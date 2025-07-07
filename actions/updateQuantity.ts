"use server";

import { quantitySchema } from "@/components/admin-tables/all-products/editQuantity";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function updateQuantity(
  values: z.infer<typeof quantitySchema>,
  id: string
) {
  await prisma.quantity.update({
    where: {
      id,
    },
    data: {
      sm: values.sm,
      md: values.md,
      lg: values.lg,
      xl: values.xl,
      doublexl: values.doublexl,
    },
  });
  revalidatePath("/admin/products/inventory");
}
