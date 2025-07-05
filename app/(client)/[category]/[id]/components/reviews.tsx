import prisma from "@/lib/prisma";
import AddReviewModal from "./AddReviewModal";
import {Card, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {ChevronRight} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {Session} from "@/auth";

export default async function Reviews({
                                          id,
                                          category,
                                          session
                                      }: {
    id: string;
    category: string;
    session: Session | null
}) {
    // await new Promise<void>(
    //   (resolve) =>
    //     setTimeout(() => {
    //       resolve();
    //     }, 300000) // Simulates a 3-second delay
    // );
    const review = await prisma.reviews.findMany({
        where: {
            productId: id,
        },
        include: {
            user: {
                select: {
                    id: true,
                    image: true,
                    name: true,
                },
            },
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

    if (review.length === 0 && !checkIfUserHasOrdered) {
        return null;
    }

    return (
        <section className="pt-10 bg-background">
            <div className="container sm:px-6">
                <div className="flex flex-col md:flex-row justify-between items-start mb-6">
                    {checkIfUserHasOrdered &&
                        !checkIfUserHasReviewed &&
                        session?.session && (
                            <div className="mt-4 md:mt-0">
                                <h2 className="text-2xl font-bold text-primary tracking-tight">
                                    Customer Reviews
                                </h2>
                                <div className="py-4 mt-4 border border-border/50 rounded-lg px-4">
                                    <div>
                                        <h3 className="text-lg font-medium mb-2">No reviews yet</h3>
                                        <p className="text-primary font-medium text-sm mb-4">
                                            Be the first to share your thoughts about this product and
                                            help other customers make informed decisions.
                                        </p>
                                        <AddReviewModal
                                            id={id}
                                            category={category}
                                            session={session!}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                </div>

                {review.length > 0 ? (
                    <>
                        <h2 className="text-2xl font-bold tracking-tight">
                            Customer Reviews
                        </h2>
                        <div className="grid gap-4 mt-4">
                            {review.map((review) => (
                                <Card
                                    key={review.id}
                                    className="bg-background md:w-1/2 w-full border border-border/50 hover:border-border transition-all duration-300 overflow-hidden shadow-sm"
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div
                                                className="relative h-10 w-10 rounded-full overflow-hidden border border-border/50">
                                                <Image
                                                    src={review.user.image ?? "/user.png"}
                                                    alt={review.user.name || "User"}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-base font-semibold truncate">
                                                    {review.user.name}
                                                </h3>
                                                <p className="text-xs text-primary">
                                                    {new Date(review.createdAt).toLocaleDateString(
                                                        "en-US",
                                                        {
                                                            year: "numeric",
                                                            month: "short",
                                                            day: "numeric",
                                                        }
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <h4 className="text-base font-medium">{review.title}</h4>
                                            <p className="text-sm text-foreground/80 line-clamp-3">
                                                {review.description}
                                            </p>
                                        </div>

                                        {review.images && review.images.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                {review.images.map((image: string, i: number) => (
                                                    <div
                                                        key={i}
                                                        className="relative max-w-[200px] min-w-[150px] aspect-square rounded-md overflow-hidden group border border-border/50"
                                                    >
                                                        <Dialog>
                                                            <DialogTrigger>
                                                                <Image
                                                                    src={image || "/placeholder.svg"}
                                                                    alt={`Review image ${i + 1}`}
                                                                    fill
                                                                    sizes="(max-width: 768px) 33vw, 20vw"
                                                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                                                />
                                                            </DialogTrigger>
                                                            <DialogContent>
                                                                <DialogHeader>
                                                                    <DialogTitle className="line-clamp-1">
                                                                        {review.title}
                                                                    </DialogTitle>
                                                                    <DialogDescription
                                                                        className="line-clamp-1 text-primary">
                                                                        {review.description}
                                                                    </DialogDescription>
                                                                </DialogHeader>
                                                                <div className="flex gap-x-4 overflow-x-auto pb-5">
                                                                    {review.images.map(
                                                                        (image: string, i: number) => (
                                                                            <Image
                                                                                key={i}
                                                                                src={image || "/placeholder.svg"}
                                                                                alt={`Review image ${i + 1}`}
                                                                                width={500}
                                                                                height={500}
                                                                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                                                            />
                                                                        )
                                                                    )}
                                                                </div>
                                                            </DialogContent>
                                                        </Dialog>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {review.length === 3 && (
                            <div className="mt-4">
                                <Button variant="outline" asChild className="group">
                                    <Link
                                        href={`/reviews/all/${id}`}
                                        className="flex items-center gap-2"
                                    >
                                        View all reviews
                                        <ChevronRight
                                            className="w-4 h-4 transition-transform group-hover:translate-x-1"/>
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </>
                ) : (
                    <></>
                )}
            </div>
        </section>
    );
}
