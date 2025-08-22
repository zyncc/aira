import { Container } from "@/components/container";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { db } from "@/db/instance";
import { getServerSession } from "@/functions/auth/get-server-session";
import { convertImage } from "@/lib/convert-image";
import { and, desc, eq } from "drizzle-orm";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import AddReviewModal from "../../../../../components/add-review-modal";

type Params = {
  params: Promise<{
    category: string;
    id: string;
  }>;
};

export default async function Reviews({ params }: Params) {
  // await new Promise((resolve) => setTimeout(resolve, 3000));
  const { id, category } = await params;
  const session = await getServerSession();
  const review = await db.query.reviews.findMany({
    where: (review) => eq(review.productId, id),
    orderBy: (review) => desc(review.createdAt),
    limit: 3,
    with: {
      user: {
        columns: {
          id: true,
          image: true,
          name: true,
        },
      },
    },
  });

  const checkIfUserHasOrdered = await db.query.order.findFirst({
    where: (order) =>
      and(
        eq(order.userId, session?.user.id ?? ""),
        eq(order.productId, id),
        eq(order.paymentSuccess, true),
      ),
  });

  if (review.length === 0 && !checkIfUserHasOrdered) {
    return null;
  }

  const checkIfUserHasReviewed = await db.query.reviews.findFirst({
    where: (review) =>
      and(eq(review.userId, session?.user.id ?? ""), eq(review.productId, id)),
  });

  return (
    <Container className="my-10 px-2">
      <div>
        <div className="mb-6 flex flex-col items-start justify-between md:flex-row">
          {checkIfUserHasOrdered && !checkIfUserHasReviewed && session && (
            <div className="mt-4 md:mt-0">
              <h2 className="text-primary text-2xl font-bold tracking-tight">
                Customer Reviews
              </h2>
              <div className="border-border/50 mt-4 rounded-lg border px-4 py-4">
                <div>
                  <h3 className="mb-2 text-lg font-medium">No reviews yet</h3>
                  <p className="text-primary mb-4 text-sm font-medium">
                    Be the first to share your thoughts about this product and help other
                    customers make informed decisions.
                  </p>
                  <AddReviewModal id={id} category={category} session={session!} />
                </div>
              </div>
            </div>
          )}
        </div>

        {review.length > 0 ? (
          <>
            <h2 className="text-2xl font-bold tracking-tight">Customer Reviews</h2>
            <div className="mt-4 grid gap-4">
              {review.map((review) => (
                <div key={review.id}>
                  <div className="mb-3 flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={review.user.image!} />
                      <AvatarFallback>
                        {review.user.name.slice(0, 1).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-base font-semibold">
                        {review.user.name}
                      </h3>
                      <p className="text-primary text-xs">
                        {new Date(review.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-base font-medium">{review.title}</h4>
                    <p className="text-foreground/80 line-clamp-3 text-sm">
                      {review.description}
                    </p>
                  </div>

                  {review.images && review.images.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {review.images.map((image: string, i: number) => (
                        <div
                          key={i}
                          className="group border-border/50 relative aspect-square max-w-[200px] min-w-[150px] overflow-hidden rounded-md border"
                        >
                          <Dialog>
                            <DialogTrigger>
                              <Image
                                src={convertImage(image, 500)}
                                alt={`Review image ${i + 1}`}
                                fill
                                loading="lazy"
                                sizes="(max-width: 768px) 33vw, 20vw"
                                className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                              />
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle className="line-clamp-1">
                                  {review.title}
                                </DialogTitle>
                                <DialogDescription className="text-primary line-clamp-1">
                                  {review.description}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="flex gap-x-4 overflow-x-auto pb-5">
                                {review.images?.map((image: string, i: number) => (
                                  <Image
                                    key={i}
                                    src={image}
                                    alt={`Review image ${i + 1}`}
                                    width={500}
                                    height={500}
                                    loading="lazy"
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                  />
                                ))}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {review.length === 3 && (
              <div className="mt-4">
                <Button variant="outline" asChild className="group">
                  <Link href={`/reviews/all/${id}`} className="flex items-center gap-2">
                    View all reviews
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            )}
          </>
        ) : (
          <></>
        )}
      </div>
    </Container>
  );
}
