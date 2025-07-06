"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import React from "react";
import { Button } from "@/components/ui/button";
import { type address } from "@prisma/client";

export default function AddressSheet({ address }: { address: address }) {
  const isMobile = useIsMobile();
  return (
    <div className="flex justify-center">
      {isMobile ? (
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline">View Address</Button>
          </DrawerTrigger>
          <DrawerContent className="p-5">
            <DrawerHeader>
              <DrawerTitle>{address.firstName}'s Address</DrawerTitle>
            </DrawerHeader>
            <div className="mt-6 bg-muted/40 p-4 rounded-xl shadow-sm space-y-2 text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">
                  Address Line 1:
                </span>{" "}
                {address.address1}
              </p>
              {address.address2 && (
                <p>
                  <span className="font-medium text-foreground">
                    Address Line 2:
                  </span>{" "}
                  {address.address2}
                </p>
              )}
              <p>
                <span className="font-medium text-foreground">City:</span>{" "}
                {address.city}
              </p>
              <p>
                <span className="font-medium text-foreground">State:</span>{" "}
                {address.state}
              </p>
              <p>
                <span className="font-medium text-foreground">Zipcode:</span>{" "}
                {address.zipcode}
              </p>
              {address.landmark && (
                <p>
                  <span className="font-medium text-foreground">Landmark:</span>{" "}
                  {address.landmark}
                </p>
              )}
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">View Address</Button>
          </SheetTrigger>
          <SheetContent className="w-[90vw] max-w-md">
            <SheetHeader>
              <SheetTitle className="text-xl font-semibold text-primary">
                {address.firstName}'s Address
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6 bg-muted/40 p-4 rounded-xl shadow-sm space-y-2 text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">
                  Address Line 1:
                </span>{" "}
                {address.address1}
              </p>
              {address.address2 && (
                <p>
                  <span className="font-medium text-foreground">
                    Address Line 2:
                  </span>{" "}
                  {address.address2}
                </p>
              )}
              <p>
                <span className="font-medium text-foreground">City:</span>{" "}
                {address.city}
              </p>
              <p>
                <span className="font-medium text-foreground">State:</span>{" "}
                {address.state}
              </p>
              <p>
                <span className="font-medium text-foreground">Zipcode:</span>{" "}
                {address.zipcode}
              </p>
              {address.landmark && (
                <p>
                  <span className="font-medium text-foreground">Landmark:</span>{" "}
                  {address.landmark}
                </p>
              )}
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}
