import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Story - Aira Clothing",
  description:
    "Aira is a homegrown brand catering to all your fashion needs at a one-stop destination for casuals, Party wear, Resort wear, Office wear, Everyday staples, that is committed to making you look good anytime, anywhere. Explore our wide range of products that embodies luxury and sustainability.",
};

export default function About() {
  return (
    <div className="container mt-[30px] font-semibold text-3xl h-screen">
      About us
    </div>
  );
}
