import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Clock, ListTodo, CheckCircle2, AlertCircle, BarChart3, Megaphone,
  Play, Pause, Square, Coffee,
} from 'lucide-react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Card, StatCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useTableData, useInsert, useUpdate } from '@/hooks/useSupabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { supabase } from '@/lib/supabase';
import type { Task, Announcement, Attendance } from '@/types';
import { formatDate, titleCase, formatTime } from '@/utils';

export default function AgentDashboard() {
  const { profile } = useAuth();
  const { success, error } = useToast();
  const [todayAttendance, setTodayAttendance] = useState<Attendance | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const { data: myTasks } = useTableData<Task>('tasks', {
    filter: { assigned_to: profile?.id },
    limit: 10,
  });
  const { data: announcements } = useTableData<Announcement>('announcements', {
    filter: { published: true },
    limit: 3,
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!profile) return;
    const fetchTodayAttendance = async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data } = await supabase
        .from('attendance')
        .select('*')
        .eq('employee_id', profile.id)
        .eq('date', today)
        .single();
      if (data) setTodayAttendance(data as Attendance);
    };
    fetchTodayAttendance();
  }, [profile]);

  const handleClockAction = async (action: 'clock_in' | 'break_start' | 'break_end' | 'clock_out') => {
    if (!profile) return;
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toISOString();

    try {
      if (todayAttendance) {
        // Update existing record
        const updates: Record<string, string | number | null> = { [action]: now };
        if (action === 'clock_out' && todayAttendance.clock_in) {
          const totalMs = new Date(now).getTime() - new Date(todayAttendance.clock_in).getTime();
          const breakMs =
            (todayAttendance.break_start && todayAttendance.break_end
              ? new Date(todayAttendance.break_end).getTime() - new Date(todayAttendance.break_start).getTime()
              : 0);
          updates.total_hours = Math.round(((totalMs - breakMs) / (1000 * 60 * 60)) * 100) / 100;
          updates.status = 'present';
        }
        const { data, error: err } = await supabase
          .from('attendance')
          .update(updates)
          .eq('id', todayAttendance.id)
          .select()
          .single();
        if (err) throw err;
        setTodayAttendance(data as Attendance);
      } else {
        // Create new record
        const { data, error: err } = await supabase
          .from('attendance')
          .insert({
            employee_id: profile.id,
            date: today,
            [action]: now,
            status: action === 'clock_in' ? 'present' : 'absent',
          })
          .select()
          .single();
        if (err) throw err;
        setTodayAttendance(data as Attendance);
      }
      success('Time tracked', `${titleCase(action.replace(/_/g, ' '))} at ${formatTime(now)}`);
    } catch (err) {
      console.error(err);
      error('Failed to record time', (err as Error).message);
    }
  };

  const completedTasks = myTasks?.filter((t) => t.status === 'completed').length ?? 0;
  const pendingTasks = myTasks?.filter((t) => ['pending', 'assigned', 'in_progress'].includes(t.status)).length ?? 0;

  return (
    <DashboardLayout allowedRoles={['agent']} title="Agent Dashboard">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        {/* Welcome */}
        <div className="card p-6 bg-gradient-navy text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-1">Welcome, {profile?.full_name?.split(' ')[0] || 'Agent'}</h2>
              <p className="text-white/70">Manage your tasks, track time, and stay updated.</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold font-mono">{currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
              <p className="text-white/50 text-sm">{currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
        </div>

        {/* Clock-in system */}
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-teal flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-navy-900 dark:text-white">Time Tracker</h3>
              <p className="text-sm text-navy-500">
                {todayAttendance?.clock_in
                  ? `Clocked in at ${formatTime(todayAttendance.clock_in)}`
                  : 'Not clocked in yet'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="p-3 rounded-lg bg-navy-50 dark:bg-navy-800/50 text-center">
              <p className="text-xs text-navy-500 mb-1">Clock In</p>
              <p className="font-semibold text-sm">{todayAttendance?.clock_in ? formatTime(todayAttendance.clock_in) : '—'}</p>
            </div>
            <div className="p-3 rounded-lg bg-navy-50 dark:bg-navy-800/50 text-center">
              <p className="text-xs text-navy-500 mb-1">Break Start</p>
              <p className="font-semibold text-sm">{todayAttendance?.break_start ? formatTime(todayAttendance.break_start) : '—'}</p>
            </div>
            <div className="p-3 rounded-lg bg-navy-50 dark:bg-navy-800/50 text-center">
              <p className="text-xs text-navy-500 mb-1">Break End</p>
              <p className="font-semibold text-sm">{todayAttendance?.break_end ? formatTime(todayAttendance.break_end) : '—'}</p>
            </div>
            <div className="p-3 rounded-lg bg-navy-50 dark:bg-navy-800/50 text-center">
              <p className="text-xs text-navy-500 mb-1">Clock Out</p>
              <p className="font-semibold text-sm">{todayAttendance?.clock_out ? formatTime(todayAttendance.clock_out) : '—'}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {!todayAttendance?.clock_in && (
              <Button variant="primary" leftIcon={<Play className="w-4 h-4" />} onClick={() => handleClockAction('clock_in')}>
                Clock In
              </Button>
            )}
            {todayAttendance?.clock_in && !todayAttendance?.break_start && !todayAttendance?.clock_out && (
              <Button variant="secondary" leftIcon={<Coffee className="w-4 h-4" />} onClick={() => handleClockAction('break_start')}>
                Start Break
              </Button>
            )}
            {todayAttendance?.break_start && !todayAttendance?.break_end && (
              <Button variant="primary" leftIcon={<Play className="w-4 h-4" />} onClick={() => handleClockAction('break_end')}>
                Resume Work
              </Button>
            )}
            {todayAttendance?.clock_in && !todayAttendance?.clock_out && (
              <Button variant="danger" leftIcon={<Square className="w-4 h-4" />} onClick={() => handleClockAction('clock_out')}>
                Clock Out
              </Button>
            )}
            {todayAttendance?.clock_out && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-medium">Day completed • {todayAttendance.total_hours}h logged</span>
              </div>
            )}
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Today's Status" value={todayAttendance?.status || 'Not started'} icon={<Clock className="w-5 h-5" />} color="teal" />
          <StatCard label="My Tasks" value={myTasks?.length ?? 0} icon={<ListTodo className="w-5 h-5" />} color="navy" />
          <StatCard label="Completed" value={completedTasks} icon={<CheckCircle2 className="w-5 h-5" />} color="green" />
          <StatCard label="Pending" value={pendingTasks} icon={<AlertCircle className="w-5 h-5" />} color="amber" />
        </div>

        {/* Tasks & Announcements */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <div className="mb-4">
              <h3 className="font-semibold text-navy-900 dark:text-white">My Tasks</h3>
              <p className="text-sm text-navy-500">Tasks assigned to you</p>
            </div>
            <div className="space-y-2">
              {(myTasks || []).slice(0, 6).map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-navy-50 dark:hover:bg-navy-800/50">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-navy-900 dark:text-white truncate">{task.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`badge-${task.priority === 'urgent' ? 'danger' : task.priority === 'high' ? 'warning' : 'neutral'} capitalize`}>
                        {task.priority}
                      </span>
                      <span className="text-xs text-navy-500">{task.deadline ? `Due ${formatDate(task.deadline)}` : ''}</span>
                    </div>
                  </div>
                  <span className={`badge-${task.status === 'completed' ? 'success' : task.status === 'in_progress' ? 'warning' : 'neutral'} capitalize flex-shrink-0`}>
                    {titleCase(task.status)}
                  </span>
                </div>
              ))}
              {(!myTasks || myTasks.length === 0) && (
                <p className="text-sm text-navy-400 text-center py-8">No tasks assigned yet</p>
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
