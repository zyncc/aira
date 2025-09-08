import { relations } from "drizzle-orm";
import { bigint, boolean, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { activity, address, cart, returns, wishlist } from "./account";
import { order } from "./order";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  role: text("role").notNull(),
  banned: boolean("banned"),
  banReason: text("banReason"),
  banExpires: timestamp("banExpires"),
  phoneNumber: text("phoneNumber").unique(),
  phoneNumberVerified: boolean("phoneNumberVerified")
    .$defaultFn(() => false)
    .notNull(),
  emailOffers: boolean("emailOffers").$defaultFn(() => true),
  storeCredit: integer("storeCredit")
    .$defaultFn(() => 0)
    .notNull(),

  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const userRelations = relations(user, ({ many, one }) => ({
  addresses: many(address),
  cart: one(cart),
  wishlist: one(wishlist),
  orders: many(order),
  activities: many(activity),
  returns: many(returns),
}));

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  impersonatedBy: text("impersonatedBy"),

  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),

  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),

  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const rateLimit = pgTable("rateLimit", {
  id: text("id").primaryKey(),
  key: text("key"),
  count: integer("count"),
  lastRequest: bigint("lastRequest", { mode: "number" }),
});
