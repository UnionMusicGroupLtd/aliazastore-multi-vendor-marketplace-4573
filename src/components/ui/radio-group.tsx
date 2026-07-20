import * as React from "react"
import { Circle } from "lucide-react"
import { cn } from "@/lib/utils"

const RadioGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  )
})
RadioGroup.displayName = "RadioGroup"

const RadioGroupItem = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { name?: string }
>(({ className, name, ...props }, ref) => {
  return (
    <div className="relative flex items-center">
      <input
        type="radio"
        ref={ref}
        name={name}
        className={cn(
          "peer h-4 w-4 rounded-full border border-gray-300 text-orange-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer",
          className
        )}
        {...props}
      />
      <Circle className="h-2.5 w-2.5 fill-current text-orange-600 absolute left-0.5 pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" />
    </div>
  )
})
RadioGroupItem.displayName = "RadioGroupItem"

export { RadioGroup, RadioGroupItem }
