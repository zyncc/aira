import prisma from "@/lib/prisma";
import AddReviewModal from "./AddReviewModal";
import { headers } from "next/headers";
import { auth } from "@/auth";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export default async function Reviews({ id }: { id: string }) {
  const session = await auth.api.getSession({
    headers: headers(),
  });
  const review = await prisma.reviews.findMany({
    where: {
      productId: id,
    },
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 3,
  });

  const checkIfUserHasOrdered = await prisma.order.findFirst({
    where: {
      userId: session?.user.id,
      productId: id,
      paymentSuccess: true,
    },
  });

  const checkIfUserHasReviewed = await prisma.reviews.findFirst({
    where: {
      userId: session?.user.id,
      productId: id,
    },
  });

  // await new Promise<void>(
  //   (resolve) =>
  //     setTimeout(() => {
  //       resolve();
  //     }, 300000) // Simulates a 3-second delay
  // );

  return (
    <div className="container mt-[100px]">
      <h1 className="text-2xl font-semibold">Reviews</h1>
      <AddReviewModal id={id} category={"men"} session={session!} />
      <div className="max-w-3xl space-y-6 mt-5">
        {review.map((review, index) => (
          <Card key={review.id} className="overflow-hidden bg-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-border">
                  <Image
                    src={review.user.image!}
                    alt={review.user.name!}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-lg font-semibold truncate">
                      {review.user.name}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {review.createdAt.toDateString()}
                  </p>
                </div>
              </div>

              {review.title && (
                <h4 className="text-lg font-medium mb-2">{review.title}</h4>
              )}

              {review.description && (
                <p className="text-muted-foreground mb-4">
                  {review.description}
                </p>
              )}

              {review.images && review.images.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {review.images.map((image: string, i: number) => (
                    <div
                      key={i}
                      className="relative aspect-square rounded-md overflow-hidden"
                    >
                      <Image
                        src={image}
                        alt={`Review image ${i + 1}`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
