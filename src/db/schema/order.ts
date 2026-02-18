import { relations } from "drizzle-orm";
import {
  boolean,
  doublePrecision,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { product } from "./product";

export const couponTypeEnum = pgEnum("coupon_type", ["percentage", "fixed"]);
export const sizeEnum = pgEnum("size_enum", ["sm", "md", "lg", "xl", "doublexl"]);

export type Size = (typeof sizeEnum.enumValues)[number];

export const coupons = pgTable("coupons", {
  id: text("id").primaryKey(),
  code: text("code").notNull().unique(),
  type: couponTypeEnum("type").notNull(),
  value: integer("value").notNull(),
  firstOrder: boolean("firstOrder").notNull(),
  minOrderValue: integer("minOrderValue").notNull(),
  isActive: boolean("isActive")
    .$defaultFn(() => true)
    .notNull(),
  usageLimit: integer("usage_limit").notNull(),
  usageCount: integer("usage_count").notNull().default(0),

  startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),

  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const couponRedemptions = pgTable("coupon_redemptions", {
  id: text("id").primaryKey(),

  couponId: text("coupon_id")
    .notNull()
    .references(() => coupons.id, {
      onDelete: "cascade",
    }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, {
      onDelete: "cascade",
    }),

  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const order = pgTable("orders", {
  id: text("id").primaryKey(),
  orderId: text("orderId").notNull(),
  paymentId: text("paymentId"),

  subtotal: doublePrecision("subtotal").notNull(),
  discountPrice: doublePrecision("discountPrice").notNull(), // discount from coupon
  shippingPrice: doublePrecision("shippingPrice").notNull(), // shipppingPrice
  totalPrice: doublePrecision("totalPrice").notNull(), // subtotal + discountPrice + shippingPrice
  paymentSuccess: boolean("paymentSuccess").default(false).notNull(),

  ttd: timestamp("ttd"),
  waybill: text("waybill"),

  firstName: text("firstName").notNull(),
  lastName: text("lastName"),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address1: text("address1").notNull(),
  address2: text("address2"),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipcode: text("zipcode").notNull(),

  couponCode: text("couponCode"),

  isCod: boolean("isCod").default(false),
  isCodApproved: boolean("isCodApproved").default(false),
  usedStoreCredit: boolean("usedStoreCredit").default(false),

  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const orderItem = pgTable("order_items", {
  id: text("id").primaryKey(),

  size: sizeEnum("size").notNull(),
  quantity: integer("quantity").notNull(),
  itemPrice: doublePrecision("itemPrice").notNull(),

  orderId: text("orderId")
    .notNull()
    .references(() => order.id, { onDelete: "cascade" }),
  productId: text("productId")
    .notNull()
    .references(() => product.id, { onDelete: "cascade" }),

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

export const couponRedemptionRelations = relations(couponRedemptions, ({ one }) => ({
  coupon: one(coupons, {
    fields: [couponRedemptions.couponId],
    references: [coupons.id],
  }),

  user: one(user, {
    fields: [couponRedemptions.userId],
    references: [user.id],
  }),
}));

export const orderRelations = relations(order, ({ one, many }) => ({
  user: one(user, {
    fields: [order.userId],
    references: [user.id],
  }),
  items: many(orderItem),
  returns: one(returns, {
    fields: [order.id],
    references: [returns.orderId],
  }),
}));

export const orderItemRelations = relations(orderItem, ({ one }) => ({
  order: one(order, {
    fields: [orderItem.orderId],
    references: [order.id],
  }),

  product: one(product, {
    fields: [orderItem.productId],
    references: [product.id],
  }),
}));
