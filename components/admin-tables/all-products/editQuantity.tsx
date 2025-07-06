"use client";

import {quantity} from "@prisma/client";
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,} from "@/components/ui/sheet";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {Button} from "@/components/ui/button";
import {updateQuantity} from "@/actions/updateQuantity";
import {useState} from "react";

export const quantitySchema = z.object({
    sm: z.number().min(0),
    md: z.number().min(0),
    lg: z.number().min(0),
    xl: z.number().min(0),
    doublexl: z.number().min(0),
});

export default function EditQuantity({quantity}: { quantity: quantity }) {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const form = useForm<z.infer<typeof quantitySchema>>({
        resolver: zodResolver(quantitySchema),
        defaultValues: {
            sm: quantity.sm,
            md: quantity.md,
            lg: quantity.lg,
            xl: quantity.xl,
            doublexl: quantity.doublexl,
        },
    });

    async function onSubmit(values: z.infer<typeof quantitySchema>) {
        setLoading(true);
        await updateQuantity(values, quantity.id);
        setLoading(false);
        setOpen(false);
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="outline">Edit Quantity</Button>
            </SheetTrigger>
            <SheetContent className="px-5">
                <SheetHeader>
                    <SheetTitle>Edit Quantity</SheetTitle>
                </SheetHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-5"
                    >
                        <FormField
                            control={form.control}
                            name="sm"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Small</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Small Quantity"
                                            {...field}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="md"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Medium</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Medium Quantity"
                                            {...field}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lg"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Large</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Large Quantity"
                                            {...field}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="xl"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Extra Large</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Extra Large Quantity"
                                            {...field}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="doublexl"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Double XL</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Double XL Quantity"
                                            {...field}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <Button disabled={loading} className="w-full" type="submit">
                            {loading ? "Updating..." : "Edit"}
                        </Button>
                    </form>
                </Form>
            </SheetContent>
        </Sheet>
    );
}
