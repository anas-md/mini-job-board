import { toast as sonnerToast } from 'sonner';

interface ToastOptions {
  duration?: number;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  onDismiss?: () => void;
  onAutoClose?: () => void;
}

interface EnhancedToastOptions extends ToastOptions {
  showCountdown?: boolean;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  id?: string | number;
}

// Default durations for different toast types
const DEFAULT_DURATIONS = {
  success: 2500,
  error: 4000,
  warning: 3500,
  info: 3000,
  loading: Infinity,
  default: 3000,
} as const;

class ToastManager {
  private activeToasts = new Map<string, { timeoutId: NodeJS.Timeout; startTime: number; duration: number }>();

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private createToastWithCountdown(
    type: 'success' | 'error' | 'warning' | 'info' | 'default',
    message: string,
    options: EnhancedToastOptions = {}
  ) {
    const {
      duration = DEFAULT_DURATIONS[type],
      showCountdown = false,
      action,
      id,
      ...restOptions
    } = options;

    // Generate a unique ID for this toast
    const uniqueId = id || this.generateId();
    
    // Create dismiss action that targets this specific toast
    const dismissAction = action || {
      label: 'Dismiss',
      onClick: () => sonnerToast.dismiss(uniqueId)
    };

    // For countdown toasts, modify the message once and create the toast
    let finalMessage = message;
    if (showCountdown && duration !== Infinity && duration > 1000) {
      const seconds = Math.ceil(duration / 1000);
      finalMessage = `${message} (${seconds}s)`;
    }

    // Create the toast with all options
    const toastOptions = {
      duration,
      'data-duration': duration,
      action: dismissAction,
      id: uniqueId,
      ...restOptions,
    };

    return sonnerToast[type === 'default' ? 'message' : type](finalMessage, toastOptions);
  }

  success(message: string, options?: EnhancedToastOptions) {
    return this.createToastWithCountdown('success', message, options);
  }

  error(message: string, options?: EnhancedToastOptions) {
    return this.createToastWithCountdown('error', message, options);
  }

  warning(message: string, options?: EnhancedToastOptions) {
    return this.createToastWithCountdown('warning', message, options);
  }

  info(message: string, options?: EnhancedToastOptions) {
    return this.createToastWithCountdown('info', message, options);
  }

  message(message: string, options?: EnhancedToastOptions) {
    return this.createToastWithCountdown('default', message, options);
  }

  loading(message: string, options?: ToastOptions) {
    return sonnerToast.loading(message, {
      duration: Infinity,
      ...options,
    });
  }

  promise<T>(
    promise: Promise<T>,
    options: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    }
  ) {
    return sonnerToast.promise(promise, options);
  }

  dismiss(id?: string | number) {
    return sonnerToast.dismiss(id);
  }

  // Quick access methods with optimized durations
  quickSuccess(message: string) {
    return this.success(message, { duration: 2000 });
  }

  quickError(message: string) {
    return this.error(message, { duration: 3000 });
  }

  quickInfo(message: string) {
    return this.info(message, { duration: 2500 });
  }

  // Persistent toasts that require manual dismissal
  persistent = {
    success: (message: string, options?: Omit<EnhancedToastOptions, 'duration'>) =>
      this.success(message, { ...options, duration: Infinity }),
    error: (message: string, options?: Omit<EnhancedToastOptions, 'duration'>) =>
      this.error(message, { ...options, duration: Infinity }),
    warning: (message: string, options?: Omit<EnhancedToastOptions, 'duration'>) =>
      this.warning(message, { ...options, duration: Infinity }),
    info: (message: string, options?: Omit<EnhancedToastOptions, 'duration'>) =>
      this.info(message, { ...options, duration: Infinity }),
  };
}

export const toast = new ToastManager();
export { sonnerToast as originalToast }; 