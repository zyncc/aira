ALTER TABLE "orders" RENAME COLUMN "firstName" TO "address";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "lastName";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "email";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "phone";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "address1";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "address2";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "city";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "state";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "zipcode";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "landmark";