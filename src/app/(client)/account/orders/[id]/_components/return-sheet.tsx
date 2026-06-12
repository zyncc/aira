"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldContent, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { CreateReturn } from "@/functions/returns/return-request";
import { useFileUpload } from "@/hooks/useFileUpload";
import { FullOrderType, ReturnReasonSchema } from "@/lib/types";
import { convertImage, formatSize } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircleIcon,
  ImageIcon,
  Loader2,
  Trash2Icon,
  UploadIcon,
  XIcon,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export default function ReturnSheet({ order }: { order: Omit<FullOrderType, "user"> }) {
  const [step, setStep] = useState(1);
  const [selectedItems, setSelectedItems] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof ReturnReasonSchema>>({
    resolver: zodResolver(ReturnReasonSchema),
    defaultValues: {
      reason: "",
    },
  });

  async function onSubmit(values: z.infer<typeof ReturnReasonSchema>) {
    setLoading(true);
    if (Object.keys(selectedItems).length === 0) {
      toast.error("Please select at least one item to return");
      setLoading(false);
      return;
    }

    if (files.length < 2) {
      toast.error("Minimum 2 images are required.");
      setLoading(false);
      return;
    }

    const fileData = new FormData();
    files.forEach((file) => {
      fileData.append("files", file.file as File);
    });

    const items = Object.entries(selectedItems).map(([id, quantity]) => ({
      orderItemId: id,
      quantity,
    }));

    fileData.append("items", JSON.stringify(items));

    const { message, success } = await CreateReturn(values, fileData, order.id);

    if (success) {
      toast.success(message);
      setOpen(false);
    } else {
      toast.error(message);
    }
    setLoading(false);
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

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="outline" className="flex-1 bg-transparent">
            Request Return
          </Button>
        }
      />
      <SheetContent className={"min-w-screen sm:min-w-[50vw]"}>
        <SheetHeader className="border-b">
          <SheetTitle className="text-lg">
            {step == 1 ? "Accept Terms & Conditions" : "Submit Details"}
          </SheetTitle>
        </SheetHeader>
        {step == 1 ? (
          <div className="px-3">
            <Alert variant="destructive">
              <AlertCircleIcon className="h-4 w-4" />
              <AlertTitle>Terms & Conditions</AlertTitle>
              <AlertDescription>
                Product tags must be intact and dress must be in original condition. We
                will accept the return only if it passes our inspection. The money will be
                added to your Store Wallet, we do not refund the money to orignal payment
                method.
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <div className="overflow-y-auto px-3">
            <h2 className="mb-3 font-medium">Select items to return</h2>
            <FieldGroup className="gap-3">
              {order.items.map((item) => (
                <FieldLabel key={item.id}>
                  <Field orientation="horizontal">
                    <Checkbox
                      id={item.id}
                      name={item.id}
                      checked={!!selectedItems[item.id]}
                      onCheckedChange={(v) => {
                        setSelectedItems((prev) => {
                          if (v) {
                            return { ...prev, [item.id]: 1 };
                          }
                          const newItems = { ...prev };
                          delete newItems[item.id];
                          return newItems;
                        });
                      }}
                    />
                    <FieldContent>
                      <div className="flex gap-2">
                        <div className="flex flex-1 flex-col">
                          <h2 className="line-clamp-1 font-medium">
                            {item.product.title}
                          </h2>
                          <p className="text-xs sm:text-sm">
                            <span className="font-medium">Size:</span>{" "}
                            {formatSize(item.size)}
                          </p>
                          <p className="text-xs sm:text-sm">
                            <span className="font-medium">Qty:</span> {item.quantity}
                          </p>
                          {selectedItems[item.id] && item.quantity > 1 && (
                            <div className="flex flex-col items-start gap-1">
                              <span className="text-muted-foreground text-xs">
                                Return Qty
                              </span>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => {
                                    setSelectedItems((prev) => ({
                                      ...prev,
                                      [item.id]: Math.max(1, prev[item.id] - 1),
                                    }));
                                  }}
                                  disabled={selectedItems[item.id] <= 1}
                                >
                                  -
                                </Button>
                                <span className="w-4 text-center text-sm">
                                  {selectedItems[item.id]}
                                </span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => {
                                    setSelectedItems((prev) => ({
                                      ...prev,
                                      [item.id]: Math.min(
                                        item.quantity,
                                        prev[item.id] + 1,
                                      ),
                                    }));
                                  }}
                                  disabled={selectedItems[item.id] >= item.quantity}
                                >
                                  +
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-center gap-2">
                          <Image
                            src={convertImage(item.product.images[0], 300)}
                            alt={item.product.title}
                            width={70}
                            height={70}
                            className="aspect-square rounded-lg object-cover object-top"
                          />
                        </div>
                      </div>
                    </FieldContent>
                  </Field>
                </FieldLabel>
              ))}
            </FieldGroup>
            <Form {...form}>
              <form
                id="return-form"
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-4 space-y-4"
              >
                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reason for Return</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Mention in detail why you want to return the Product"
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
            <div className="mt-3 flex flex-col gap-2">
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
          </div>
        )}
        <SheetFooter className="flex flex-row border-t">
          {step == 1 ? (
            <SheetClose
              render={
                <Button type="button" variant={"destructive"} className={"flex-1"}>
                  Close
                </Button>
              }
            ></SheetClose>
          ) : (
            <Button
              type="button"
              variant={"destructive"}
              onClick={() => setStep(1)}
              className={"flex-1"}
            >
              Back
            </Button>
          )}
          {step == 1 ? (
            <Button
              type="button"
              onClick={() => setStep(2)}
              className={"flex-1"}
              variant={"secondary"}
            >
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
              Submit
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
