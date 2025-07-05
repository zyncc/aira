"use client";

import {Card, CardContent} from "@/components/ui/card";
import {ReviewWithUser} from "@/lib/types";
import {Loader2} from "lucide-react";
import Image from "next/image";
import {useInView} from "react-intersection-observer";
import {useEffect} from "react";
import {useInfiniteQuery} from "@tanstack/react-query";
import timeAgo from "@/lib/timeAgo";

type ReviewsResponse = {
    review: ReviewWithUser[];
    nextPage?: number;
};

export default function InfiniteReviews({
                                            review,
                                        }: {
    review: ReviewWithUser[];
}) {
    const {ref, inView} = useInView();
    const {data, fetchNextPage, hasNextPage} = useInfiniteQuery({
        queryKey: ["infiniteReviews"],
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        queryFn: async ({pageParam = 1}) => {
            const res = await fetch(
                `/api/infiniteQuery/allReviews?page=${pageParam}&productId=${review[0].productId}`
            );
            return (await res.json()) as ReviewsResponse;
        },
        initialPageParam: 1,
        initialData: {
            pages: [
                {
                    review,
                    nextPage: 2,
                },
            ],
            pageParams: [1],
        },
        getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    });

    useEffect(() => {
        if (inView) {
            fetchNextPage();
        }
    }, [inView, fetchNextPage]);
    return (
        <div className="space-y-6 mt-5">
            {data.pages.map((page) =>
                page.review.map((review) => (
                    <Card key={review.id} className="bg-background overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="relative h-12 w-12 rounded-full overflow-hidden">
                                    <Image
                                        src={review.user.image ?? "/user.png"}
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
                                    <p className="text-sm text-foreground">
                                        {timeAgo(review.createdAt)}
                                    </p>
                                </div>
                            </div>
                            <h4 className="text-lg font-medium mb-2">{review.title}</h4>
                            <p className="text-foreground mb-4">{review.description}</p>
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
                                                sizes="25vw"
                                                className="object-cover transition-transform duration-300 group-hover:scale-110"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))
            )}
            {hasNextPage && (
                <div
                    ref={ref}
                    className={"w-full flex items-center pt-10 justify-center"}
                >
                    <Loader2 className={"animate-spin"} size={35}/>
                </div>
            )}
        </div>
    );
}
