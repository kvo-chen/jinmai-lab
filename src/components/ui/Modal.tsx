import React, { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/cn';
import { Button } from './Button';
import { Card } from './Card';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  variant?: 'default' | 'card' | 'sheet' | 'centered';
  closeOnOverlay?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
  footer?: React.ReactNode;
  className?: string;
  overlayClassName?: string;
  preventScroll?: boolean;
  animation?: 'fade' | 'slide-up' | 'slide-down' | 'scale' | 'none';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  variant = 'default',
  closeOnOverlay = true,
  closeOnEsc = true,
  showCloseButton = true,
  footer,
  className,
  overlayClassName,
  preventScroll = true,
  animation = 'fade',
}) => {
  const [isMounted, setIsMounted] = React.useState(false);
  const [isAnimating, setIsAnimating] = React.useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      setTimeout(() => setIsMounted(false), 300);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && closeOnEsc && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      if (preventScroll) {
        document.body.style.overflow = 'hidden';
      }
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      if (preventScroll) {
        document.body.style.overflow = 'unset';
      }
    };
  }, [isOpen, closeOnEsc, onClose, preventScroll]);

  const handleOverlayClick = useCallback((event: React.MouseEvent) => {
    if (event.target === event.currentTarget && closeOnOverlay) {
      onClose();
    }
  }, [closeOnOverlay, onClose]);

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full mx-4',
  };

  const animationClasses = {
    fade: {
      overlay: 'transition-opacity duration-300',
      content: 'transition-all duration-300',
      show: { overlay: 'opacity-100', content: 'opacity-100 scale-100' },
      hide: { overlay: 'opacity-0', content: 'opacity-0 scale-95' },
    },
    'slide-up': {
      overlay: 'transition-opacity duration-300',
      content: 'transition-all duration-300',
      show: { overlay: 'opacity-100', content: 'opacity-100 translate-y-0' },
      hide: { overlay: 'opacity-0', content: 'opacity-0 translate-y-4' },
    },
    'slide-down': {
      overlay: 'transition-opacity duration-300',
      content: 'transition-all duration-300',
      show: { overlay: 'opacity-100', content: 'opacity-100 translate-y-0' },
      hide: { overlay: 'opacity-0', content: 'opacity-0 -translate-y-4' },
    },
    scale: {
      overlay: 'transition-opacity duration-300',
      content: 'transition-all duration-300',
      show: { overlay: 'opacity-100', content: 'opacity-100 scale-100' },
      hide: { overlay: 'opacity-0', content: 'opacity-0 scale-95' },
    },
    none: {
      overlay: '',
      content: '',
      show: { overlay: '', content: '' },
      hide: { overlay: '', content: '' },
    },
  };

  const currentAnimation = animationClasses[animation];

  const overlayClasses = cn(
    'fixed inset-0 z-50',
    'flex items-center justify-center',
    'bg-black bg-opacity-50 backdrop-blur-sm',
    currentAnimation.overlay,
    isAnimating ? currentAnimation.show.overlay : currentAnimation.hide.overlay,
    overlayClassName
  );

  const contentClasses = cn(
    'relative',
    'w-full',
    sizeClasses[size],
    currentAnimation.content,
    isAnimating ? currentAnimation.show.content : currentAnimation.hide.content,
    className
  );

  const renderContent = () => {
    const closeButton = showCloseButton && (
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-foreground-muted hover:text-foreground transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    );

    if (variant === 'card') {
      return (
        <Card className={contentClasses} shadow="lg" rounded="xl">
          {title && (
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">{title}</h2>
              {showCloseButton && closeButton}
            </div>
          )}
          {!title && showCloseButton && (
            <div className="absolute top-4 right-4">
              {closeButton}
            </div>
          )}
          <div className="mb-6">
            {children}
          </div>
          {footer && (
            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              {footer}
            </div>
          )}
        </Card>
      );
    }

    if (variant === 'sheet') {
      return (
        <div className={cn(
          'fixed right-0 top-0 h-full w-full max-w-md',
          'bg-background shadow-2xl',
          currentAnimation.content,
          isAnimating ? 'translate-x-0' : 'translate-x-full'
        )}>
          <div className="flex items-center justify-between p-6 border-b border-border">
            {title && <h2 className="text-xl font-semibold text-foreground">{title}</h2>}
            {showCloseButton && closeButton}
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            {children}
          </div>
          {footer && (
            <div className="p-6 border-t border-border">
              {footer}
            </div>
          )}
        </div>
      );
    }

    if (variant === 'centered') {
      return (
        <div className={cn(
          'bg-background rounded-2xl shadow-2xl',
          'border border-border',
          'max-w-2xl w-full mx-4',
          contentClasses
        )}>
          <div className="p-8 text-center">
            {title && (
              <h2 className="text-2xl font-bold text-foreground mb-6">{title}</h2>
            )}
            <div className="mb-8">
              {children}
            </div>
            {footer && (
              <div className="flex justify-center gap-4">
                {footer}
              </div>
            )}
          </div>
          {showCloseButton && (
            <div className="absolute top-4 right-4">
              {closeButton}
            </div>
          )}
        </div>
      );
    }

    return (
      <div className={cn(
        'bg-background rounded-xl shadow-2xl',
        'border border-border',
        contentClasses
      )}>
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-xl font-semibold text-foreground">{title}</h2>
            {showCloseButton && closeButton}
          </div>
        )}
        <div className="p-6">
          {children}
        </div>
        {footer && (
          <div className="flex justify-end gap-3 p-6 border-t border-border">
            {footer}
          </div>
        )}
      </div>
    );
  };

  if (!isMounted) return null;

  return createPortal(
    <div className={overlayClasses} onClick={handleOverlayClick}>
      {renderContent()}
    </div>,
    document.body
  );
};

export interface ConfirmModalProps extends Omit<ModalProps, 'footer' | 'children' | 'variant'> {
  message: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  variant?: 'default' | 'danger';
  loading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  message,
  description,
  confirmText = '确认',
  cancelText = '取消',
  onConfirm,
  variant = 'default',
  loading = false,
  ...modalProps
}) => {
  const handleConfirm = () => {
    onConfirm();
  };

  const footer = (
    <>
      <Button 
        variant="outline" 
        onClick={modalProps.onClose}
        disabled={loading}
      >
        {cancelText}
      </Button>
      <Button 
        variant={variant === 'danger' ? 'danger' : 'primary'}
        onClick={handleConfirm}
        isLoading={loading}
      >
        {confirmText}
      </Button>
    </>
  );

  return (
    <Modal 
      {...modalProps} 
      footer={footer}
      size="sm"
      variant="card"
    >
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-warning-100 dark:bg-warning-900 mb-4">
          <svg className="w-6 h-6 text-warning-600 dark:text-warning-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">{message}</h3>
        {description && (
          <p className="text-sm text-foreground-muted">{description}</p>
        )}
      </div>
    </Modal>
  );
};

export interface LoadingModalProps extends Omit<ModalProps, 'footer' | 'closeOnOverlay' | 'closeOnEsc'> {
  message?: string;
  progress?: number;
  indeterminate?: boolean;
}

export const LoadingModal: React.FC<LoadingModalProps> = ({
  message = '加载中...',
  progress,
  indeterminate = true,
  ...modalProps
}) => {
  return (
    <Modal 
      {...modalProps} 
      closeOnOverlay={false}
      closeOnEsc={false}
      showCloseButton={false}
      size="sm"
      variant="centered"
    >
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-primary-red-100 dark:bg-primary-red-900 mb-4">
          {indeterminate ? (
            <svg className="animate-spin w-8 h-8 text-primary-red-600 dark:text-primary-red-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <div className="relative w-8 h-8">
              <svg className="w-8 h-8 text-primary-red-600 dark:text-primary-red-400" fill="none" viewBox="0 0 36 36">
                <path className="stroke-current" strokeWidth="3" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="stroke-current text-primary-gold-500" strokeWidth="3" strokeDasharray={`${progress}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-semibold">{progress}%</span>
              </div>
            </div>
          )}
        </div>
        <p className="text-foreground font-medium">{message}</p>
        {progress !== undefined && !indeterminate && (
          <div className="mt-4">
            <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-primary-red-500 to-primary-gold-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};