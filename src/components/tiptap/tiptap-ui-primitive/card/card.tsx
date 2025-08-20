"use client";

import "@/components/tiptap/tiptap-ui-primitive/card/card.scss";
import { cn } from "@/lib/tiptap-utils";
import * as React from "react";

const Card = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("tiptap-card", className)} {...props} />;
  },
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("tiptap-card-header", className)} {...props} />;
  },
);
CardHeader.displayName = "CardHeader";

const CardBody = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("tiptap-card-body", className)} {...props} />;
  },
);
CardBody.displayName = "CardBody";

const CardItemGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    orientation?: "horizontal" | "vertical";
  }
>(({ className, orientation = "vertical", ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-orientation={orientation}
      className={cn("tiptap-card-item-group", className)}
      {...props}
    />
  );
});
CardItemGroup.displayName = "CardItemGroup";

const CardGroupLabel = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("tiptap-card-group-label", className)} {...props} />
    );
  },
);
CardGroupLabel.displayName = "CardGroupLabel";

const CardFooter = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("tiptap-card-footer", className)} {...props} />;
  },
);
CardFooter.displayName = "CardFooter";

export { Card, CardBody, CardFooter, CardGroupLabel, CardHeader, CardItemGroup };
