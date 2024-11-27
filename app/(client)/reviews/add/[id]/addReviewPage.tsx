"use client";

import {uploadReview} from "@/actions/formSubmissions";
import FormSubmitButton from "@/components/FormSubmitButton";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {toast} from "@/components/ui/use-toast";
import {Session} from "next-auth";
import Image from "next/image";
import React, {useState} from "react";
import Dropzone, {FileRejection} from "react-dropzone";
import {IoCloudUploadOutline} from "react-icons/io5";
import {RiDeleteBin6Line} from "react-icons/ri";

export default function AddReviewPage({
                                          id,
                                          session,
                                          category,
                                      }: {
    id: string;
    session: Session;
    category: string;
}) {
    const [isDragOver, setIsDragOver] = useState(false);
    const [droppedFiles, setDroppedFiles] = useState(false);
    const [images, setImages] = useState<File[] | null>(null);

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
        } else if (rejectedFiles[0].errors[0].code == "too-many-files") {
            toast({
                variant: "destructive",
                title: "Too many files",
                description: "Please select upto 3 files",
            });
        }
    }

    function handleReviewSubmit(formData: FormData) {
        images?.map((image) => {
            formData.append("images", image);
        });
        formData.append("pid", id);
        formData.append("category", category);
        formData.append("uid", session?.user.id as string);
        uploadReview(formData);
    }

    return (
        <div className="flex flex-wrap gap-16 max-[734px]:flex-col mt-8 mb-16">
            <form
                action={(formData) => handleReviewSubmit(formData)}
                className="flex flex-1 max-[734px]:order-2 flex-col gap-8 min-w-[320px]"
            >
                <Input
                    id="title"
                    name="title"
                    placeholder="Title"
                    className="col-span-3"
                    maxLength={50}
                    autoComplete="off"
                    required
                />
                <Textarea
                    name="description"
                    defaultValue=""
                    placeholder="Message"
                    className="col-span-3 h-[150px] max-h-[300px] max-[640px]:h-[300px]"
                    maxLength={550}
                    autoComplete="off"
                    required
                />
                <FormSubmitButton text="Add review"/>
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
                        maxFiles={3}
                        maxSize={2097152}
                    >
                        {({getRootProps, getInputProps}) => (
                            <div
                                {...getRootProps()}
                                className={`flex h-[500px] bg-background border-2 border-muted w-full min-w-[320px] items-center rounded-lg p-4 justify-center cursor-pointer ${
                                    isDragOver && "border-dashed border-blue-950"
                                }`}
                            >
                                <input {...getInputProps()} name="images" required/>
                                {!isDragOver ? (
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <IoCloudUploadOutline size={27}/>
                                        <h1 className="font-medium text-sm">
                                            Click to upload or{" "}
                                            <span className="font-bold">Drag and Drop</span>
                                        </h1>
                                        <div className="text-center">
                                            <p className="text-muted-foreground text-xs">
                                                PNG JPG JPEG
                                            </p>
                                            <p className="text-muted-foreground text-xs">
                                                Upto 3 Images, Max 2MB per Image
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col bg-background items-center justify-center gap-2">
                                        <IoCloudUploadOutline size={27}/>
                                        <h1 className="font-medium text-sm">
                                            <span className="font-bold">Release to drop</span>
                                        </h1>
                                        <div className="text-center">
                                            <p className="text-muted-foreground text-xs">
                                                PNG JPG JPEG
                                            </p>
                                            <p className="text-muted-foreground text-xs">
                                                Upto 3 images, Max 2MB per Image
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
                                <div key={index}>
                                    <Image
                                        src={URL.createObjectURL(image)}
                                        width={200}
                                        height={200}
                                        alt="product image"
                                        className="object-cover aspect-square rounded-md"
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
                                <RiDeleteBin6Line color="grey" size={60}/>
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
