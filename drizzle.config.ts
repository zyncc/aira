import type { Config } from "drizzle-kit";

export default {
  out: "./src/db/migrations",
  schema: "./src/db/schema/index.ts",
  breakpoints: true,
  verbose: true,
  strict: true,
  dialect: "postgresql",
  casing: "camelCase",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
