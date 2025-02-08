import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseURL = "https://pansy.in";

  // const res = await fetch(`${baseURL}/api/generateSitemap`);

  // const productEntries = await res.json();

  return [
    // ...productEntries,
    { url: `${baseURL}` },
    { url: `${baseURL}/signin` },
    { url: `${baseURL}/signup` },
    { url: `${baseURL}/about` },
  ];
}
