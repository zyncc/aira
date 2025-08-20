import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

type ContainerProps = {
  className?: string;
  children: ReactNode;
};

export function Container({ className, children }: ContainerProps) {
  return <div className={cn("containerr mx-auto", className)}>{children}</div>;
}
