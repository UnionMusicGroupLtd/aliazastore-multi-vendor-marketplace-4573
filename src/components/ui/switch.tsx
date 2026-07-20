import * as React from "react"
import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { checked?: boolean }
>(({ className, checked, ...props }, ref) => (
  <label className="relative inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      ref={ref}
      checked={checked}
      className="sr-only peer"
      {...props}
    />
    <div
      className={cn(
        "peer h-6 w-11 rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-orange-600" : "bg-gray-300",
        className
      )}
    >
      <div
        className={cn(
          "pointer-events-none h-5 w-5 rounded-full bg-white shadow-lg transition-transform",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </div>
  </label>
))
Switch.displayName = "Switch"

export { Switch }
