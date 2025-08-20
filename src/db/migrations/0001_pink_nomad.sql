ALTER TABLE "order" DROP CONSTRAINT "order_addressId_address_id_fk";
--> statement-breakpoint
ALTER TABLE "order" DROP CONSTRAINT "order_trackingId_tracking_id_fk";
--> statement-breakpoint
ALTER TABLE "activity" ALTER COLUMN "createdAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "activity" ALTER COLUMN "updatedAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "address" ALTER COLUMN "createdAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "address" ALTER COLUMN "updatedAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "cart" ALTER COLUMN "createdAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "cart" ALTER COLUMN "updatedAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "cartItems" ALTER COLUMN "quantity" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "cartItems" ALTER COLUMN "createdAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "cartItems" ALTER COLUMN "updatedAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "wishlist" ALTER COLUMN "createdAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "wishlist" ALTER COLUMN "updatedAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "wishlistItems" ALTER COLUMN "createdAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "wishlistItems" ALTER COLUMN "updatedAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "role" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "phoneNumberVerified" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "verification" ALTER COLUMN "createdAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "verification" ALTER COLUMN "updatedAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "order" ALTER COLUMN "paymentSuccess" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "order" ALTER COLUMN "createdAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "order" ALTER COLUMN "updatedAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "tracking" ALTER COLUMN "createdAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "tracking" ALTER COLUMN "updatedAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "product" ALTER COLUMN "placeholderImages" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "product" ALTER COLUMN "isArchived" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "product" ALTER COLUMN "isFeatured" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "product" ALTER COLUMN "createdAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "product" ALTER COLUMN "updatedAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "quantity" ALTER COLUMN "sm" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "quantity" ALTER COLUMN "md" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "quantity" ALTER COLUMN "lg" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "quantity" ALTER COLUMN "xl" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "quantity" ALTER COLUMN "doublexl" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "quantity" ALTER COLUMN "createdAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "quantity" ALTER COLUMN "updatedAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "reviews" ALTER COLUMN "createdAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "reviews" ALTER COLUMN "updatedAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "order" ADD CONSTRAINT "order_addressId_address_id_fk" FOREIGN KEY ("addressId") REFERENCES "public"."address"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order" ADD CONSTRAINT "order_trackingId_tracking_id_fk" FOREIGN KEY ("trackingId") REFERENCES "public"."tracking"("id") ON DELETE cascade ON UPDATE no action;