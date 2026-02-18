CREATE TYPE "public"."size_enum" AS ENUM('sm', 'md', 'lg', 'xl', 'doublexl');--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" text PRIMARY KEY NOT NULL,
	"size" "size_enum" NOT NULL,
	"quantity" integer NOT NULL,
	"itemPrice" double precision NOT NULL,
	"orderId" text NOT NULL,
	"productId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "orders" RENAME COLUMN "rzpOrderId" TO "orderId";--> statement-breakpoint
ALTER TABLE "orders" RENAME COLUMN "price" TO "totalPrice";--> statement-breakpoint
ALTER TABLE "orders" RENAME COLUMN "shipmentCost" TO "shippingPrice";--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "paymentSuccess" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "isCod" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "isCodApproved" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "discountPrice" double precision;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "usedStoreCredit" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_orderId_orders_id_fk" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_productId_product_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "size";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "quantity";