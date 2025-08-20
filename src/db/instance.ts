import * as schema from "@/db/schema";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const globalForDb = globalThis as unknown as {
  postgresClient?: ReturnType<typeof postgres>;
};

const driver =
  globalForDb.postgresClient ??
  postgres(process.env.DATABASE_URL!, {
    max: 1,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.postgresClient = driver;
}

export const db = drizzle(driver, {
  schema,
  casing: "camelCase",
});
