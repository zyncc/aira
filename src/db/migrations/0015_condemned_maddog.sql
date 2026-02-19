CREATE TABLE "return_items" (
	"id" text PRIMARY KEY NOT NULL,
	"quantity" integer NOT NULL,
	"refundAmount" double precision,
	"images" text[] NOT NULL,
	"returnId" text NOT NULL,
	"orderItemId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "returns" DROP CONSTRAINT "returns_orderItemId_order_items_id_fk";
--> statement-breakpoint
ALTER TABLE "returns" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "returns" ALTER COLUMN "status" SET DEFAULT 'requested'::text;--> statement-breakpoint
DROP TYPE "public"."return_status";--> statement-breakpoint
CREATE TYPE "public"."return_status" AS ENUM('requested', 'approved', 'rejected', 'finalApproved', 'finalRejected');--> statement-breakpoint
ALTER TABLE "returns" ALTER COLUMN "status" SET DEFAULT 'requested'::"public"."return_status";--> statement-breakpoint
ALTER TABLE "returns" ALTER COLUMN "status" SET DATA TYPE "public"."return_status" USING "status"::"public"."return_status";--> statement-breakpoint
ALTER TABLE "return_items" ADD CONSTRAINT "return_items_returnId_returns_id_fk" FOREIGN KEY ("returnId") REFERENCES "public"."returns"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "return_items" ADD CONSTRAINT "return_items_orderItemId_order_items_id_fk" FOREIGN KEY ("orderItemId") REFERENCES "public"."order_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "returns" DROP COLUMN "type";--> statement-breakpoint
ALTER TABLE "returns" DROP COLUMN "quantity";--> statement-breakpoint
ALTER TABLE "returns" DROP COLUMN "refundAmount";--> statement-breakpoint
ALTER TABLE "returns" DROP COLUMN "images";--> statement-breakpoint
ALTER TABLE "returns" DROP COLUMN "orderItemId";--> statement-breakpoint
ALTER TABLE "returns" ADD CONSTRAINT "returns_orderId_unique" UNIQUE("orderId");