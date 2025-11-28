import React from 'react';
import { cn } from '../../utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'elevated' | 'gradient';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  shadow?: 'sm' | 'md' | 'lg' | 'xl' | 'none';
  interactive?: boolean;
  hover?: boolean;
  gradient?: 'primary' | 'secondary' | 'subtle';
  borderColor?: 'default' | 'primary' | 'secondary' | 'accent';
}

/**
 * 统一卡片组件
 * Unified Card Component with multiple variants
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ 
    className, 
    variant = 'default', 
    padding = 'md', 
    rounded = 'lg', 
    shadow = 'md',
    interactive = false,
    hover = false,
    gradient,
    borderColor = 'default',
    children, 
    ...props 
  }, ref) => {
    
    const baseClasses = cn(
      'relative transition-all duration-200',
      'overflow-hidden',
      {
        'cursor-pointer': interactive,
        'hover:scale-105 hover:shadow-lg': hover,
        'hover:shadow-xl': interactive && shadow !== 'none',
      }
    );

    const variantClasses = {
      default: cn(
        'bg-background-card',
        'text-foreground'
      ),
      outlined: cn(
        'bg-background-card',
        'text-foreground',
        'border-2'
      ),
      elevated: cn(
        'bg-background-card',
        'text-foreground',
        'shadow-lg'
      ),
      gradient: cn(
        'text-white'
      ),
    };

    const paddingClasses = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
      xl: 'p-10',
    };

    const roundedClasses = {
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      full: 'rounded-full',
    };

    const shadowClasses = {
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg',
      xl: 'shadow-xl',
      none: 'shadow-none',
    };

    const gradientClasses = {
      primary: 'bg-gradient-to-br from-primary-red-600 to-primary-gold-600',
      secondary: 'bg-gradient-to-br from-primary-gold-600 to-primary-red-600',
      subtle: 'bg-gradient-to-br from-primary-red-50 to-primary-gold-50',
    };

    const borderColorClasses = {
      default: 'border-border',
      primary: 'border-primary-red-200 dark:border-primary-red-800',
      secondary: 'border-primary-gold-200 dark:border-primary-gold-800',
      accent: 'border-primary-red-300 dark:border-primary-gold-300',
    };

    return (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          paddingClasses[padding],
          roundedClasses[rounded],
          shadowClasses[shadow],
          gradient && gradientClasses[gradient],
          borderColor !== 'default' && borderColorClasses[borderColor],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

/**
 * 卡片头部组件
 * Card Header Component
 */
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  avatar?: React.ReactNode;
  divider?: boolean;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ 
  className, 
  title, 
  subtitle, 
  action, 
  avatar,
  divider = false,
  children,
  ...props 
}) => {
  return (
    <div className={cn('flex items-center justify-between', className)} {...props}>
      <div className="flex items-center gap-4 flex-1">
        {avatar && (
          <div className="flex-shrink-0">
            {avatar}
          </div>
        )}
        <div className="flex-1 min-w-0">
          {title && (
            <h3 className="text-lg font-semibold text-foreground truncate">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-foreground-muted mt-1">
              {subtitle}
            </p>
          )}
          {children}
        </div>
      </div>
      {action && (
        <div className="flex-shrink-0 ml-4">
          {action}
        </div>
      )}
      {divider && (
        <div className="absolute bottom-0 left-0 right-0 h-px bg-border"></div>
      )}
    </div>
  );
};

/**
 * 卡片内容组件
 * Card Content Component
 */
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  compact?: boolean;
}

export const CardContent: React.FC<CardContentProps> = ({ 
  className, 
  compact = false,
  children, 
  ...props 
}) => {
  return (
    <div 
      className={cn(
        'text-foreground',
        compact ? 'space-y-2' : 'space-y-4',
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * 卡片底部组件
 * Card Footer Component
 */
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  justify?: 'start' | 'center' | 'end' | 'between';
  divider?: boolean;
}

export const CardFooter: React.FC<CardFooterProps> = ({ 
  className, 
  justify = 'end',
  divider = false,
  children, 
  ...props 
}) => {
  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
  };

  return (
    <div 
      className={cn(
        'flex items-center gap-2',
        justifyClasses[justify],
        divider ? 'pt-4 border-t border-border' : 'pt-4',
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * 卡片媒体组件
 * Card Media Component for images/videos
 */
export interface CardMediaProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  aspectRatio?: '16:9' | '4:3' | '1:1' | '3:4';
  objectFit?: 'cover' | 'contain' | 'fill';
  rounded?: boolean;
}

export const CardMedia: React.FC<CardMediaProps> = ({ 
  className, 
  aspectRatio = '16:9',
  objectFit = 'cover',
  rounded = true,
  ...props 
}) => {
  const aspectRatioClasses = {
    '16:9': 'aspect-video',
    '4:3': 'aspect-[4/3]',
    '1:1': 'aspect-square',
    '3:4': 'aspect-[3/4]',
  };

  const objectFitClasses = {
    cover: 'object-cover',
    contain: 'object-contain',
    fill: 'object-fill',
  };

  return (
    <div className={cn(
      'overflow-hidden',
      aspectRatioClasses[aspectRatio],
      rounded ? 'rounded-lg' : ''
    )}>
      <img
        className={cn(
          'w-full h-full',
          objectFitClasses[objectFit],
          className
        )}
        {...props}
      />
    </div>
  );
};

/**
 * 卡片徽章组件
 * Card Badge Component for status indicators
 */
export interface CardBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  rounded?: 'sm' | 'md' | 'lg' | 'full';
}

export const CardBadge: React.FC<CardBadgeProps> = ({ 
  className, 
  variant = 'neutral', 
  size = 'md',
  rounded = 'full',
  children, 
  ...props 
}) => {
  const variantClasses = {
    primary: 'bg-primary-red-100 text-primary-red-800 dark:bg-primary-red-900 dark:text-primary-red-200',
    secondary: 'bg-primary-gold-100 text-primary-gold-800 dark:bg-primary-gold-900 dark:text-primary-gold-200',
    success: 'bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200',
    warning: 'bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-200',
    error: 'bg-error-100 text-error-800 dark:bg-error-900 dark:text-error-200',
    neutral: 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-sm',
  };

  const roundedClasses = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium',
        variantClasses[variant],
        sizeClasses[size],
        roundedClasses[rounded],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

/**
 * 骨架屏卡片组件
 * Card Skeleton Component for loading states
 */
export interface CardSkeletonProps {
  lines?: number;
  hasImage?: boolean;
  hasHeader?: boolean;
  hasActions?: boolean;
  className?: string;
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({ 
  lines = 3, 
  hasImage = false, 
  hasHeader = true,
  hasActions = false,
  className 
}) => {
  return (
    <Card className={cn('animate-pulse', className)}>
      {hasHeader && (
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-neutral-200 dark:bg-neutral-700 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2"></div>
            </div>
          </div>
        </CardHeader>
      )}
      
      <CardContent>
        {hasImage && (
          <div className="aspect-video bg-neutral-200 dark:bg-neutral-700 rounded-lg mb-4"></div>
        )}
        
        <div className="space-y-3">
          {Array.from({ length: lines }).map((_, index) => (
            <div 
              key={index} 
              className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded"
              style={{ width: `${Math.random() * 40 + 60}%` }}
            ></div>
          ))}
        </div>
      </CardContent>
      
      {hasActions && (
        <CardFooter>
          <div className="flex gap-2">
            <div className="h-8 w-20 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
            <div className="h-8 w-20 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};