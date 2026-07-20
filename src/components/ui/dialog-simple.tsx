import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface DialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

const Dialog = ({ open, onOpenChange, children }: DialogProps) => {
  const [internalOpen, setInternalOpen] = React.useState(open || false)
  
  const isControlled = open !== undefined
  const isOpen = isControlled ? open : internalOpen
  
  const handleOpenChange = (newOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(newOpen)
    }
    if (onOpenChange) {
      onOpenChange(newOpen)
    }
  }
  
  if (!isOpen) {
    return <>{children}</>
  }
  
  return (
    <>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as any, { 
            open: isOpen, 
            onOpenChange: handleOpenChange 
          })
        }
        return child
      })}
    </>
  )
}

const DialogTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, onClick, ...props }, ref) => (
  <button
    ref={ref}
    className={className}
    onClick={onClick}
    {...props}
  />
))
DialogTrigger.displayName = "DialogTrigger"

const DialogContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { 
    open?: boolean
    onOpenChange?: (open: boolean) => void
  }
>(({ className, children, open, onOpenChange, ...props }, ref) => {
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onOpenChange?.(false)
    }
  }
  
  return (
    <>
      {/* Mobile-only overlay - hidden on desktop */}
      <div
        onClick={handleOverlayClick}
        className="sm:hidden fixed inset-0 z-50 bg-black/60 animate-in fade-in-0"
      />
      {/* Desktop overlay */}
      <div
        onClick={handleOverlayClick}
        className="hidden sm:block fixed inset-0 z-50 bg-black/80 animate-in fade-in-0"
      />
      <div
        ref={ref}
        className={cn(
          // Base positioning
          "fixed left-[50%] top-[50%] z-50 grid gap-4 bg-white shadow-lg animate-in zoom-in-95 fade-in-0",
          // Mobile-specific: full screen
          "sm:translate-x-[-50%] sm:translate-y-[-50%] sm:rounded-lg sm:border",
          // Desktop positioning
          "w-full h-[100dvh] sm:w-auto sm:h-auto sm:max-w-lg",
          // Height and scrolling
          "sm:max-h-[calc(100vh-2rem)] sm:overflow-y-auto",
          // Padding
          "sm:p-6 p-0", // No padding on mobile, full control in parent
          // Mobile-specific adjustments
          "sm:my-4 sm:mx-4",
          className
        )}
        {...props}
      >
        {children}
        {/* Desktop close button only */}
        <button
          onClick={() => onOpenChange?.(false)}
          className="hidden sm:block absolute right-4 top-4 z-50 rounded-full p-2 bg-white hover:bg-gray-100 transition-opacity hover:opacity-100 opacity-70 shadow-md border border-gray-200"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </button>
      </div>
    </>
  )
})
DialogContent.displayName = "DialogContent"

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = "DialogTitle"

const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = "DialogDescription"

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
}
