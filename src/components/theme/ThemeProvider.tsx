import React, { createContext, useContext, useEffect, useState } from 'react';
import { cn } from '../../utils/cn';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  enableSystem?: boolean;
}

interface ThemeProviderState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
  resolvedTheme: 'light',
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

/**
 * 主题提供者组件
 * Theme Provider Component for managing light/dark mode
 */
export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'jinmai-theme',
  enableSystem = true,
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system' && enableSystem) {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
      root.setAttribute('data-theme', systemTheme);
      setResolvedTheme(systemTheme);
    } else {
      root.classList.add(theme);
      root.setAttribute('data-theme', theme);
      setResolvedTheme(theme as 'light' | 'dark');
    }
  }, [theme, enableSystem]);

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      localStorage.setItem(storageKey, newTheme);
      setTheme(newTheme);
    },
    resolvedTheme,
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

/**
 * 主题钩子
 * Theme Hook for accessing theme state
 */
export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};

/**
 * 主题切换按钮
 * Theme Toggle Button Component
 */
export interface ThemeToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'icon' | 'button' | 'switch';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function ThemeToggle({ 
  className, 
  variant = 'icon', 
  size = 'md',
  showLabel = false,
  ...props 
}: ThemeToggleProps) {
  const { setTheme, resolvedTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
  };

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

  const SunIcon = () => (
    <svg
      className={iconSizeClasses[size]}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  );

  const MoonIcon = () => (
    <svg
      className={iconSizeClasses[size]}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>
  );

  if (variant === 'switch') {
    return (
      <button
        onClick={toggleTheme}
        className={cn(
          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
          resolvedTheme === 'dark' ? 'bg-primary-red-600' : 'bg-neutral-300 dark:bg-neutral-600',
          className
        )}
        {...props}
      >
        <span
          className={cn(
            'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
            resolvedTheme === 'dark' ? 'translate-x-6' : 'translate-x-1'
          )}
        />
      </button>
    );
  }

  if (variant === 'button') {
    return (
      <button
        onClick={toggleTheme}
        className={cn(
          'inline-flex items-center gap-2 px-4 py-2 rounded-lg',
          'bg-background-card border border-border',
          'hover:bg-neutral-50 dark:hover:bg-neutral-800',
          'transition-colors duration-200',
          className
        )}
        {...props}
      >
        {resolvedTheme === 'light' ? <MoonIcon /> : <SunIcon />}
        {showLabel && (
          <span className="text-sm font-medium">
            {resolvedTheme === 'light' ? '深色模式' : '浅色模式'}
          </span>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'inline-flex items-center justify-center rounded-full',
        'bg-background-card border border-border',
        'hover:bg-neutral-50 dark:hover:bg-neutral-800',
        'transition-all duration-200 hover:scale-110',
        sizeClasses[size],
        className
      )}
      aria-label={resolvedTheme === 'light' ? '切换到深色模式' : '切换到浅色模式'}
      {...props}
    >
      {resolvedTheme === 'light' ? <MoonIcon /> : <SunIcon />}
    </button>
  );
}

/**
 * 主题感知组件
 * Theme-aware component wrapper
 */
export interface ThemeAwareProps {
  children: React.ReactNode;
  light?: React.ReactNode;
  dark?: React.ReactNode;
  className?: string;
}

export function ThemeAware({ children, light, dark, className }: ThemeAwareProps) {
  const { resolvedTheme } = useTheme();
  
  return (
    <div className={className}>
      {resolvedTheme === 'light' ? (light || children) : (dark || children)}
    </div>
  );
}

/**
 * 主题选择器
 * Theme Selector Component
 */
export interface ThemeSelectorProps extends React.HTMLAttributes<HTMLDivElement> {
  showSystem?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ThemeSelector({ 
  className, 
  showSystem = true,
  size = 'md',
  ...props 
}: ThemeSelectorProps) {
  const { theme, setTheme } = useTheme();

  const sizeClasses = {
    sm: 'gap-1 p-1',
    md: 'gap-2 p-2',
    lg: 'gap-3 p-3',
  };

  const buttonSizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const themes = [
    { value: 'light', label: '浅色', icon: '🌞' },
    { value: 'dark', label: '深色', icon: '🌙' },
    ...(showSystem ? [{ value: 'system', label: '系统', icon: '🖥️' }] : []),
  ];

  return (
    <div 
      className={cn(
        'inline-flex bg-background-card border border-border rounded-lg',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {themes.map((t) => (
        <button
          key={t.value}
          onClick={() => setTheme(t.value as Theme)}
          className={cn(
            buttonSizeClasses[size],
            'flex items-center justify-center rounded-md transition-all duration-200',
            'hover:bg-neutral-100 dark:hover:bg-neutral-800',
            theme === t.value
              ? 'bg-primary-red-100 text-primary-red-700 dark:bg-primary-red-900 dark:text-primary-red-200'
              : 'text-foreground-muted hover:text-foreground'
          )}
          title={t.label}
        >
          <span className="text-lg">{t.icon}</span>
        </button>
      ))}
    </div>
  );
}