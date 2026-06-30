import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, type, ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    className={cn(
      "focus-ring flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";
