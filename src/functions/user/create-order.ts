"use server";

import { CouponData } from "@/app/(client)/checkout/_components/checkout";
import { db } from "@/db/instance";
import { couponRedemptions, coupons, order, orderItem, Size, user } from "@/db/schema";
import {
  AuthorizationErrorResponse,
  ErrorResponse,
  SuccessResponse,
} from "@/lib/api-responses";
import { calculateShippingCost, calculateTtd } from "@/lib/delhivery";
import { Address, Coupon, ProductsWithQuantity, User } from "@/lib/types";
import { calculateDiscount, formatSize, sendWhatsappMessage, uuid } from "@/lib/utils";
import { and, eq, sql } from "drizzle-orm";
import Razorpay from "razorpay";
import { getServerSession } from "../auth/get-server-session";

type products = {
  productWithQuantity: ProductsWithQuantity;
  quantity: number;
  size: string;
}[];

type OrderCreationData = {
  user: User;
  products: products;
  address: Address;
  subtotal: number;
  discountValue: number;
  afterDiscount: number;
  totalLength: number;
  totalWidth: number;
  totalHeight: number;
  totalWeight: number;
  couponCode: Coupon | undefined;
  useStoreCredit: boolean;
};

export async function CreateOrder(
  products: products,
  addressId: string,
  useStoreCredit: boolean,
  coupon: CouponData | undefined,
  sessionType: "guest" | "loggedin",
  paymentMethod: "cod" | "prepaid",
) {
  try {
    // quantity validation
    for (const p of products) {
      if (p.quantity <= 0) throw new Error("Quantity cannot be 0 or lower");
    }

    const inputProductIds = products.map((p) => p.productWithQuantity.id);

    // fetch products to validate existence and get details
    const dbProducts = await db.query.product.findMany({
      where: (f, o) => o.inArray(f.id, inputProductIds),
      with: {
        quantity: true,
      },
    });

    // validate product ids
    const dbProductMap = new Map(dbProducts.map((p) => [p.id, p]));
    if (!inputProductIds.every((id) => dbProductMap.has(id))) {
      throw new Error("Invalid products: One or more products not found");
    }

    // calculate values based on DB data
    const trustedProducts: products = [];
    let subtotal = 0;
    let totalWeight = 0;

    for (const p of products) {
      const dbProduct = dbProductMap.get(p.productWithQuantity.id);
      if (!dbProduct) throw new Error("Product validation error");

      // Validate quantity availability
      const quantityRecord = dbProduct.quantity;
      if (!quantityRecord)
        throw new Error(`Quantity record not found for ${dbProduct.title}`);

      let quantityAvailable = false;
      switch (p.size) {
        case "sm":
          quantityAvailable = quantityRecord.sm >= p.quantity;
          break;
        case "md":
          quantityAvailable = quantityRecord.md >= p.quantity;
          break;
        case "lg":
          quantityAvailable = quantityRecord.lg >= p.quantity;
          break;
        case "xl":
          quantityAvailable = quantityRecord.xl >= p.quantity;
          break;
        case "doublexl":
          quantityAvailable = quantityRecord.doublexl >= p.quantity;
          break;
        default:
          throw new Error(`Invalid size: ${p.size}`);
      }

      if (!quantityAvailable) {
        throw new Error(
          `${dbProduct.title} of Size ${formatSize(p.size)} is Out of stock`,
        );
      }

      // Accumulate totals using DB data
      subtotal += dbProduct.price * p.quantity;
      totalWeight += dbProduct.weight * p.quantity;

      trustedProducts.push({
        ...p,
        productWithQuantity: dbProduct,
      });
    }

    const totalLength = Math.max(
      ...trustedProducts.map((p) => p.productWithQuantity.length),
    );
    const totalWidth = Math.max(
      ...trustedProducts.map((p) => p.productWithQuantity.breadth),
    );
    const totalHeight = trustedProducts.reduce(
      (acc, p) => acc + p.productWithQuantity.height,
      0,
    );

    // Address validation
    const validatedAddress = await db.query.address.findFirst({
      where: (f, o) => o.eq(f.id, addressId),
    });
    if (!validatedAddress) throw new Error("Address does not exist");

    const user = await db.query.user.findFirst({
      where: (f, o) => o.eq(f.id, validatedAddress.userId),
      with: {
        orders: {
          columns: {
            id: true,
          },
        },
      },
    });
    if (!user) throw new Error("User does not exist");

    // useful values
    let discountValue = 0;
    let validatedCoupon: Coupon | undefined;

    // handle coupon
    if (coupon) {
      validatedCoupon = await db.query.coupons.findFirst({
        where: (f) => eq(f.code, coupon.code),
      });

      if (validatedCoupon) {
        if (
          !validatedCoupon.isActive ||
          validatedCoupon.usageCount >= validatedCoupon.usageLimit ||
          validatedCoupon.expiresAt < new Date() ||
          (validatedCoupon.firstOrder && user.orders.length > 0) ||
          validatedCoupon.minOrderValue > subtotal
        )
          throw new Error("Invalid coupon");

        const discount = calculateDiscount(subtotal, validatedCoupon);
        discountValue = discount;
      } else {
        throw new Error("Invalid coupon code");
      }
    }

    const afterDiscount = subtotal - discountValue;

    const orderData: OrderCreationData = {
      user,
      products: trustedProducts,
      address: validatedAddress,
      subtotal,
      discountValue,
      afterDiscount,
      totalLength,
      totalWidth,
      totalHeight,
      totalWeight,
      couponCode: validatedCoupon,
      useStoreCredit,
    };

    switch (sessionType) {
      case "guest":
        switch (paymentMethod) {
          case "cod":
            return await GuestCodOrder(orderData);
          case "prepaid":
            return await GuestPrepaidOrder(orderData);
          default:
            throw new Error("Invalid payment method");
        }
      case "loggedin":
        switch (paymentMethod) {
          case "cod":
            return await LoggedInCodOrder(orderData);
          case "prepaid":
            return await LoggedInPrepaidOrder(orderData);
          default:
            throw new Error("Invalid payment method");
        }
      default:
        throw new Error("Invalid session type");
    }
  } catch (error) {
    console.error("CreateOrder Error:", error);
    return ErrorResponse(error instanceof Error ? error.message : String(error));
  }
}

async function GuestCodOrder(data: OrderCreationData) {
  try {
    // calculate shipping cost
    const shippingPrice = await calculateShippingCost(
      data.address,
      data.totalWeight,
      "COD",
    );

    // calculate ttd
    const ttd = await calculateTtd(data.address);

    const orderId = uuid();

    await db.transaction(async (tx) => {
      const id = uuid();
      // create order
      await tx.insert(order).values({
        ...data.address,
        id,
        orderId,
        paymentId: "COD",
        discountPrice: data.discountValue,
        subtotal: data.subtotal,
        shippingPrice,
        totalPrice: Math.ceil(data.afterDiscount + shippingPrice),
        ttd,
        usedStoreCredit: false,
        couponCode: data.couponCode?.code ?? null,
        paymentSuccess: true,
        isCodApproved: false,
        isCod: true,
      });

      // create order items
      for (const item of data.products) {
        await tx.insert(orderItem).values({
          id: uuid(),
          orderId: id,
          productId: item.productWithQuantity.id,
          size: item.size as Size,
          quantity: item.quantity,
          itemPrice: item.productWithQuantity.price,
        });
      }

      if (data.couponCode) {
        tx.insert(couponRedemptions).values({
          id: uuid(),
          couponId: data.couponCode.id,
          userId: data.user.id,
        });

        tx.update(coupons)
          .set({
            usageCount: sql`${coupons.usageCount} + 1`,
          })
          .where(eq(coupons.id, data.couponCode.id));
      }
    });

    await sendWhatsappMessage("9148106357", {
      id: orderId,
      firstName: data.address.firstName,
      items: data.products.map((p) => ({
        product: p.productWithQuantity,
        itemPrice: p.productWithQuantity.price,
      })),
      ttd,
      waybill: "COD NOT APPROVED YET",
    });

    return SuccessResponse("Order created successfully", {
      orderID: orderId,
      NoRazorpayOrder: true,
      price: data.subtotal + data.discountValue + shippingPrice,
    });
  } catch (error) {
    console.error(error);
    return ErrorResponse(String(error));
  }
}

async function GuestPrepaidOrder(data: OrderCreationData) {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string,
      key_secret: process.env.RAZORPAY_KEY_SECRET as string,
    });

    const orderId = await razorpay.orders
      .create({
        amount: data.afterDiscount * 100,
        currency: "INR",
      })
      .then((data) => data.id);

    // calculate shipping cost
    const shippingPrice = await calculateShippingCost(
      data.address,
      data.totalWeight,
      "Pre-paid",
    );

    // calculate ttd
    const ttd = await calculateTtd(data.address);

    await db.transaction(async (tx) => {
      const id = uuid();
      await tx.insert(order).values({
        ...data.address,
        id,
        orderId,
        paymentId: orderId,
        discountPrice: data.discountValue,
        shippingPrice,
        subtotal: data.subtotal,
        totalPrice: Math.ceil(data.afterDiscount + shippingPrice),
        ttd,
        usedStoreCredit: false,
        couponCode: data.couponCode?.code ?? null,
        paymentSuccess: false,
        isCodApproved: false,
        isCod: false,
      });

      // create order items
      for (const item of data.products) {
        await tx.insert(orderItem).values({
          id: uuid(),
          orderId: id,
          productId: item.productWithQuantity.id,
          size: item.size as Size,
          quantity: item.quantity,
          itemPrice: item.productWithQuantity.price,
        });
      }
    });

    await sendWhatsappMessage("9148106357", {
      id: orderId,
      firstName: data.address.firstName,
      items: data.products.map((p) => ({
        product: p.productWithQuantity,
        itemPrice: p.productWithQuantity.price,
      })),
      ttd,
      waybill: "COD NOT APPROVED YET",
    });

    return SuccessResponse("Order created successfully", {
      orderID: orderId,
      NoRazorpayOrder: false,
      price: data.afterDiscount,
    });
  } catch (error) {
    console.error(error);
    return ErrorResponse(error instanceof Error ? error.message : String(error));
  }
}

async function LoggedInCodOrder(data: OrderCreationData) {
  try {
    const session = await getServerSession(true);
    if (!session) throw new Error("Session not found");

    if (session.user.id !== data.address.userId)
      return AuthorizationErrorResponse(
        "You are not authorized to create order for this address",
      );

    // calculate shipping cost
    const shippingPrice = await calculateShippingCost(
      data.address,
      data.totalWeight,
      "COD",
    );

    // calculate ttd
    const ttd = await calculateTtd(data.address);

    const orderId = uuid();

    await db.transaction(async (tx) => {
      const id = uuid();
      await tx.insert(order).values({
        ...data.address,
        id,
        orderId,
        paymentId: "COD",
        discountPrice: data.discountValue,
        shippingPrice,
        subtotal: data.subtotal,
        totalPrice: Math.ceil(data.afterDiscount + shippingPrice),
        ttd,
        usedStoreCredit: false,
        couponCode: data.couponCode?.code ?? null,
        paymentSuccess: true,
        isCodApproved: false,
        isCod: true,
      });

      // create order items
      for (const item of data.products) {
        await tx.insert(orderItem).values({
          id: uuid(),
          orderId: id,
          productId: item.productWithQuantity.id,
          size: item.size as Size,
          quantity: item.quantity,
          itemPrice: item.productWithQuantity.price,
        });
      }
    });

    await sendWhatsappMessage("9148106357", {
      id: orderId,
      firstName: data.address.firstName,
      items: data.products.map((p) => ({
        product: p.productWithQuantity,
        itemPrice: p.productWithQuantity.price,
      })),
      ttd,
      waybill: "COD NOT APPROVED YET",
    });

    return SuccessResponse("Order created successfully", {
      orderID: orderId,
      NoRazorpayOrder: true,
      price: data.afterDiscount + shippingPrice,
    });
  } catch (error) {
    console.error(error);
    return ErrorResponse(error instanceof Error ? error.message : String(error));
  }
}

async function LoggedInPrepaidOrder(data: OrderCreationData) {
  try {
    const session = await getServerSession(true);
    if (!session) throw new Error("Session not found");

    if (session.user.id !== data.address.userId)
      return AuthorizationErrorResponse(
        "You are not authorized to create order for this address",
      );

    // calculate shipping cost
    const shippingPrice = await calculateShippingCost(
      data.address,
      data.totalWeight,
      "Pre-paid",
    );

    // calculate ttd
    const ttd = await calculateTtd(data.address);

    // handle store credit
    const wallet = session.user.storeCredit;
    const amountToPay = data.afterDiscount - wallet;
    if (data.useStoreCredit) {
      if (amountToPay <= 0) {
        // create order without razorpay
        const orderId = uuid();
        await db.transaction(async (tx) => {
          const id = uuid();

          // deduct user store credit
          const updatedUser = await tx
            .update(user)
            .set({
              storeCredit: sql`${user.storeCredit} - ${data.afterDiscount}`,
            })
            .where(
              and(
                eq(user.id, session.user.id),
                sql`${user.storeCredit} >= ${data.afterDiscount}`,
              ),
            )
            .returning({ id: user.id });

          if (updatedUser.length === 0) {
            return ErrorResponse("Insufficient store credit or race condition detected");
          }

          await tx.insert(order).values({
            ...data.address,
            id,
            orderId,
            paymentId: orderId,
            discountPrice: data.discountValue,
            shippingPrice,
            subtotal: data.subtotal,
            totalPrice: Math.ceil(data.afterDiscount + shippingPrice),
            ttd,
            usedStoreCredit: true,
            couponCode: data.couponCode?.code ?? null,
            paymentSuccess: true,
            isCodApproved: false,
            isCod: false,
          });

          // create order items
          for (const item of data.products) {
            await tx.insert(orderItem).values({
              id: uuid(),
              orderId: id,
              productId: item.productWithQuantity.id,
              size: item.size as Size,
              quantity: item.quantity,
              itemPrice: item.productWithQuantity.price,
            });
          }
        });

        await sendWhatsappMessage("9148106357", {
          id: orderId,
          firstName: data.address.firstName,
          items: data.products.map((p) => ({
            product: p.productWithQuantity,
            itemPrice: p.productWithQuantity.price,
          })),
          ttd,
          waybill: "COD NOT APPROVED YET",
        });

        return SuccessResponse("Order created successfully", {
          orderID: orderId,
          NoRazorpayOrder: true,
          price: data.afterDiscount + shippingPrice,
        });
      }
      // create razorpay order with balance amount
      const razorpay = new Razorpay({
        key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string,
        key_secret: process.env.RAZORPAY_KEY_SECRET as string,
      });

      const orderId = await razorpay.orders
        .create({
          amount: amountToPay * 100,
          currency: "INR",
        })
        .then((data) => data.id);

      await db.transaction(async (tx) => {
        const id = uuid();
        await tx.insert(order).values({
          ...data.address,
          id,
          orderId,
          paymentId: orderId,
          discountPrice: data.discountValue,
          shippingPrice,
          subtotal: data.subtotal,
          totalPrice: Math.ceil(data.afterDiscount + shippingPrice),
          ttd,
          usedStoreCredit: true,
          couponCode: data.couponCode?.code ?? null,
          paymentSuccess: false,
          isCodApproved: false,
          isCod: false,
        });

        // create order items
        for (const item of data.products) {
          await tx.insert(orderItem).values({
            id: uuid(),
            orderId: id,
            productId: item.productWithQuantity.id,
            size: item.size as Size,
            quantity: item.quantity,
            itemPrice: item.productWithQuantity.price,
          });
        }
      });

      return SuccessResponse("Order created successfully", {
        orderID: orderId,
        NoRazorpayOrder: false,
        price: amountToPay,
      });
    }

    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string,
      key_secret: process.env.RAZORPAY_KEY_SECRET as string,
    });

    const orderId = await razorpay.orders
      .create({
        amount: data.afterDiscount * 100,
        currency: "INR",
      })
      .then((data) => data.id);

    const id = uuid();
    await db.transaction(async (tx) => {
      await tx.insert(order).values({
        ...data.address,
        id,
        orderId,
        paymentId: orderId,
        discountPrice: data.discountValue,
        shippingPrice,
        subtotal: data.subtotal,
        totalPrice: Math.ceil(data.afterDiscount + shippingPrice),
        ttd,
        usedStoreCredit: true,
        couponCode: data.couponCode?.code ?? null,
        paymentSuccess: false,
        isCodApproved: false,
        isCod: false,
      });

      // create order items
      for (const item of data.products) {
        await tx.insert(orderItem).values({
          id: uuid(),
          orderId: id,
          productId: item.productWithQuantity.id,
          size: item.size as Size,
          quantity: item.quantity,
          itemPrice: item.productWithQuantity.price,
        });
      }
    });

    await sendWhatsappMessage("9148106357", {
      id,
      firstName: data.address.firstName,
      items: data.products.map((p) => ({
        product: p.productWithQuantity,
        itemPrice: p.productWithQuantity.price,
      })),
      ttd,
      waybill: "COD NOT APPROVED YET",
    });

    return SuccessResponse("Order created successfully", {
      orderID: orderId,
      NoRazorpayOrder: false,
      price: data.afterDiscount,
    });
  } catch (error) {
    console.error(error);
    return ErrorResponse(error instanceof Error ? error.message : String(error));
  }
}
