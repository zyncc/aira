import SidebarInsetWrapper from "@/components/sidebar/sidebar-inset-wrapper";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { db } from "@/db/instance";
import { CircleX } from "lucide-react";
import { ReviewCard } from "./_components/review-card";

export default async function ReviewsPage() {
  // await sleep(3);
  const reviews = await db.query.reviews.findMany({
    with: {
      product: {
        columns: {
          title: true,
        },
      },
      user: {
        columns: {
          name: true,
          image: true,
        },
      },
    },
    orderBy: (review, o) => o.desc(review.createdAt),
  });
  return (
    <SidebarInsetWrapper title="Reviews">
      {reviews.length == 0 ? (
        <div>
          <EmptyState />
        </div>
      ) : (
        <div className="space-y-5 p-6">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              productName={review.product.title}
              userName={review.user.name}
              userAvatar={review.user.image}
            />
          ))}
        </div>
      )}
    </SidebarInsetWrapper>
  );
}

function EmptyState() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <CircleX className={"text-primary"} />
        </EmptyMedia>
        <EmptyTitle>No Reviews</EmptyTitle>
        <EmptyDescription>No Reviews have been posted</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
