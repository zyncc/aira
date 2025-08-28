ALTER TABLE "orders" DROP CONSTRAINT "orders_addressId_address_id_fk";
--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "addressId";