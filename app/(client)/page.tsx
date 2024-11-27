import Footer from "@/components/footer/footer";
import formatCurrency from "@/lib/formatCurrency";
import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
    const featuredProducts = await prisma.product.findMany({
        where: {
            isFeatured: true,
            isArchived: false,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return (
        <>
            <div>
                <Link href={"men"}>
                    <div>
                        <Image
                            src={
                                "https://res.cloudinary.com/dfdusmp26/image/upload/v1715926698/Banners/s1xugtcvadefnsgyn2c7.png"
                            }
                            //https://res.cloudinary.com/dfdusmp26/image/upload/v1715926697/Banners/q6n7njubkmwn73johhqs.jpg
                            width={2000}
                            height={500}
                            className="object-cover overflow-x-hidden"
                            alt="banner"
                            priority
                        />
                    </div>
                </Link>
                <div className="container mt-10 mb-10">
                    <div className="flex gap-4 overflow-auto mt-4">
                        {featuredProducts.length > 0 && (
                            <div className="container">
                                <h1 className="text-2xl font-semibold">Featured Products</h1>
                                <div className="similar gap-2 mt-6 overflow-x-auto flex">
                                    {featuredProducts.map((featuredProducts) => (
                                        <div
                                            className="w-[400px] flex-shrink-0 pb-1"
                                            key={featuredProducts.id}
                                        >
                                            <Link
                                                href={`/${featuredProducts.category}/${featuredProducts.id}`}
                                            >
                                                <Image
                                                    key={featuredProducts.id}
                                                    src={featuredProducts.images[0]}
                                                    height={400}
                                                    width={400}
                                                    alt="similar products"
                                                    className="cursor-pointer object-cover aspect-square"
                                                />
                                            </Link>
                                            <Link
                                                href={`/${featuredProducts.category}/${featuredProducts.id}`}
                                            >
                                                <h1 className="mt-1">{featuredProducts.title}</h1>
                                            </Link>
                                            <h2>
                                                {formatCurrency(featuredProducts.price).split(".")[0]}
                                            </h2>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="container flex flex-col md:flex-row my-10">
                    <div className="flex justify-center relative">
                        <Image
                            src={"/Untitled-design-1-3.jpg"}
                            height={500}
                            width={1000}
                            alt="image"
                            priority
                        />
                        <h1 className="text-2xl font-semibold absolute text-center bottom-5 text-white">
                            New
                        </h1>
                    </div>
                    <div className="flex justify-center relative">
                        <Image
                            src={"/1-1.jpg"}
                            height={500}
                            width={1000}
                            alt="image"
                            priority
                        />
                        <h1 className="text-2xl font-semibold absolute text-center bottom-5 text-white">
                            Best Sellers
                        </h1>
                    </div>
                </div>
            </div>
            <Footer/>
        </>
    );
}
