import * as React from "react";
import { Alert, type AlertProps } from "../ui/alert";

export type NotificationType = "info" | "success" | "warning" | "error";

export interface AlertNotificationProps
  extends Omit<AlertProps, "variant"> {
  type?: NotificationType;
  autoClose?: boolean;
  autoCloseDuration?: number;
  id?: string;
}

const typeToVariant = (type: NotificationType): AlertProps["variant"] => {
  const mapping: Record<NotificationType, AlertProps["variant"]> = {
    info: "default",
    success: "success",
    warning: "warning",
    error: "destructive",
  };
  return mapping[type];
};

const AlertNotification = React.forwardRef<
  HTMLDivElement,
  AlertNotificationProps
>(
  (
    {
      type = "info",
      title,
      description,
      autoClose = false,
      autoCloseDuration = 5000,
      onClose,
      showCloseButton = true,
      ...props
    },
    ref,
  ) => {
    const [isVisible, setIsVisible] = React.useState(true);

    React.useEffect(() => {
      if (autoClose && isVisible) {
        const timer = setTimeout(() => {
          setIsVisible(false);
          onClose?.();
        }, autoCloseDuration);

        return () => clearTimeout(timer);
      }
    }, [autoClose, autoCloseDuration, isVisible, onClose]);

    if (!isVisible) return null;

    return (
      <Alert
        ref={ref}
        variant={typeToVariant(type)}
        title={title}
        description={description}
        onClose={() => {
          setIsVisible(false);
          onClose?.();
        }}
        showCloseButton={showCloseButton}
        {...props}
      />
    );
  },
);

AlertNotification.displayName = "AlertNotification";

export { AlertNotification };
