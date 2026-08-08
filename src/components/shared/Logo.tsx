import { cn } from '@/utils';

interface LogoProps {
  variant?: 'full' | 'icon';
  className?: string;
  dark?: boolean;
}

export function Logo({ variant = 'full', className, dark = true }: LogoProps) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div className="relative">
        <svg
          width="36"
          height="36"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="flex-shrink-0"
        >
          <rect width="64" height="64" rx="14" fill="url(#logo-gradient)" />
          <path
            d="M16 44V20h6l8 14 8-14h6v24h-5V28l-9 16-9-16v16h-5z"
            fill="white"
            fillOpacity="0.95"
          />
          <circle cx="48" cy="16" r="3.5" fill="#2dd4bf" />
          <defs>
            <linearGradient id="logo-gradient" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0B1F3A" />
              <stop offset="1" stopColor="#1f3a5f" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      {variant === 'full' && (
        <div className="flex flex-col leading-none">
          <span
            className={cn(
              'font-display font-bold text-lg tracking-tight',
              dark ? 'text-white' : 'text-navy-900'
            )}
          >
            MYNE7X
          </span>
          <span
            className={cn(
              'text-[10px] font-medium tracking-[0.2em] uppercase',
              dark ? 'text-teal-400' : 'text-teal-600'
            )}
          >
            BPO
          </span>
        </div>
      )}
    </div>
  );
}
