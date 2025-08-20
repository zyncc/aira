"use client";

import { Session } from "@/auth/server";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import { Textarea } from "@/components/ui/textarea";
import { uploadReview } from "@/functions/user/add-review";
import { useFileUpload } from "@/hooks/useFileUpload";
import { ReviewFormSchema } from "@/lib/zod-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon, ImageIcon, Loader2, UploadIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export default function AddReviewModal({
  id,
  category,
}: {
  id: string;
  session: Session | null;
  category: string;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof ReviewFormSchema>>({
    resolver: zodResolver(ReviewFormSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof ReviewFormSchema>) {
    setIsSubmitting(true);
    const ImageData = new FormData();
    files.map((image) => {
      ImageData.append("images", image.file as File);
    });
    const { message, success } = await uploadReview(values, id, category, ImageData);
    if (!success) {
      toast.error(message);
    }
    setIsSubmitting(false);
    setOpen(false);
  }

  const maxSizeMB = 2;
  const maxSize = maxSizeMB * 1024 * 1024;
  const maxFiles = 3;

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
    },
  ] = useFileUpload({
    accept: "image/png,image/jpeg,image/jpg",
    maxSize,
    multiple: true,
    maxFiles,
  });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="secondary" size={"sm"} className="font-medium">
          Write a review
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="overflow-hidden">
        <AlertDialogHeader>
          <AlertDialogTitle className="from-primary to-primary/60 bg-gradient-to-r bg-clip-text text-2xl font-bold text-transparent">
            Share Your Experience
          </AlertDialogTitle>
        </AlertDialogHeader>
        <Form {...form}>
          <form
            id="reviewDetailsForm"
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-6"
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
                      className="focus:ring-primary/20 transition-all duration-200 focus:ring-2"
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
                      className="focus:ring-primary/20 min-h-[120px] resize-none transition-all duration-200 focus:ring-2"
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
          <div className="flex flex-col gap-2">
            {/* Drop area */}
            <div
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              data-dragging={isDragging || undefined}
              data-files={files.length > 0 || undefined}
              className="border-input data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors not-data-[files]:justify-center has-[input:focus]:ring-[3px]"
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
                      Uploaded Files ({files.length})
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={openFileDialog}
                      disabled={files.length >= maxFiles}
                    >
                      <UploadIcon
                        className="-ms-0.5 size-3.5 opacity-60"
                        aria-hidden="true"
                      />
                      Add more
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                    {files.map((file) => (
                      <div
                        key={file.id}
                        className="bg-accent relative aspect-square rounded-md"
                      >
                        <img
                          src={file.preview}
                          alt={file.file.name}
                          className="size-full rounded-[inherit] object-cover object-top"
                        />
                        <Button
                          onClick={() => removeFile(file.id)}
                          size="icon"
                          className="border-background focus-visible:border-background absolute -top-2 -right-2 size-6 rounded-full border-2 shadow-none"
                          aria-label="Remove image"
                        >
                          <XIcon className="size-3.5" />
                        </Button>
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
                  <p className="mb-1.5 text-sm font-medium">Drop your images here</p>
                  <p className="text-muted-foreground text-xs">
                    PNG, JPG or JPEG (max. {maxSizeMB}MB)
                  </p>
                  <Button variant="outline" className="mt-4" onClick={openFileDialog}>
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
        <div className="flex w-full gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isSubmitting}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            form="reviewDetailsForm"
            type="submit"
            className="flex-1"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
