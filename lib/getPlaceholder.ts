import { getPlaiceholder } from "plaiceholder";

export default async function getPlaceholders(imageUrls: string[]) {
  try {
    const promises = imageUrls.map(async (imageUrl) => {
      const res = await fetch(imageUrl);
      if (!res.ok) {
        throw new Error(
          `Failed to fetch image: ${res.status} ${res.statusText}`
        );
      }
      const buffer = await res.arrayBuffer();
      const { base64 } = await getPlaiceholder(Buffer.from(buffer));
      return base64;
    });

    const results = await Promise.allSettled(promises);

    const base64Array = results.map((result) => {
      if (result.status === "fulfilled") {
        return result.value;
      } else {
        console.error(result.reason);
        return null;
      }
    });
    return base64Array;
  } catch (e) {
    if (e instanceof Error) console.log(e.stack);
  }
}
