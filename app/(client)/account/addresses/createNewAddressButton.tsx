"use client";

import {createNewAddress} from "@/actions/formSubmissions";
import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {LoaderCircle, PlusCircle} from "lucide-react";
import React, {useState} from "react";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {AddressFormSchema} from "@/lib/zodSchemas";
import {toast} from "sonner";

const states = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jammu and Kashmir",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
];

export default function CreateNewAddressButton() {
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);

    const createForm = useForm<z.infer<typeof AddressFormSchema>>({
        resolver: zodResolver(AddressFormSchema),
        defaultValues: {
            address1: "",
            address2: "",
            city: "",
            state: "",
            zipcode: "",
            landmark: "",
            phone: "",
            email: "",
            firstName: "",
            lastName: "",
        },
    });

    async function handleCreateAddress(
        values: z.infer<typeof AddressFormSchema>
    ) {
        setCreateLoading(true);
        const getTTD = await fetch("/api/pincode?pincode=" + values.zipcode);
        const data = await getTTD.json();

        if (!data.success) {
            toast.error("This pincode is not Serviceable");
            setCreateLoading(false);
            return;
        }

        await createNewAddress(values);
        setCreateLoading(false);
        setCreateModalOpen(false);
    }

    return (
        <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
            <DialogTrigger asChild>
                <Button className="mt-6 gap-2">
                    <PlusCircle className="w-4 h-4"/>
                    Add address
                </Button>
            </DialogTrigger>
            <DialogContent className="flex flex-col p-0 gap-0 sm:max-h-[min(640px,80vh)] sm:max-w-lg">
                <DialogHeader className="border-b p-5">
                    <DialogTitle>Create new Address</DialogTitle>
                </DialogHeader>
                <div className="overflow-y-auto px-5 py-4">
                    <Form {...createForm}>
                        <form
                            id="createAddressForm"
                            className="flex flex-col space-y-4"
                            onSubmit={createForm.handleSubmit(handleCreateAddress)}
                        >
                            <FormField
                                control={createForm.control}
                                name="firstName"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="First Name" type="text" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={createForm.control}
                                name="lastName"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Last Name" type="text" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={createForm.control}
                                name="email"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Email" type="text" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={createForm.control}
                                name="phone"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Phone</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Phone" type="tel" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={createForm.control}
                                name="address1"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Address line 1</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Address line 1"
                                                type="text"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={createForm.control}
                                name="address2"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Address line 2</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Address line 2"
                                                type="text"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={createForm.control}
                                name="city"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>City</FormLabel>
                                        <FormControl>
                                            <Input placeholder="City" type="text" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={createForm.control}
                                name="state"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>State</FormLabel>
                                        <FormControl>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a state"/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {states.map((state, i) => (
                                                        <SelectItem value={state} key={i}>
                                                            {state}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={createForm.control}
                                name="zipcode"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Zipcode</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Zipcode" type="text"/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={createForm.control}
                                name="landmark"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Landmark</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Landmark" type="text"/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                </div>
                <DialogFooter className="p-5 border-t flex flex-row gap-x-3">
                    <DialogClose asChild>
                        <Button className="w-full" variant="outline">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        form="createAddressForm"
                        className="w-full"
                        type="submit"
                        disabled={createLoading}
                    >
                        {createLoading ? <LoaderCircle className="w-4 h-4 animate-spin"/> : "Create"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
