ALTER TABLE "orders" DROP CONSTRAINT "orders_productId_product_id_fk";
--> statement-breakpoint
ALTER TABLE "coupons" ALTER COLUMN "expires_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "productId";