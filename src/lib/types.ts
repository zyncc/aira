import {
  account,
  activity,
  address,
  cart,
  cartItems,
  coupons,
  order,
  orderItem,
  product,
  quantity,
  returns,
  reviews,
  session,
  user,
  verification,
  wishlist,
  wishlistItems,
} from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

/* =========================
   Base Table Types
========================= */

// Auth
export type User = InferSelectModel<typeof user>;
export type Session = InferSelectModel<typeof session>;
export type Account = InferSelectModel<typeof account>;
export type Verification = InferSelectModel<typeof verification>;

// Account Related
export type Address = InferSelectModel<typeof address>;
export type Cart = InferSelectModel<typeof cart>;
export type CartItem = InferSelectModel<typeof cartItems>;
export type Wishlist = InferSelectModel<typeof wishlist>;
export type WishlistItem = InferSelectModel<typeof wishlistItems>;
export type Activity = InferSelectModel<typeof activity>;
export type Returns = InferSelectModel<typeof returns>;

// Order
export type Order = InferSelectModel<typeof order>;
export type OrderItem = InferSelectModel<typeof orderItem>;
export type Coupon = InferSelectModel<typeof coupons>;

// Product
export type Product = InferSelectModel<typeof product>;
export type Review = InferSelectModel<typeof reviews>;
export type Quantity = InferSelectModel<typeof quantity>;

/* =========================
   Relation Types
========================= */

export type ProductsWithQuantity = Product & {
  quantity: Quantity;
};

export type FullOrderType = Order & {
  user: User;
  items: (OrderItem & {
    product: Product;
  })[];
};

export type FullReturnType = Returns & {
  user: User;
  order: Order;
};

export type UserWithAddress = User & {
  address: Address[];
};

export type OrderWithUser = Order & {
  user: User;
};

export type OrderWithOrderItems = Order & {
  items: (OrderItem & {
    product: Product;
  })[];
};

export type WhatsappOrderDetails = {
  id: string;
  firstName: string;
  items: {
    product: Product;
    itemPrice: number;
  }[];
  ttd: Date | null;
  waybill: string | null;
};
