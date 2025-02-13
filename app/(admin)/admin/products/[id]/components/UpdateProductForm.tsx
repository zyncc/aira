"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  updateProduct,
  updateProductWithImage,
} from "@/actions/formSubmissions";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";
import { MdHideImage, MdImage } from "react-icons/md";
import { Products } from "@/lib/types";
import FormSubmitButton from "@/components/FormSubmitButton";

type Props = {
  product: Products | null;
};

const CreateProductForm = ({ product }: Props) => {
  const [imageDisabled, setImageDisabled] = useState(true);
  if (product) {
    const {
      title,
      description,
      images,
      price,
      quantity,
      category,
      color,
      id,
      fabric,
      fit,
      isFeatured,
      isArchived,
      transparency,
      weavePattern,
    } = product;
    return (
      <div className="flex flex-wrap flex-col md:flex-row gap-20 mt-16 mb-16">
        <form
          action={imageDisabled ? updateProduct : updateProductWithImage}
          className="flex flex-1 flex-col gap-6"
        >
          <div className="flex gap-4">
            <Button
              aria-label="Button"
              type="button"
              size={"sm"}
              variant={"secondary"}
              onClick={() => setImageDisabled(!imageDisabled)}
            >
              {imageDisabled ? (
                <MdImage size={25} />
              ) : (
                <MdHideImage size={25} />
              )}
            </Button>
            <Input
              name="images"
              type="file"
              multiple
              disabled={imageDisabled}
            />
          </div>
          <input type="hidden" name="id" defaultValue={id} />
          <Label>Title</Label>
          <Input name="title" required defaultValue={title} />
          <Label>Description</Label>
          <Textarea
            name="description"
            defaultValue={description}
            className="resize-y h-[150px]"
          />
          <Label>Color</Label>
          <Input
            name="color"
            type="text"
            autoCapitalize="false"
            required
            defaultValue={color}
          />
          <Label>Price</Label>
          <Input name="price" type="number" required defaultValue={price} />
          <Label>Quantity - Small</Label>
          <Input name="sm" type="number" required defaultValue={quantity?.sm} />
          <Label>Quantity - Medium</Label>
          <Input name="md" type="number" required defaultValue={quantity?.md} />
          <Label>Quantity - Large</Label>
          <Input name="lg" type="number" required defaultValue={quantity?.lg} />
          <Label>Quantity - XL</Label>
          <Input name="xl" type="number" required defaultValue={quantity?.xl} />
          <Label>Is Featured?</Label>
          <select
            name="featured"
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-foreground focus-visible:outline-none focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option
              value={1}
              selected={isFeatured !== null && isFeatured && true}
            >
              Is Featured
            </option>
            <option
              value={""}
              selected={isFeatured !== null && isFeatured == false}
            >
              Not Featured
            </option>
          </select>
          <Label>Category</Label>
          <select
            name="category"
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-foreground focus-visible:outline-none focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            defaultValue={category}
          >
            <option value="men">Men</option>
            <option value="skirts">Skirts</option>
            <option value="pants">Pants</option>
          </select>
          <Label>Is Archived?</Label>
          <select
            defaultValue={isArchived ? 1 : ""}
            name="isArchived"
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value={"1"} selected={isArchived && true}>
              Is Archived
            </option>
            <option value={""} selected={isArchived == false}>
              Not Archived
            </option>
          </select>
          <Label>Fabric</Label>
          <Input
            name="fabric"
            required
            placeholder="Fabric"
            defaultValue={fabric !== null ? fabric : ""}
          />
          <Label>Transparency</Label>
          <Input
            name="transparency"
            required
            placeholder="Transparency"
            defaultValue={transparency !== null ? transparency : ""}
          />
          <Label>Weave Pattern</Label>
          <Input
            name="weavePattern"
            required
            placeholder="Weave Pattern"
            defaultValue={weavePattern !== null ? weavePattern : ""}
          />
          <Label>Fit</Label>
          <Input
            name="fit"
            required
            placeholder="Fit"
            defaultValue={fit !== null ? fit : ""}
          />
          <FormSubmitButton text="Update" />
        </form>
        <Carousel
          className="flex flex-1"
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent>
            {images?.map((image) => (
              <CarouselItem key={image}>
                <Image
                  src={image}
                  height={1000}
                  width={1000}
                  alt="Carousel Image"
                  priority={true}
                  className="rounded-sm object-cover aspect-square"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    );
  }
};

export default CreateProductForm;
