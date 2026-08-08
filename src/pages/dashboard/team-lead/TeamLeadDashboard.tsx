import { motion } from 'framer-motion';
import { Users, ListTodo, CheckCircle2, Ticket, AlertTriangle, Megaphone, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Card, StatCard } from '@/components/ui/Card';
import { DashboardSkeleton } from '@/components/ui/Skeleton';
import { useTableData, useCount } from '@/hooks/useSupabase';
import { useAuth } from '@/contexts/AuthContext';
import type { Task, Ticket as TicketType, Announcement } from '@/types';
import { formatDate, titleCase } from '@/utils';

const teamPerformanceData = [
  { agent: 'Sarah M.', tasks: 24, tickets: 18 },
  { agent: 'James L.', tasks: 20, tickets: 15 },
  { agent: 'Maria K.', tasks: 22, tickets: 20 },
  { agent: 'Ahmed R.', tasks: 18, tickets: 16 },
  { agent: 'Lisa P.', tasks: 26, tickets: 22 },
];

export default function TeamLeadDashboard() {
  const { profile } = useAuth();
  const { data: tasksCount } = useCount('tasks', { assigned_by: profile?.id });
  const { data: openTicketsCount } = useCount('tickets', { status: 'open' });

  const { data: teamTasks, isLoading } = useTableData<Task>('tasks', {
    filter: { assigned_by: profile?.id },
    limit: 5,
  });
  const { data: teamTickets } = useTableData<TicketType>('tickets', { limit: 5 });
  const { data: announcements } = useTableData<Announcement>('announcements', {
    filter: { published: true },
    limit: 3,
  });

  if (isLoading) {
    return (
      <DashboardLayout allowedRoles={['team_lead']} title="Team Lead Dashboard">
        <DashboardSkeleton />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout allowedRoles={['team_lead']} title="Team Lead Dashboard">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div className="card p-6 bg-gradient-navy text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-1">Welcome back, {profile?.full_name?.split(' ')[0] || 'Team Lead'}</h2>
              <p className="text-white/70">Monitor your team's performance and manage tasks efficiently.</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10">
              <Activity className="w-4 h-4 text-teal-400" />
              <span className="text-sm">Team active</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="My Team" value="8" icon={<Users className="w-5 h-5" />} color="navy" />
          <StatCard label="Assigned Tasks" value={tasksCount ?? '—'} icon={<ListTodo className="w-5 h-5" />} color="teal" />
          <StatCard label="Completed Today" value="14" icon={<CheckCircle2 className="w-5 h-5" />} color="green" />
          <StatCard label="Open Tickets" value={openTicketsCount ?? '—'} icon={<Ticket className="w-5 h-5" />} color="red" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <div className="mb-6">
              <h3 className="font-semibold text-navy-900 dark:text-white">Team Performance</h3>
              <p className="text-sm text-navy-500">Tasks & tickets by agent</p>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={teamPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
                <XAxis dataKey="agent" stroke="#9ca3af" fontSize={11} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip contentStyle={{ background: 'rgba(11, 31, 58, 0.95)', border: 'none', borderRadius: '12px', color: 'white' }} />
                <Bar dataKey="tasks" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="tickets" fill="#0fa3a0" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-navy-900 dark:text-white">My Team Tasks</h3>
                <p className="text-sm text-navy-500">Tasks assigned by you</p>
              </div>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </div>
            <div className="space-y-2">
              {(teamTasks || []).slice(0, 6).map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-navy-50 dark:hover:bg-navy-800/50">
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-navy-900 dark:text-white truncate">{task.title}</p>
                    <p className="text-xs text-navy-500 capitalize">{task.priority} • {task.status.replace(/_/g, ' ')}</p>
                  </div>
                  <span className="text-xs text-navy-400 flex-shrink-0">{task.deadline ? formatDate(task.deadline) : '—'}</span>
                </div>
              ))}
              {(!teamTasks || teamTasks.length === 0) && (
                <p className="text-sm text-navy-400 text-center py-8">No tasks assigned yet</p>
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
              {(teamTickets || []).slice(0, 5).map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-navy-50 dark:hover:bg-navy-800/50">
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-navy-900 dark:text-white truncate">{ticket.subject}</p>
                    <p className="text-xs text-navy-500 capitalize">{ticket.category} • {ticket.priority}</p>
                  </div>
                  <span className={`badge-${ticket.status === 'open' ? 'info' : ticket.status === 'resolved' ? 'success' : 'warning'} capitalize flex-shrink-0`}>
                    {ticket.status.replace(/_/g, ' ')}
                  </span>
                </div>
              ))}
              {(!teamTickets || teamTickets.length === 0) && (
                <p className="text-sm text-navy-400 text-center py-8">No tickets yet</p>
              )}
            </div>
          </Card>

          <Card>
            <div className="mb-4 flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-teal-500" />
              <h3 className="font-semibold text-navy-900 dark:text-white">Announcements</h3>
            </div>
            <div className="space-y-3">
              {(announcements || []).slice(0, 3).map((ann) => (
                <div key={ann.id} className="p-3 rounded-lg bg-navy-50 dark:bg-navy-800/50">
                  <p className="font-medium text-sm text-navy-900 dark:text-white">{ann.title}</p>
                  <p className="text-xs text-navy-500 mt-1 line-clamp-2">{ann.message}</p>
                  <p className="text-xs text-navy-400 mt-1">{formatDate(ann.created_at)}</p>
                </div>
              ))}
              {(!announcements || announcements.length === 0) && (
                <p className="text-sm text-navy-400 text-center py-8">No announcements</p>
              )}
            </div>
          </Card>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
