ALTER TABLE "tracking" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "tracking" CASCADE;--> statement-breakpoint
-- ALTER TABLE "order" DROP CONSTRAINT "order_trackingId_tracking_id_fk";
--> statement-breakpoint
-- ALTER TABLE "order" DROP COLUMN "trackingId";