import z from "zod";
import {
  accountSchema,
  activitySchema,
  addressSchema,
  cartItemsSchema,
  cartSchema,
  orderSchema,
  productSchema,
  quantitySchema,
  reviewsSchema,
  sessionSchema,
  userSchema,
  verificationSchema,
  wishlistItemsSchema,
  wishlistSchema,
} from "./zod-schemas";

export type ProductsWithQuantity = Product & { quantity: Quantity };

export type FullOrderType = Order & { user: User } & { product: Product } & {
  address: Address;
};

export type UserWithAddress = User & { address: Address[] };

export type OrderWithUser = Order & { user: User };

export type OrderWithProduct = Order & { product: Product };
// Auth Schema
export type User = z.infer<typeof userSchema>;
export type Session = z.infer<typeof sessionSchema>;
export type Account = z.infer<typeof accountSchema>;
export type Verification = z.infer<typeof verificationSchema>;

// Account Schema
export type Address = z.infer<typeof addressSchema>;
export type Cart = z.infer<typeof cartSchema>;
export type CartItem = z.infer<typeof cartItemsSchema>;
export type Wishlist = z.infer<typeof wishlistSchema>;
export type WishlistItem = z.infer<typeof wishlistItemsSchema>;
export type Activity = z.infer<typeof activitySchema>;

// Order Schema
export type Order = z.infer<typeof orderSchema>;

// Product Schema
export type Product = z.infer<typeof productSchema>;
export type Review = z.infer<typeof reviewsSchema>;
export type Quantity = z.infer<typeof quantitySchema>;
