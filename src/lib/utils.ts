import { type ClassValue, clsx } from "clsx";
import { customAlphabet } from "nanoid";
import { twMerge } from "tailwind-merge";
import { Coupon, WhatsappOrderDetails } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function uuid(length?: number) {
  const random = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", length ?? 10);
  return random();
}

export function formatCurrency(number: number): string {
  return new Intl.NumberFormat("en-US", {
    currency: "INR",
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

export function extractDescription(s: string) {
  const start = s.indexOf("<p>") + 3;
  const end = s.indexOf("</p>");

  return s.slice(start, end).trim();
}

export async function sleep(secs: number) {
  return await new Promise<void>((resolve) =>
    setTimeout(() => {
      resolve();
    }, secs * 1000),
  );
}

export function convertImage(src: string, size: number): string {
  const cleanSrc = src.replace(/\/$/, "");

  const parts = cleanSrc.split("/");
  const fileName = parts.pop();

  if (!fileName) return src;

  return `${parts.join("/")}/${size}/${fileName}`;
}

export function useJPEG(src: string): string {
  return src.replace(/\.webp(\?.*)?$/i, ".jpeg$1");
}

export function calculateDiscount(price: number, coupon: Coupon): number {
  if (!coupon) return 0;

  if (coupon.type === "percentage") {
    const discount = (price * coupon.value) / 100;
    return discount;
  }

  const discountPrice = Math.max(0, price - coupon.value);
  const discount = price - discountPrice;

  return discount;
}

export async function sendWhatsappMessage(
  phoneNumber: string,
  order: WhatsappOrderDetails,
) {
  const requests = order.items.map((item) => {
    const payload = {
      messaging_product: "whatsapp",
      to: `+91${phoneNumber}`,
      type: "template",
      template: {
        name: "order_confirmed",
        language: { code: "en_US" },
        components: [
          {
            type: "header",
            parameters: [
              {
                type: "image",
                image: {
                  link: `${useJPEG(item.product.images[0])}`,
                },
              },
            ],
          },
          {
            type: "body",
            parameters: [
              { type: "text", text: order.firstName },
              { type: "text", text: `${order.id}` },
              { type: "text", text: `${formatCurrency(item.itemPrice)}` },
              {
                type: "text",
                text:
                  order.ttd?.toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "long",
                  }) ?? "",
              },
              { type: "text", text: `${order.waybill ?? ""}` },
            ],
          },
        ],
      },
    };

    return fetch(
      `https://graph.facebook.com/v22.0/${process.env.WHATSAPP_PHONE_NUMBER}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${process.env.WHATSAPP_CLOUD_API_KEY}`,
        },
        body: JSON.stringify(payload),
      },
    );
  });

  const responses = await Promise.all(requests);
  return responses;
}
