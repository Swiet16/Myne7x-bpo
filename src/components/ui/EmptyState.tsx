import { type ReactNode } from 'react';
import { Inbox, AlertCircle, SearchX, ServerCrash } from 'lucide-react';
import { cn } from '@/utils';

interface EmptyStateProps {
  icon?: 'inbox' | 'error' | 'search' | 'server';
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

const icons = {
  inbox: Inbox,
  error: AlertCircle,
  search: SearchX,
  server: ServerCrash,
};

export function EmptyState({ icon = 'inbox', title, description, action, className }: EmptyStateProps) {
  const Icon = icons[icon];
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4 text-center', className)}>
      <div className="w-16 h-16 rounded-2xl bg-navy-50 dark:bg-navy-800 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-navy-400" />
      </div>
      <h3 className="text-lg font-semibold text-navy-800 dark:text-navy-100">{title}</h3>
      {description && (
        <p className="text-sm text-navy-500 dark:text-navy-400 mt-1 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'An unexpected error occurred. Please try again.',
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-900/30 flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-red-500" />
      </div>
      <h3 className="text-lg font-semibold text-navy-800 dark:text-navy-100">{title}</h3>
      <p className="text-sm text-navy-500 dark:text-navy-400 mt-1 max-w-sm">{description}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary mt-4">
          Try again
        </button>
      )}
    </div>
  );
}

export function LoadingScreen({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-teal mb-4 animate-pulse-slow">
          <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-white/80 text-sm">{message}</p>
      </div>
    </div>
  );
}
