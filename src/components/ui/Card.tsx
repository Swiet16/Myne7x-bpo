import { type ReactNode } from 'react';
import { cn } from '@/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, hover = false, onClick }: CardProps) {
  return (
    <div
      className={cn(
        'card p-6',
        hover && 'transition-all duration-300 hover:-translate-y-1 hover:shadow-card cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: { value: number; isPositive: boolean };
  color?: 'teal' | 'navy' | 'amber' | 'green' | 'red' | 'blue';
}

export function StatCard({ label, value, icon, trend, color = 'teal' }: StatCardProps) {
  const colorClasses = {
    teal: 'bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400',
    navy: 'bg-navy-50 text-navy-600 dark:bg-navy-800 dark:text-navy-300',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    green: 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    red: 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400',
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  };

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-navy-500 dark:text-navy-400 mb-1">{label}</p>
          <p className="text-2xl font-bold font-display">{value}</p>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span
                className={cn(
                  'text-xs font-medium',
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                )}
              >
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-navy-400">vs last month</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={cn('p-3 rounded-xl', colorClasses[color])}>{icon}</div>
        )}
      </div>
    </Card>
  );
}
