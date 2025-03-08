"use server";

import { auth } from "@/auth";
import { headers } from "next/headers";
import { cache } from "react";

export const getServerSession = cache(async () => {
  return auth.api.getSession({
    headers: await headers(),
  });
});
