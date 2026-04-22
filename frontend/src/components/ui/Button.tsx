import { Loader2 } from 'lucide-react';
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@utils/utils';
import { Tooltip } from './Tooltip';

const variants = {
  primary: 'bg-brand-500 text-white hover:bg-brand-600 active:bg-brand-700',
  secondary: 'border border-surface-300 bg-surface-0 text-surface-700 hover:bg-surface-100 dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10',
  ghost: 'bg-transparent text-surface-700 hover:bg-surface-100 dark:text-white/70 dark:hover:bg-white/5',
  danger: 'bg-danger-500 text-white hover:bg-danger-700',
  link: 'bg-transparent px-0 text-brand-600 hover:text-brand-700 dark:text-brand-300 dark:hover:text-brand-200'
} as const;

const sizes = {
  xs: 'h-8 px-2.5 text-xs',
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-3.5 text-sm',
  lg: 'h-11 px-4 text-base'
} as const;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  loading?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
  iconOnly?: boolean;
  tooltip?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    children,
    variant = 'primary',
    size = 'md',
    loading,
    disabled,
    iconLeft,
    iconRight,
    fullWidth,
    iconOnly,
    tooltip,
    ...props
  },
  ref
) {
  const button = (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/50 disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        iconOnly && 'aspect-square px-0',
        'active:scale-[0.98]',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : iconLeft}
      {loading ? 'Loading...' : children}
      {!loading ? iconRight : null}
    </button>
  );

  if (tooltip && iconOnly) {
    return <Tooltip content={tooltip}>{button}</Tooltip>;
  }

  return button;
});
