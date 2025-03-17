"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { categories, CreateProductFormSchema } from "@/lib/zodSchemas";
import { Checkbox } from "./ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import Dropzone, { FileRejection } from "react-dropzone";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { IoCloudUploadOutline } from "react-icons/io5";
import { X } from "lucide-react";
import { createProduct } from "@/actions/formSubmissions";

export default function CreateProductForm() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [submitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof CreateProductFormSchema>>({
    resolver: zodResolver(CreateProductFormSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      category: undefined,
      isArchived: false,
      isFeatured: true,
      smallQuantity: 0,
      mediumQuantity: 0,
      largeQuantity: 0,
      xlQuantity: 0,
      color: "",
      fabric: "",
      transparency: "",
      weavePattern: "",
      fit: "",
      length: 0,
      breadth: 0,
      height: 0,
      weight: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof CreateProductFormSchema>) {
    if (images.length === 0) {
      toast.error("No images provided");
      return;
    }
    setIsSubmitting(true);
    const formData = new FormData();
    images.forEach((image) => {
      formData.append(`images`, image);
    });
    const createProductPromise = createProduct(values, formData);
    toast.promise(createProductPromise, {
      loading: "Creating Product...",
      success: () => {
        setImages([]);
        setIsSubmitting(false);
        form.reset();
        return `${values.title} has been added`;
      },
      error: (err) => {
        console.error("Error creating product:", err);
        setIsSubmitting(false);
        return "Error creating product";
      },
    });
  }

  function acceptFiles(acceptedFiles: File[]) {
    const sortedArray = acceptedFiles.sort((a, b) => {
      const numA = parseInt(a.name.match(/\d+/)?.[0] || "0", 10);
      const numB = parseInt(b.name.match(/\d+/)?.[0] || "0", 10);

      return numA - numB;
    });
    setIsDragOver(false);
    setImages(sortedArray);
  }

  function rejectFiles(rejectedFiles: FileRejection[]) {
    setIsDragOver(false);
    if (rejectedFiles[0].errors[0].code == "file-too-large") {
      toast.error("File too large", {
        description: "Please select a file smaller than 2MB",
      });
    } else if (rejectedFiles[0].errors[0].code == "file-invalid-type") {
      toast.error("Invalid file type", {
        description: "Please select a PNG, JPG or JPEG",
      });
    }
  }

  const removeImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  return (
    <div className="flex gap-5 lg:gap-10 flex-col lg:flex-row">
      <div className="flex-1">
        {images?.length == 0 && (
          <Dropzone
            onDropAccepted={acceptFiles}
            onDropRejected={rejectFiles}
            onDragEnter={() => setIsDragOver(true)}
            onDragLeave={() => setIsDragOver(false)}
            accept={{
              "image/png": [".png"],
              "image/jpeg": [".jpeg"],
              "image/jpg": [".jpg"],
            }}
            maxSize={2097152}
          >
            {({ getRootProps, getInputProps }) => (
              <div
                {...getRootProps()}
                className={`flex h-[500px] bg-background border-2 border-muted w-full min-w-[320px] items-center rounded-lg p-4 justify-center cursor-pointer ${
                  isDragOver && "border-dashed"
                }`}
              >
                <input {...getInputProps()} name="images" />
                {!isDragOver ? (
                  <div className="flex flex-col items-center justify-center gap-2">
                    <IoCloudUploadOutline size={27} />
                    <h1 className="font-medium text-sm">
                      Click to upload or{" "}
                      <span className="font-bold">Drag and Drop</span>
                    </h1>
                    <div className="text-center">
                      <p className="text-foreground text-xs">PNG JPG JPEG</p>
                      <p className="text-foreground text-xs">
                        Max 2MB per Image
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col bg-background items-center justify-center gap-2">
                    <IoCloudUploadOutline size={27} />
                    <h1 className="font-medium text-sm">
                      <span className="font-bold">Release to drop</span>
                    </h1>
                    <div className="text-center">
                      <p className="text-foreground text-xs">PNG JPG JPEG</p>
                      <p className="text-foreground text-xs">
                        Max 2MB per Image
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Dropzone>
        )}
        <div className="grid grid-cols-3 gap-4 mt-4">
          {images.map((file, index) => {
            const imageUrl = URL.createObjectURL(file);
            return (
              <div key={index} className="flex flex-wrap relative">
                <Image
                  src={imageUrl}
                  alt={file.name}
                  width={100}
                  height={100}
                  priority
                  className="aspect-square object-cover rounded-lg flex-1"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 text-white rounded-full flex items-center justify-center bg-black/80 p-1"
                >
                  <X color="white" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <div className="w-full flex-1">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <div className="*:not-first:mt-2">
                        <div className="relative flex rounded-md shadow-xs">
                          <span className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm">
                            ₹
                          </span>
                          <Input
                            className="-me-px rounded-e-none ps-6 shadow-none"
                            placeholder="0.00"
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                          <span className="border-input bg-background text-muted-foreground z-10 inline-flex items-center rounded-e-md border px-3 text-sm">
                            INR
                          </span>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter product description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isArchived"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      className="rounded-[6px]"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="space-y-0">Archived</FormLabel>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      className="rounded-[6px]"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>Featured</FormLabel>
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="smallQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Small Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Small"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mediumQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medium Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Medium"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="largeQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Large Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Large"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="xlQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>XL Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="XL"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter color" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fabric"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fabric</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter fabric" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="transparency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transparency</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter transparency" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="weavePattern"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weave Pattern</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter weave pattern" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fit</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter fit" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="length"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Length</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Enter length"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="breadth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Breadth</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Enter breadth"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Height</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Enter height"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Enter weight"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button disabled={submitting} type="submit" className="w-full">
              Create Product
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
