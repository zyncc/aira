import Link from "next/link";
import { MdWhatsapp } from "react-icons/md";

export default function Whatsapp() {
  return (
    <div className="fixed right-5 bottom-5 z-[10] transition-all duration-300 hover:translate-y-[-5px]">
      <Link
        target="_blank"
        aria-label="Contact on WhatsApp"
        href={"https://wa.me/919448093950"}
      >
        <div className="rounded-sm bg-[#0dc143] p-2">
          <MdWhatsapp color="white" size={35} />
        </div>
      </Link>
    </div>
  );
}
