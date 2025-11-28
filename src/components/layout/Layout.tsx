import React from 'react';
import { cn } from '../../utils/cn';

export interface LayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'centered' | 'full' | 'sidebar';
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  responsive?: boolean;
}

/**
 * 主要布局容器组件
 * Main Layout Container Component
 */
export const Layout: React.FC<LayoutProps> = ({ 
  className, 
  variant = 'default', 
  maxWidth = 'xl', 
  padding = 'md', 
  gap = 'md',
  responsive = true,
  children, 
  ...props 
}) => {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    full: 'max-w-none',
  };

  const paddingClasses = {
    none: '',
    sm: 'px-4 py-4',
    md: 'px-6 py-6',
    lg: 'px-8 py-8',
    xl: 'px-10 py-10',
  };

  const gapClasses = {
    none: '',
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-10',
  };

  const variantClasses = {
    default: cn(
      'min-h-screen',
      responsive ? 'mx-auto' : '',
      maxWidthClasses[maxWidth],
      paddingClasses[padding],
      gapClasses[gap]
    ),
    centered: cn(
      'min-h-screen flex items-center justify-center',
      responsive ? 'mx-auto' : '',
      maxWidthClasses[maxWidth],
      paddingClasses[padding],
      gapClasses[gap]
    ),
    full: cn(
      'min-h-screen w-full',
      paddingClasses[padding],
      gapClasses[gap]
    ),
    sidebar: cn(
      'min-h-screen flex',
      responsive ? 'mx-auto' : '',
      maxWidthClasses[maxWidth]
    ),
  };

  return (
    <div 
      className={cn(variantClasses[variant], className)} 
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * 头部导航组件
 * Header Navigation Component
 */
export interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'default' | 'sticky' | 'floating' | 'transparent';
  height?: 'sm' | 'md' | 'lg' | 'xl';
  border?: boolean;
  shadow?: boolean;
  blur?: boolean;
  container?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  className, 
  variant = 'default', 
  height = 'md', 
  border = true, 
  shadow = false, 
  blur = false,
  container = true,
  children, 
  ...props 
}) => {
  const heightClasses = {
    sm: 'h-12',
    md: 'h-16',
    lg: 'h-20',
    xl: 'h-24',
  };

  const variantClasses = {
    default: 'relative',
    sticky: 'sticky top-0 z-50',
    floating: 'fixed top-4 left-4 right-4 z-50 rounded-xl',
    transparent: 'absolute top-0 left-0 right-0 z-50',
  };

  const containerClasses = container ? 'px-4 sm:px-6 lg:px-8' : '';

  return (
    <header
      className={cn(
        'flex items-center',
        heightClasses[height],
        variantClasses[variant],
        border ? 'border-b border-border' : '',
        shadow ? 'shadow-md' : '',
        blur ? 'backdrop-blur-sm bg-background/80' : 'bg-background',
        containerClasses,
        className
      )}
      {...props}
    >
      {container ? (
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
          {children}
        </div>
      ) : (
        children
      )}
    </header>
  );
};

/**
 * 主要内容区域组件
 * Main Content Area Component
 */
export interface MainProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'default' | 'centered' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  container?: boolean;
}

export const Main: React.FC<MainProps> = ({ 
  className, 
  variant = 'default', 
  padding = 'md', 
  gap = 'md',
  container = true,
  children, 
  ...props 
}) => {
  const paddingClasses = {
    none: '',
    sm: 'py-4',
    md: 'py-6',
    lg: 'py-8',
    xl: 'py-10',
  };

  const gapClasses = {
    none: '',
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-10',
  };

  const variantClasses = {
    default: cn(
      'flex-1',
      paddingClasses[padding],
      gapClasses[gap]
    ),
    centered: cn(
      'flex-1 flex items-center justify-center',
      paddingClasses[padding],
      gapClasses[gap]
    ),
    full: cn(
      'flex-1 w-full',
      paddingClasses[padding],
      gapClasses[gap]
    ),
  };

  return (
    <main 
      className={cn(variantClasses[variant], className)} 
      {...props}
    >
      {container ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      ) : (
        children
      )}
    </main>
  );
};

/**
 * 侧边栏组件
 * Sidebar Component
 */
export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'default' | 'collapsible' | 'overlay';
  width?: 'sm' | 'md' | 'lg' | 'xl';
  position?: 'left' | 'right';
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  className, 
  variant = 'default', 
  width = 'md', 
  position = 'left',
  collapsed = false,
  onCollapse,
  children, 
  ...props 
}) => {
  const widthClasses = {
    sm: 'w-48',
    md: 'w-64',
    lg: 'w-80',
    xl: 'w-96',
  };

  const collapsedWidthClasses = {
    sm: 'w-12',
    md: 'w-16',
    lg: 'w-20',
    xl: 'w-24',
  };

  const positionClasses = position === 'left' ? 'order-first' : 'order-last';

  return (
    <aside
      className={cn(
        'flex-shrink-0 bg-background border-border',
        variant === 'collapsible' ? (collapsed ? collapsedWidthClasses[width] : widthClasses[width]) : widthClasses[width],
        position === 'left' ? 'border-r' : 'border-l',
        positionClasses,
        variant === 'overlay' ? 'fixed h-full z-40' : '',
        className
      )}
      {...props}
    >
      {children}
    </aside>
  );
};

/**
 * 底部组件
 * Footer Component
 */
export interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'default' | 'sticky' | 'floating';
  height?: 'sm' | 'md' | 'lg';
  border?: boolean;
  container?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ 
  className, 
  variant = 'default', 
  height = 'md', 
  border = true, 
  container = true,
  children, 
  ...props 
}) => {
  const heightClasses = {
    sm: 'h-12',
    md: 'h-16',
    lg: 'h-20',
  };

  const variantClasses = {
    default: 'relative',
    sticky: 'sticky bottom-0 z-40',
    floating: 'fixed bottom-4 left-4 right-4 z-40 rounded-xl',
  };

  const containerClasses = container ? 'px-4 sm:px-6 lg:px-8' : '';

  return (
    <footer
      className={cn(
        'flex items-center',
        heightClasses[height],
        variantClasses[variant],
        border ? 'border-t border-border' : '',
        'bg-background',
        containerClasses,
        className
      )}
      {...props}
    >
      {container ? (
        <div className="w-full max-w-7xl mx-auto">
          {children}
        </div>
      ) : (
        children
      )}
    </footer>
  );
};

/**
 * 网格布局组件
 * Grid Layout Component
 */
export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  responsive?: boolean;
  equalHeight?: boolean;
}

export const Grid: React.FC<GridProps> = ({ 
  className, 
  cols = 1, 
  gap = 'md', 
  responsive = true,
  equalHeight = false,
  children, 
  ...props 
}) => {
  const colsClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
    12: 'grid-cols-12',
  };

  const responsiveColsClasses = responsive ? {
    1: 'grid-cols-1',
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-2 lg:grid-cols-3',
    4: 'sm:grid-cols-2 lg:grid-cols-4',
    5: 'sm:grid-cols-3 lg:grid-cols-5',
    6: 'sm:grid-cols-3 lg:grid-cols-6',
    12: 'sm:grid-cols-6 lg:grid-cols-12',
  }[cols] : colsClasses[cols];

  const gapClasses = {
    none: '',
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-10',
  };

  return (
    <div 
      className={cn(
        'grid',
        responsiveColsClasses,
        gapClasses[gap],
        equalHeight ? 'items-stretch' : '',
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * 弹性布局组件
 * Flex Layout Component
 */
export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  wrap?: boolean;
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  responsive?: boolean;
}

export const Flex: React.FC<FlexProps> = ({ 
  className, 
  direction = 'row', 
  justify = 'start', 
  align = 'stretch', 
  wrap = false,
  gap = 'md', 
  responsive = true,
  children, 
  ...props 
}) => {
  const directionClasses = {
    row: 'flex-row',
    column: 'flex-col',
    'row-reverse': 'flex-row-reverse',
    'column-reverse': 'flex-col-reverse',
  };

  const responsiveDirectionClasses = responsive ? {
    row: 'flex-col sm:flex-row',
    column: 'flex-col',
    'row-reverse': 'flex-col-reverse sm:flex-row-reverse',
    'column-reverse': 'flex-col-reverse',
  }[direction] : directionClasses[direction];

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
    baseline: 'items-baseline',
  };

  const gapClasses = {
    none: '',
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-10',
  };

  return (
    <div 
      className={cn(
        'flex',
        responsiveDirectionClasses,
        justifyClasses[justify],
        alignClasses[align],
        wrap ? 'flex-wrap' : 'flex-nowrap',
        gapClasses[gap],
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * 容器组件
 * Container Component
 */
export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  centered?: boolean;
}

export const Container: React.FC<ContainerProps> = ({ 
  className, 
  size = 'xl', 
  padding = 'md', 
  centered = false,
  children, 
  ...props 
}) => {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-none',
  };

  const paddingClasses = {
    none: '',
    sm: 'px-4',
    md: 'px-6',
    lg: 'px-8',
    xl: 'px-10',
  };

  return (
    <div 
      className={cn(
        centered ? 'mx-auto' : '',
        sizeClasses[size],
        paddingClasses[padding],
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
};