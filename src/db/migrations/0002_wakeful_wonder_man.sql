ALTER TABLE "order" ALTER COLUMN "addressId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "order" ALTER COLUMN "trackingId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "ttd" timestamp;--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "shipmentCost" double precision;--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "status" text;--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "shippingLabel" text;