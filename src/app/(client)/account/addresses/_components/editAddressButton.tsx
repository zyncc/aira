"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
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
import { DeleteAddress, updateUserAddress } from "@/functions/user/address";
import { states } from "@/lib/constants";
import { Address } from "@/lib/types";
import { AddressFormSchema } from "@/lib/zod-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CircleAlertIcon,
  EllipsisVertical,
  LoaderCircle,
  Pencil,
  Trash2,
} from "lucide-react";
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
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"} size={"icon"}>
            <EllipsisVertical className={"size-4"} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side={"right"}>
          <AlertDialog open={updateModalOpen} onOpenChange={setUpdateModalOpen}>
            <AlertDialogTrigger className={"w-full"}>
              <DropdownMenuItem className={"w-full"} onSelect={(e) => e.preventDefault()}>
                <Pencil />
                Edit
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent className="flex flex-col gap-0 overflow-y-hidden p-0 sm:max-h-[min(640px,80vh)] sm:max-w-lg">
              <AlertDialogHeader className="border-b px-5 py-4">
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
                          <FormLabel>First Name</FormLabel>
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
                          <FormLabel>Last Name (Optional)</FormLabel>
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
                          <FormLabel>Email</FormLabel>
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
                          <FormLabel>Phone</FormLabel>
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
                          <FormLabel>Address line 1</FormLabel>
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
                          <FormLabel>Address line 2 (Optional)</FormLabel>
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
                          <FormLabel>City</FormLabel>
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
                          <FormLabel>State</FormLabel>
                          <FormControl>
                            <Select autoComplete="state" {...field}>
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
                          <FormLabel>Zipcode</FormLabel>
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
              <AlertDialogFooter className="flex flex-row gap-x-3 border-t px-5 py-4">
                <AlertDialogCancel asChild>
                  <Button
                    disabled={updateLoading}
                    variant="outline"
                    className="w-full flex-1 text-left font-medium"
                  >
                    Cancel
                  </Button>
                </AlertDialogCancel>
                <Button
                  form="editAddressForm"
                  type="submit"
                  className="w-full flex-1"
                  disabled={updateLoading}
                >
                  {updateLoading && <LoaderCircle className="animate-spin" />}
                  Update
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <AlertDialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
            <AlertDialogTrigger className="w-full">
              <DropdownMenuItem
                variant="destructive"
                className={"w-full"}
                onSelect={(e) => {
                  e.preventDefault();
                }}
              >
                <Trash2 />
                Delete
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <div className="flex flex-col items-center gap-2">
                <div
                  className="flex size-9 shrink-0 items-center justify-center rounded-full border"
                  aria-hidden="true"
                >
                  <CircleAlertIcon className="opacity-80" size={16} />
                </div>
                <AlertDialogHeader>
                  <AlertDialogTitle className="sm:text-center">
                    Are you sure?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="sm:text-center">
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel asChild>
                  <Button
                    disabled={deleteLoading}
                    type="button"
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </AlertDialogCancel>
                <Button
                  onClick={handleDeleteAddress}
                  type="button"
                  variant={"destructive"}
                  className="flex-1"
                >
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
