import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { checked?: boolean }
>(({ className, checked, ...props }, ref) => (
  <div className="relative">
    <input
      type="checkbox"
      ref={ref}
      checked={checked}
      className={cn(
        "peer h-4 w-4 shrink-0 rounded-sm border border-gray-300 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer",
        checked && "bg-orange-600 border-orange-600",
        className
      )}
      {...props}
    />
    {checked && (
      <Check className="h-3 w-3 text-white absolute top-0.5 left-0.5 pointer-events-none" />
    )}
  </div>
))
Checkbox.displayName = "Checkbox"

export { Checkbox }
