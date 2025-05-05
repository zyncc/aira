import Link from "next/link";
import React from "react";
import { MdWhatsapp } from "react-icons/md";

export default function Whatsapp() {
  return (
    <div className="fixed bottom-5 right-5 z-[10]">
      <Link
        target="_blank"
        aria-label="Contact on WhatsApp"
        href={"https://wa.me/919448093950"}
      >
        <div className="bg-[#0dc143] p-2 rounded-full">
          <MdWhatsapp color="white" size={35} />
        </div>
      </Link>
    </div>
  );
}
