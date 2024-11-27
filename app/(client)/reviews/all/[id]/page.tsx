import prisma from "@/lib/prisma";
import Image from "next/image";
import React from "react";

type Params = {
    params: {
        id: string;
    };
};

export default async function Page({params: {id}}: Params) {
    const reviews = await prisma.reviews.findMany({
        where: {
            productId: id,
        },
        orderBy: {
            createdAt: "desc",
        },
        include: {
            user: true,
        },
    });
    const product = await prisma.product.findUnique({
        where: {
            id,
        },
    });
    return (
        <section className="container mt-[40px] mb-[100px] flex flex-wrap gap-10">
            <div className="flex-1 flex flex-col gap-4 min-w-[320px] max-w-full">
                <h1 className="text-3xl font-semibold">All Reviews</h1>
                <Image
                    src={product?.images[0] || ""}
                    height={400}
                    width={400}
                    alt="Product Image"
                    className="object-cover aspect-square rounded-lg"
                />
                <h1 className="font-medium text-xl">{product?.title}</h1>
                <p>{product?.description}</p>
            </div>
            {reviews.length == 0 ? (
                <div className="flex-1">
                    <h1 className="font-medium text-xl">This product has no reviews</h1>
                </div>
            ) : (
                <div className="flex-1">
                    {reviews.map((review) => (
                        <div
                            className="mt-5 rounded-lg p-4 min-w-[320px] max-w-full bg-gray-50"
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
                            <p className="mt-3 text-[15px]">{review.description}</p>
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
            )}
        </section>
    );
}
