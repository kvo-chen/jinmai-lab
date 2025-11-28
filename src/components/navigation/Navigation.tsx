import React, { useState, useEffect } from 'react';
import { cn } from '../../utils/cn';
import { IconButton } from '../ui/Button';

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  badge?: string | number;
  children?: NavigationItem[];
}

export interface NavigationProps extends React.HTMLAttributes<HTMLElement> {
  items: NavigationItem[];
  variant?: 'horizontal' | 'vertical' | 'pills' | 'tabs';
  size?: 'sm' | 'md' | 'lg';
  align?: 'start' | 'center' | 'end';
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  showIcons?: boolean;
  showLabels?: boolean;
  mobileBreakpoint?: number;
  onItemClick?: (item: NavigationItem) => void;
}

/**
 * 导航组件
 * Navigation Component with multiple variants
 */
export const Navigation: React.FC<NavigationProps> = ({ 
  className, 
  items, 
  variant = 'horizontal', 
  size = 'md', 
  align = 'start', 
  collapsible = false,
  defaultCollapsed = false,
  showIcons = true,
  showLabels = true,
  mobileBreakpoint = 768,
  onItemClick,
  ...props 
}) => {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [isMobile, setIsMobile] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < mobileBreakpoint);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, [mobileBreakpoint]);

  const handleItemClick = (item: NavigationItem) => {
    if (item.disabled) return;
    
    setActiveItem(item.id);
    onItemClick?.(item);
  };

  const sizeClasses = {
    sm: 'text-sm gap-1',
    md: 'text-base gap-2',
    lg: 'text-lg gap-3',
  };

  const alignClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
  };

  const baseClasses = cn(
    'flex',
    variant === 'vertical' || variant === 'pills' ? 'flex-col' : 'flex-row',
    sizeClasses[size],
    alignClasses[align],
    className
  );

  const renderNavItem = (item: NavigationItem, depth = 0) => {
    const isActive = activeItem === item.id || item.active;
    const hasChildren = item.children && item.children.length > 0;

    const itemClasses = cn(
      'flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200',
      'hover:bg-neutral-100 dark:hover:bg-neutral-800',
      'focus:outline-none focus:ring-2 focus:ring-primary-red-500 focus:ring-offset-1',
      {
        'bg-primary-red-100 text-primary-red-700 dark:bg-primary-red-900 dark:text-primary-red-200': isActive && variant !== 'tabs',
        'border-b-2 border-primary-red-600 text-primary-red-600': isActive && variant === 'tabs',
        'opacity-50 cursor-not-allowed': item.disabled,
        'pl-6': depth > 0,
        'justify-center': collapsed && !isMobile,
      }
    );

    const iconClasses = cn(
      'flex-shrink-0',
      {
        'w-4 h-4': size === 'sm',
        'w-5 h-5': size === 'md',
        'w-6 h-6': size === 'lg',
        'hidden': !showIcons || !item.icon,
      }
    );

    const labelClasses = cn(
      'flex-1 text-left truncate',
      {
        'hidden': collapsed && !isMobile && !showLabels,
      }
    );

    return (
      <div key={item.id} className="relative">
        <button
          className={itemClasses}
          onClick={() => handleItemClick(item)}
          disabled={item.disabled}
          aria-current={isActive ? 'page' : undefined}
        >
          {item.icon && <span className={iconClasses}>{item.icon}</span>}
          {showLabels && <span className={labelClasses}>{item.label}</span>}
          {item.badge && (
            <span className={cn(
              'flex-shrink-0 px-2 py-0.5 text-xs font-medium rounded-full',
              'bg-primary-red-100 text-primary-red-700 dark:bg-primary-red-900 dark:text-primary-red-200'
            )}>
              {item.badge}
            </span>
          )}
        </button>
        
        {hasChildren && (
          <div className={cn(
            'ml-4 mt-1 space-y-1',
            {
              'hidden': collapsed && !isMobile,
            }
          )}>
            {item.children!.map((child) => renderNavItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <nav className={baseClasses} {...props}>
      {collapsible && !isMobile && (
        <div className="mb-4">
          <IconButton
            icon={collapsed ? '→' : '←'}
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            tooltip={collapsed ? '展开菜单' : '收起菜单'}
          />
        </div>
      )}
      
      <div className={cn(
        'space-y-1',
        {
          'w-full': variant === 'vertical' || variant === 'pills',
        }
      )}>
        {items.map((item) => renderNavItem(item))}
      </div>
    </nav>
  );
};

/**
 * 面包屑导航组件
 * Breadcrumb Navigation Component
 */
export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  showHome?: boolean;
  onItemClick?: (item: BreadcrumbItem, index: number) => void;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ 
  className, 
  items, 
  separator = '/', 
  size = 'md', 
  showHome = true,
  onItemClick,
  ...props 
}) => {
  const sizeClasses = {
    sm: 'text-sm gap-1',
    md: 'text-base gap-2',
    lg: 'text-lg gap-3',
  };

  const handleItemClick = (item: BreadcrumbItem, index: number) => {
    onItemClick?.(item, index);
  };

  return (
    <nav 
      className={cn(
        'flex items-center',
        sizeClasses[size],
        className
      )} 
      aria-label="面包屑导航"
      {...props}
    >
      {showHome && (
        <>
          <BreadcrumbItem 
            item={{ label: '首页', href: '/' }} 
            onClick={() => handleItemClick({ label: '首页', href: '/' }, 0)}
          />
          {items.length > 0 && (
            <BreadcrumbSeparator separator={separator} />
          )}
        </>
      )}
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <BreadcrumbItem 
            item={item} 
            isLast={index === items.length - 1}
            onClick={() => handleItemClick(item, index)}
          />
          {index < items.length - 1 && (
            <BreadcrumbSeparator separator={separator} />
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

interface BreadcrumbItemProps {
  item: BreadcrumbItem;
  isLast?: boolean;
  onClick?: () => void;
}

const BreadcrumbItem: React.FC<BreadcrumbItemProps> = ({ 
  item, 
  isLast = false,
  onClick 
}) => {
  const baseClasses = cn(
    'flex items-center gap-1 hover:text-primary-red-600 transition-colors',
    {
      'text-foreground font-medium': isLast,
      'text-foreground-muted': !isLast,
    }
  );

  if (item.href) {
    return (
      <a href={item.href} className={baseClasses} onClick={onClick}>
        {item.icon && <span className="w-4 h-4">{item.icon}</span>}
        <span>{item.label}</span>
      </a>
    );
  }

  return (
    <span className={baseClasses} onClick={onClick}>
      {item.icon && <span className="w-4 h-4">{item.icon}</span>}
      <span>{item.label}</span>
    </span>
  );
};

interface BreadcrumbSeparatorProps {
  separator: React.ReactNode;
}

const BreadcrumbSeparator: React.FC<BreadcrumbSeparatorProps> = ({ separator }) => {
  return (
    <span className="text-foreground-muted mx-2">
      {separator}
    </span>
  );
};

/**
 * 分页导航组件
 * Pagination Navigation Component
 */
export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  showEllipsis?: boolean;
  maxButtons?: number;
  size?: 'sm' | 'md' | 'lg';
}

export const Pagination: React.FC<PaginationProps> = ({ 
  className, 
  currentPage, 
  totalPages, 
  onPageChange,
  showFirstLast = true,
  showPrevNext = true,
  showEllipsis = true,
  maxButtons = 5,
  size = 'md',
  ...props 
}) => {
  const sizeClasses = {
    sm: 'gap-1',
    md: 'gap-2',
    lg: 'gap-3',
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const half = Math.floor(maxButtons / 2);
    
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, currentPage + half);
    
    if (currentPage <= half) {
      end = Math.min(totalPages, maxButtons);
    }
    
    if (currentPage + half >= totalPages) {
      start = Math.max(1, totalPages - maxButtons + 1);
    }
    
    if (showFirstLast && start > 1) {
      pages.push(1);
      if (start > 2 && showEllipsis) {
        pages.push('...');
      }
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    if (showFirstLast && end < totalPages) {
      if (end < totalPages - 1 && showEllipsis) {
        pages.push('...');
      }
      pages.push(totalPages);
    }
    
    return pages;
  };

  const handlePageClick = (page: number | string) => {
    if (typeof page === 'number') {
      onPageChange(page);
    }
  };

  const pages = getPageNumbers();

  return (
    <nav 
      className={cn(
        'flex items-center justify-center',
        sizeClasses[size],
        className
      )} 
      {...props}
    >
      {showFirstLast && (
        <PaginationButton
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          size={size}
        >
          首页
        </PaginationButton>
      )}
      
      {showPrevNext && (
        <PaginationButton
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          size={size}
        >
          上一页
        </PaginationButton>
      )}
      
      {pages.map((page, index) => (
        <PaginationButton
          key={index}
          onClick={() => handlePageClick(page)}
          active={page === currentPage}
          disabled={page === '...'}
          size={size}
        >
          {page}
        </PaginationButton>
      ))}
      
      {showPrevNext && (
        <PaginationButton
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          size={size}
        >
          下一页
        </PaginationButton>
      )}
      
      {showFirstLast && (
        <PaginationButton
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          size={size}
        >
          末页
        </PaginationButton>
      )}
    </nav>
  );
};

interface PaginationButtonProps {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  size: 'sm' | 'md' | 'lg';
}

const PaginationButton: React.FC<PaginationButtonProps> = ({ 
  children, 
  active = false, 
  disabled = false, 
  onClick,
  size 
}) => {
  const sizeClasses = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-3 py-2 text-base',
    lg: 'px-4 py-3 text-lg',
  };

  const baseClasses = cn(
    'inline-flex items-center justify-center font-medium transition-all duration-200',
    'border border-border rounded-md',
    'focus:outline-none focus:ring-2 focus:ring-primary-red-500 focus:ring-offset-1',
    sizeClasses[size],
    {
      'bg-primary-red-600 text-white border-primary-red-600 hover:bg-primary-red-700': active,
      'bg-background text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800': !active && !disabled,
      'opacity-50 cursor-not-allowed': disabled,
    }
  );

  return (
    <button
      className={baseClasses}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

/**
 * 步骤导航组件
 * Step Navigation Component
 */
export interface StepItem {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  completed?: boolean;
}

export interface StepNavigationProps extends React.HTMLAttributes<HTMLElement> {
  steps: StepItem[];
  currentStep: number;
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  showDescriptions?: boolean;
  onStepClick?: (step: number) => void;
}

export const StepNavigation: React.FC<StepNavigationProps> = ({ 
  className, 
  steps, 
  currentStep, 
  orientation = 'horizontal', 
  size = 'md', 
  showDescriptions = true,
  onStepClick,
  ...props 
}) => {
  const sizeClasses = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
  };

  const baseClasses = cn(
    'flex',
    orientation === 'horizontal' ? 'flex-row items-center' : 'flex-col',
    sizeClasses[size],
    className
  );

  const handleStepClick = (stepIndex: number) => {
    if (stepIndex <= currentStep || steps[stepIndex].completed) {
      onStepClick?.(stepIndex);
    }
  };

  return (
    <nav className={baseClasses} {...props}>
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <StepItem
            step={step}
            index={index}
            currentStep={currentStep}
            size={size}
            showDescription={showDescriptions}
            onClick={() => handleStepClick(index)}
            clickable={index <= currentStep || step.completed}
          />
          {index < steps.length - 1 && (
            <StepConnector
              orientation={orientation}
              completed={index < currentStep}
              size={size}
            />
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

interface StepItemProps {
  step: StepItem;
  index: number;
  currentStep: number;
  size: 'sm' | 'md' | 'lg';
  showDescription: boolean;
  onClick: () => void;
  clickable?: boolean;
}

const StepItem: React.FC<StepItemProps> = ({ 
  step, 
  index, 
  currentStep, 
  size, 
  showDescription, 
  onClick,
  clickable 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
  };

  const isActive = index === currentStep;
  const isCompleted = index < currentStep || step.completed;

  const baseClasses = cn(
    'flex items-center justify-center rounded-full font-semibold transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-primary-red-500 focus:ring-offset-2',
    sizeClasses[size],
    {
      'bg-primary-red-600 text-white': isActive,
      'bg-success-600 text-white': isCompleted && !isActive,
      'bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-400': !isActive && !isCompleted,
      'cursor-pointer hover:scale-110': clickable,
      'cursor-not-allowed': !clickable,
    }
  );

  return (
    <div className="flex flex-col items-center gap-2">
      <button className={baseClasses} onClick={onClick}>
        {step.icon || index + 1}
      </button>
      <div className="text-center">
        <div className={cn(
          'font-medium',
          {
            'text-primary-red-600': isActive,
            'text-success-600': isCompleted && !isActive,
            'text-foreground': !isActive && !isCompleted,
          }
        )}>
          {step.label}
        </div>
        {showDescription && step.description && (
          <div className="text-sm text-foreground-muted mt-1">
            {step.description}
          </div>
        )}
      </div>
    </div>
  );
};

interface StepConnectorProps {
  orientation: 'horizontal' | 'vertical';
  completed: boolean;
  size: 'sm' | 'md' | 'lg';
}

const StepConnector: React.FC<StepConnectorProps> = ({ 
  orientation, 
  completed, 
  size 
}) => {
  const sizeClasses = {
    sm: orientation === 'horizontal' ? 'w-8' : 'h-8',
    md: orientation === 'horizontal' ? 'w-12' : 'h-12',
    lg: orientation === 'horizontal' ? 'w-16' : 'h-16',
  };

  const baseClasses = cn(
    'flex-auto',
    sizeClasses[size],
    {
      'border-t-2': orientation === 'horizontal',
      'border-l-2': orientation === 'vertical',
      'border-success-600': completed,
      'border-neutral-200 dark:border-neutral-700': !completed,
    }
  );

  return <div className={baseClasses} />;
};