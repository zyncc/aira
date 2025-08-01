import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {Skeleton} from "@/components/ui/skeleton";

const Loading = () => {
    return (
        <section className="max-[768px]:pt-[0px] md:mt-[30px] pb-[50px]">
            <Breadcrumb className="container hidden md:block">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator/>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="flex md:mt-10 flex-wrap md:flex-nowrap gap-8 md:container m-0">
                <div className="md:basis-1/2 w-screen ">
                    <div className="flex flex-col">
                        <Skeleton className="w-[100%] h-full aspect-[2/3] rounded-none md:rounded-md"/>
                        <div className="flex gap-2 mt-2 overflow-hidden px-1 md:p-0">
                            <Skeleton className="w-[70px] h-[70px] flex-shrink-0"/>
                            <Skeleton className="w-[70px] h-[70px] flex-shrink-0"/>
                            <Skeleton className="w-[70px] h-[70px] flex-shrink-0"/>
                            <Skeleton className="w-[70px] h-[70px] flex-shrink-0"/>
                            <Skeleton className="w-[70px] h-[70px] flex-shrink-0"/>
                        </div>
                    </div>
                </div>
                <div className="md:basis-1/2 flex flex-col gap-4 w-screen container">
                    <Skeleton className="w-[100%] h-[27px]"/>
                    <Skeleton className="w-[70%] h-[22px]"/>
                    <Skeleton className="w-[20%] h-[30px]"/>
                    <div className="flex gap-3 flex-wrap">
                        <Skeleton className="w-[45px] h-[45px] rounded-full aspect-square"/>
                        <Skeleton className="w-[45px] h-[45px] rounded-full aspect-square"/>
                        <Skeleton className="w-[845x] h-[45px] rounded-full aspect-square"/>
                        <Skeleton className="w-[845x] h-[45px] rounded-full aspect-square"/>
                        <Skeleton className="w-[845x] h-[45px] rounded-full aspect-square"/>
                    </div>
                    <div className="flex gap-4 w-full flex-wrap flex-col md:flex-row">
                        <Skeleton className="w-[100%] h-[44px] rounded-sm"/>
                        <Skeleton className="w-[100%] h-[44px] rounded-sm"/>
                    </div>
                    <div className="flex flex-col gap-3 mt-2">
                        <Skeleton className="w-[70%] h-[32px]"/>
                        <Skeleton className="w-[80%] h-[32px]"/>
                        <Skeleton className="w-[70%] h-[32px]"/>
                        <Skeleton className="w-[60%] h-[32px]"/>
                        <Skeleton className="w-[30%] h-[30px] mt-5"/>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Loading;
