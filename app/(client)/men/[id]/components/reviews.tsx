import Image from "next/image";
import prisma from "@/lib/prisma";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import getSession from "@/lib/getSession";

export default async function Reviews({id}: { id: string }) {
    const session = await getSession();
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

    return (
        <div className="container mt-[100px]">
            <h1 className="text-2xl font-semibold">Reviews</h1>
            <div>
                {session?.user &&
                    checkIfUserHasOrdered !== null &&
                    checkIfUserHasReviewed == null && (
                        <Link href={`/reviews/add/${id}`}>
                            <Button variant="secondary" className="mt-4">
                                Write a review
                            </Button>
                        </Link>
                    )}
                {review.map((review) => (
                    <div
                        className="mt-5 rounded-lg p-4 bg- max-w-[768px] bg-gray-50"
                        key={review.userId}
                    >
                        <div className="flex gap-2 items-center justify-start">
                            <Image
                                src={review.user.image || ""}
                                width={30}
                                height={30}
                                alt="Profile Picture"
                                className="rounded-full"
                                priority
                            />
                            <h1 className="font-semibold">{review.user.name}</h1>
                        </div>
                        <h1 className="font-medium mt-3">{review.title}</h1>
                        <p className="mt-3 text-[15px] line-clamp-[7] md:line-clamp-4 lg:line-clamp-3">
                            {review.description}
                        </p>
                        <div className="flex gap-3 mt-5 flex-wrap">
                            {review.images &&
                                review.images.map((image) => (
                                    <Image
                                        key={image}
                                        src={image}
                                        width={80}
                                        height={80}
                                        alt="review image"
                                        priority
                                        className="rounded-md aspect-square object-cover"
                                    />
                                ))}
                        </div>
                    </div>
                ))}
            </div>
            {review.length == 0 ? (
                <h1 className="mt-5 font-medium">This product has no reviews</h1>
            ) : (
                <Link href={"/reviews/all/" + id}>
                    <Button variant={"link"} className="mt-5 text-black">
                        See all reviews
                    </Button>
                </Link>
            )}
        </div>
    );
}
