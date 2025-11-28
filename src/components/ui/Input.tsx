import React, { forwardRef, useState } from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: 'default' | 'outline' | 'filled' | 'underlined';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  focusRing?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    variant = 'default', 
    size = 'md', 
    label, 
    error, 
    helperText,
    leftIcon,
    rightIcon,
    fullWidth = false,
    rounded = 'lg',
    focusRing = true,
    disabled,
    ...props 
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    const baseClasses = cn(
      'transition-all duration-200',
      'font-medium placeholder:text-foreground-muted',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'focus:outline-none',
      {
        'w-full': fullWidth,
        'focus:ring-2 focus:ring-offset-2': focusRing,
      }
    );

    const variantClasses = {
      default: cn(
        'bg-background border border-border',
        'text-foreground',
        'hover:border-primary-red-300 dark:hover:border-primary-red-600',
        'focus:border-primary-red-500 focus:ring-primary-red-500',
        {
          'border-error-500 focus:ring-error-500': error,
        }
      ),
      outline: cn(
        'bg-transparent border-2 border-border',
        'text-foreground',
        'hover:border-primary-red-400 dark:hover:border-primary-red-500',
        'focus:border-primary-red-500 focus:ring-primary-red-500',
        {
          'border-error-500 focus:ring-error-500': error,
        }
      ),
      filled: cn(
        'bg-neutral-100 dark:bg-neutral-800 border border-transparent',
        'text-foreground',
        'hover:bg-neutral-200 dark:hover:bg-neutral-700',
        'focus:bg-background focus:border-primary-red-500 focus:ring-primary-red-500',
        {
          'bg-error-50 dark:bg-error-900/20': error,
        }
      ),
      underlined: cn(
        'bg-transparent border-b-2 border-border',
        'text-foreground',
        'hover:border-primary-red-400 dark:hover:border-primary-red-500',
        'focus:border-primary-red-500 focus:ring-0',
        'rounded-none',
        {
          'border-error-500': error,
        }
      ),
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-5 py-3 text-lg',
    };

    const roundedClasses = {
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      full: 'rounded-full',
    };

    const iconSizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    };

    return (
      <div className={cn('relative', fullWidth ? 'w-full' : '', className)}>
        {label && (
          <label className={cn(
            'block text-sm font-medium mb-2',
            error ? 'text-error-600 dark:text-error-400' : 'text-foreground-muted'
          )}>
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className={cn(
              'absolute left-3 top-1/2 transform -translate-y-1/2',
              'text-foreground-muted pointer-events-none',
              iconSizeClasses[size]
            )}>
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            className={cn(
              baseClasses,
              variantClasses[variant],
              sizeClasses[size],
              rounded !== 'full' && roundedClasses[rounded],
              leftIcon ? 'pl-10' : '',
              rightIcon ? 'pr-10' : '',
              'peer'
            )}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={disabled}
            {...props}
          />
          
          {rightIcon && (
            <div className={cn(
              'absolute right-3 top-1/2 transform -translate-y-1/2',
              'text-foreground-muted pointer-events-none',
              iconSizeClasses[size]
            )}>
              {rightIcon}
            </div>
          )}
          
          {/* Focus indicator for underlined variant */}
          {variant === 'underlined' && isFocused && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-red-500 to-primary-gold-500 transform scale-x-100 transition-transform duration-200"></div>
          )}
        </div>
        
        {(error || helperText) && (
          <div className={cn(
            'mt-2 text-sm',
            error ? 'text-error-600 dark:text-error-400' : 'text-foreground-muted'
          )}>
            {error || helperText}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: 'default' | 'outline' | 'filled' | 'underlined';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  rows?: number;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    className, 
    variant = 'default', 
    size = 'md', 
    label, 
    error, 
    helperText,
    fullWidth = false,
    rows = 4,
    resize = 'vertical',
    disabled,
    ...props 
  }, ref) => {
    const baseClasses = cn(
      'transition-all duration-200 resize-none',
      'font-medium placeholder:text-foreground-muted',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-red-500',
      {
        'w-full': fullWidth,
        'resize-none': resize === 'none',
        'resize-y': resize === 'vertical',
        'resize-x': resize === 'horizontal',
        'resize': resize === 'both',
      }
    );

    const variantClasses = {
      default: cn(
        'bg-background border border-border',
        'text-foreground rounded-lg',
        'hover:border-primary-red-300 dark:hover:border-primary-red-600',
        {
          'border-error-500 focus:ring-error-500': error,
        }
      ),
      outline: cn(
        'bg-transparent border-2 border-border',
        'text-foreground rounded-lg',
        'hover:border-primary-red-400 dark:hover:border-primary-red-500',
        {
          'border-error-500 focus:ring-error-500': error,
        }
      ),
      filled: cn(
        'bg-neutral-100 dark:bg-neutral-800 border border-transparent',
        'text-foreground rounded-lg',
        'hover:bg-neutral-200 dark:hover:bg-neutral-700',
        {
          'bg-error-50 dark:bg-error-900/20': error,
        }
      ),
      underlined: cn(
        'bg-transparent border-b-2 border-border',
        'text-foreground rounded-none',
        'hover:border-primary-red-400 dark:hover:border-primary-red-500',
        {
          'border-error-500': error,
        }
      ),
    };

    const sizeClasses = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-3 text-base',
      lg: 'px-5 py-4 text-lg',
    };

    return (
      <div className={cn('relative', fullWidth ? 'w-full' : '', className)}>
        {label && (
          <label className={cn(
            'block text-sm font-medium mb-2',
            error ? 'text-error-600 dark:text-error-400' : 'text-foreground-muted'
          )}>
            {label}
          </label>
        )}
        
        <textarea
          ref={ref}
          rows={rows}
          className={cn(
            baseClasses,
            variantClasses[variant],
            sizeClasses[size]
          )}
          disabled={disabled}
          {...props}
        />
        
        {(error || helperText) && (
          <div className={cn(
            'mt-2 text-sm',
            error ? 'text-error-600 dark:text-error-400' : 'text-foreground-muted'
          )}>
            {error || helperText}
          </div>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  variant?: 'default' | 'outline' | 'filled' | 'underlined';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  error?: string;
  helperText?: string;
  options: Array<{
    value: string;
    label: string;
    disabled?: boolean;
  }>;
  placeholder?: string;
  fullWidth?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ 
    className, 
    variant = 'default', 
    size = 'md', 
    label, 
    error, 
    helperText,
    options,
    placeholder,
    fullWidth = false,
    disabled,
    ...props 
  }, ref) => {
    const baseClasses = cn(
      'transition-all duration-200',
      'font-medium',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-red-500',
      'appearance-none',
      'bg-no-repeat bg-right pr-8',
      'cursor-pointer',
      {
        'w-full': fullWidth,
      }
    );

    const variantClasses = {
      default: cn(
        'bg-background border border-border',
        'text-foreground rounded-lg',
        'hover:border-primary-red-300 dark:hover:border-primary-red-600',
        {
          'border-error-500 focus:ring-error-500': error,
        }
      ),
      outline: cn(
        'bg-transparent border-2 border-border',
        'text-foreground rounded-lg',
        'hover:border-primary-red-400 dark:hover:border-primary-red-500',
        {
          'border-error-500 focus:ring-error-500': error,
        }
      ),
      filled: cn(
        'bg-neutral-100 dark:bg-neutral-800 border border-transparent',
        'text-foreground rounded-lg',
        'hover:bg-neutral-200 dark:hover:bg-neutral-700',
        {
          'bg-error-50 dark:bg-error-900/20': error,
        }
      ),
      underlined: cn(
        'bg-transparent border-b-2 border-border',
        'text-foreground rounded-none',
        'hover:border-primary-red-400 dark:hover:border-primary-red-500',
        {
          'border-error-500': error,
        }
      ),
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm pl-3 pr-8',
      md: 'px-4 py-2 text-base pl-4 pr-10',
      lg: 'px-5 py-3 text-lg pl-5 pr-12',
    };

    const arrowIcon = (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );

    return (
      <div className={cn('relative', fullWidth ? 'w-full' : '', className)}>
        {label && (
          <label className={cn(
            'block text-sm font-medium mb-2',
            error ? 'text-error-600 dark:text-error-400' : 'text-foreground-muted'
          )}>
            {label}
          </label>
        )}
        
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              baseClasses,
              variantClasses[variant],
              sizeClasses[size],
              "bg-[url('data:image/svg+xml,%3csvg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 20 20\")%3ecpath stroke=\"%236b7280\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.5\" d=\"m6 8 4 4 4-4\"/%3e%3c/svg%3e')]"
            )}
            disabled={disabled}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>{placeholder}</option>
            )}
            {options.map((option) => (
              <option 
                key={option.value} 
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
          
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            {arrowIcon}
          </div>
        </div>
        
        {(error || helperText) && (
          <div className={cn(
            'mt-2 text-sm',
            error ? 'text-error-600 dark:text-error-400' : 'text-foreground-muted'
          )}>
            {error || helperText}
          </div>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';