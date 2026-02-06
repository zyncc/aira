ALTER TABLE "coupon_redemptions" DROP CONSTRAINT "coupon_redemptions_order_id_orders_id_fk";
--> statement-breakpoint
ALTER TABLE "coupon_redemptions" DROP COLUMN "order_id";