"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
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
import { Textarea } from "@/components/ui/textarea";
import { CreateReturn } from "@/functions/returns/return-request";
import { useFileUpload } from "@/hooks/useFileUpload";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircleIcon,
  ImageIcon,
  Loader2,
  Trash2Icon,
  UploadIcon,
  XIcon,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

interface Props {
  title: "Exchange" | "Return";
  children: React.ReactNode;
  orderId: string;
}

const ExchangeDescription =
  "Product tags must be intact and dress must be in original condition. We will exchange the product only if it passes our inspection.";
const ReturnDescription =
  "Product tags must be intact and dress must be in original condition. We will accept the return only if it passes our inspection. The money will be added to your Store Wallet, we do not refund the money to orignal payment method";

export const ReturnReasonSchema = z.object({
  reason: z
    .string()
    .min(100, "Please enter atleast 100 Characters")
    .max(500, "Maximum 500 Characters allowed")
    .trim(),
});

export default function ReturnDialog({ title, orderId, children }: Props) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof ReturnReasonSchema>>({
    resolver: zodResolver(ReturnReasonSchema),
    defaultValues: {
      reason: "",
    },
  });

  const getFilePreview = (file: {
    file: File | { type: string; name: string; url?: string };
  }) => {
    const fileType = file.file instanceof File ? file.file.type : file.file.type;
    const fileName = file.file instanceof File ? file.file.name : file.file.name;

    const renderImage = (src: string) => (
      <img
        src={src}
        alt={fileName}
        className="size-full rounded-md rounded-t-[inherit] object-cover object-top"
      />
    );

    return (
      <div className="bg-accent flex aspect-square items-center justify-center overflow-hidden rounded-md rounded-t-[inherit]">
        {fileType.startsWith("image/") &&
          (file.file instanceof File ? (
            (() => {
              const previewUrl = URL.createObjectURL(file.file);
              return renderImage(previewUrl);
            })()
          ) : file.file.url ? (
            renderImage(file.file.url)
          ) : (
            <ImageIcon className="size-5 opacity-60" />
          ))}
      </div>
    );
  };

  async function onSubmit(values: z.infer<typeof ReturnReasonSchema>) {
    setLoading(true);
    if (files.length !== 5) {
      toast.error("Minimum 5 images are required.");
      return;
    }
    const fileData = new FormData();
    files.forEach((file) => {
      fileData.append("files", file.file as File);
    });

    const { message, success } = await CreateReturn(
      values,
      fileData,
      title == "Exchange" ? "exchange" : "return",
      orderId,
    );
    if (success) {
      toast.success(message);
    } else {
      toast.error(message);
    }
    setLoading(false);
    setOpen(false);
  }

  const maxSizeMB = 2;
  const maxSize = maxSizeMB * 1024 * 1024;
  const maxFiles = 5;

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
    maxFiles,
    maxSize,
    accept: "image/png,image/jpeg,image/jpg",
  });
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title} Request</AlertDialogTitle>
        </AlertDialogHeader>
        {step == 1 && (
          <div>
            <Alert variant="destructive">
              <AlertCircleIcon />
              <AlertTitle>Please Agree to the terms and conditions</AlertTitle>
              <AlertDescription>
                <p> {title == "Exchange" ? ExchangeDescription : ReturnDescription}</p>
              </AlertDescription>
            </Alert>
          </div>
        )}
        {step == 2 && (
          <>
            <Form {...form}>
              <form
                id="return-form"
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reason for {title}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={
                            title == "Exchange"
                              ? "Mention What Size or Color You Want to Exchange it With"
                              : "Mention in detail why you want to return the Product"
                          }
                          className="max-h-[100px]"
                          {...field}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
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
                        Files ({files.length})
                      </h3>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={openFileDialog}>
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
                    <p className="mb-1.5 text-sm font-medium">Drop your files here</p>
                    <p className="text-muted-foreground text-xs">
                      Max {maxFiles} files ∙ Up to {maxSizeMB}MB
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
          </>
        )}

        <AlertDialogFooter className="flex flex-row gap-x-3">
          {step == 1 ? (
            <AlertDialogCancel type="button" className="flex-1">
              Cancel
            </AlertDialogCancel>
          ) : (
            <Button
              className="flex-1"
              type="button"
              disabled={loading}
              variant={"outline"}
              onClick={() => setStep(1)}
            >
              Back
            </Button>
          )}
          {step == 1 ? (
            <Button type="button" className="flex-1" onClick={() => setStep(2)}>
              Agree
            </Button>
          ) : (
            <Button
              disabled={loading}
              type="submit"
              className="flex-1"
              form="return-form"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Request
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
