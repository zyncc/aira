import { relations } from "drizzle-orm";
import { boolean, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth";
import { order } from "./order";
import { product } from "./product";

export const address = pgTable("address", {
  id: text("id").primaryKey(),
  firstName: text("firstName").notNull(),
  lastName: text("lastName"),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address1: text("address1").notNull(),
  address2: text("address2"),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipcode: text("zipcode").notNull(),

  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const addressRelations = relations(address, ({ one }) => ({
  user: one(user, {
    fields: [address.userId],
    references: [user.id],
  }),
}));

export const cart = pgTable("cart", {
  id: text("id").primaryKey(),

  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const cartRelations = relations(cart, ({ many }) => ({
  items: many(cartItems),
}));

export const cartItems = pgTable("cartItems", {
  id: text("id").primaryKey(),
  size: text("size").notNull(),
  quantity: integer("quantity")
    .$defaultFn(() => 1)
    .notNull(),

  cartId: text("cartId")
    .notNull()
    .references(() => cart.id, { onDelete: "cascade" }),
  productId: text("productId")
    .notNull()
    .references(() => product.id, { onDelete: "cascade" }),

  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const cartItemsRelation = relations(cartItems, ({ one }) => ({
  product: one(product, {
    fields: [cartItems.productId],
    references: [product.id],
  }),
  cart: one(cart, {
    fields: [cartItems.cartId],
    references: [cart.id],
  }),
}));

export const wishlist = pgTable("wishlist", {
  id: text("id").primaryKey(),

  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const wishlistRelations = relations(wishlist, ({ many }) => ({
  items: many(wishlistItems),
}));

export const wishlistItems = pgTable("wishlistItems", {
  id: text("id").primaryKey(),

  productId: text("productId")
    .notNull()
    .references(() => product.id, { onDelete: "cascade" }),
  wishlistId: text("wishlistId")
    .notNull()
    .references(() => wishlist.id, { onDelete: "cascade" }),

  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const wishlistItemsRelations = relations(wishlistItems, ({ one }) => ({
  wishlist: one(wishlist, {
    fields: [wishlistItems.wishlistId],
    references: [wishlist.id],
  }),
  product: one(product, {
    fields: [wishlistItems.productId],
    references: [product.id],
  }),
}));

export const activity = pgTable("activity", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type").notNull(),

  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const returns = pgTable("returns", {
  id: text("id").primaryKey(),
  reason: text("reason").notNull(),
  type: text("type").notNull(),
  approved: boolean("approved"),
  notApprovedReason: text("notApprovedReason"),
  finalApproved: boolean("finalApproved"),
  finalNotApprovedReason: text("finalNotApprovedReason"),
  images: text("images").array().notNull(),

  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  orderId: text("orderId")
    .notNull()
    .references(() => order.id, { onDelete: "cascade" }),

  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const returnRelations = relations(returns, ({ one }) => ({
  user: one(user, {
    fields: [returns.userId],
    references: [user.id],
  }),
  order: one(order, {
    fields: [returns.orderId],
    references: [order.id],
  }),
}));
