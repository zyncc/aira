"use client";

import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { pincodeSchema } from "@/lib/zod-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import parse from "html-react-parser";
import { CircleX, Truck } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaCottonBureau } from "react-icons/fa6";
import z from "zod";

type DeliveryState = { type: "success"; date: Date } | { type: "error" } | null;

export default function RightBottom({ description }: { description: string }) {
  const [delivery, setDelivery] = useState<DeliveryState>(null);
  const [pincodeLoading, setPincodeLoading] = useState(false);

  const form = useForm<z.infer<typeof pincodeSchema>>({
    resolver: zodResolver(pincodeSchema),
    defaultValues: {
      pincode: "",
    },
  });

  async function onSubmit(values: z.infer<typeof pincodeSchema>) {
    setPincodeLoading(true);
    const getTTD = await fetch("/api/pincode?pincode=" + values.pincode);
    const data = await getTTD.json();

    if (!data.success) {
      setPincodeLoading(false);
      setDelivery({ type: "error" });
      return;
    }

    const currentDate = new Date();
    const estimatedDeliveryDate = new Date();
    estimatedDeliveryDate.setDate(currentDate.getDate() + data.ttd);

    setDelivery({ type: "success", date: estimatedDeliveryDate });
    setPincodeLoading(false);
  }
  return (
    <>
      <div className="mt-6 space-y-4">
        <div className="flex justify-center gap-3 py-2 md:flex-col">
          <div className="text-muted-foreground flex items-center gap-3">
            <Truck className="hidden h-4 w-4 md:block" />
            <span className="text-sm">Free Shipping</span>
          </div>
          <div className="max-md:border-primary/40 text-muted-foreground flex items-center gap-3 max-md:border-l max-md:pl-3">
            <FaCottonBureau className="hidden h-4 w-4 md:block" />
            <span className="text-sm">100% Cotton Linen</span>
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-end gap-x-2">
            <FormField
              control={form.control}
              name="pincode"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Check Expected Delivery Date</FormLabel>
                  <div className="flex items-center gap-x-2">
                    <FormControl>
                      <Input
                        type="number"
                        className="w-full md:max-w-fit"
                        placeholder="Pincode"
                        {...field}
                      />
                    </FormControl>
                    <Button disabled={pincodeLoading} type="submit">
                      {pincodeLoading ? "Checking..." : "Check"}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        {delivery?.type === "success" && (
          <Alert className="bg-secondary">
            <Truck size={18} />
            <AlertTitle>
              Expected to be delivered by{" "}
              {delivery.date.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
              })}
            </AlertTitle>
          </Alert>
        )}
        {delivery?.type === "error" && (
          <Alert variant="destructive" className="border-destructive">
            <CircleX size={18} />
            <AlertTitle>This pincode is not serviceable</AlertTitle>
          </Alert>
        )}
      </div>
      <Tabs defaultValue="description" className="mt-4 w-full">
        <TabsList className="bg-secondary grid h-auto w-full grid-cols-2 rounded-lg p-1">
          <TabsTrigger
            value="description"
            className="data-[state=active]:bg-primary w-full rounded-md py-3 data-[state=active]:text-white data-[state=active]:shadow-sm"
          >
            Description
          </TabsTrigger>
          <TabsTrigger
            value="care"
            className="data-[state=active]:bg-primary rounded-md py-3 data-[state=active]:text-white data-[state=active]:shadow-sm"
          >
            Care
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value="description"
          className="bg-secondary prose-ul:list-disc prose-ul:ml-4 prose-ul:mt-3 text-foreground marker:text-foreground space-y-4 rounded-lg p-4"
        >
          {parse(description)}
        </TabsContent>
        <TabsContent
          value="care"
          className="bg-secondary prose-ul:list-disc prose-ul:ml-4 prose-ul:mt-3 text-foreground marker:text-foreground space-y-4 rounded-lg p-2"
        >
          <ul className="space-y-3">
            <li>Cold water wash</li>
            <li>Use mild detergent</li>
            <li>
              Pure/Natural fabric is prone to wrinkling - high heat ironing gives the best
              finish.
            </li>
          </ul>
        </TabsContent>
      </Tabs>
    </>
  );
}
