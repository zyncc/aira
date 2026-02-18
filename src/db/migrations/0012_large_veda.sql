ALTER TABLE "orders" ALTER COLUMN "discountPrice" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "subtotal" double precision NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "codAmount";