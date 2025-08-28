ALTER TABLE "orders" RENAME COLUMN "address" TO "firstName";--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "lastName" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "email" text NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "phone" text NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "address1" text NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "address2" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "city" text NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "state" text NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "zipcode" text NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "landmark" text;