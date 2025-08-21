import { relations } from "drizzle-orm";
import {
  boolean,
  doublePrecision,
  integer,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { address } from "./account";
import { user } from "./auth";
import { product } from "./product";

export const order = pgTable("order", {
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
  shippingLabel: text("shippingLabel"),

  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  productId: text("productId")
    .notNull()
    .references(() => product.id, { onDelete: "cascade" }),
  addressId: text("addressId")
    .notNull()
    .references(() => address.id, { onDelete: "cascade" }),
  trackingId: text("trackingId").references(() => tracking.id, { onDelete: "cascade" }),

  createdAt: timestamp("createdAt")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updatedAt")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const orderRelations = relations(order, ({ one }) => ({
  tracking: one(tracking, {
    fields: [order.trackingId],
    references: [tracking.id],
  }),
  user: one(user, {
    fields: [order.userId],
    references: [user.id],
  }),
  product: one(product, {
    fields: [order.productId],
    references: [product.id],
  }),
  address: one(address, {
    fields: [order.addressId],
    references: [address.id],
  }),
}));

export const tracking = pgTable("tracking", {
  id: text("id").primaryKey(),
  trackingId: text("trackingId").notNull(),
  statusType: text("statusType").notNull(),
  status: text("status").notNull(),
  statusDateTime: timestamp("statusDateTime").notNull(),
  statusLocation: text("statusLocation").notNull(),

  createdAt: timestamp("createdAt")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updatedAt")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const trackingRelations = relations(tracking, ({ many }) => ({
  orders: many(order),
}));
