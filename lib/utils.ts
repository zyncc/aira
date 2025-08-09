import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { customAlphabet } from "nanoid";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatSize = (size: string) => {
  switch (size) {
    case "sm":
      return "Small";
    case "md":
      return "Medium";
    case "lg":
      return "Large";
    case "xl":
      return "XL";
    case "doublexl":
      return "2XL";
    default:
      return size;
  }
};

export function uuid() {
  const random = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 10);
  return random();
}
