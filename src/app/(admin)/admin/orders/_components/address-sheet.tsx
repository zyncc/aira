"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/useMobile";
import { Address } from "@/lib/types";
import Link from "next/link";

export default function AddressSheet({
  address,
}: {
  address: Omit<Address, "userId" | "id" | "createdAt" | "updatedAt">;
}) {
  const isMobile = useIsMobile();
  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="link" size={"sm"}>
          Address
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{address.firstName}&apos;s Address</DrawerTitle>
        </DrawerHeader>
        <div className="flex flex-col gap-3 p-4">
          <p>
            <span className="text-foreground font-medium">Email:</span> {address.email}
          </p>
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
            <span className="text-foreground font-medium">State:</span> {address.state}
          </p>
          <p>
            <span className="text-foreground font-medium">Zipcode:</span>{" "}
            {address.zipcode}
          </p>
          <p>
            Phone:{" "}
            <Link
              href={`tel:${address.phone}`}
              className="text-foreground hover:text-destructive font-medium hover:underline"
            >
              {address.phone}
            </Link>
          </p>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
