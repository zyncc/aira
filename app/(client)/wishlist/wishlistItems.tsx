"use client";

import {wishlistItemsType} from "@/components/cards/productCard";
import {toast} from "@/components/ui/use-toast";
import formatCurrency from "@/lib/formatCurrency";
import Image from "next/image";
import Link from "next/link";
import React, {useEffect, useState} from "react";
import {IoCartOutline} from "react-icons/io5";

export default function WishlistItems() {
    const [wishlistItems, setWishlistItems] = useState<wishlistItemsType>();
    useEffect(() => {
        const wishlistitems = localStorage.getItem("wishlist");
        if (wishlistitems) {
            setWishlistItems(JSON.parse(wishlistitems));
        }
    }, []);

    function addtocart() {
        toast({
            variant: "destructive",
            title: "Select a size before you can add to cart",
        });
    }

    return (
        <div className="mt-[50px]">
            {wishlistItems?.length == 0 && (
                <div className="h-full w-full flex items-center justify-center">
                    No items in wishlist :{"("}
                </div>
            )}
            {wishlistItems?.map(({id, image, title, price, category}) => (
                <div key={id} className="flex gap-4 mb-4 w-fit">
                    <Link href={`${category}/${id}`}>
                        <Image
                            src={image}
                            width={100}
                            height={100}
                            className="object-cover aspect-square rounded-md"
                            priority
                            alt="Wishlist-Item-Image"
                        />
                    </Link>
                    <div className="flex flex-col justify-between">
                        <div>
                            <Link href={`${category}/${id}`}>
                                <h1>{title}</h1>
                            </Link>
                            <p>{formatCurrency(price).split(".")[0]}</p>
                        </div>
                        <Link href={`${category}/${id}`}>
                            <IoCartOutline size={30} onClick={addtocart}/>
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    );
}
