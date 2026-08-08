import { type ReactNode, Suspense } from 'react';
import { PublicNavbar, PublicFooter } from '@/components/shared/PublicLayout';
import { LoadingScreen } from '@/components/ui/EmptyState';
import { Helmet } from 'react-helmet-async';

interface PublicLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export function PublicLayout({ children, title, description }: PublicLayoutProps) {
  return (
    <>
      <Helmet>
        <title>{title ? `${title} | MYNE7X BPO` : 'MYNE7X BPO | Customer Support & BPO Outsourcing'}</title>
        {description && <meta name="description" content={description} />}
      </Helmet>
      <div className="min-h-screen flex flex-col bg-white dark:bg-navy-950">
        <PublicNavbar />
        <main className="flex-1">
          <Suspense fallback={<LoadingScreen />}>{children}</Suspense>
        </main>
        <PublicFooter />
      </div>
    </>
  );
}
