"use client";

import "@/components/tiptap/tiptap-ui-primitive/badge/badge-colors.scss";
import "@/components/tiptap/tiptap-ui-primitive/badge/badge-group.scss";
import "@/components/tiptap/tiptap-ui-primitive/badge/badge.scss";
import * as React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "ghost" | "white" | "gray" | "green" | "default";
  size?: "default" | "small";
  appearance?: "default" | "subdued" | "emphasized";
  trimText?: boolean;
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  (
    {
      variant,
      size = "default",
      appearance = "default",
      trimText = false,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={`tiptap-badge ${className || ""}`}
        data-style={variant}
        data-size={size}
        data-appearance={appearance}
        data-text-trim={trimText ? "on" : "off"}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Badge.displayName = "Badge";

export default Badge;
