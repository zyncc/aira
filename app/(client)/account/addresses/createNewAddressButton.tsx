"use client";

import { createNewAddress } from "@/actions/formSubmissions";
import { AlertDialogHeader } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { LoaderCircle, PlusCircle } from "lucide-react";
import React, { useRef, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AddressFormSchema } from "@/lib/zodSchemas";

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
  });

  async function handleCreateAddress(
    values: z.infer<typeof AddressFormSchema>
  ) {
    setCreateLoading(true);
    await createNewAddress(values);
    setCreateLoading(false);
    setCreateModalOpen(false);
  }
  return (
    <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
      <DialogTrigger asChild>
        <Button className="mt-6 gap-2">
          <PlusCircle className="w-4 h-4" />
          Add address
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col sm:max-h-[min(640px,80vh)] sm:max-w-lg">
        <AlertDialogHeader>
          <DialogTitle>Create new Address</DialogTitle>
        </AlertDialogHeader>
        <div className="overflow-y-auto"></div>
      </DialogContent>
    </Dialog>
  );
}
