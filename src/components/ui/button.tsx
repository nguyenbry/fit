import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "active:scale-95 transition-all inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-xslate-1 text-xslate-11 hover:bg-xslate-5 border border-xslate-8",
        success:
          "bg-xmint-3 text-xmint-11 hover:bg-xmint-5 border-xmint-8 border",
        destructive:
          "bg-xred-3 text-xred-11 hover:bg-xred-5 border-xred-8 border",
        violet:
          "bg-xviolet-3 text-xviolet-11 hover:bg-xviolet-5 border border-xviolet-8",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        contrast: "bg-black dark:bg-white text-white dark:text-black",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-4",
        lg: "h-10 px-8",
        icon: "size-9 [&>svg]:size-4",
        "responsive-icon": "size-7 [&>svg]:size-3 md:[&>svg]:size-4 md:size-8 lg:size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
