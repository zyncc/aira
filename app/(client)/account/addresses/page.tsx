import prisma from "@/lib/prisma";
import React from "react";
import CreateNewAddressButton from "./createNewAddressButton";
import {getServerSession} from "@/lib/getServerSession";
import {MapPin} from "lucide-react";
import EditAddressButton from "@/app/(client)/account/addresses/editAddressButton";

export default async function Page() {
    const session = await getServerSession();
    const addresses = await prisma.address.findMany({
        where: {
            userId: session?.user.id,
        },
        orderBy: {createdAt: "desc"}
    });

    return (
        <div className="container py-8 space-y-8 mt-[30px]">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Addresses</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage your shipping addresses
                    </p>
                </div>
                <CreateNewAddressButton/>
            </div>
            <div className="gap-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {addresses.map((address) => (
                    <div
                        key={address.id}
                        className="flex flex-1 items-start gap-4 p-4 rounded-lg border transition-colors"
                    >
                        <div
                            className="h-10 w-10 rounded-full bg-primary/10 items-center justify-center flex-shrink-0 hidden sm:flex">
                            <MapPin className="w-5 h-5 text-primary"/>
                        </div>
                        <div className="">
                            <div className="mt-1 text-sm text-muted-foreground">
                                <p className="line-clamp-1">{address.firstName}</p>
                                <p className="line-clamp-1">{address.address1}</p>
                                <p className="line-clamp-1">{address.address2}</p>
                                <p className="line-clamp-1">
                                    {address.landmark}, {address.state} {address.zipcode}
                                </p>
                            </div>
                        </div>
                        <div className="flex-1"></div>
                        <div className="flex gap-3">
                            <EditAddressButton address={address}/>
                        </div>
                    </div>
                ))}
            </div>
            {addresses.length === 0 && (
                <div className="text-center w-full py-12">
                    <MapPin className="w-12 h-12 mx-auto text-muted"/>
                    <h3 className="mt-4 text-lg font-medium">No addresses found</h3>
                    <p className="mt-1 text-sm text-muted">
                        Add your first shipping address to get started
                    </p>
                    <CreateNewAddressButton/>
                </div>
            )}
        </div>
    );
}
