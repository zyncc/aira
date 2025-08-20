import { clsx, type ClassValue } from "clsx";
import { customAlphabet } from "nanoid";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function uuid(length?: number) {
  const random = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", length ?? 10);
  return random();
}

export function formatCurrency(number: number): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
}

export function formatSize(size: string) {
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
}
