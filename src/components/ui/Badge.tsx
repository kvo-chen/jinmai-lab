import React from 'react';
import { cn } from '../../utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  rounded?: 'sm' | 'md' | 'lg' | 'full';
  dot?: boolean;
  pulse?: boolean;
  icon?: React.ReactNode;
  closable?: boolean;
  onClose?: () => void;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ 
    className, 
    variant = 'neutral', 
    size = 'md', 
    rounded = 'full',
    dot = false,
    pulse = false,
    icon,
    closable = false,
    onClose,
    children, 
    ...props 
  }, ref) => {
    
    const baseClasses = cn(
      'inline-flex items-center justify-center',
      'font-medium transition-all duration-200',
      'select-none'
    );

    const variantClasses = {
      primary: cn(
        'bg-primary-red-100 text-primary-red-800',
        'dark:bg-primary-red-900 dark:text-primary-red-200',
        'border border-primary-red-200 dark:border-primary-red-800'
      ),
      secondary: cn(
        'bg-primary-gold-100 text-primary-gold-800',
        'dark:bg-primary-gold-900 dark:text-primary-gold-200',
        'border border-primary-gold-200 dark:border-primary-gold-800'
      ),
      success: cn(
        'bg-success-100 text-success-800',
        'dark:bg-success-900 dark:text-success-200',
        'border border-success-200 dark:border-success-800'
      ),
      warning: cn(
        'bg-warning-100 text-warning-800',
        'dark:bg-warning-900 dark:text-warning-200',
        'border border-warning-200 dark:border-warning-800'
      ),
      error: cn(
        'bg-error-100 text-error-800',
        'dark:bg-error-900 dark:text-error-200',
        'border border-error-200 dark:border-error-800'
      ),
      info: cn(
        'bg-info-100 text-info-800',
        'dark:bg-info-900 dark:text-info-200',
        'border border-info-200 dark:border-info-800'
      ),
      neutral: cn(
        'bg-neutral-100 text-neutral-800',
        'dark:bg-neutral-800 dark:text-neutral-200',
        'border border-neutral-200 dark:border-neutral-700'
      ),
      outline: cn(
        'bg-transparent border-2',
        'border-neutral-300 text-neutral-700',
        'dark:border-neutral-600 dark:text-neutral-300'
      ),
    };

    const sizeClasses = {
      sm: cn(
        'px-2 py-0.5 text-xs',
        'gap-1',
        dot ? 'pl-1.5' : ''
      ),
      md: cn(
        'px-2.5 py-1 text-sm',
        'gap-1.5',
        dot ? 'pl-2' : ''
      ),
      lg: cn(
        'px-3 py-1.5 text-sm',
        'gap-2',
        dot ? 'pl-2.5' : ''
      ),
    };

    const roundedClasses = {
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      full: 'rounded-full',
    };

    const dotClasses = {
      sm: 'w-1.5 h-1.5',
      md: 'w-2 h-2',
      lg: 'w-2.5 h-2.5',
    };

    const pulseClasses = pulse ? cn(
      'animate-pulse',
      'ring-2 ring-current ring-opacity-20'
    ) : '';

    const closeIconSize = {
      sm: 'w-3 h-3',
      md: 'w-3.5 h-3.5',
      lg: 'w-4 h-4',
    };

    const closeIcon = (
      <svg 
        className={cn(closeIconSize[size], 'ml-1 cursor-pointer hover:opacity-70')} 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
        onClick={onClose}
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    );

    return (
      <span
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          roundedClasses[rounded],
          pulseClasses,
          className
        )}
        {...props}
      >
        {dot && (
          <span className={cn(
            dotClasses[size],
            'rounded-full bg-current',
            pulse ? 'animate-ping' : ''
          )}></span>
        )}
        
        {icon && !dot && (
          <span className={cn(
            'flex items-center justify-center',
            size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-3.5 h-3.5' : 'w-4 h-4'
          )}>
            {icon}
          </span>
        )}
        
        {children}
        
        {closable && closeIcon}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export interface BadgeGroupProps {
  children: React.ReactNode;
  spacing?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const BadgeGroup: React.FC<BadgeGroupProps> = ({ 
  children, 
  spacing = 'md',
  className 
}) => {
  const spacingClasses = {
    sm: 'gap-1',
    md: 'gap-2',
    lg: 'gap-3',
  };

  return (
    <div className={cn('flex flex-wrap items-center', spacingClasses[spacing], className)}>
      {React.Children.map(children, (child, index) => (
        <div key={index} className="flex-shrink-0">
          {child}
        </div>
      ))}
    </div>
  );
};

export interface StatusBadgeProps extends Omit<BadgeProps, 'variant' | 'dot'> {
  status: 'online' | 'offline' | 'busy' | 'away' | 'pending';
  showText?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status,
  showText = true,
  children,
  ...props 
}) => {
  const statusConfig = {
    online: { color: 'success', text: '在线' },
    offline: { color: 'neutral', text: '离线' },
    busy: { color: 'warning', text: '忙碌' },
    away: { color: 'warning', text: '离开' },
    pending: { color: 'info', text: '等待中' },
  };

  const config = statusConfig[status];

  return (
    <Badge 
      variant={config.color as any} 
      dot={!showText}
      {...props}
    >
      {showText ? (children || config.text) : ''}
    </Badge>
  );
};

export interface CountBadgeProps extends Omit<BadgeProps, 'variant' | 'children'> {
  count: number;
  max?: number;
  showZero?: boolean;
}

export const CountBadge: React.FC<CountBadgeProps> = ({ 
  count,
  max = 99,
  showZero = false,
  ...props 
}) => {
  if (!showZero && count === 0) {
    return null;
  }

  const displayCount = count > max ? `${max}+` : count.toString();

  return (
    <Badge variant="error" {...props}>
      {displayCount}
    </Badge>
  );
};