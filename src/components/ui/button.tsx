import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:transition-transform [&_svg]:duration-300",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-soft hover:shadow-card active:scale-[0.98] hover:[&_svg]:translate-x-0.5",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-soft hover:shadow-card active:scale-[0.98]",
        outline: "border-2 border-input bg-background hover:bg-secondary hover:text-secondary-foreground hover:border-primary/50 active:scale-[0.98]",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-[0.98]",
        ghost: "hover:bg-secondary hover:text-secondary-foreground active:scale-[0.98]",
        link: "text-primary underline-offset-4 hover:underline",
        gradient: "gradient-warm text-primary-foreground shadow-glow hover:shadow-glow-accent hover:scale-[1.02] active:scale-[0.98] hover:[&_svg]:translate-x-1 hover:[&_svg]:scale-110",
        soft: "bg-primary/10 text-primary hover:bg-primary/20 active:scale-[0.98] hover:[&_svg]:translate-x-0.5",
        glass: "glass hover:bg-card/90 active:scale-[0.98] shadow-soft hover:shadow-card",
        premium: "relative overflow-hidden gradient-warm text-primary-foreground shadow-colored-primary hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] before:absolute before:inset-0 before:bg-gradient-shimmer before:opacity-0 hover:before:opacity-100 before:transition-opacity hover:[&_svg]:translate-x-1 hover:[&_svg]:scale-110",
        neon: "relative bg-background text-primary border-2 border-primary hover:bg-primary hover:text-primary-foreground shadow-glow hover:shadow-glow-accent active:scale-[0.98] transition-all duration-300",
        magnetic: "bg-primary text-primary-foreground shadow-soft hover:shadow-card active:scale-[0.98] transition-all duration-200 hover:-translate-y-0.5",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg font-semibold",
        icon: "h-10 w-10",
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
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
