"use client";

import React, { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createProduct } from "@/actions/formSubmissions";
import Dropzone, { FileRejection } from "react-dropzone";
import { toast } from "@/components/ui/use-toast";
import { IoCloudUploadOutline } from "react-icons/io5";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { RiDeleteBin6Line } from "react-icons/ri";
import FormSubmitButton from "@/components/FormSubmitButton";

const CreateProductForm = () => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [droppedFiles, setDroppedFiles] = useState(false);
  const [images, setImages] = useState<File[] | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  function acceptFiles(acceptedFiles: File[]) {
    const sortedArray = acceptedFiles.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    setIsDragOver(false);
    setDroppedFiles(true);
    setImages(sortedArray);
  }

  function rejectFiles(rejectedFiles: FileRejection[]) {
    setIsDragOver(false);
    if (rejectedFiles[0].errors[0].code == "file-too-large") {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Please select a file smaller than 2MB",
      });
    } else if (rejectedFiles[0].errors[0].code == "file-invalid-type") {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please select a PNG, JPG or JPEG",
      });
    }
  }

  async function handleFormSubmit(formData: FormData) {
    images?.map((image) => {
      formData.append("images", image);
    });
    const res = await createProduct(formData);
    if (res?.noImage) {
      toast({
        variant: "destructive",
        title: "No images uploaded",
        description: "Please select atleast 1 image",
      });
    }
    formRef.current?.reset();
    setDroppedFiles(false);
    setImages(null);
  }

  return (
    <div className="flex flex-wrap gap-16 max-[734px]:flex-col mt-8 mb-16">
      <form
        ref={formRef}
        action={(formData) => handleFormSubmit(formData)}
        className="flex flex-1 max-[734px]:order-2 flex-col gap-5 min-w-[320px]"
      >
        <Label>Title</Label>
        <Input name="title" required className="" placeholder="Title" />
        <Label>Description</Label>
        <Textarea
          placeholder="Description"
          name="description"
          className="resize-y h-[150px]"
          required
        />
        <Label>Color</Label>
        <Input
          name="color"
          autoCapitalize="false"
          type="text"
          required
          placeholder="Color"
        />
        <Label>Price</Label>
        <Input name="price" type="number" required placeholder="Price" />
        <Label>Quantity - Small</Label>
        <Input name="sm" type="number" required placeholder="Small Qty" />
        <Label>Quantity - Medium</Label>
        <Input name="md" type="number" required placeholder="Medium Qty" />
        <Label>Quantity - Large</Label>
        <Input name="lg" type="number" required placeholder="Large Qty" />
        <Label>Quantity - XL</Label>
        <Input name="xl" type="number" required placeholder="Extra Large Qty" />
        <Label>Is Featured?</Label>
        <select
          name="featured"
          required
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value={1}>Is Featured</option>
          <option value={""} selected>
            Not Featured
          </option>
        </select>
        <Label>Category</Label>
        <select
          name="category"
          required
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="men">Men</option>
        </select>
        <Label>Is Archived?</Label>
        <select
          name="isArchived"
          defaultValue={""}
          required
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value={1}>Is Archived</option>
          <option value={""}>Not Archived</option>
        </select>
        <Label>Fabric</Label>
        <Input name="fabric" required placeholder="Fabric" />
        <Label>Transparency</Label>
        <Input name="transparency" required placeholder="Transparency" />
        <Label>Weave Pattern</Label>
        <Input name="weavePattern" required placeholder="Weave Pattern" />
        <Label>Fit</Label>
        <Input name="fit" required placeholder="Fit" />
        <FormSubmitButton text="Create" />
      </form>
      <div className="flex-1 flex justify-center max-[734px]:order-1">
        {!droppedFiles ? (
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
                  isDragOver && "border-dashed border-blue-950"
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
                      <p className="text-muted-foreground text-xs">
                        PNG JPG JPEG
                      </p>
                      <p className="text-muted-foreground text-xs">
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
                      <p className="text-muted-foreground text-xs">
                        PNG JPG JPEG
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Max 2MB per Image
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Dropzone>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 h-fit">
              {images?.map((image, index) => (
                <div key={index} className="w-full">
                  <Image
                    src={URL.createObjectURL(image)}
                    width={200}
                    height={200}
                    alt="product image"
                    className="object-cover aspect-square rounded-lg"
                  />
                </div>
              ))}
              <Button
                variant={"outline"}
                className="w-full h-[200px]"
                onClick={() => {
                  setImages(null);
                  setDroppedFiles(false);
                }}
              >
                <RiDeleteBin6Line color="white" size={60} />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CreateProductForm;
