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
  
  // Always render so triggers stay visible; DialogContent guards its own open state
  
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
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    asChild?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
  }
>(({ className, onClick, asChild, children, open, onOpenChange, ...props }, ref) => {
  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<any>
    return React.cloneElement(child, {
      ref,
      onClick: (event: React.MouseEvent<HTMLElement>) => {
        child.props.onClick?.(event)
        onClick?.(event as React.MouseEvent<HTMLButtonElement>)
        onOpenChange?.(true)
      },
    })
  }

  return (
    <button
      ref={ref}
      className={className}
      onClick={(event) => {
        onClick?.(event)
        onOpenChange?.(true)
      }}
      {...props}
    >
      {children}
    </button>
  )
})
DialogTrigger.displayName = "DialogTrigger"

const DialogContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { 
    open?: boolean
    onOpenChange?: (open: boolean) => void
  }
>(({ className, children, open, onOpenChange, ...props }, ref) => {
  if (!open) return null

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
          "fixed z-50 grid gap-4 bg-white shadow-lg",
          // Mobile: FULL SCREEN from edges, no transforms
          "inset-0 sm:inset-auto",
          "sm:left-[50%] sm:top-[50%]", 
          "sm:translate-x-[-50%] sm:translate-y-[-50%]",
          // Desktop styling
          "sm:rounded-lg sm:border sm:max-w-lg",
          "sm:max-h-[calc(100vh-2rem)] sm:overflow-y-auto",
          // Mobile padding (smaller), desktop padding (larger)
          "p-4 sm:p-6",
          // Mobile-specific: ensure no overflow
          "overflow-y-auto max-h-[100dvh]",
          // Desktop margin
          "sm:my-4 sm:mx-4",
          className
        )}
        {...props}
      >
        {children}
        {/* Mobile close button - always visible on mobile */}
        <button
          onClick={() => onOpenChange?.(false)}
          className="sm:hidden absolute left-3 top-3 z-50 rounded-full p-2 bg-gray-100 hover:bg-gray-200 shadow-md"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        {/* Desktop close button */}
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
