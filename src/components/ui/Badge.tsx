import { cn, getStatusColor, titleCase } from '@/utils';

interface BadgeProps {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'teal' | 'neutral';
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = 'neutral', children, className }: BadgeProps) {
  const variants = {
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
    info: 'badge-info',
    teal: 'badge-teal',
    neutral: 'badge-neutral',
  };
  return <span className={cn(variants[variant], className)}>{children}</span>;
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn(getStatusColor(status), 'capitalize')}>
      {titleCase(status)}
    </span>
  );
}
