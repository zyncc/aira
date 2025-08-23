"use server";

import { db } from "@/db/instance";
import { cart, order, product } from "@/db/schema";
import {
  AuthErrorResponse,
  AuthorizationErrorResponse,
  ErrorResponse,
  SuccessResponse,
} from "@/lib/api-responses";
import { ProductsWithQuantity } from "@/lib/types";
import { formatSize, uuid } from "@/lib/utils";
import { eq, inArray } from "drizzle-orm";
import Razorpay from "razorpay";
import { getServerSession } from "../auth/get-server-session";

type products = {
  productWithQuantity: ProductsWithQuantity;
  quantity: number;
  size: string;
}[];

export async function CreateOrder(products: products, addressId: string) {
  try {
    const session = await getServerSession();

    if (!session) {
      return AuthErrorResponse();
    }

    const checkAddress = await db.query.address.findFirst({
      where: (address, o) =>
        o.and(o.eq(address.id, addressId), o.eq(address.userId, session.user.id)),
    });

    if (!checkAddress) {
      AuthorizationErrorResponse();
    }

    const instance = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string,
      key_secret: process.env.RAZORPAY_KEY_SECRET as string,
    });

    const ids = products.map((item) => item.productWithQuantity.id);

    // Fetch all products to calculate price
    const productList = await db
      .select({
        id: product.id,
        price: product.price,
      })
      .from(product)
      .where(inArray(product.id, ids));

    // Calculate Price
    const price = productList.reduce((sum, product) => {
      const match = products.find((p) => p.productWithQuantity.id === product.id);
      const quantity = match?.quantity ?? 1;
      return sum + product.price * quantity;
    }, 0);

    // Create Razorpay Order ID
    const orderID = await instance.orders
      .create({
        amount: price * 100,
        currency: "INR",
        receipt: `Order for ${product.title}`,
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
        try {
          await db.delete(cart).where(eq(cart.userId, session.user.id));
        } catch (error) {
          console.error("Error clearing cart:", error);
        }

        return ErrorResponse(
          `${product.productWithQuantity.title} of Size ${formatSize(product.size)} is Out of stock`,
        );
      }

      await db.insert(order).values({
        id: uuid(),
        paymentSuccess: false,
        price: product.productWithQuantity.price,
        quantity: product.quantity,
        size: product.size,
        userId: session.user.id,
        productId: product.productWithQuantity.id,
        addressId,
        rzpOrderId: orderID,
      });
    }

    return SuccessResponse("Created Order(s) Successfully", { orderID, price });
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

    // Fetch all products to calculate price
    const productList = await db
      .select({
        id: product.id,
        price: product.price,
      })
      .from(product)
      .where(inArray(product.id, ids));

    // Calculate Price
    const price = productList.reduce((sum, product) => {
      const match = products.find((p) => p.productWithQuantity.id === product.id);
      const quantity = match?.quantity ?? 1;
      return sum + product.price * quantity;
    }, 0);

    // Create Razorpay Order ID
    const orderID = await instance.orders
      .create({
        amount: price * 100,
        currency: "INR",
        receipt: `Order for ${product.title}`,
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
        price: product.productWithQuantity.price,
        quantity: product.quantity,
        size: product.size,
        userId: checkUser.id,
        productId: product.productWithQuantity.id,
        addressId,
        rzpOrderId: orderID,
      });
    }

    return SuccessResponse("Created Order(s) Successfully", { orderID, price });
  } catch (error) {
    console.error("Create Order error:", error);
    return ErrorResponse("Something went wrong, please try again later");
  }
}
