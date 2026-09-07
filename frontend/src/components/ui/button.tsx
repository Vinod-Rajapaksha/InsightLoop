import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-indigo-600 via-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 hover:opacity-95",
        destructive:
          "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-500/20 hover:shadow-lg hover:shadow-red-500/30 hover:opacity-95",
        outline:
          "border border-slate-200/80 bg-white/70 backdrop-blur-sm shadow-sm hover:bg-slate-100/80 hover:text-slate-900 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950/70 dark:hover:bg-slate-800",
        secondary:
          "bg-indigo-50 text-indigo-600 shadow-sm hover:bg-indigo-100/80 hover:text-indigo-700 dark:bg-slate-800 dark:text-indigo-400 dark:hover:bg-slate-700",
        ghost: "hover:bg-indigo-50/80 hover:text-indigo-600 dark:hover:bg-slate-800 dark:hover:text-indigo-400",
        link: "text-indigo-600 underline-offset-4 hover:underline dark:text-indigo-400",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        icon: "h-10 w-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
