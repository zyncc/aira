"use client";

import Spinner from "@/components/loadingSpinner";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";

export default function FormSubmitButton({ text }: { text: string }) {
  const { pending } = useFormStatus();
  return (
    <Button aria-label="Button" type="submit" disabled={pending}>
      {pending ? <Spinner size={30} /> : text}
    </Button>
  );
}
