import React, { createContext, useContext, useCallback } from 'react';
import { Toaster, toast as sonnerToast } from 'sonner';
import { cn } from '../../utils/cn';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading';
export type ToastPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

export interface ToastOptions {
  duration?: number;
  position?: ToastPosition;
  dismissible?: boolean;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  cancel?: React.ReactNode;
  onDismiss?: () => void;
  onAutoClose?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType, options?: ToastOptions) => string | number;
  success: (message: string, options?: ToastOptions) => string | number;
  error: (message: string, options?: ToastOptions) => string | number;
  warning: (message: string, options?: ToastOptions) => string | number;
  info: (message: string, options?: ToastOptions) => string | number;
  loading: (message: string, options?: ToastOptions) => string | number;
  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    },
    options?: ToastOptions
  ) => Promise<any>;
  dismiss: (toastId?: string | number) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export interface ToastProviderProps {
  children: React.ReactNode;
  position?: ToastPosition;
  richColors?: boolean;
  closeButton?: boolean;
  theme?: 'light' | 'dark' | 'system';
}

export function ToastProvider({ 
  children, 
  position = 'top-right',
  richColors = true,
  closeButton = true,
  theme = 'system',
}: ToastProviderProps) {
  const toast = useCallback((message: string, type: ToastType = 'info', options: ToastOptions = {}) => {
    let toastId: string | number;
    
    const toastConfig = {
      duration: options.duration || (type === 'error' ? 5000 : 4000),
      position: options.position || position,
      dismissible: options.dismissible ?? true,
      icon: options.icon,
      action: options.action,
      cancel: options.cancel,
      onDismiss: options.onDismiss,
      onAutoClose: options.onAutoClose,
      className: cn(
        'toast-custom',
        options.className
      ),
      style: options.style,
    };

    switch (type) {
      case 'success':
        toastId = sonnerToast.success(message, toastConfig);
        break;
      case 'error':
        toastId = sonnerToast.error(message, toastConfig);
        break;
      case 'warning':
        toastId = sonnerToast.warning(message, toastConfig);
        break;
      case 'loading':
        toastId = sonnerToast.loading(message, toastConfig);
        break;
      case 'info':
      default:
        toastId = sonnerToast.info(message, toastConfig);
        break;
    }
    
    return toastId;
  }, [position]);

  const success = useCallback((message: string, options?: ToastOptions) => {
    return toast(message, 'success', options);
  }, [toast]);

  const error = useCallback((message: string, options?: ToastOptions) => {
    return toast(message, 'error', options);
  }, [toast]);

  const warning = useCallback((message: string, options?: ToastOptions) => {
    return toast(message, 'warning', options);
  }, [toast]);

  const info = useCallback((message: string, options?: ToastOptions) => {
    return toast(message, 'info', options);
  }, [toast]);

  const loading = useCallback((message: string, options?: ToastOptions) => {
    return toast(message, 'loading', options);
  }, [toast]);

  const promise = useCallback(<T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    },
    options?: ToastOptions
  ): Promise<T> => {
    return new Promise<T>((resolve, reject) => {
      const toastPromise = sonnerToast.promise(promise, {
        loading: messages.loading,
        success: messages.success,
        error: messages.error,
        duration: options?.duration,
        position: options?.position || position,
        className: cn('toast-custom', options?.className),
      });
      
      promise.then(resolve).catch(reject);
      return toastPromise;
    });
  }, [position]);

  const dismiss = useCallback((toastId?: string | number) => {
    if (toastId) {
      sonnerToast.dismiss(toastId);
    } else {
      sonnerToast.dismiss();
    }
  }, []);

  const value = {
    toast,
    success,
    error,
    warning,
    info,
    loading,
    promise,
    dismiss,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toaster
        position={position}
        richColors={richColors}
        closeButton={closeButton}
        theme={theme}
        className="toast-container"
        toastOptions={{
          classNames: {
            toast: 'toast-item',
            title: 'toast-title',
            description: 'toast-description',
            actionButton: 'toast-action-button',
            cancelButton: 'toast-cancel-button',
            closeButton: 'toast-close-button',
            error: 'toast-error',
            success: 'toast-success',
            warning: 'toast-warning',
            info: 'toast-info',
          },
        }}
      />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}