"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/useMobile";
import { Address } from "@/lib/types";

export default function AddressSheet({ address }: { address: Address }) {
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
              <DrawerTitle>{address.firstName}&apos;s Address</DrawerTitle>
            </DrawerHeader>
            <div className="bg-muted/40 text-muted-foreground mt-6 space-y-2 rounded-xl p-4 shadow-sm">
              <p>
                <span className="text-foreground font-medium">Address Line 1:</span>{" "}
                {address.address1}
              </p>
              {address.address2 && (
                <p>
                  <span className="text-foreground font-medium">Address Line 2:</span>{" "}
                  {address.address2}
                </p>
              )}
              <p>
                <span className="text-foreground font-medium">City:</span> {address.city}
              </p>
              <p>
                <span className="text-foreground font-medium">State:</span>{" "}
                {address.state}
              </p>
              <p>
                <span className="text-foreground font-medium">Zipcode:</span>{" "}
                {address.zipcode}
              </p>
              {address.landmark && (
                <p>
                  <span className="text-foreground font-medium">Landmark:</span>{" "}
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
              <SheetTitle className="text-primary text-xl font-semibold">
                {address.firstName}&apos;s Address
              </SheetTitle>
            </SheetHeader>
            <div className="bg-muted/40 text-muted-foreground mt-6 space-y-2 rounded-xl p-4 shadow-sm">
              <p>
                <span className="text-foreground font-medium">Address Line 1:</span>{" "}
                {address.address1}
              </p>
              {address.address2 && (
                <p>
                  <span className="text-foreground font-medium">Address Line 2:</span>{" "}
                  {address.address2}
                </p>
              )}
              <p>
                <span className="text-foreground font-medium">City:</span> {address.city}
              </p>
              <p>
                <span className="text-foreground font-medium">State:</span>{" "}
                {address.state}
              </p>
              <p>
                <span className="text-foreground font-medium">Zipcode:</span>{" "}
                {address.zipcode}
              </p>
              {address.landmark && (
                <p>
                  <span className="text-foreground font-medium">Landmark:</span>{" "}
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
