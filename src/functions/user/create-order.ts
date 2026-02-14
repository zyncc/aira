"use server";

import { CouponData } from "@/app/(client)/checkout/_components/checkout";
import { db } from "@/db/instance";
import { activity, address, cart, order, product, quantity, user } from "@/db/schema";
import {
  ApiResponse,
  AuthErrorResponse,
  AuthorizationErrorResponse,
  ErrorResponse,
  SuccessResponse,
} from "@/lib/api-responses";
import { Coupon, ProductsWithQuantity } from "@/lib/types";
import { formatCurrency, formatSize, uuid } from "@/lib/utils";
import { CreateCheckoutUser } from "@/lib/zod-schemas";
import { and, eq, inArray, sql } from "drizzle-orm";
import Razorpay from "razorpay";
import z from "zod";
import { sendOrderReceipt } from "../auth/emails/send-order-receipt";
import { getServerSession } from "../auth/get-server-session";

type products = {
  productWithQuantity: ProductsWithQuantity;
  quantity: number;
  size: string;
}[];

export async function CreateOrder(
  products: products,
  addressId: string,
  useStoreCredit: boolean,
  coupon: CouponData | undefined,
) {
  try {
    for (const p of products) {
      if (p.quantity < 1) {
        return ErrorResponse("Product quantity must be at least 1.");
      }
    }

    const session = await getServerSession(true);

    if (!session) {
      return AuthErrorResponse();
    }

    const wallet = session.user.storeCredit;

    const addressData = await db.query.address.findFirst({
      where: (address, o) =>
        o.and(o.eq(address.id, addressId), o.eq(address.userId, session.user.id)),
    });

    if (!addressData) {
      return AuthorizationErrorResponse();
    }

    const instance = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string,
      key_secret: process.env.RAZORPAY_KEY_SECRET as string,
    });

    const ids = products.map((item) => item.productWithQuantity.id);

    // Fetch all products to calculate price
    const productListRaw = await db
      .select({
        id: product.id,
        price: product.price,
      })
      .from(product)
      .where(inArray(product.id, ids));

    const productList = ids.map((id) => productListRaw.find((p) => p.id === id)!);

    // Calculate Price
    const price = productList.reduce((sum, product, index) => {
      const quantity = products[index].quantity;
      return sum + product.price * quantity;
    }, 0);

    let amountToPay = price;

    if (useStoreCredit) {
      amountToPay -= wallet;
    }

    if (amountToPay <= 0) {
      // Place the order without Razorpay
      const orderID = uuid();

      await db.transaction(async (tx) => {
        // Step 1: Check stock for all items atomically
        for (const product of products) {
          const quantityRecord = await tx.query.quantity.findFirst({
            where: (q, o) => o.eq(q.productId, product.productWithQuantity.id),
          });

          if (!quantityRecord) {
            return ErrorResponse(
              `Inventory record not found for ${product.productWithQuantity.title}`,
            );
          }

          let quantityAvailable = false;
          const requiredQuantity = product.quantity;
          switch (product.size) {
            case "sm":
              quantityAvailable = (quantityRecord.sm ?? 0) >= requiredQuantity;
              break;
            case "md":
              quantityAvailable = (quantityRecord.md ?? 0) >= requiredQuantity;
              break;
            case "lg":
              quantityAvailable = (quantityRecord.lg ?? 0) >= requiredQuantity;
              break;
            case "xl":
              quantityAvailable = (quantityRecord.xl ?? 0) >= requiredQuantity;
              break;
            case "doublexl":
              quantityAvailable = (quantityRecord.doublexl ?? 0) >= requiredQuantity;
              break;
          }

          if (!quantityAvailable) {
            // This will cancel the transaction automatically
            throw new Error(
              `${product.productWithQuantity.title} of Size ${formatSize(product.size)} is out of stock`,
            );
          }
        }

        // Step 2: Update store credit (Atomic Check & Update)
        const creditNeeded = price;
        // Atomic Update with RETURNING to verify success
        const updatedUser = await tx
          .update(user)
          .set({ storeCredit: sql`${user.storeCredit} - ${creditNeeded}` })
          .where(
            and(
              eq(user.id, session.user.id),
              sql`${user.storeCredit} >= ${creditNeeded}`,
            ),
          )
          .returning({ id: user.id });

        if (updatedUser.length === 0) {
          return ErrorResponse("Insufficient store credit or race condition detected");
        }

        const { id, userId, createdAt, updatedAt, ...address } = addressData;

        // Step 3: Insert order items
        await tx.insert(order).values(
          products.map((p) => ({
            id: uuid(),
            paymentSuccess: true,
            price: p.productWithQuantity.price * p.quantity,
            quantity: p.quantity,
            size: p.size,
            userId: session.user.id,
            productId: p.productWithQuantity.id,
            rzpOrderId: orderID,
            ...address,
          })),
        );

        // Step 4: Decrement quantities (Atomic Update)
        const quantityUpdates = products.map(async (p) => {
          const sizeColumn =
            p.size === "doublexl"
              ? quantity.doublexl
              : quantity[p.size as keyof typeof quantity];

          if (!sizeColumn)
            return ErrorResponse(`Invalid product size detected: ${p.size}`);

          // Atomic Decrement: Only update if stock >= requested (Prevent Race Condition)
          const updateResult = await tx
            .update(quantity)
            .set({ [p.size]: sql`${sizeColumn} - ${p.quantity}` })
            .where(
              and(
                eq(quantity.productId, p.productWithQuantity.id),
                sql`${sizeColumn} >= ${p.quantity}`,
              ),
            )
            .returning({ id: quantity.id });

          if (updateResult.length === 0) {
            throw new Error(
              `${p.productWithQuantity.title} of Size ${formatSize(p.size)} is out of stock`,
            );
          }
        });

        await Promise.all(quantityUpdates);
      });

      const allOrders = await db.query.order.findMany({
        where: (o) => eq(o.rzpOrderId, orderID),
        with: { user: true, product: true },
      });

      const orderUser = allOrders[0].user;
      const zipcode = allOrders[0].zipcode;
      const userId = orderUser.id;

      // Delete user cart (single call)
      try {
        await db.delete(cart).where(eq(cart.userId, userId));
      } catch (error) {
        console.error("Error deleting user cart", error);
      }

      // Create activity logs (parallel)
      const activityLogs = allOrders.map((o) => {
        return db.insert(activity).values({
          id: uuid(),
          type: "order",
          title: `Order Placed ${o.product.title}`,
          userId: userId,
        });
      });

      await Promise.all([...activityLogs]);

      // Get delivery time
      const ttdData = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/pincode?pincode=${zipcode}`,
      ).then((res) => res.json());
      const deliveryDate = new Date(
        new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
      );
      deliveryDate.setDate(deliveryDate.getDate() + ttdData.ttd + 2);

      // Aggregate product data
      const totalWeight = allOrders.reduce((acc, o) => acc + o.product.weight, 0);
      const totalHeight = allOrders.reduce((acc, o) => acc + o.product.height, 0);
      const totalLength = Math.max(...allOrders.map((order) => order.product.length));
      const totalWidth = Math.max(...allOrders.map((order) => order.product.breadth));
      const totalAmount = allOrders.reduce((acc, o) => acc + o.product.price, 0);

      console.log("Total Weight ", totalWeight);
      console.log("Total Height ", totalHeight);
      console.log("Total Length ", totalLength);
      console.log("Total Width ", totalWidth);
      console.log("Total Amount ", totalAmount);

      // Get shipping cost
      const shippingCostData = await fetch(
        `https://track.delhivery.com/api/kinko/v1/invoice/charges/.json?md=S&ss=DTO&d_pin=${zipcode}&o_pin=560078&cgm=${totalWeight}&pt=Pre-paid`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: process.env.DELHIVERY_TOKEN!,
          },
        },
      ).then((res) => res.json());

      const shippingCost = shippingCostData[0]?.total_amount;

      // Create shipment
      const shipmentData = {
        shipments: [
          {
            name: `${allOrders[0].firstName + allOrders[0].lastName || ""}`,
            order: orderID,
            phone: allOrders[0].phone,
            add: `${allOrders[0].address1}, ${allOrders[0].address2 || ""}`,
            pin: zipcode,
            payment_mode: "Prepaid",
            weight: totalWeight,
            shipment_height: totalHeight,
            shipment_length: totalLength,
            shipment_width: totalWidth,
          },
        ],
        pickup_location: { name: "mahaveer-sitara-d-block" },
      };

      const formBody = new URLSearchParams({
        format: "json",
        data: JSON.stringify(shipmentData),
      });

      const createShipment = await fetch(
        "https://track.delhivery.com/api/cmu/create.json",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
            Authorization: process.env.DELHIVERY_TOKEN!,
          },
          body: formBody,
        },
      ).then((res) => res.json());

      const waybill = createShipment.packages?.[0]?.waybill;

      console.log("WAYBILL: ", waybill);

      // Update all orders (bulk update if schema allows)
      await db
        .update(order)
        .set({
          ttd: deliveryDate,
          shipmentCost: Math.floor((shippingCost / allOrders.length) * 100) / 100,
          waybill,
        })
        .where(eq(order.rzpOrderId, orderID));
      const paymentId = uuid();
      // Send Email
      await sendOrderReceipt(
        waybill,
        orderUser.name,
        orderID,
        allOrders,
        paymentId,
        deliveryDate,
        orderUser.email,
      );

      // Prepare WhatsApp messages
      for (const order of allOrders) {
        await Promise.all([
          fetch(
            `https://graph.facebook.com/v22.0/${process.env.WHATSAPP_PHONE_NUMBER}/messages`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `${process.env.WHATSAPP_CLOUD_API_KEY}`,
              },
              body: JSON.stringify({
                messaging_product: "whatsapp",
                to: `+91${allOrders[0].phone}`,
                type: "template",
                template: {
                  name: "order_confirmed",
                  language: {
                    code: "en_US",
                  },
                  components: [
                    {
                      type: "header",
                      parameters: [
                        {
                          type: "image",
                          image: {
                            link: `${order.product.images[0]}${"?w-3000,q-70"}`,
                          },
                        },
                      ],
                    },
                    {
                      type: "body",
                      parameters: [
                        {
                          type: "text",
                          text: order.firstName,
                        },
                        {
                          type: "text",
                          text: `${order.id}`,
                        },
                        {
                          type: "text",
                          text: `${formatCurrency(order.price)}`,
                        },
                        {
                          type: "text",
                          text: `${deliveryDate.toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "long",
                          })}`,
                        },
                        {
                          type: "text",
                          text: `${waybill}`,
                        },
                      ],
                    },
                  ],
                },
              }),
            },
          ),
          fetch(
            `https://graph.facebook.com/v22.0/${process.env.WHATSAPP_PHONE_NUMBER}/messages`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `${process.env.WHATSAPP_CLOUD_API_KEY}`,
              },
              body: JSON.stringify({
                messaging_product: "whatsapp",
                to: "+919448093950",
                type: "template",
                template: {
                  name: "order_confirmed",
                  language: {
                    code: "en_US",
                  },
                  components: [
                    {
                      type: "header",
                      parameters: [
                        {
                          type: "image",
                          image: {
                            link: `${order.product.images[0]}${"?w-3000,q-70"}`,
                          },
                        },
                      ],
                    },
                    {
                      type: "body",
                      parameters: [
                        {
                          type: "text",
                          text: order.firstName,
                        },
                        {
                          type: "text",
                          text: `${order.id}`,
                        },
                        {
                          type: "text",
                          text: `${formatCurrency(order.price)}`,
                        },
                        {
                          type: "text",
                          text: `${deliveryDate.toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "long",
                          })}`,
                        },
                        {
                          type: "text",
                          text: `${waybill}`,
                        },
                      ],
                    },
                  ],
                },
              }),
            },
          ),
        ]);
      }
      return SuccessResponse("Created Order(s) Successfully", {
        orderID,
        NoRazorpayOrder: true,
        price,
      });
    }

    // Handle Coupon
    if (coupon) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL!}/api/coupon?code=${coupon.code}`,
      );
      const findCoupon: ApiResponse<Coupon> = await res.json();

      if (!findCoupon.success || !findCoupon.data) {
        return ErrorResponse("Invalid Coupon");
      }

      const couponData = findCoupon.data;

      // handle first order only coupon
      if (couponData.firstOrder) {
        const orderExists = await db.query.order.findFirst({
          where: (order, o) => o.eq(order.email, addressData.email),
        });
        if (orderExists) {
          return ErrorResponse("Invalid Coupon");
        }
      }

      // handle min order value
      if (couponData.minOrderValue > 0) {
        if (price < couponData.minOrderValue) {
          return ErrorResponse(
            `Minimum order value of ${formatCurrency(couponData.minOrderValue)} is required`,
          );
        }
      }

      // check if user has already user coupon
      const usedCoupon = await db.query.couponRedemptions.findFirst({
        where: (fields, operators) =>
          operators.and(
            operators.eq(fields.couponId, couponData.id),
            operators.eq(fields.userId, session.user.id),
          ),
      });

      if (usedCoupon) {
        return ErrorResponse("Invalid Coupon");
      }

      amountToPay = calculateDiscount(price, couponData);
    }

    // Deduct Store Credit for Partial Payment (Atomic)
    if (useStoreCredit && wallet > 0 && amountToPay > 0) {
      // We attempt to deduct 'wallet' amount (up to what's needed).
      // However, 'amountToPay' used for Razorpay is ALREADY reduced by 'wallet' (line 78).
      // So we MUST ensure we deduct the original logic's expected reduction from DB.

      const creditToDeduct = wallet;

      const updateRes = await db
        .update(user)
        .set({ storeCredit: sql`${user.storeCredit} - ${creditToDeduct}` })
        .where(
          and(
            eq(user.id, session.user.id),
            sql`${user.storeCredit} >= ${creditToDeduct}`,
          ),
        )
        .returning({ id: user.id });

      if (updateRes.length === 0) {
        return ErrorResponse("Insufficient store credit changed during transaction");
      }
    }

    // Create Razorpay Order ID
    const orderID = await instance.orders
      .create({
        amount: amountToPay * 100,
        currency: "INR",
      })
      .then((data) => data.id);

    // Check if Quantity Exists for each product
    await db.transaction(async (tx) => {
      // Step 1: Check stock for all items atomically
      for (const product of products) {
        // Atomic Check: Ensure stock exists (Read Only)
        const quantityRecord = await tx.query.quantity.findFirst({
          where: (q, o) => o.eq(q.productId, product.productWithQuantity.id),
        });

        if (!quantityRecord) {
          throw new Error(
            `Inventory record not found for ${product.productWithQuantity.title}`,
          );
        }

        let quantityAvailable = false;
        const requiredQuantity = product.quantity;
        const qSize = product.size as keyof typeof quantityRecord;
        if (typeof quantityRecord[qSize] === "number") {
          quantityAvailable = (quantityRecord[qSize] as number) >= requiredQuantity;
        }

        if (!quantityAvailable) {
          throw new Error(
            `${product.productWithQuantity.title} of Size ${formatSize(product.size)} is Out of stock`,
          );
        }
      }

      // Step 2: Insert placeholder order items
      const { id, userId, createdAt, updatedAt, ...address } = addressData;
      await tx.insert(order).values(
        products.map((p) => ({
          id: uuid(),
          paymentSuccess: false, // Payment is pending
          price: p.productWithQuantity.price * p.quantity,
          quantity: p.quantity,
          size: p.size,
          userId: session.user.id,
          productId: p.productWithQuantity.id,
          rzpOrderId: orderID,
          ...address,
        })),
      );
    });

    return SuccessResponse("Created Order(s) Successfully", {
      orderID,
      NoRazorpayOrder: false,
      price,
    });
  } catch (error) {
    console.error("Create Order error:", error);
    return ErrorResponse("Something went wrong, please try again later");
  }
}

function calculateDiscount(price: number, coupon: Coupon): number {
  if (!coupon) return price;

  if (coupon.type === "percentage") {
    const discount = (price * coupon.value) / 100;
    return price - discount;
  }

  return Math.max(0, price - coupon.value);
}

export async function CreateOrderForLoggedOutUsers(
  products: products,
  addressData: z.infer<typeof CreateCheckoutUser>,
  coupon: CouponData | undefined,
) {
  try {
    for (const p of products) {
      if (p.quantity < 1) {
        return ErrorResponse("Product quantity must be at least 1.");
      }
    }

    const { success } = CreateCheckoutUser.safeParse(addressData);
    if (!success) {
      return ErrorResponse("Invalid Data");
    }
    const findUser = await db.query.user.findFirst({
      where: (user, o) => o.eq(user.email, addressData.email),
    });

    const userId = uuid();

    if (!findUser) {
      await db.insert(user).values({
        id: userId,
        email: addressData.email,
        name: `${addressData.firstName} ${addressData.lastName}`,
        role: "user",
        emailOffers: addressData.emailOffers,
      });
      await db.insert(address).values({
        id: uuid(),
        userId,
        ...addressData,
      });
    } else {
      await db.insert(address).values({
        id: uuid(),
        userId: findUser.id,
        ...addressData,
      });
    }

    const instance = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string,
      key_secret: process.env.RAZORPAY_KEY_SECRET as string,
    });

    const ids = products.map((item) => item.productWithQuantity.id);
    const productListRaw = await db
      .select({
        id: product.id,
        price: product.price,
      })
      .from(product)
      .where(inArray(product.id, ids));

    const productList = ids.map((id) => productListRaw.find((p) => p.id === id)!);

    // Calculate Price
    let price = productList.reduce((sum, product, index) => {
      const quantity = products[index].quantity;
      return sum + product.price * quantity;
    }, 0);

    // Handle Coupon
    if (coupon) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL!}/api/coupon?code=${coupon.code}`,
      );
      const findCoupon: ApiResponse<Coupon> = await res.json();

      if (!findCoupon.success || !findCoupon.data) {
        return ErrorResponse("Invalid Coupon");
      }

      const couponData = findCoupon.data;

      // handle first order only coupon
      if (couponData.firstOrder) {
        const orderExists = await db.query.order.findFirst({
          where: (order, o) => o.eq(order.email, addressData.email),
        });
        if (orderExists) {
          return ErrorResponse("Invalid Coupon");
        }
      }

      // handle min order value
      if (couponData.minOrderValue > 0) {
        if (price < couponData.minOrderValue) {
          return ErrorResponse(
            `Minimum order value of ${formatCurrency(couponData.minOrderValue)} is required`,
          );
        }
      }

      // check if user has already user coupon
      const usedCoupon = await db.query.couponRedemptions.findFirst({
        where: (fields, operators) =>
          operators.and(
            operators.eq(fields.couponId, couponData.id),
            operators.eq(fields.userId, findUser?.id ?? userId),
          ),
      });

      if (usedCoupon) {
        return ErrorResponse("Invalid Coupon");
      }

      price = calculateDiscount(price, couponData);
    }

    // Create Razorpay Order ID
    const orderID = await instance.orders
      .create({
        amount: price * 100,
        currency: "INR",
      })
      .then((data) => data.id);

    // Check if Quantity Exists and Reserve (Atomic Transaction)
    await db.transaction(async (tx) => {
      for (const product of products) {
        // Atomic Check: Ensure stock exists
        const quantityRecord = await tx.query.quantity.findFirst({
          where: (q, o) => o.eq(q.productId, product.productWithQuantity.id),
        });

        if (!quantityRecord) {
          throw new Error(
            `Inventory record not found for ${product.productWithQuantity.title}`,
          );
        }

        let quantityAvailable = false;
        const requiredQuantity = product.quantity;
        const qSize = product.size as keyof typeof quantityRecord;
        if (typeof quantityRecord[qSize] === "number") {
          quantityAvailable = (quantityRecord[qSize] as number) >= requiredQuantity;
        }

        if (!quantityAvailable) {
          throw new Error(
            `${product.productWithQuantity.title} of Size ${formatSize(product.size)} is Out of stock`,
          );
        }

        // Insert Order
        await tx.insert(order).values({
          id: uuid(),
          paymentSuccess: false,
          price: product.productWithQuantity.price * product.quantity,
          quantity: product.quantity,
          size: product.size,
          userId: findUser?.id || userId,
          productId: product.productWithQuantity.id,
          rzpOrderId: orderID,
          address1: addressData.address1,
          address2: addressData.address2,
          city: addressData.city,
          email: addressData.email,
          couponCode: coupon ? coupon.code : null,
          firstName: addressData.firstName,
          lastName: addressData.lastName,
          phone: addressData.phone,
          state: addressData.state,
          zipcode: addressData.zipcode,
        });
      }
    });

    return SuccessResponse("Created Order(s) Successfully", {
      firstName: addressData.firstName,
      email: addressData.email,
      phone: addressData.phone,
      orderID,
      price,
    });
  } catch (error) {
    console.error("Create Order error:", error);
    return ErrorResponse("Something went wrong, please try again later");
  }
}

export async function CreateCodOrder(
  products: products,
  addressData: z.infer<typeof CreateCheckoutUser>,
  coupon: CouponData | undefined,
) {
  try {
    const { success } = CreateCheckoutUser.safeParse(addressData);
    if (!success) {
      return ErrorResponse("Invalid Data");
    }

    const findUser = await db.query.user.findFirst({
      where: (user, o) => o.eq(user.email, addressData.email),
    });

    const userId = uuid();

    if (!findUser) {
      await db.insert(user).values({
        id: userId,
        email: addressData.email,
        name: `${addressData.firstName} ${addressData.lastName}`,
        role: "user",
        emailOffers: addressData.emailOffers,
      });
      await db.insert(address).values({
        id: uuid(),
        userId,
        ...addressData,
      });
    } else {
      await db.insert(address).values({
        id: uuid(),
        userId: findUser.id,
        ...addressData,
      });
    }

    const ids = products.map((item) => item.productWithQuantity.id);
    const productListRaw = await db
      .select({
        id: product.id,
        price: product.price,
      })
      .from(product)
      .where(inArray(product.id, ids));

    const productList = ids.map((id) => productListRaw.find((p) => p.id === id)!);

    // Calculate Price
    let price = productList.reduce((sum, product, index) => {
      const quantity = products[index].quantity;
      return sum + product.price * quantity;
    }, 0);

    // Handle Coupon
    if (coupon) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL!}/api/coupon?code=${coupon.code}`,
      );
      const findCoupon: ApiResponse<Coupon> = await res.json();

      if (!findCoupon.success || !findCoupon.data) {
        return ErrorResponse("Invalid Coupon");
      }

      const couponData = findCoupon.data;

      // handle first order only coupon
      if (couponData.firstOrder) {
        const orderExists = await db.query.order.findFirst({
          where: (order, o) => o.eq(order.email, addressData.email),
        });
        if (orderExists) {
          return ErrorResponse("Invalid Coupon");
        }
      }

      // handle min order value
      if (couponData.minOrderValue > 0) {
        if (price < couponData.minOrderValue) {
          return ErrorResponse(
            `Minimum order value of ${formatCurrency(couponData.minOrderValue)} is required`,
          );
        }
      }

      // check if user has already user coupon
      const usedCoupon = await db.query.couponRedemptions.findFirst({
        where: (fields, operators) =>
          operators.and(
            operators.eq(fields.couponId, couponData.id),
            operators.eq(fields.userId, findUser?.id ?? userId),
          ),
      });

      if (usedCoupon) {
        return ErrorResponse("Invalid Coupon");
      }

      price = calculateDiscount(price, couponData);
    }

    const totalWeight =
      250 *
      products.length *
      products.reduce((sum, product) => sum + product.quantity, 0);

    // Get shipping cost
    let shippingCost: number = 0;
    try {
      const res = await fetch(
        `https://track.delhivery.com/api/kinko/v1/invoice/charges/.json?md=S&ss=DTO&d_pin=${addressData.zipcode}&o_pin=560078&cgm=${totalWeight}&pt=COD`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${process.env.DELHIVERY_TOKEN as string}`,
          },
        },
      );

      const shippingCostData = await res.json();
      shippingCost = shippingCostData[0]?.total_amount;
      if (shippingCost === undefined || shippingCost === null) {
        throw new Error("Invalid shipping cost response");
      }
    } catch (e) {
      console.error("Failed to fetch shipping cost", e);
      return ErrorResponse("Failed to calculate shipping cost. Please try again.");
    }

    const orderID = uuid();
    // Check if Quantity Exists and Reserve (Atomic Transaction)
    await db.transaction(async (tx) => {
      for (const product of products) {
        // Atomic Check: Ensure stock exists
        const quantityRecord = await tx.query.quantity.findFirst({
          where: (q, o) => o.eq(q.productId, product.productWithQuantity.id),
        });

        if (!quantityRecord) {
          throw new Error(
            `Inventory record not found for ${product.productWithQuantity.title}`,
          );
        }

        let quantityAvailable = false;
        const requiredQuantity = product.quantity;
        const qSize = product.size as keyof typeof quantityRecord;
        if (typeof quantityRecord[qSize] === "number") {
          quantityAvailable = (quantityRecord[qSize] as number) >= requiredQuantity;
        }

        if (!quantityAvailable) {
          throw new Error(
            `${product.productWithQuantity.title} of Size ${formatSize(product.size)} is Out of stock`,
          );
        }

        // Insert Order
        await tx.insert(order).values({
          id: uuid(),
          paymentSuccess: true,
          price: product.productWithQuantity.price * product.quantity,
          quantity: product.quantity,
          size: product.size,
          userId: findUser?.id || userId,
          productId: product.productWithQuantity.id,
          rzpOrderId: orderID,
          address1: addressData.address1,
          address2: addressData.address2,
          city: addressData.city,
          email: addressData.email,
          couponCode: coupon ? coupon.code : null,
          firstName: addressData.firstName,
          lastName: addressData.lastName,
          phone: addressData.phone,
          state: addressData.state,
          zipcode: addressData.zipcode,
          isCod: true,
          isCodApproved: false,
          codAmount: price + shippingCost,
          shipmentCost: shippingCost,
        });
      }

      await tx.insert(activity).values({
        id: uuid(),
        type: "order",
        title: `Order Placed ${product.title}`,
        userId: findUser?.id || userId,
      });
    });

    return SuccessResponse("Created Order(s) Successfully", {
      firstName: addressData.firstName,
      email: addressData.email,
      phone: addressData.phone,
      orderID,
      price,
    });
  } catch (error) {
    console.error("Create Order error:", error);
    return ErrorResponse(
      error instanceof Error
        ? error.message
        : "Something went wrong, please try again later",
    );
  }
}

export async function CreateCodOrderForLoggedInUsers(
  products: products,
  addressId: string,
  useStoreCredit: boolean,
  coupon: CouponData | undefined,
) {
  try {
    for (const p of products) {
      if (p.quantity < 1) {
        return ErrorResponse("Product quantity must be at least 1.");
      }
    }

    const session = await getServerSession(true);

    if (!session) {
      return AuthErrorResponse();
    }

    const wallet = session.user.storeCredit;

    const addressData = await db.query.address.findFirst({
      where: (address, o) =>
        o.and(o.eq(address.id, addressId), o.eq(address.userId, session.user.id)),
    });

    if (!addressData) {
      return AuthorizationErrorResponse();
    }

    const ids = products.map((item) => item.productWithQuantity.id);

    // Fetch all products to calculate price
    const productListRaw = await db
      .select({
        id: product.id,
        price: product.price,
      })
      .from(product)
      .where(inArray(product.id, ids));

    const productList = ids.map((id) => productListRaw.find((p) => p.id === id)!);

    // Calculate Price
    const price = productList.reduce((sum, product, index) => {
      const quantity = products[index].quantity;
      return sum + product.price * quantity;
    }, 0);

    let amountToPay = price;

    if (useStoreCredit) {
      amountToPay -= wallet;
    }

    // Place the order without COD
    if (amountToPay <= 0) {
      const orderID = uuid();

      await db.transaction(async (tx) => {
        // Step 1: Check stock for all items atomically
        for (const product of products) {
          const quantityRecord = await tx.query.quantity.findFirst({
            where: (q, o) => o.eq(q.productId, product.productWithQuantity.id),
          });

          if (!quantityRecord) {
            return ErrorResponse(
              `Inventory record not found for ${product.productWithQuantity.title}`,
            );
          }

          let quantityAvailable = false;
          const requiredQuantity = product.quantity;
          switch (product.size) {
            case "sm":
              quantityAvailable = (quantityRecord.sm ?? 0) >= requiredQuantity;
              break;
            case "md":
              quantityAvailable = (quantityRecord.md ?? 0) >= requiredQuantity;
              break;
            case "lg":
              quantityAvailable = (quantityRecord.lg ?? 0) >= requiredQuantity;
              break;
            case "xl":
              quantityAvailable = (quantityRecord.xl ?? 0) >= requiredQuantity;
              break;
            case "doublexl":
              quantityAvailable = (quantityRecord.doublexl ?? 0) >= requiredQuantity;
              break;
          }

          if (!quantityAvailable) {
            // This will cancel the transaction automatically
            throw new Error(
              `${product.productWithQuantity.title} of Size ${formatSize(product.size)} is out of stock`,
            );
          }
        }

        // Step 2: Update store credit (Atomic Check & Update)
        const creditNeeded = price;
        // Atomic Update with RETURNING to verify success
        const updatedUser = await tx
          .update(user)
          .set({ storeCredit: sql`${user.storeCredit} - ${creditNeeded}` })
          .where(
            and(
              eq(user.id, session.user.id),
              sql`${user.storeCredit} >= ${creditNeeded}`,
            ),
          )
          .returning({ id: user.id });

        if (updatedUser.length === 0) {
          return ErrorResponse("Insufficient store credit or race condition detected");
        }

        const {
          id: _id,
          userId: _userId,
          createdAt: _createdAt,
          updatedAt: _updatedAt,
          ...address
        } = addressData;

        // Step 3: Insert order items
        await tx.insert(order).values(
          products.map((p) => ({
            id: uuid(),
            paymentSuccess: true,
            price: p.productWithQuantity.price * p.quantity,
            quantity: p.quantity,
            size: p.size,
            userId: session.user.id,
            productId: p.productWithQuantity.id,
            rzpOrderId: orderID,
            ...address,
          })),
        );

        // Step 4: Decrement quantities (Atomic Update)
        const quantityUpdates = products.map(async (p) => {
          const sizeColumn =
            p.size === "doublexl"
              ? quantity.doublexl
              : quantity[p.size as keyof typeof quantity];

          if (!sizeColumn)
            return ErrorResponse(`Invalid product size detected: ${p.size}`);

          // Atomic Decrement: Only update if stock >= requested (Prevent Race Condition)
          const updateResult = await tx
            .update(quantity)
            .set({ [p.size]: sql`${sizeColumn} - ${p.quantity}` })
            .where(
              and(
                eq(quantity.productId, p.productWithQuantity.id),
                sql`${sizeColumn} >= ${p.quantity}`,
              ),
            )
            .returning({ id: quantity.id });

          if (updateResult.length === 0) {
            throw new Error(
              `${p.productWithQuantity.title} of Size ${formatSize(p.size)} is out of stock`,
            );
          }
        });

        await Promise.all(quantityUpdates);
      });

      const allOrders = await db.query.order.findMany({
        where: (o) => eq(o.rzpOrderId, orderID),
        with: { user: true, product: true },
      });

      const orderUser = allOrders[0].user;
      const zipcode = allOrders[0].zipcode;
      const userId = orderUser.id;

      // Delete user cart (single call)
      try {
        await db.delete(cart).where(eq(cart.userId, userId));
      } catch (error) {
        console.error("Error deleting user cart", error);
      }

      // Create activity logs (parallel)
      const activityLogs = allOrders.map((o) => {
        return db.insert(activity).values({
          id: uuid(),
          type: "order",
          title: `Order Placed ${o.product.title}`,
          userId: userId,
        });
      });

      await Promise.all([...activityLogs]);

      // Get delivery time
      const ttdData = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/pincode?pincode=${zipcode}`,
      ).then((res) => res.json());
      const deliveryDate = new Date(
        new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
      );
      deliveryDate.setDate(deliveryDate.getDate() + ttdData.ttd + 2);

      // Aggregate product data
      const totalWeight = allOrders.reduce((acc, o) => acc + o.product.weight, 0);
      const totalHeight = allOrders.reduce((acc, o) => acc + o.product.height, 0);
      const totalLength = Math.max(...allOrders.map((order) => order.product.length));
      const totalWidth = Math.max(...allOrders.map((order) => order.product.breadth));
      const totalAmount = allOrders.reduce((acc, o) => acc + o.product.price, 0);

      console.log("Total Weight ", totalWeight);
      console.log("Total Height ", totalHeight);
      console.log("Total Length ", totalLength);
      console.log("Total Width ", totalWidth);
      console.log("Total Amount ", totalAmount);

      // Get shipping cost
      const shippingCostData = await fetch(
        `https://track.delhivery.com/api/kinko/v1/invoice/charges/.json?md=S&ss=DTO&d_pin=${zipcode}&o_pin=560078&cgm=${totalWeight}&pt=Pre-paid`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: process.env.DELHIVERY_TOKEN!,
          },
        },
      ).then((res) => res.json());

      const shippingCost = shippingCostData[0]?.total_amount;

      // Create shipment
      const shipmentData = {
        shipments: [
          {
            name: `${allOrders[0].firstName + allOrders[0].lastName || ""}`,
            order: orderID,
            phone: allOrders[0].phone,
            add: `${allOrders[0].address1}, ${allOrders[0].address2 || ""}`,
            pin: zipcode,
            payment_mode: "Prepaid",
            weight: totalWeight,
            shipment_height: totalHeight,
            shipment_length: totalLength,
            shipment_width: totalWidth,
          },
        ],
        pickup_location: { name: "mahaveer-sitara-d-block" },
      };

      const formBody = new URLSearchParams({
        format: "json",
        data: JSON.stringify(shipmentData),
      });

      const createShipment = await fetch(
        "https://track.delhivery.com/api/cmu/create.json",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
            Authorization: process.env.DELHIVERY_TOKEN!,
          },
          body: formBody,
        },
      ).then((res) => res.json());

      const waybill = createShipment.packages?.[0]?.waybill;

      console.log("WAYBILL: ", waybill);

      // Update all orders (bulk update if schema allows)
      await db
        .update(order)
        .set({
          ttd: deliveryDate,
          shipmentCost: Math.floor((shippingCost / allOrders.length) * 100) / 100,
          waybill,
        })
        .where(eq(order.rzpOrderId, orderID));
      const paymentId = uuid();
      // Send Email
      await sendOrderReceipt(
        waybill,
        orderUser.name,
        orderID,
        allOrders,
        paymentId,
        deliveryDate,
        orderUser.email,
      );

      // Prepare WhatsApp messages
      for (const order of allOrders) {
        await Promise.all([
          fetch(
            `https://graph.facebook.com/v22.0/${process.env.WHATSAPP_PHONE_NUMBER}/messages`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `${process.env.WHATSAPP_CLOUD_API_KEY}`,
              },
              body: JSON.stringify({
                messaging_product: "whatsapp",
                to: `+91${allOrders[0].phone}`,
                type: "template",
                template: {
                  name: "order_confirmed",
                  language: {
                    code: "en_US",
                  },
                  components: [
                    {
                      type: "header",
                      parameters: [
                        {
                          type: "image",
                          image: {
                            link: `${order.product.images[0]}${"?w-3000,q-70"}`,
                          },
                        },
                      ],
                    },
                    {
                      type: "body",
                      parameters: [
                        {
                          type: "text",
                          text: order.firstName,
                        },
                        {
                          type: "text",
                          text: `${order.id}`,
                        },
                        {
                          type: "text",
                          text: `${formatCurrency(order.price)}`,
                        },
                        {
                          type: "text",
                          text: `${deliveryDate.toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "long",
                          })}`,
                        },
                        {
                          type: "text",
                          text: `${waybill}`,
                        },
                      ],
                    },
                  ],
                },
              }),
            },
          ),
          fetch(
            `https://graph.facebook.com/v22.0/${process.env.WHATSAPP_PHONE_NUMBER}/messages`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `${process.env.WHATSAPP_CLOUD_API_KEY}`,
              },
              body: JSON.stringify({
                messaging_product: "whatsapp",
                to: "+919448093950",
                type: "template",
                template: {
                  name: "order_confirmed",
                  language: {
                    code: "en_US",
                  },
                  components: [
                    {
                      type: "header",
                      parameters: [
                        {
                          type: "image",
                          image: {
                            link: `${order.product.images[0]}${"?w-3000,q-70"}`,
                          },
                        },
                      ],
                    },
                    {
                      type: "body",
                      parameters: [
                        {
                          type: "text",
                          text: order.firstName,
                        },
                        {
                          type: "text",
                          text: `${order.id}`,
                        },
                        {
                          type: "text",
                          text: `${formatCurrency(order.price)}`,
                        },
                        {
                          type: "text",
                          text: `${deliveryDate.toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "long",
                          })}`,
                        },
                        {
                          type: "text",
                          text: `${waybill}`,
                        },
                      ],
                    },
                  ],
                },
              }),
            },
          ),
        ]);
      }
      return SuccessResponse("Created Order(s) Successfully", {
        orderID,
        NoRazorpayOrder: true,
        price,
      });
    }

    // Handle Coupon
    if (coupon) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL!}/api/coupon?code=${coupon.code}`,
      );
      const findCoupon: ApiResponse<Coupon> = await res.json();

      if (!findCoupon.success || !findCoupon.data) {
        return ErrorResponse("Invalid Coupon");
      }

      const couponData = findCoupon.data;

      // handle first order only coupon
      if (couponData.firstOrder) {
        const orderExists = await db.query.order.findFirst({
          where: (order, o) => o.eq(order.email, addressData.email),
        });
        if (orderExists) {
          return ErrorResponse("Invalid Coupon");
        }
      }

      // handle min order value
      if (couponData.minOrderValue > 0) {
        if (price < couponData.minOrderValue) {
          return ErrorResponse(
            `Minimum order value of ₹${formatCurrency(couponData.minOrderValue)} is required`,
          );
        }
      }

      // check if user has already user coupon
      const usedCoupon = await db.query.couponRedemptions.findFirst({
        where: (fields, operators) =>
          operators.and(
            operators.eq(fields.couponId, couponData.id),
            operators.eq(fields.userId, session.user.id),
          ),
      });

      if (usedCoupon) {
        return ErrorResponse("Invalid Coupon");
      }

      amountToPay = calculateDiscount(price, couponData);
    }

    // Deduct Store Credit for Partial Payment (Atomic)
    if (useStoreCredit && wallet > 0 && amountToPay > 0) {
      const creditToDeduct = wallet;

      const updateRes = await db
        .update(user)
        .set({ storeCredit: sql`${user.storeCredit} - ${creditToDeduct}` })
        .where(
          and(
            eq(user.id, session.user.id),
            sql`${user.storeCredit} >= ${creditToDeduct}`,
          ),
        )
        .returning({ id: user.id });

      if (updateRes.length === 0) {
        return ErrorResponse("Insufficient store credit changed during transaction");
      }
    }

    // Aggregate product weight
    const totalWeight =
      250 *
      products.length *
      products.reduce((sum, product) => sum + product.quantity, 0);

    const shippingCostData = await fetch(
      `https://track.delhivery.com/api/kinko/v1/invoice/charges/.json?md=S&ss=DTO&d_pin=${addressData.zipcode}&o_pin=560078&cgm=${totalWeight}&pt=COD`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: process.env.DELHIVERY_TOKEN!,
        },
      },
    ).then((res) => res.json());

    const shippingCost: number = shippingCostData[0]?.total_amount;

    if (shippingCost === undefined || shippingCost === null) {
      return ErrorResponse("Failed to calculate shipping cost. Please try again.");
    }

    const orderID = uuid();
    // Check if Quantity Exists for each product
    await db.transaction(async (tx) => {
      // Step 1: Check stock for all items atomically
      for (const product of products) {
        // Atomic Check: Ensure stock exists (Read Only)
        const quantityRecord = await tx.query.quantity.findFirst({
          where: (q, o) => o.eq(q.productId, product.productWithQuantity.id),
        });

        if (!quantityRecord) {
          throw new Error(
            `Inventory record not found for ${product.productWithQuantity.title}`,
          );
        }

        let quantityAvailable = false;
        const requiredQuantity = product.quantity;
        const qSize = product.size as keyof typeof quantityRecord;
        if (typeof quantityRecord[qSize] === "number") {
          quantityAvailable = (quantityRecord[qSize] as number) >= requiredQuantity;
        }

        if (!quantityAvailable) {
          throw new Error(
            `${product.productWithQuantity.title} of Size ${formatSize(product.size)} is Out of stock`,
          );
        }

        await tx.insert(activity).values({
          id: uuid(),
          type: "order",
          title: `Order Placed ${product.productWithQuantity.title}`,
          userId: session.user.id,
        });
      }

      // Step 2: Insert placeholder order items
      const { id, userId, createdAt, updatedAt, ...address } = addressData;
      await tx.insert(order).values(
        products.map((p) => ({
          id: uuid(),
          paymentSuccess: true,
          isCod: true,
          isCodApproved: false,
          price: p.productWithQuantity.price * p.quantity,
          codAmount: amountToPay + shippingCost,
          shipmentCost: shippingCost,
          quantity: p.quantity,
          size: p.size,
          userId: session.user.id,
          productId: p.productWithQuantity.id,
          rzpOrderId: orderID,
          ...address,
        })),
      );
    });

    return SuccessResponse("Created Order(s) Successfully", {
      orderID,
      NoRazorpayOrder: true,
      price,
    });
  } catch (error) {
    return ErrorResponse(
      error instanceof Error ? error.message : "Failed to create order",
    );
  }
}
