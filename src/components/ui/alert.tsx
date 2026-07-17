import * as AlertDialog from "@radix-ui/react-alert-dialog";
import * as React from "react";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive" | "success" | "warning";
  title?: string;
  description?: string;
  onClose?: () => void;
  showCloseButton?: boolean;
}

const alertVariants = (variant = "default") => {
  const variants: Record<string, string> = {
    default: "bg-blue-50 border-blue-200 text-blue-800",
    destructive: "bg-red-50 border-red-200 text-red-800",
    success: "bg-green-50 border-green-200 text-green-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
  };
  return variants[variant] || variants.default;
};

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      className,
      variant = "default",
      title,
      description,
      onClose,
      showCloseButton = false,
      ...props
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = React.useState(true);

    const handleClose = () => {
      setIsOpen(false);
      onClose?.();
    };

    if (!isOpen) return null;

    return (
      <div
        ref={ref}
        className={`rounded-lg border px-4 py-3 ${alertVariants(variant)} ${className || ""}`}
        role="alert"
        {...props}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            {title && (
              <h3 className="font-semibold leading-none tracking-tight">
                {title}
              </h3>
            )}
            {description && (
              <p className={`text-sm ${title ? "mt-2" : ""}`}>
                {description}
              </p>
            )}
          </div>
          {showCloseButton && (
            <button
              type="button"
              onClick={handleClose}
              className="inline-flex h-6 w-6 items-center justify-center rounded text-sm font-medium opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none"
              aria-label="Close alert"
            >
              ×
            </button>
          )}
        </div>
      </div>
    );
  },
);
Alert.displayName = "Alert";

export { Alert, alertVariants };
