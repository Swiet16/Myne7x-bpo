import { useParams } from 'react-router-dom';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { GenericListPage } from '@/components/dashboard/GenericListPage';
import type { UserRole } from '@/types';

const pageTitles: Record<string, string> = {
  users: 'Users Management',
  admins: 'Admins',
  'team-leads': 'Team Leads',
  agents: 'Agents',
  clients: 'Clients',
  teams: 'Teams',
  projects: 'Projects',
  tasks: 'Tasks',
  tickets: 'Tickets',
  leads: 'Leads CRM',
  attendance: 'Attendance',
  schedules: 'Schedules',
  performance: 'Performance',
  payroll: 'Payroll',
  documents: 'Documents',
  announcements: 'Announcements',
  reports: 'Reports',
  analytics: 'Analytics',
  cms: 'Website CMS',
  'services-cms': 'Services CMS',
  testimonials: 'Testimonials',
  faqs: 'FAQs Management',
  'legal-pages': 'Legal Pages',
  settings: 'Settings',
  'audit-logs': 'Audit Logs',
  profile: 'My Profile',
};

interface GenericDashboardPageProps {
  role: UserRole;
}

export default function GenericDashboardPage({ role }: GenericDashboardPageProps) {
  const { page } = useParams<{ page: string }>();
  const title = pageTitles[page || ''] || 'Dashboard';

  return (
    <DashboardLayout allowedRoles={[role]} title={title}>
      <GenericListPage page={page || ''} role={role} />
    </DashboardLayout>
  );
}
