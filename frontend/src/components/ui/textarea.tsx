import * as React from "react"

import { cn } from "@/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-xl border border-slate-200/80 bg-white/80 backdrop-blur-sm px-3.5 py-2.5 text-sm shadow-xs transition-all duration-200 placeholder:text-slate-400 focus-visible:outline-none focus-visible:border-indigo-500 focus-visible:ring-4 focus-visible:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950/60 dark:placeholder:text-slate-500 dark:focus-visible:border-indigo-400 dark:focus-visible:ring-indigo-400/20",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
