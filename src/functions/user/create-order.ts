"use server";

import { db } from "@/db/instance";
import { activity, cart, order, product, quantity, user } from "@/db/schema";
import {
  AuthErrorResponse,
  AuthorizationErrorResponse,
  ErrorResponse,
  SuccessResponse,
} from "@/lib/api-responses";
import { ProductsWithQuantity } from "@/lib/types";
import { formatCurrency, formatSize, uuid } from "@/lib/utils";
import { eq, inArray, sql } from "drizzle-orm";
import Razorpay from "razorpay";
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
) {
  try {
    const session = await getServerSession(true);

    if (!session) {
      return AuthErrorResponse();
    }

    const wallet = session.user.storeCredit;

    const checkAddress = await db.query.address.findFirst({
      where: (address, o) =>
        o.and(o.eq(address.id, addressId), o.eq(address.userId, session.user.id)),
    });

    if (!checkAddress) {
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
      const quantity = products[index].quantity ?? 1;
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
            return ErrorResponse(
              `${product.productWithQuantity.title} of Size ${formatSize(product.size)} is out of stock`,
            );
          }
        }

        // Step 2: Update store credit
        const remainingCredit = wallet - price;
        await tx
          .update(user)
          .set({ storeCredit: remainingCredit < 0 ? 0 : remainingCredit })
          .where(eq(user.id, session.user.id));

        const { id, userId, ...address } = checkAddress;

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

        // Step 4: Decrement quantities
        const quantityUpdates = products.map((p) => {
          switch (p.size) {
            case "sm":
              return tx
                .update(quantity)
                .set({ sm: sql`${quantity.sm} - ${p.quantity}` })
                .where(eq(quantity.productId, p.productWithQuantity.id));
            case "md":
              return tx
                .update(quantity)
                .set({ md: sql`${quantity.md} - ${p.quantity}` })
                .where(eq(quantity.productId, p.productWithQuantity.id));
            case "lg":
              return tx
                .update(quantity)
                .set({ lg: sql`${quantity.lg} - ${p.quantity}` })
                .where(eq(quantity.productId, p.productWithQuantity.id));
            case "xl":
              return tx
                .update(quantity)
                .set({ xl: sql`${quantity.xl} - ${p.quantity}` })
                .where(eq(quantity.productId, p.productWithQuantity.id));
            case "doublexl":
              return tx
                .update(quantity)
                .set({ doublexl: sql`${quantity.doublexl} - ${p.quantity}` })
                .where(eq(quantity.productId, p.productWithQuantity.id));
            default:
              return ErrorResponse(`Invalid product size detected: ${p.size}`);
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

      // ✅ Delete user cart (single call)
      try {
        await db.delete(cart).where(eq(cart.userId, userId));
      } catch (error) {
        console.error("Error deleting user cart", error);
      }

      // ✅ Create activity logs (parallel)
      const activityLogs = allOrders.map((o) => {
        return db.insert(activity).values({
          id: uuid(),
          type: "order",
          title: `Order Placed ${o.product.title}`,
          userId: userId,
        });
      });

      await Promise.all([...activityLogs]);

      // ✅ Get delivery time
      const ttdData = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/pincode?pincode=${zipcode}`,
      ).then((res) => res.json());
      const deliveryDate = new Date(
        new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
      );
      deliveryDate.setDate(deliveryDate.getDate() + ttdData.ttd + 2);

      // ✅ Aggregate product data
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

      // ✅ Get shipping cost
      const shippingCostData = await fetch(
        `https://track.delhivery.com/api/kinko/v1/invoice/charges/.json?md=E&ss=DTO&d_pin=${zipcode}&o_pin=560078&cgm=${totalWeight}&pt=Pre-paid`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: process.env.DELHIVERY_TOKEN!,
          },
        },
      ).then((res) => res.json());

      const shippingCost = shippingCostData[0]?.total_amount;

      // ✅ Create shipment
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
        pickup_location: { name: "mahaveer-sitara" },
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

      // ✅ Update all orders (bulk update if schema allows)
      await db
        .update(order)
        .set({
          ttd: deliveryDate,
          shipmentCost: Math.floor((shippingCost / allOrders.length) * 100) / 100,
          waybill,
        })
        .where(eq(order.rzpOrderId, orderID));
      const paymentId = uuid();
      // ✅ Send Email
      await sendOrderReceipt(
        waybill,
        orderUser.name,
        orderID,
        allOrders,
        paymentId,
        deliveryDate,
        orderUser.email,
      );

      // ✅ Prepare WhatsApp messages
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
                to: `+91${orderUser.phoneNumber}`,
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
                to: "+919148106357",
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
          return ErrorResponse(
            `${product.productWithQuantity.title} of Size ${formatSize(product.size)} is out of stock`,
          );
        }
      }

      // Step 2: Insert placeholder order items
      const { id, userId, ...address } = checkAddress;
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

export async function CreateOrderForLoggedOutUsers(
  products: products,
  addressId: string,
  userId: string,
) {
  try {
    const checkUser = await db.query.user.findFirst({
      where: (user, o) => o.eq(user.id, userId),
      columns: {
        id: true,
      },
    });

    if (!checkUser) {
      return ErrorResponse("User not found");
    }

    const checkAddress = await db.query.address.findFirst({
      where: (address, o) =>
        o.and(o.eq(address.id, addressId), o.eq(address.userId, checkUser.id)),
    });

    if (!checkAddress) {
      return AuthorizationErrorResponse();
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
    const price = productList.reduce((sum, product, index) => {
      const quantity = products[index].quantity ?? 1;
      return sum + product.price * quantity;
    }, 0);

    // Create Razorpay Order ID
    const orderID = await instance.orders
      .create({
        amount: price * 100,
        currency: "INR",
      })
      .then((data) => data.id);

    // Check if Quantity Exists for each product
    for (const product of products) {
      let quantityAvailable = false;
      const quantity = await db.query.quantity.findFirst({
        where: (quantity, o) => o.eq(quantity.productId, product.productWithQuantity.id),
      });

      if (!quantity) {
        return ErrorResponse("Something went wrong, try again");
      }

      const requiredQuantity = product.quantity;

      switch (product.size) {
        case "sm":
          quantityAvailable = (quantity.sm ?? 0) >= requiredQuantity;
          break;
        case "md":
          quantityAvailable = (quantity.md ?? 0) >= requiredQuantity;
          break;
        case "lg":
          quantityAvailable = (quantity.lg ?? 0) >= requiredQuantity;
          break;
        case "xl":
          quantityAvailable = (quantity.xl ?? 0) >= requiredQuantity;
          break;
        case "doublexl":
          quantityAvailable = (quantity.doublexl ?? 0) >= requiredQuantity;
          break;
        default:
          console.error(`Invalid size detected: ${product.size}`);
      }

      if (!quantityAvailable) {
        return ErrorResponse(
          `${product.productWithQuantity.title} of Size ${formatSize(product.size)} is Out of stock`,
        );
      }

      await db.insert(order).values({
        id: uuid(),
        paymentSuccess: false,
        price: product.productWithQuantity.price * product.quantity,
        quantity: product.quantity,
        size: product.size,
        userId: checkUser.id,
        productId: product.productWithQuantity.id,
        rzpOrderId: orderID,
        address1: checkAddress.address1,
        address2: checkAddress.address2,
        city: checkAddress.city,
        email: checkAddress.email,
        firstName: checkAddress.firstName,
        lastName: checkAddress.lastName,
        phone: checkAddress.phone,
        state: checkAddress.state,
        zipcode: checkAddress.zipcode,
      });
    }

    return SuccessResponse("Created Order(s) Successfully", { orderID, price });
  } catch (error) {
    console.error("Create Order error:", error);
    return ErrorResponse("Something went wrong, please try again later");
  }
}
