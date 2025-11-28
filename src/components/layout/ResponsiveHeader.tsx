import React, { useState } from 'react';
import { Header } from '../layout/Layout';
import { Button } from '../ui/Button';
import { MobileNav } from '../ui/Mobile';
import { ThemeToggle } from '../theme/ThemeProvider';

export interface ResponsiveHeaderProps {
  title: string;
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
  onNavItemClick: (item: any) => void;
  className?: string;
}

export const ResponsiveHeader: React.FC<ResponsiveHeaderProps> = ({
  title,
  navigationItems,
  onNavItemClick,
  className,
}) => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <>
      <Header variant="sticky" shadow className={className}>
        {/* 桌面端导航 */}
        <div className="hidden lg:flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold bg-gradient-to-r from-primary-red-600 to-primary-gold-600 bg-clip-text text-transparent">
              {title}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <nav className="flex items-center gap-2">
              {navigationItems.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavItemClick(item)}
                >
                  {item.icon && <span className="mr-1">{item.icon}</span>}
                  {item.label}
                </Button>
              ))}
            </nav>
            
            <div className="flex items-center gap-2">
              <ThemeToggle variant="icon" size="md" />
            </div>
          </div>
        </div>

        {/* 移动端导航 */}
        <div className="lg:hidden flex items-center justify-between w-full">
          <div className="text-xl font-bold bg-gradient-to-r from-primary-red-600 to-primary-gold-600 bg-clip-text text-transparent">
            {title}
          </div>
          
          <div className="flex items-center gap-2">
            <ThemeToggle variant="icon" size="sm" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileNavOpen(true)}
              className="p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>
      </Header>

      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        navigationItems={navigationItems}
        onItemClick={onNavItemClick}
      />
    </>
  );
};