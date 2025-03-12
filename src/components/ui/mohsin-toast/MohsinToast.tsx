"use client";

import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import { 
  X, 
  CheckCircle, 
  AlertTriangle, 
  AlertCircle, 
  Info,
  HelpCircle,
  Bell,
  Zap,
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import styles from "./MohsinToast.module.scss";
import { AnimatePresence, motion } from "framer-motion";

// ============================
// Toast Context and Hooks
// ============================

const TOAST_LIMIT = 5;
// Auto dismiss after 5 seconds by default
const TOAST_REMOVE_DELAY = 5000;

export type ToastVariant = 
  | "default" 
  | "success" 
  | "error" 
  | "warning" 
  | "info" 
  | "discovery" 
  | "notification" 
  | "update";

export type ToastPosition = 
  | "top-right" 
  | "top-left" 
  | "bottom-right" 
  | "bottom-left" 
  | "top-center" 
  | "bottom-center";

export type ToastSize = "sm" | "md" | "lg";

export type ToastStyle = "solid" | "outline" | "glass";

export type ToasterToast = {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  variant?: ToastVariant;
  duration?: number;
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  position?: ToastPosition;
  size?: ToastSize;
  style?: ToastStyle;
  icon?: React.ReactNode;
  showIcon?: boolean;
  showProgress?: boolean;
};

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

type ActionType = typeof actionTypes;

type Action =
  | {
      type: ActionType["ADD_TOAST"];
      toast: ToasterToast;
    }
  | {
      type: ActionType["UPDATE_TOAST"];
      toast: Partial<ToasterToast>;
    }
  | {
      type: ActionType["DISMISS_TOAST"];
      toastId?: string;
    }
  | {
      type: ActionType["REMOVE_TOAST"];
      toastId?: string;
    };

interface State {
  toasts: ToasterToast[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const addToRemoveQueue = (toastId: string, duration: number = TOAST_REMOVE_DELAY) => {
  if (toastTimeouts.has(toastId)) {
    clearTimeout(toastTimeouts.get(toastId));
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    });
  }, duration);

  toastTimeouts.set(toastId, timeout);
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case "DISMISS_TOAST": {
      const { toastId } = action;

      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      };
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
};

const listeners: Array<(state: State) => void> = [];

let memoryState: State = { toasts: [] };

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

export interface ToastOptions extends Partial<Omit<ToasterToast, "id">> {}

export function toast(options: ToastOptions) {
  const id = genId();
  const duration = options.duration || TOAST_REMOVE_DELAY;

  const update = (props: ToastOptions) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    });

  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...options,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
        options.onOpenChange?.(open);
      },
    },
  });

  // Auto-dismiss based on duration
  if (duration !== Infinity) {
    setTimeout(dismiss, duration);
  }

  return {
    id,
    dismiss,
    update,
  };
}

export function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  };
}

// ============================
// Toast Components
// ============================

const ToastProvider = ToastPrimitives.Provider;

interface ToastViewportProps 
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport> {
  position?: ToastPosition;
}

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  ToastViewportProps
>(({ className, position = "bottom-right", ...props }, ref) => {
  const positionClasses = {
    "top-right": styles.topRight,
    "top-left": styles.topLeft,
    "bottom-right": styles.bottomRight,
    "bottom-left": styles.bottomLeft,
    "top-center": styles.topCenter,
    "bottom-center": styles.bottomCenter,
  };

  return (
    <ToastPrimitives.Viewport
      ref={ref}
      className={cn(
        styles.viewport,
        positionClasses[position],
        className
      )}
      {...props}
    />
  );
});
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

interface MohsinToastProps 
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> {
  variant?: ToastVariant;
  size?: ToastSize;
  toastStyle?: ToastStyle;
  showIcon?: boolean;
  showProgress?: boolean;
}

const MohsinToast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  MohsinToastProps
>(({ className, variant = "default", size = "md", toastStyle = "solid", showIcon = true, showProgress = true, children, ...props }, ref) => {
  const variantClassNames = {
    default: styles.default,
    success: styles.success,
    error: styles.error,
    warning: styles.warning,
    info: styles.info,
    discovery: styles.discovery,
    notification: styles.notification,
    update: styles.update
  };

  const sizeClassNames = {
    sm: styles.sizeSm,
    md: styles.sizeMd,
    lg: styles.sizeLg
  };

  const styleClassNames = {
    solid: styles.styleSolid,
    outline: styles.styleOutline,
    glass: styles.styleGlass
  };
  
  const [timeLeft, setTimeLeft] = React.useState(100);
  const duration = props.duration || TOAST_REMOVE_DELAY;
  
  React.useEffect(() => {
    if (!showProgress || duration === Infinity) return;
    
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const newValue = prev - (100 / (duration / 100));
        return newValue < 0 ? 0 : newValue;
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, [duration, showProgress]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={styles.motionContainer}
    >
      <ToastPrimitives.Root
        ref={ref}
        className={cn(
          styles.toast,
          variantClassNames[variant],
          sizeClassNames[size],
          styleClassNames[toastStyle],
          className
        )}
        {...props}
      >
        {children}
        {showProgress && duration !== Infinity && (
          <div className={styles.progressContainer}>
            <div 
              className={cn(styles.progressBar, variantClassNames[variant])}
              style={{ width: `${timeLeft}%` }}
            />
          </div>
        )}
      </ToastPrimitives.Root>
    </motion.div>
  );
});
MohsinToast.displayName = "MohsinToast";

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      styles.action,
      className
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      styles.close,
      className
    )}
    toast-close=""
    {...props}
  >
    <X className={styles.closeIcon} />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn(
      styles.title,
      className
    )}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn(
      styles.description,
      className
    )}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

// ============================
// Toast Icon Components
// ============================

interface ToastIconProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: ToastVariant;
  iconOverride?: React.ReactNode;
}

const ToastIcon = ({ variant = "default", iconOverride, className, ...props }: ToastIconProps) => {
  const icons = {
    default: <Info className={styles.iconDefault} />,
    success: <CheckCircle className={styles.iconSuccess} />,
    error: <AlertCircle className={styles.iconError} />,
    warning: <AlertTriangle className={styles.iconWarning} />,
    info: <Info className={styles.iconInfo} />,
    discovery: <HelpCircle className={styles.iconDiscovery} />,
    notification: <Bell className={styles.iconNotification} />,
    update: <Zap className={styles.iconUpdate} />
  };

  const iconToRender = iconOverride || icons[variant];

  return (
    <div className={cn(styles.icon, styles[`icon${variant.charAt(0).toUpperCase() + variant.slice(1)}`], className)} {...props}>
      {iconToRender}
    </div>
  );
};

// ============================
// Main Toaster Component
// ============================

export interface MohsinToasterProps {
  position?: ToastPosition;
  defaultStyle?: ToastStyle;
  defaultSize?: ToastSize;
  showIcons?: boolean;
  showProgress?: boolean;
}

export function MohsinToaster({ 
  position = "bottom-right", 
  defaultStyle = "solid",
  defaultSize = "md",
  showIcons = true,
  showProgress = true
}: MohsinToasterProps) {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      <AnimatePresence>
        {toasts.map(({ id, title, description, action, variant, position: toastPosition, size, style, icon, showIcon = showIcons, showProgress: toastShowProgress, ...props }) => {
          return (
            <MohsinToast 
              key={id} 
              variant={variant} 
              size={size || defaultSize} 
              toastStyle={style || defaultStyle}
              showIcon={showIcon}
              showProgress={toastShowProgress !== undefined ? toastShowProgress : showProgress}
              {...props}
            >
              <div className={styles.contentContainer}>
                {showIcon && <ToastIcon variant={variant} iconOverride={icon} />}
                <div className={styles.textContainer}>
                  {title && <ToastTitle>{title}</ToastTitle>}
                  {description && <ToastDescription>{description}</ToastDescription>}
                  {action && <div className={styles.actionContainer}>{action}</div>}
                </div>
                <ToastClose />
              </div>
            </MohsinToast>
          );
        })}
      </AnimatePresence>
      <ToastViewport position={position} />
    </ToastProvider>
  );
}

// ============================
// Helper Functions
// ============================

// Default toast
toast.default = (options: Omit<ToastOptions, "variant">) => {
  return toast({ ...options, variant: "default" });
};

// Success toast shorthand
toast.success = (options: Omit<ToastOptions, "variant">) => {
  return toast({ ...options, variant: "success" });
};

// Error toast shorthand
toast.error = (options: Omit<ToastOptions, "variant">) => {
  return toast({ ...options, variant: "error" });
};

// Warning toast shorthand
toast.warning = (options: Omit<ToastOptions, "variant">) => {
  return toast({ ...options, variant: "warning" });
};

// Info toast shorthand
toast.info = (options: Omit<ToastOptions, "variant">) => {
  return toast({ ...options, variant: "info" });
};

// Discovery toast shorthand
toast.discovery = (options: Omit<ToastOptions, "variant">) => {
  return toast({ ...options, variant: "discovery" });
};

// Notification toast shorthand
toast.notification = (options: Omit<ToastOptions, "variant">) => {
  return toast({ ...options, variant: "notification" });
};

// Update toast shorthand
toast.update = (options: Omit<ToastOptions, "variant">) => {
  return toast({ ...options, variant: "update" });
};

// Simple toast to show a message with a title and description
export function showToast(
  title: string,
  description?: string,
  variant: ToastVariant = "default",
  duration: number = TOAST_REMOVE_DELAY,
  style?: ToastStyle,
  size?: ToastSize,
  showIcon?: boolean,
  showProgress?: boolean
) {
  return toast({
    title,
    description,
    variant,
    duration,
    style,
    size,
    showIcon,
    showProgress
  });
}

export {
  ToastProvider,
  ToastViewport,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};