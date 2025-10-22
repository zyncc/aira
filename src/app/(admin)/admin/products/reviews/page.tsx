import SidebarInsetWrapper from "@/components/ui/sidebar-inset";
import { db } from "@/db/instance";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { CircleX } from "lucide-react";

const links = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Products",
    href: "/admin/products",
  },
  {
    label: "Reviews",
    href: "/admin/products/reviews",
  },
];

export default async function ReviewsPage() {
  const reviews = await db.query.reviews.findMany({
    orderBy: (review, o) => o.desc(review.createdAt),
  });
  return (
    <div className="w-full overflow-hidden">
      <SidebarInsetWrapper links={links} />
      {reviews.length == 1 ? (
        <div>
          <EmptyState />
        </div>
      ) : (
        <div className="space-y-5 px-4">
          <h1>Reviews</h1>
          {reviews.map((review) => (
            <div key={review.id}>
              <p>{review.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
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