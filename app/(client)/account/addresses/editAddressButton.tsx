"use client";

import {updateUserAddress} from "@/actions/formSubmissions";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {Input} from "@/components/ui/input";
import {address} from "@prisma/client";
import React, {useState} from "react";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {AddressFormSchema} from "@/lib/zodSchemas";
import {EllipsisVertical, LoaderCircle, Pencil} from "lucide-react";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";

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

export default function EditAddressButton({address}: { address: address }) {
    const [updateLoading, setUpdateLoading] = useState(false);
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const updateForm = useForm<z.infer<typeof AddressFormSchema>>({
        resolver: zodResolver(AddressFormSchema),
    });

    async function handleUpdateAddress(
        values: z.infer<typeof AddressFormSchema>
    ) {
        setUpdateLoading(true);
        await updateUserAddress(values);
        setUpdateLoading(false);
        setUpdateModalOpen(false);
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant={'ghost'} size={'icon'}>
                        <EllipsisVertical className={'size-4'}/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side={'right'}>
                    <AlertDialog open={updateModalOpen} onOpenChange={setUpdateModalOpen}>
                        <AlertDialogTrigger className={'w-full'}>
                            <DropdownMenuItem className={'w-full'} onSelect={(e) => e.preventDefault()}>
                                <Pencil/>
                                Edit
                            </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent
                            className="flex flex-col p-0 gap-0 overflow-y-hidden sm:max-h-[min(640px,80vh)] sm:max-w-lg">
                            <AlertDialogHeader className="px-5 py-4 border-b">
                                <AlertDialogTitle>Edit Address</AlertDialogTitle>
                            </AlertDialogHeader>
                            <div className="overflow-y-auto px-5 pb-4">
                                <Form {...updateForm}>
                                    <form
                                        id="editAddressForm"
                                        className="flex flex-col space-y-4"
                                        onSubmit={updateForm.handleSubmit(handleUpdateAddress)}
                                    >
                                        <FormField
                                            control={updateForm.control}
                                            defaultValue={address.id}
                                            name="id"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <input type="text" hidden {...field} />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={updateForm.control}
                                            defaultValue={address.firstName}
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
                                            control={updateForm.control}
                                            defaultValue={address.lastName}
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
                                            control={updateForm.control}
                                            defaultValue={address.email}
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
                                            control={updateForm.control}
                                            defaultValue={address.phone}
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
                                            control={updateForm.control}
                                            name="address1"
                                            defaultValue={address.address1}
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
                                            control={updateForm.control}
                                            defaultValue={address.address2}
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
                                            control={updateForm.control}
                                            defaultValue={address.city}
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
                                            control={updateForm.control}
                                            defaultValue={address.state}
                                            name="state"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>State</FormLabel>
                                                    <FormControl>
                                                        <Select required {...field}>
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
                                            control={updateForm.control}
                                            defaultValue={address.zipcode}
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
                                            control={updateForm.control}
                                            defaultValue={address.landmark}
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
                            <AlertDialogFooter className="py-4 px-5 border-t flex flex-row gap-x-3">
                                <AlertDialogCancel asChild>
                                    <Button variant="outline" className="font-mediuml w-full text-left">
                                        Cancel
                                    </Button>
                                </AlertDialogCancel>
                                <Button
                                    form="editAddressForm"
                                    type="submit"
                                    className="w-full"
                                    disabled={updateLoading}
                                >
                                    {updateLoading && <LoaderCircle className="animate-spin"/>}
                                    Update
                                </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </DropdownMenuContent>
            </DropdownMenu>

        </>
    );
}
