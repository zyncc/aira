import React from "react";
import { CgSpinner } from "react-icons/cg";

export default function Spinner({ size }: { size: number }) {
  return <CgSpinner className="animate-spin" size={size} />;
}
