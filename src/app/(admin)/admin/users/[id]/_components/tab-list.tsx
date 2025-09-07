"use client";

import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams } from "next/navigation";

export default function TabList() {
  const searchParams = useSearchParams();

  function handleTabChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    history.replaceState(null, "", `?${params.toString()}`);
  }

  return (
    <div className="flex w-full justify-center">
      <TabsList className="flex min-w-[300px] justify-center">
        <TabsTrigger value="addresses" onClick={() => handleTabChange("addresses")}>
          Addresses
        </TabsTrigger>
        <TabsTrigger value="orders" onClick={() => handleTabChange("orders")}>
          Orders
        </TabsTrigger>
        <TabsTrigger value="returns" onClick={() => handleTabChange("returns")}>
          Returns
        </TabsTrigger>
      </TabsList>
    </div>
  );
}
