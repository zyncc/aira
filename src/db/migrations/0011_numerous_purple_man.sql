ALTER TABLE "orders" DROP CONSTRAINT "orders_addressId_address_id_fk";
--> statement-breakpoint
ALTER TABLE "address" ALTER COLUMN "lastName" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "address" ALTER COLUMN "address2" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "address" ALTER COLUMN "landmark" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "firstName" text NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "lastName" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "email" text NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "phone" text NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "address1" text NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "address2" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "city" text NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "state" text NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "zipcode" text NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "landmark" text;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_addressId_address_id_fk" FOREIGN KEY ("addressId") REFERENCES "public"."address"("id") ON DELETE set null ON UPDATE no action;