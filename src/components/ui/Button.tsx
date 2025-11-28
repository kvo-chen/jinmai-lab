import React from 'react';
import { cn } from '../../utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  gradient?: boolean;
}

/**
 * 统一按钮组件
 * Unified Button Component with multiple variants and sizes
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    isLoading = false, 
    loadingText,
    icon,
    iconPosition = 'left',
    fullWidth = false,
    rounded = 'lg',
    gradient = false,
    children, 
    disabled,
    ...props 
  }, ref) => {
    
    const baseClasses = cn(
      'inline-flex items-center justify-center font-medium transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'active:scale-95 transform',
      {
        'w-full': fullWidth,
        'rounded-sm': rounded === 'sm',
        'rounded-md': rounded === 'md',
        'rounded-lg': rounded === 'lg',
        'rounded-xl': rounded === 'xl',
        'rounded-full': rounded === 'full',
      }
    );

    const variantClasses = {
      primary: cn(
        'bg-primary-red-600 text-white hover:bg-primary-red-700',
        'focus:ring-primary-red-500',
        'shadow-md hover:shadow-lg',
        {
          'bg-gradient-to-r from-primary-red-600 to-primary-gold-600 hover:from-primary-red-700 hover:to-primary-gold-700': gradient
        }
      ),
      secondary: cn(
        'bg-primary-gold-600 text-white hover:bg-primary-gold-700',
        'focus:ring-primary-gold-500',
        'shadow-md hover:shadow-lg',
        {
          'bg-gradient-to-r from-primary-gold-600 to-primary-red-600 hover:from-primary-gold-700 hover:to-primary-red-700': gradient
        }
      ),
      outline: cn(
        'bg-transparent border-2 border-primary-red-600 text-primary-red-600 hover:bg-primary-red-50',
        'focus:ring-primary-red-500',
        'dark:border-primary-red-400 dark:text-primary-red-400 dark:hover:bg-primary-red-900/20'
      ),
      ghost: cn(
        'bg-transparent text-neutral-700 hover:bg-neutral-100',
        'focus:ring-neutral-500',
        'dark:text-neutral-300 dark:hover:bg-neutral-800'
      ),
      danger: cn(
        'bg-error-600 text-white hover:bg-error-700',
        'focus:ring-error-500',
        'shadow-md hover:shadow-lg'
      ),
      success: cn(
        'bg-success-600 text-white hover:bg-success-700',
        'focus:ring-success-500',
        'shadow-md hover:shadow-lg'
      ),
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm gap-1.5',
      md: 'px-4 py-2 text-base gap-2',
      lg: 'px-6 py-3 text-lg gap-2',
      xl: 'px-8 py-4 text-xl gap-3',
    };

    const iconSizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
      xl: 'w-7 h-7',
    };

    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        disabled={isDisabled}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className={cn(
                'animate-spin',
                iconSizeClasses[size],
                loadingText ? 'mr-2' : ''
              )}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {loadingText || children}
          </>
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <span className={cn(iconSizeClasses[size], 'flex-shrink-0')}>
                {icon}
              </span>
            )}
            {children}
            {icon && iconPosition === 'right' && (
              <span className={cn(iconSizeClasses[size], 'flex-shrink-0')}>
                {icon}
              </span>
            )}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

/**
 * 图标按钮组件
 * Icon Button Component for compact actions
 */
export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  tooltip?: string;
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ 
    className, 
    icon, 
    variant = 'ghost', 
    size = 'md',
    isLoading = false,
    tooltip,
    rounded = 'full',
    ...props 
  }, ref) => {
    
    const sizeClasses = {
      sm: 'w-8 h-8',
      md: 'w-10 h-10',
      lg: 'w-12 h-12',
    };

    const iconSizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    };

    return (
      <div className="relative group">
        <Button
          ref={ref}
          variant={variant}
          size={size}
          isLoading={isLoading}
          className={cn(
            sizeClasses[size],
            'p-0',
            {
              'rounded-sm': rounded === 'sm',
              'rounded-md': rounded === 'md',
              'rounded-lg': rounded === 'lg',
              'rounded-xl': rounded === 'xl',
              'rounded-full': rounded === 'full',
            },
            className
          )}
          {...props}
        >
          {!isLoading && (
            <span className={iconSizeClasses[size]}>
              {icon}
            </span>
          )}
        </Button>
        {tooltip && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-neutral-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
            {tooltip}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-neutral-800"></div>
          </div>
        )}
      </div>
    );
  }
);

IconButton.displayName = 'IconButton';

/**
 * 按钮组组件
 * Button Group Component for related actions
 */
export interface ButtonGroupProps {
  children: React.ReactNode;
  variant?: 'horizontal' | 'vertical';
  spacing?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({ 
  children, 
  variant = 'horizontal', 
  spacing = 'md',
  className 
}) => {
  const spacingClasses = {
    sm: 'gap-1',
    md: 'gap-2',
    lg: 'gap-3',
  };

  const baseClasses = cn(
    'flex',
    {
      'flex-row': variant === 'horizontal',
      'flex-col': variant === 'vertical',
    },
    spacingClasses[spacing],
    className
  );

  return (
    <div className={baseClasses}>
      {React.Children.map(children, (child, index) => (
        <div key={index} className="flex-shrink-0">
          {child}
        </div>
      ))}
    </div>
  );
};

/**
 * 浮动操作按钮
 * Floating Action Button for primary actions
 */
export interface FabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  variant?: 'primary' | 'secondary';
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  tooltip?: string;
}

export const Fab = React.forwardRef<HTMLButtonElement, FabProps>(
  ({ 
    className, 
    icon, 
    variant = 'primary',
    position = 'bottom-right',
    tooltip,
    ...props 
  }, ref) => {
    
    const positionClasses = {
      'bottom-right': 'bottom-6 right-6',
      'bottom-left': 'bottom-6 left-6',
      'top-right': 'top-6 right-6',
      'top-left': 'top-6 left-6',
    };

    return (
      <div className={`fixed ${positionClasses[position]} z-50`}>
        <IconButton
          ref={ref}
          icon={icon}
          variant={variant}
          size="lg"
          tooltip={tooltip}
          className={cn(
            'shadow-lg hover:shadow-xl',
            'transform hover:scale-110 active:scale-95',
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

Fab.displayName = 'Fab';