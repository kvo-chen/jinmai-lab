import React from 'react';
import { cn } from '../../utils/cn';
import { Button } from './Button';

export interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  navigationItems: Array<{
    id: string;
    label: string;
    href: string;
    icon?: string;
    children?: Array<{
      id: string;
      label: string;
      href: string;
    }>;
  }>;
  onItemClick: (item: any) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  isOpen,
  onClose,
  navigationItems,
  onItemClick,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="absolute right-0 top-0 h-full w-80 bg-background shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">导航菜单</h2>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onClose}
            className="p-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>
        
        <div className="p-4">
          <nav className="space-y-2">
            {navigationItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                fullWidth
                onClick={() => {
                  onItemClick(item);
                  onClose();
                }}
                className="justify-start text-left"
              >
                {item.icon && <span className="mr-2">{item.icon}</span>}
                {item.label}
              </Button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export interface TouchButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  className?: string;
}

export const TouchButton: React.FC<TouchButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  className,
}) => {
  return (
    <Button
      variant={variant}
      size="lg"
      onClick={onClick}
      className={cn(
        'min-h-[44px] min-w-[44px]',
        'active:scale-95 transform transition-transform',
        className
      )}
    >
      {children}
    </Button>
  );
};