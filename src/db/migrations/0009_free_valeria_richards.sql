CREATE TABLE "orders" (
	"id" text PRIMARY KEY NOT NULL,
	"rzpOrderId" text NOT NULL,
	"price" integer NOT NULL,
	"size" text NOT NULL,
	"quantity" integer NOT NULL,
	"paymentId" text,
	"paymentSuccess" boolean NOT NULL,
	"ttd" timestamp,
	"shipmentCost" double precision,
	"waybill" text,
	"shippingLabel" text,
	"userId" text NOT NULL,
	"productId" text NOT NULL,
	"addressId" text NOT NULL,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
-- DROP TABLE "order" CASCADE;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_productId_product_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_addressId_address_id_fk" FOREIGN KEY ("addressId") REFERENCES "public"."address"("id") ON DELETE cascade ON UPDATE no action;