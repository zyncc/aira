"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { DeleteAddress, updateUserAddress } from "@/functions/user/address";
import { states } from "@/lib/constants";
import { Address } from "@/lib/types";
import { AddressFormSchema } from "@/lib/zod-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { EllipsisVertical, LoaderCircle, Pencil, Trash2, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export default function EditAddressButton({ address }: { address: Address }) {
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const updateForm = useForm<z.infer<typeof AddressFormSchema>>({
    resolver: zodResolver(AddressFormSchema),
  });

  async function handleUpdateAddress(values: z.infer<typeof AddressFormSchema>) {
    setUpdateLoading(true);
    const res = await updateUserAddress(values);
    if (!res.success) {
      toast.error("Failed to update Address", {
        description: res.message,
      });
    }
    setUpdateLoading(false);
    setUpdateModalOpen(false);
  }

  async function handleDeleteAddress() {
    setDeleteLoading(true);

    const res = await DeleteAddress(address.id);

    if (!res.success) {
      toast.error("Failed to delete Address", {
        description: res.message,
      });
    }

    setDeleteLoading(false);
    setDeleteModalOpen(false);
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant={"ghost"} size={"icon"}>
              <EllipsisVertical className={"size-4"} />
            </Button>
          }
        />
        <DropdownMenuContent side={"right"}>
          <DropdownMenuItem
            onClick={() => {
              setUpdateModalOpen(true);
            }}
            className={"w-full"}
          >
            <Pencil />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            className={"w-full"}
            onClick={() => {
              setDeleteModalOpen(true);
            }}
          >
            <Trash2 />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Sheet open={updateModalOpen} onOpenChange={setUpdateModalOpen}>
        <SheetContent className="flex flex-col gap-0 overflow-y-auto max-sm:data-[side=right]:w-[100%]">
          <SheetHeader className="border-b px-5 py-4">
            <SheetTitle>Edit Address</SheetTitle>
          </SheetHeader>
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
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <input type="text" hidden {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={updateForm.control}
                  defaultValue={address.firstName}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        First Name
                        <span className="text-destructive align-super">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="First Name" type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={updateForm.control}
                  defaultValue={address.lastName ?? ""}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Last Name" type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={updateForm.control}
                  defaultValue={address.email}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Email
                        <span className="text-destructive align-super">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Email" type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={updateForm.control}
                  defaultValue={address.phone}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Phone
                        <span className="text-destructive align-super">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Phone" type="tel" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={updateForm.control}
                  name="address1"
                  defaultValue={address.address1}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Address line 1
                        <span className="text-destructive align-super">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Address line 1" type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={updateForm.control}
                  defaultValue={address.address2 ?? ""}
                  name="address2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address line 2</FormLabel>
                      <FormControl>
                        <Input placeholder="Address line 2" type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={updateForm.control}
                  defaultValue={address.city}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        City
                        <span className="text-destructive align-super">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="City" type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={updateForm.control}
                  defaultValue={address.state}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        State
                        <span className="text-destructive align-super">*</span>
                      </FormLabel>
                      <FormControl>
                        <Select {...field}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a state" />
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={updateForm.control}
                  defaultValue={address.zipcode}
                  name="zipcode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Zipcode
                        <span className="text-destructive align-super">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Zipcode" type="text" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
          <SheetFooter className="flex flex-row gap-x-3 border-t px-5 py-4">
            <SheetClose
              render={
                <Button
                  disabled={updateLoading}
                  variant="outline"
                  className="w-full flex-1 text-left font-medium"
                >
                  Cancel
                </Button>
              }
            />
            <Button
              form="editAddressForm"
              type="submit"
              className="w-full flex-1"
              disabled={updateLoading}
            >
              {updateLoading && <LoaderCircle className="animate-spin" />}
              Update
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      <AlertDialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
              <Trash2Icon />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete Address</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this address?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleteLoading}
              variant="destructive"
              onClick={handleDeleteAddress}
            >
              {deleteLoading && <Spinner />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
