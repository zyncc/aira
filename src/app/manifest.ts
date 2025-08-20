import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Aira Clothing",
    short_name: "Aira Clothing",
    description:
      "Aira is a homegrown brand catering to all your fashion needs at a one-stop destination for casuals, Party wear, Resort wear, Office wear, Everyday staples, that is committed to making you look good anytime, anywhere. Explore our wide range of products that embodies luxury and sustainability.",
    start_url: "/",
    display: "standalone",
    background_color: "#f3efec",
    theme_color: "#56756e",
    icons: [
      {
        src: "/logo-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/logo-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
