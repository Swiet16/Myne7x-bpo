import { motion } from 'framer-motion';
import { Headphones, UsersRound, ListTodo, Ticket, UserPlus, CalendarClock, BarChart3, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Card, StatCard } from '@/components/ui/Card';
import { DashboardSkeleton } from '@/components/ui/Skeleton';
import { useCount, useTableData } from '@/hooks/useSupabase';
import type { Task, Ticket as TicketType, Lead } from '@/types';
import { formatDate, titleCase } from '@/utils';

const taskCompletionData = [
  { day: 'Mon', completed: 12, assigned: 15 },
  { day: 'Tue', completed: 18, assigned: 20 },
  { day: 'Wed', completed: 14, assigned: 16 },
  { day: 'Thu', completed: 22, assigned: 25 },
  { day: 'Fri', completed: 19, assigned: 22 },
  { day: 'Sat', completed: 8, assigned: 10 },
  { day: 'Sun', completed: 5, assigned: 6 },
];

export default function AdminDashboard() {
  const { data: agentsCount } = useCount('profiles', { role: 'agent' });
  const { data: teamsCount } = useCount('teams');
  const { data: tasksCount } = useCount('tasks', { status: 'pending' });
  const { data: ticketsCount } = useCount('tickets', { status: 'open' });
  const { data: leadsCount } = useCount('leads', { status: 'new' });

  const { data: recentTasks, isLoading } = useTableData<Task>('tasks', { limit: 5 });
  const { data: recentTickets } = useTableData<TicketType>('tickets', { limit: 5 });
  const { data: recentLeads } = useTableData<Lead>('leads', { limit: 5 });

  if (isLoading) {
    return (
      <DashboardLayout allowedRoles={['admin']} title="Admin Dashboard">
        <DashboardSkeleton />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout allowedRoles={['admin']} title="Admin Dashboard">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div className="card p-6 bg-gradient-navy text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-1">Welcome back, Admin</h2>
              <p className="text-white/70">Manage your support operations and team performance.</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10">
              <Activity className="w-4 h-4 text-teal-400" />
              <span className="text-sm">All systems operational</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Active Agents" value={agentsCount ?? '—'} icon={<Headphones className="w-5 h-5" />} color="teal" />
          <StatCard label="Teams" value={teamsCount ?? '—'} icon={<UsersRound className="w-5 h-5" />} color="navy" />
          <StatCard label="Open Tasks" value={tasksCount ?? '—'} icon={<ListTodo className="w-5 h-5" />} color="amber" />
          <StatCard label="Open Tickets" value={ticketsCount ?? '—'} icon={<Ticket className="w-5 h-5" />} color="red" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard label="New Leads" value={leadsCount ?? '—'} icon={<UserPlus className="w-5 h-5" />} color="blue" />
          <StatCard label="Attendance Today" value="92%" icon={<CalendarClock className="w-5 h-5" />} color="green" />
          <StatCard label="Avg Performance" value="4.5/5" icon={<BarChart3 className="w-5 h-5" />} color="teal" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <div className="mb-6">
              <h3 className="font-semibold text-navy-900 dark:text-white">Task Completion</h3>
              <p className="text-sm text-navy-500">Weekly task completion rate</p>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={taskCompletionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
                <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip contentStyle={{ background: 'rgba(11, 31, 58, 0.95)', border: 'none', borderRadius: '12px', color: 'white' }} />
                <Bar dataKey="assigned" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completed" fill="#14b8a6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <div className="mb-4">
              <h3 className="font-semibold text-navy-900 dark:text-white">Recent Tasks</h3>
              <p className="text-sm text-navy-500">Latest task assignments</p>
            </div>
            <div className="space-y-2">
              {(recentTasks || []).slice(0, 5).map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-navy-50 dark:hover:bg-navy-800/50">
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-navy-900 dark:text-white truncate">{task.title}</p>
                    <p className="text-xs text-navy-500 capitalize">{task.priority} priority</p>
                  </div>
                  <span className={`badge-${task.status === 'completed' ? 'success' : task.status === 'in_progress' ? 'warning' : 'neutral'} capitalize flex-shrink-0`}>
                    {titleCase(task.status)}
                  </span>
                </div>
              ))}
              {(!recentTasks || recentTasks.length === 0) && (
                <p className="text-sm text-navy-400 text-center py-8">No tasks yet</p>
              )}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <div className="mb-4">
              <h3 className="font-semibold text-navy-900 dark:text-white">Recent Tickets</h3>
            </div>
            <div className="space-y-2">
              {(recentTickets || []).slice(0, 5).map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-navy-50 dark:hover:bg-navy-800/50">
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-navy-900 dark:text-white truncate">{ticket.subject}</p>
                    <p className="text-xs text-navy-500 capitalize">{ticket.category}</p>
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

          <Card>
            <div className="mb-4">
              <h3 className="font-semibold text-navy-900 dark:text-white">Recent Leads</h3>
            </div>
            <div className="space-y-2">
              {(recentLeads || []).slice(0, 5).map((lead) => (
                <div key={lead.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-navy-50 dark:hover:bg-navy-800/50">
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-navy-900 dark:text-white truncate">{lead.company}</p>
                    <p className="text-xs text-navy-500 truncate">{lead.email}</p>
                  </div>
                  <span className={`badge-${lead.status === 'new' ? 'info' : lead.status === 'won' ? 'success' : 'neutral'} capitalize flex-shrink-0`}>
                    {lead.status}
                  </span>
                </div>
              ))}
              {(!recentLeads || recentLeads.length === 0) && (
                <p className="text-sm text-navy-400 text-center py-8">No leads yet</p>
              )}
            </div>
          </Card>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
