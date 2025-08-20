CREATE TABLE "activity" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"type" text NOT NULL,
	"userId" text NOT NULL,
	"createdAt" timestamp,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "address" (
	"id" text PRIMARY KEY NOT NULL,
	"firstName" text NOT NULL,
	"lastName" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"address1" text NOT NULL,
	"address2" text NOT NULL,
	"city" text NOT NULL,
	"state" text NOT NULL,
	"zipcode" text NOT NULL,
	"landmark" text NOT NULL,
	"userId" text NOT NULL,
	"createdAt" timestamp,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "cart" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"createdAt" timestamp,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "cartItems" (
	"id" text PRIMARY KEY NOT NULL,
	"size" text NOT NULL,
	"quantity" integer,
	"cartId" text NOT NULL,
	"productId" text NOT NULL,
	"createdAt" timestamp,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "wishlist" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"createdAt" timestamp,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "wishlistItems" (
	"id" text PRIMARY KEY NOT NULL,
	"productId" text NOT NULL,
	"wishlistId" text NOT NULL,
	"createdAt" timestamp,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"accountId" text NOT NULL,
	"providerId" text NOT NULL,
	"accessToken" text,
	"refreshToken" text,
	"idToken" text,
	"accessTokenExpiresAt" timestamp,
	"refreshTokenExpiresAt" timestamp,
	"scope" text,
	"password" text,
	"userId" text NOT NULL,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rateLimit" (
	"id" text PRIMARY KEY NOT NULL,
	"key" text,
	"count" integer,
	"lastRequest" bigint
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"token" text NOT NULL,
	"ipAddress" text,
	"userAgent" text,
	"impersonatedBy" text,
	"userId" text NOT NULL,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"emailVerified" boolean NOT NULL,
	"image" text,
	"role" text,
	"banned" boolean,
	"banReason" text,
	"banExpires" timestamp,
	"phoneNumber" text,
	"phoneNumberVerified" boolean,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_phoneNumber_unique" UNIQUE("phoneNumber")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"createdAt" timestamp,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "order" (
	"id" text PRIMARY KEY NOT NULL,
	"rzpOrderId" text NOT NULL,
	"price" integer NOT NULL,
	"size" text NOT NULL,
	"quantity" integer NOT NULL,
	"paymentId" text,
	"paymentSuccess" boolean,
	"userId" text NOT NULL,
	"productId" text NOT NULL,
	"addressId" text,
	"trackingId" text,
	"createdAt" timestamp,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "tracking" (
	"id" text PRIMARY KEY NOT NULL,
	"trackingId" text NOT NULL,
	"statusType" text NOT NULL,
	"status" text NOT NULL,
	"statusDateTime" timestamp NOT NULL,
	"statusLocation" text NOT NULL,
	"createdAt" timestamp,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "product" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"productDetails" text NOT NULL,
	"price" integer NOT NULL,
	"images" text[] NOT NULL,
	"placeholderImages" text[] NOT NULL,
	"salePrice" integer,
	"category" text NOT NULL,
	"isArchived" boolean,
	"isFeatured" boolean,
	"color" text NOT NULL,
	"length" double precision NOT NULL,
	"breadth" double precision NOT NULL,
	"height" double precision NOT NULL,
	"weight" double precision NOT NULL,
	"createdAt" timestamp,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "quantity" (
	"id" text PRIMARY KEY NOT NULL,
	"sm" integer,
	"md" integer,
	"lg" integer,
	"xl" integer,
	"doublexl" integer,
	"productId" text NOT NULL,
	"createdAt" timestamp,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"images" text[],
	"userId" text NOT NULL,
	"productId" text NOT NULL,
	"createdAt" timestamp,
	"updatedAt" timestamp
);
--> statement-breakpoint
ALTER TABLE "activity" ADD CONSTRAINT "activity_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "address" ADD CONSTRAINT "address_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart" ADD CONSTRAINT "cart_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cartItems" ADD CONSTRAINT "cartItems_cartId_cart_id_fk" FOREIGN KEY ("cartId") REFERENCES "public"."cart"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cartItems" ADD CONSTRAINT "cartItems_productId_product_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wishlist" ADD CONSTRAINT "wishlist_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wishlistItems" ADD CONSTRAINT "wishlistItems_productId_product_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wishlistItems" ADD CONSTRAINT "wishlistItems_wishlistId_wishlist_id_fk" FOREIGN KEY ("wishlistId") REFERENCES "public"."wishlist"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order" ADD CONSTRAINT "order_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order" ADD CONSTRAINT "order_productId_product_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order" ADD CONSTRAINT "order_addressId_address_id_fk" FOREIGN KEY ("addressId") REFERENCES "public"."address"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order" ADD CONSTRAINT "order_trackingId_tracking_id_fk" FOREIGN KEY ("trackingId") REFERENCES "public"."tracking"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quantity" ADD CONSTRAINT "quantity_productId_product_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_productId_product_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;