import { relations } from "drizzle-orm";
import {
  boolean,
  doublePrecision,
  integer,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { cartItems, wishlistItems } from "./account";
import { user } from "./auth";
import { order } from "./order";

export const product = pgTable("product", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  images: text("images").array().notNull(),
  placeholderImages: text("placeholderImages")
    .array()
    .notNull()
    .$defaultFn(() => []),
  salePrice: integer("salePrice"),
  category: text("category").notNull(),
  isArchived: boolean("isArchived")
    .$defaultFn(() => false)
    .notNull()
    .notNull()
    .notNull(),
  isFeatured: boolean("isFeatured")
    .$defaultFn(() => false)
    .notNull()
    .notNull(),
  color: text("color").notNull(),
  length: doublePrecision("length").notNull(),
  breadth: doublePrecision("breadth").notNull(),
  height: doublePrecision("height").notNull(),
  weight: doublePrecision("weight").notNull(),
  listOrder: integer("listOrder").$defaultFn(() => 0),

  createdAt: timestamp("createdAt")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updatedAt")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const productRelations = relations(product, ({ one, many }) => ({
  cartItems: many(cartItems),
  reviews: many(reviews),
  order: many(order),
  wishlistItems: many(wishlistItems),
  quantity: one(quantity, {
    fields: [product.id],
    references: [quantity.productId],
  }),
}));

export const reviews = pgTable("reviews", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  images: text("images").array(),

  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  productId: text("productId")
    .notNull()
    .references(() => product.id, { onDelete: "cascade" }),

  createdAt: timestamp("createdAt")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updatedAt")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const reviewRelations = relations(reviews, ({ one }) => ({
  product: one(product, { fields: [reviews.productId], references: [product.id] }),
  user: one(user, { fields: [reviews.userId], references: [user.id] }),
}));

export const quantity = pgTable("quantity", {
  id: text("id").primaryKey(),
  sm: integer("sm")
    .$defaultFn(() => 0)
    .notNull(),
  md: integer("md")
    .$defaultFn(() => 0)
    .notNull(),
  lg: integer("lg")
    .$defaultFn(() => 0)
    .notNull(),
  xl: integer("xl")
    .$defaultFn(() => 0)
    .notNull(),
  doublexl: integer("doublexl")
    .$defaultFn(() => 0)
    .notNull(),

  productId: text("productId")
    .notNull()
    .references(() => product.id, { onDelete: "cascade" }),

  createdAt: timestamp("createdAt")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updatedAt")
    .$defaultFn(() => new Date())
    .notNull(),
});
