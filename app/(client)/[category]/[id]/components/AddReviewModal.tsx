"use client";

import { Session } from "@/auth";
import Image from "next/image";
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
import { useState } from "react";
import { Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { IoCloudUploadOutline } from "react-icons/io5";
import Dropzone, { FileRejection } from "react-dropzone";
import { uploadReview } from "@/actions/formSubmissions";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface FilePreview {
  url: string;
  file: File;
}

export default function AddReviewModal({
  id,
  session,
  category,
}: {
  id: string;
  session: Session;
  category: string;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previews, setPreviews] = useState<FilePreview[]>([]);
  const [open, setOpen] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [images, setImages] = useState<File[] | null>(null);

  const removePreview = (index: number) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  function acceptFiles(acceptedFiles: File[]) {
    setImages(acceptedFiles);
    const newPreviews: FilePreview[] = [];
    Array.from(acceptedFiles)
      .slice(0, 3)
      .forEach((file) => {
        newPreviews.push({
          url: URL.createObjectURL(file),
          file,
        });
      });
    setPreviews([...previews, ...newPreviews].slice(0, 3));
    setIsDragOver(false);
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
    } else if (rejectedFiles[0].errors[0].code == "too-many-files") {
      toast.error("Too many files", {
        description: "Please select upto 3 files",
      });
    }
  }

  async function handleReviewSubmit(formData: FormData) {
    if (!images) {
      console.log("No images selected");
    } else {
      images.map((image) => {
        console.log("Map", image);
        formData.append("images", image);
      });
    }
    formData.append("pid", id);
    formData.append("category", category);
    formData.append("uid", session?.user.id as string);
  }

  const formSchema = z.object({
    title: z
      .string()
      .min(2, {
        message: "Title is too small",
      })
      .max(100, "Title is too long"),
    description: z
      .string()
      .min(2, {
        message: "Description is too small",
      })
      .max(500, "Description is too long"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const review = {
      ...values,
      images,
      pid: id,
      category,
      uid: session?.user.id as string,
    };
    console.log(review);
    setIsSubmitting(true);
    const formData = new FormData();
    review.images?.map((image) => {
      formData.append("images", image);
    });
    formData.append("title", review.title);
    formData.append("description", review.description);
    formData.append("pid", id);
    formData.append("category", category);
    formData.append("uid", session?.user.id as string);
    await uploadReview(formData);
    setImages(null);
    setPreviews([]);
    setIsSubmitting(false);
    setOpen(false);
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="secondary" className="mt-4">
          Write a review
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-md:h-screen">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Share Your Experience
          </AlertDialogTitle>
        </AlertDialogHeader>
        <Form {...form}>
          <form
            id="reviewDetailsForm"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 mt-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="title"
                      name="title"
                      placeholder="Sum up your experience"
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      name="description"
                      id="review"
                      placeholder="Tell us what you loved (or didn't)"
                      className="min-h-[120px] resize-none transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <label htmlFor="images" className="text-sm font-medium">
              Add Photos
            </label>
            <span className="text-xs text-gray-500">(Optional)</span>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              {previews.map((preview, index) => (
                <div key={index} className="relative group aspect-square">
                  <Image
                    src={preview.url}
                    alt={`Preview ${index + 1}`}
                    fill
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removePreview(index)}
                    className="absolute top-2 right-2 p-1 bg-black/50 rounded-full opacity-100  transition-opacity"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              ))}
            </div>
            {previews.length < 3 && (
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
                maxFiles={3}
                maxSize={2097152}
              >
                {({ getRootProps, getInputProps }) => (
                  <div
                    {...getRootProps()}
                    className={`flex bg-background border border-dashed border-muted-foreground w-full min-w-[320px] items-center rounded-lg p-8 justify-center cursor-pointer ${
                      isDragOver && "border-dashed border-blue-950"
                    }`}
                  >
                    <input {...getInputProps()} />
                    {!isDragOver ? (
                      <div className="flex flex-col items-center justify-center gap-2">
                        <IoCloudUploadOutline size={27} />
                        <h1 className="font-medium text-sm">
                          Click to upload or{" "}
                          <span className="font-bold">Drag and Drop</span>
                        </h1>
                        <div className="text-center">
                          <p className="text-foreground text-xs">
                            PNG JPG JPEG
                          </p>
                          <p className="text-foreground text-xs">
                            Upto 3 Images, Max 2MB per Image
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
                          <p className="text-foreground text-xs">
                            PNG JPG JPEG
                          </p>
                          <p className="text-foreground text-xs">
                            Upto 3 images, Max 2MB per Image
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Dropzone>
            )}
          </div>
        </div>
        <div className="flex w-full gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isSubmitting}
            className="w-full"
          >
            Cancel
          </Button>
          <Button
            form="reviewDetailsForm"
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Adding...
              </>
            ) : (
              "Add Review"
            )}
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
