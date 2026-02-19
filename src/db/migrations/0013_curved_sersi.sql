CREATE TYPE "public"."return_status" AS ENUM('requested', 'approved', 'rejected', 'picked_up', 'received', 'refunded', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."return_type" AS ENUM('exchange', 'refund');--> statement-breakpoint
ALTER TABLE "returns" ALTER COLUMN "type" SET DATA TYPE "public"."return_type" USING "type"::"public"."return_type";--> statement-breakpoint
ALTER TABLE "returns" ADD COLUMN "status" "return_status" DEFAULT 'requested' NOT NULL;--> statement-breakpoint
ALTER TABLE "returns" ADD COLUMN "quantity" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "returns" ADD COLUMN "refundAmount" double precision;--> statement-breakpoint
ALTER TABLE "returns" ADD COLUMN "adminNote" text;--> statement-breakpoint
ALTER TABLE "returns" ADD COLUMN "orderItemId" text NOT NULL;--> statement-breakpoint
ALTER TABLE "returns" ADD CONSTRAINT "returns_orderItemId_order_items_id_fk" FOREIGN KEY ("orderItemId") REFERENCES "public"."order_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "returns" DROP COLUMN "approved";--> statement-breakpoint
ALTER TABLE "returns" DROP COLUMN "notApprovedReason";--> statement-breakpoint
ALTER TABLE "returns" DROP COLUMN "finalApproved";--> statement-breakpoint
ALTER TABLE "returns" DROP COLUMN "finalNotApprovedReason";