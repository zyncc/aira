"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  AlertCircleIcon,
  Copy,
  FileArchiveIcon,
  FileIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  HeadphonesIcon,
  ImageIcon,
  Trash2Icon,
  UploadIcon,
  VideoIcon,
  XIcon,
} from "lucide-react";
import { formatBytes, useFileUpload } from "@/hooks/use-file-upload";
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
import { useState } from "react";
import { toast } from "sonner";
import { createProduct } from "@/actions/formSubmissions";

const getFileIcon = (file: { file: File | { type: string; name: string } }) => {
  const fileType = file.file instanceof File ? file.file.type : file.file.type;
  const fileName = file.file instanceof File ? file.file.name : file.file.name;

  const iconMap = {
    pdf: {
      icon: FileTextIcon,
      conditions: (type: string, name: string) =>
        type.includes("pdf") ||
        name.endsWith(".pdf") ||
        type.includes("word") ||
        name.endsWith(".doc") ||
        name.endsWith(".docx"),
    },
    archive: {
      icon: FileArchiveIcon,
      conditions: (type: string, name: string) =>
        type.includes("zip") ||
        type.includes("archive") ||
        name.endsWith(".zip") ||
        name.endsWith(".rar"),
    },
    excel: {
      icon: FileSpreadsheetIcon,
      conditions: (type: string, name: string) =>
        type.includes("excel") ||
        name.endsWith(".xls") ||
        name.endsWith(".xlsx"),
    },
    video: {
      icon: VideoIcon,
      conditions: (type: string) => type.includes("video/"),
    },
    audio: {
      icon: HeadphonesIcon,
      conditions: (type: string) => type.includes("audio/"),
    },
    image: {
      icon: ImageIcon,
      conditions: (type: string) => type.startsWith("image/"),
    },
  };

  for (const { icon: Icon, conditions } of Object.values(iconMap)) {
    if (conditions(fileType, fileName)) {
      return <Icon className="size-5 opacity-60" />;
    }
  }

  return <FileIcon className="size-5 opacity-60" />;
};

const getFilePreview = (file: {
  file: File | { type: string; name: string; url?: string };
}) => {
  const fileType = file.file instanceof File ? file.file.type : file.file.type;
  const fileName = file.file instanceof File ? file.file.name : file.file.name;

  const renderImage = (src: string) => (
    <img
      src={src}
      alt={fileName}
      className="size-full rounded-t-[inherit] object-cover object-top"
    />
  );

  return (
    <div className="bg-accent flex aspect-square items-center justify-center overflow-hidden rounded-t-[inherit]">
      {fileType.startsWith("image/") ? (
        file.file instanceof File ? (
          (() => {
            const previewUrl = URL.createObjectURL(file.file);
            return renderImage(previewUrl);
          })()
        ) : file.file.url ? (
          renderImage(file.file.url)
        ) : (
          <ImageIcon className="size-5 opacity-60" />
        )
      ) : (
        getFileIcon(file)
      )}
    </div>
  );
};

export default function CreateProductForm() {
  const [submitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof CreateProductFormSchema>>({
    resolver: zodResolver(CreateProductFormSchema),
    defaultValues: {
      title: "",
      description: "",
      productDetails: "",
      modelSize: "",
      vibeCheck: "",
      price: 0,
      category: undefined,
      isArchived: false,
      isFeatured: true,
      smallQuantity: 0,
      mediumQuantity: 0,
      largeQuantity: 0,
      xlQuantity: 0,
      doubleXlQuantity: 0,
      color: "",
      length: 0,
      breadth: 0,
      height: 0,
      weight: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof CreateProductFormSchema>) {
    if (files.length === 0) {
      toast.error("No images provided");
      return;
    }
    setIsSubmitting(true);
    const formData = new FormData();
    files.forEach((file) => {
      formData.append(`images`, file.file as File);
    });
    toast.promise(createProduct(values, formData), {
      loading: "Creating Product...",
      success: () => {
        clearFiles();
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

  const maxSizeMB = 2;
  const maxSize = maxSizeMB * 1024 * 1024;
  const maxFiles = 10;

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      clearFiles,
      getInputProps,
    },
  ] = useFileUpload({
    multiple: true,
    accept: "image/png,image/jpeg,image/jpg",
    maxFiles,
    maxSize,
  });

  return (
    <div className="flex gap-5 lg:gap-10 flex-col lg:flex-row">
      <div className="flex-1">
        <div className="flex flex-col gap-2 h-full">
          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            data-dragging={isDragging || undefined}
            data-files={files.length > 0 || undefined}
            className={`border-input data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex h-full flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors not-data-[files]:justify-center has-[input:focus]:ring-[3px] ${files.length > 0 ? "justify-start" : "justify-center"}`}
          >
            <input
              {...getInputProps()}
              className="sr-only"
              aria-label="Upload image file"
            />
            {files.length > 0 ? (
              <div className="flex w-full flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="truncate text-sm font-medium">
                    Files ({files.length})
                  </h3>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={openFileDialog}
                    >
                      <UploadIcon
                        className="-ms-0.5 size-3.5 opacity-60"
                        aria-hidden="true"
                      />
                      Add files
                    </Button>
                    <Button variant="outline" size="sm" onClick={clearFiles}>
                      <Trash2Icon
                        className="-ms-0.5 size-3.5 opacity-60"
                        aria-hidden="true"
                      />
                      Remove all
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="bg-background relative flex flex-col rounded-md border"
                    >
                      {getFilePreview(file)}
                      <Button
                        onClick={() => removeFile(file.id)}
                        size="icon"
                        className="border-background focus-visible:border-background absolute -top-2 -right-2 size-6 rounded-full border-2 shadow-none"
                        aria-label="Remove image"
                      >
                        <XIcon className="size-3.5" />
                      </Button>
                      <div className="flex min-w-0 flex-col gap-0.5 border-t p-3">
                        <p className="truncate text-[13px] font-medium">
                          {file.file.name}
                        </p>
                        <p className="text-muted-foreground truncate text-xs">
                          {formatBytes(file.file.size)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
                <div
                  className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
                  aria-hidden="true"
                >
                  <ImageIcon className="size-4 opacity-60" />
                </div>
                <p className="mb-1.5 text-sm font-medium">
                  Drop your files here
                </p>
                <p className="text-muted-foreground text-xs">
                  Max {maxFiles} files ∙ Up to {maxSizeMB}MB
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={openFileDialog}
                >
                  <UploadIcon className="-ms-1 opacity-60" aria-hidden="true" />
                  Select images
                </Button>
              </div>
            )}
          </div>

          {errors.length > 0 && (
            <div
              className="text-destructive flex items-center gap-1 text-xs"
              role="alert"
            >
              <AlertCircleIcon className="size-3 shrink-0" />
              <span>{errors[0]}</span>
            </div>
          )}
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
                      className="max-h-[400px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="productDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Product Details{" "}
                    <Button
                      variant="ghost"
                      size="icon"
                      type="button"
                      onClick={() => navigator.clipboard.writeText("<li></li>")}
                    >
                      <Copy className="size-3" />
                    </Button>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter product details"
                      className="max-h-[400px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="modelSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model Size</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter model size" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vibeCheck"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vibe Check</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter vibe check" {...field} />
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
              <FormField
                control={form.control}
                name="doubleXlQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>2XL Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="2XL"
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
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="length"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Length (cm)</FormLabel>
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
                    <FormLabel>Breadth (cm)</FormLabel>
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
                    <FormLabel>Height (cm)</FormLabel>
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
                    <FormLabel>Weight (g)</FormLabel>
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
