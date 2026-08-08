import { motion } from 'framer-motion';
import {
  Users, Headphones, UserCog, Briefcase, FolderKanban, Ticket,
  UserPlus, DollarSign, CalendarClock, ListTodo, TrendingUp, TrendingDown,
  ArrowUpRight, Activity,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Card, StatCard } from '@/components/ui/Card';
import { DashboardSkeleton } from '@/components/ui/Skeleton';
import { useCount, useTableData } from '@/hooks/useSupabase';
import type { Lead, Ticket as TicketType, Project } from '@/types';
import { formatCurrency, formatDate } from '@/utils';

const revenueData = [
  { month: 'Jan', revenue: 45000, target: 50000 },
  { month: 'Feb', revenue: 52000, target: 55000 },
  { month: 'Mar', revenue: 61000, target: 60000 },
  { month: 'Apr', revenue: 58000, target: 65000 },
  { month: 'May', revenue: 70000, target: 70000 },
  { month: 'Jun', revenue: 78000, target: 75000 },
  { month: 'Jul', revenue: 85000, target: 80000 },
  { month: 'Aug', revenue: 92000, target: 85000 },
];

const leadSourceData = [
  { name: 'Website', value: 35, color: '#14b8a6' },
  { name: 'LinkedIn', value: 25, color: '#0fa3a0' },
  { name: 'Referral', value: 20, color: '#1dbfb9' },
  { name: 'Email', value: 12, color: '#2dd4bf' },
  { name: 'Other', value: 8, color: '#43d8d3' },
];

const projectStatusData = [
  { status: 'Active', count: 12 },
  { status: 'Planning', count: 5 },
  { status: 'Onboarding', count: 3 },
  { status: 'Paused', count: 2 },
  { status: 'Completed', count: 8 },
];

export default function SuperAdminDashboard() {
  const { data: usersCount } = useCount('profiles');
  const { data: agentsCount } = useCount('profiles', { role: 'agent' });
  const { data: teamLeadsCount } = useCount('profiles', { role: 'team_lead' });
  const { data: clientsCount } = useCount('profiles', { role: 'client' });
  const { data: projectsCount } = useCount('projects');
  const { data: ticketsCount } = useCount('tickets', { status: 'open' });
  const { data: leadsCount } = useCount('leads', { status: 'new' });
  const { data: tasksCount } = useCount('tasks', { status: 'pending' });

  const { data: recentLeads, isLoading: leadsLoading } = useTableData<Lead>('leads', { limit: 5 });
  const { data: recentTickets } = useTableData<TicketType>('tickets', { limit: 5 });
  const { data: recentProjects } = useTableData<Project>('projects', { limit: 5 });

  if (leadsLoading) {
    return (
      <DashboardLayout allowedRoles={['super_admin']} title="Super Admin Dashboard">
        <DashboardSkeleton />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout allowedRoles={['super_admin']} title="Super Admin Dashboard">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        {/* Welcome banner */}
        <div className="card p-6 bg-gradient-navy text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-1">Welcome back, Super Admin</h2>
              <p className="text-white/70">Here's what's happening across your platform today.</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10">
              <Activity className="w-4 h-4 text-teal-400" />
              <span className="text-sm">System operational</span>
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard label="Total Users" value={usersCount ?? '—'} icon={<Users className="w-5 h-5" />} color="navy" />
          <StatCard label="Active Agents" value={agentsCount ?? '—'} icon={<Headphones className="w-5 h-5" />} color="teal" />
          <StatCard label="Team Leads" value={teamLeadsCount ?? '—'} icon={<UserCog className="w-5 h-5" />} color="blue" />
          <StatCard label="Clients" value={clientsCount ?? '—'} icon={<Briefcase className="w-5 h-5" />} color="amber" />
          <StatCard label="Active Projects" value={projectsCount ?? '—'} icon={<FolderKanban className="w-5 h-5" />} color="green" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Open Tickets" value={ticketsCount ?? '—'} icon={<Ticket className="w-5 h-5" />} color="red" />
          <StatCard label="New Leads" value={leadsCount ?? '—'} icon={<UserPlus className="w-5 h-5" />} color="teal" />
          <StatCard label="Pending Tasks" value={tasksCount ?? '—'} icon={<ListTodo className="w-5 h-5" />} color="amber" />
          <StatCard label="Monthly Revenue" value={formatCurrency(92000)} icon={<DollarSign className="w-5 h-5" />} color="green" trend={{ value: 8.5, isPositive: true }} />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <Card className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-navy-900 dark:text-white">Revenue Overview</h3>
                <p className="text-sm text-navy-500">Monthly revenue vs target</p>
              </div>
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <TrendingUp className="w-4 h-4" />
                +15.2%
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(11, 31, 58, 0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                  }}
                  formatter={(value: number) => [formatCurrency(value), '']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#14b8a6" strokeWidth={2} fill="url(#revenueGradient)" />
                <Area type="monotone" dataKey="target" stroke="#9ca3af" strokeWidth={1} strokeDasharray="5 5" fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Lead Sources Pie */}
          <Card>
            <div className="mb-6">
              <h3 className="font-semibold text-navy-900 dark:text-white">Lead Sources</h3>
              <p className="text-sm text-navy-500">Distribution by source</p>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={leadSourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {leadSourceData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'rgba(11, 31, 58, 0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {leadSourceData.map((source) => (
                <div key={source.name} className="flex items-center gap-2 text-xs">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: source.color }} />
                  <span className="text-navy-600 dark:text-navy-300">{source.name}</span>
                  <span className="text-navy-400 ml-auto">{source.value}%</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Second row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Project Status Bar Chart */}
          <Card>
            <div className="mb-6">
              <h3 className="font-semibold text-navy-900 dark:text-white">Project Status</h3>
              <p className="text-sm text-navy-500">Current project distribution</p>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={projectStatusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
                <XAxis dataKey="status" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(11, 31, 58, 0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                  }}
                />
                <Bar dataKey="count" fill="#14b8a6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Recent Leads */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-navy-900 dark:text-white">Recent Leads</h3>
                <p className="text-sm text-navy-500">Latest quote requests</p>
              </div>
            </div>
            <div className="space-y-3">
              {(recentLeads || []).slice(0, 5).map((lead) => (
                <div key={lead.id} className="flex items-center justify-between gap-3 p-3 rounded-lg hover:bg-navy-50 dark:hover:bg-navy-800/50">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-gradient-teal flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                      {lead.company.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm text-navy-900 dark:text-white truncate">{lead.company}</p>
                      <p className="text-xs text-navy-500 truncate">{lead.contact_name} • {lead.email}</p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <span className={`badge-${lead.status === 'new' ? 'info' : lead.status === 'won' ? 'success' : 'neutral'} capitalize`}>
                      {lead.status}
                    </span>
                    <p className="text-xs text-navy-400 mt-1">{formatDate(lead.created_at)}</p>
                  </div>
                </div>
              ))}
              {(!recentLeads || recentLeads.length === 0) && (
                <p className="text-sm text-navy-400 text-center py-8">No leads yet</p>
              )}
            </div>
          </Card>
        </div>

        {/* Recent Projects & Tickets */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-navy-900 dark:text-white">Recent Projects</h3>
              <ArrowUpRight className="w-4 h-4 text-navy-400" />
            </div>
            <div className="space-y-2">
              {(recentProjects || []).slice(0, 4).map((project) => (
                <div key={project.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-navy-50 dark:hover:bg-navy-800/50">
                  <div>
                    <p className="font-medium text-sm text-navy-900 dark:text-white">{project.name}</p>
                    <p className="text-xs text-navy-500 capitalize">{project.status}</p>
                  </div>
                  <span className="text-xs text-navy-400">{formatDate(project.start_date)}</span>
                </div>
              ))}
              {(!recentProjects || recentProjects.length === 0) && (
                <p className="text-sm text-navy-400 text-center py-8">No projects yet</p>
              )}
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-navy-900 dark:text-white">Recent Tickets</h3>
              <ArrowUpRight className="w-4 h-4 text-navy-400" />
            </div>
            <div className="space-y-2">
              {(recentTickets || []).slice(0, 4).map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-navy-50 dark:hover:bg-navy-800/50">
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-navy-900 dark:text-white truncate">{ticket.subject}</p>
                    <p className="text-xs text-navy-500 capitalize">{ticket.priority} • {ticket.category}</p>
                  </div>
                  <span className={`badge-${ticket.status === 'open' ? 'info' : ticket.status === 'resolved' ? 'success' : 'warning'} capitalize flex-shrink-0`}>
                    {ticket.status.replace(/_/g, ' ')}
                  </span>
                </div>
              ))}
              {(!recentTickets || recentTickets.length === 0) && (
                <p className="text-sm text-navy-400 text-center py-8">No tickets yet</p>
              )}
            </div>
          </Card>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
