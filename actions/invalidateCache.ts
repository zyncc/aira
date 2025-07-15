"use server";

import { revalidatePath } from "next/cache";

export async function invalidateCache(pathName: string) {
  revalidatePath(pathName);
}
