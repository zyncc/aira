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
import { returns } from "./account";
import { user } from "./auth";
import { product } from "./product";

export const couponTypeEnum = pgEnum("coupon_type", ["percentage", "fixed"]);

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
  expiresAt: timestamp("expires_at", { withTimezone: true }),

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
  rzpOrderId: text("rzpOrderId").notNull(),
  price: integer("price").notNull(),
  size: text("size").notNull(),
  quantity: integer("quantity").notNull(),
  paymentId: text("paymentId"),
  paymentSuccess: boolean("paymentSuccess")
    .$defaultFn(() => false)
    .notNull(),
  ttd: timestamp("ttd"),
  shipmentCost: doublePrecision("shipmentCost"),
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

  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  productId: text("productId")
    .notNull()
    .references(() => product.id, { onDelete: "cascade" }),

  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

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

export const orderRelations = relations(order, ({ one }) => ({
  user: one(user, {
    fields: [order.userId],
    references: [user.id],
  }),
  product: one(product, {
    fields: [order.productId],
    references: [product.id],
  }),
  returns: one(returns, {
    fields: [order.id],
    references: [returns.orderId],
  }),
}));
