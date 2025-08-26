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

  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  productId: text("productId")
    .notNull()
    .references(() => product.id, { onDelete: "cascade" }),
  addressId: text("addressId")
    .notNull()
    .references(() => address.id, { onDelete: "cascade" }),

  createdAt: timestamp("createdAt")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updatedAt")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const orderRelations = relations(order, ({ one }) => ({
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
