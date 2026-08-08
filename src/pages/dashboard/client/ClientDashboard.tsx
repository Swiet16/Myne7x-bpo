import { motion } from 'framer-motion';
import { FolderKanban, Ticket, Users, FileText, FileBarChart, Plus, Activity } from 'lucide-react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Card, StatCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { useState } from 'react';
import { useTableData, useCount, useInsert } from '@/hooks/useSupabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import type { Project, Ticket as TicketType } from '@/types';
import { formatDate, titleCase } from '@/utils';

export default function ClientDashboard() {
  const { profile } = useAuth();
  const { success } = useToast();
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    description: '',
    category: 'customer_support',
    priority: 'medium',
  });

  const { data: projectsCount } = useCount('projects');
  const { data: ticketsCount } = useCount('tickets', { status: 'open' });

  const { data: myProjects, isLoading } = useTableData<Project>('projects', { limit: 5 });
  const { data: myTickets } = useTableData<TicketType>('tickets', { limit: 5 });

  const createTicket = useInsert<TicketType>('tickets');

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    await createTicket.mutateAsync({
      ...ticketForm,
      created_by: profile.id,
      status: 'open',
    } as Partial<TicketType>);
    setShowTicketModal(false);
    setTicketForm({ subject: '', description: '', category: 'customer_support', priority: 'medium' });
  };

  if (isLoading) {
    return (
      <DashboardLayout allowedRoles={['client']} title="Client Dashboard">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-28 rounded-2xl" />
          ))}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout allowedRoles={['client']} title="Client Dashboard">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div className="card p-6 bg-gradient-navy text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-1">Welcome, {profile?.full_name?.split(' ')[0] || 'Client'}</h2>
              <p className="text-white/70">Manage your projects, track tickets, and access reports.</p>
            </div>
            <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowTicketModal(true)}>
              New Support Ticket
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Active Projects" value={projectsCount ?? '—'} icon={<FolderKanban className="w-5 h-5" />} color="teal" />
          <StatCard label="Open Tickets" value={ticketsCount ?? '—'} icon={<Ticket className="w-5 h-5" />} color="amber" />
          <StatCard label="Assigned Team" value="8" icon={<Users className="w-5 h-5" />} color="navy" />
          <StatCard label="Reports" value="12" icon={<FileBarChart className="w-5 h-5" />} color="green" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-navy-900 dark:text-white">My Projects</h3>
                <p className="text-sm text-navy-500">Your active projects</p>
              </div>
              <Activity className="w-4 h-4 text-teal-500" />
            </div>
            <div className="space-y-2">
              {(myProjects || []).slice(0, 5).map((project) => (
                <div key={project.id} className="p-3 rounded-lg hover:bg-navy-50 dark:hover:bg-navy-800/50">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-sm text-navy-900 dark:text-white">{project.name}</p>
                    <span className={`badge-${project.status === 'active' ? 'success' : 'neutral'} capitalize`}>
                      {project.status}
                    </span>
                  </div>
                  <p className="text-xs text-navy-500">
                    Started: {formatDate(project.start_date)}
                    {project.end_date && ` • Ends: ${formatDate(project.end_date)}`}
                  </p>
                </div>
              ))}
              {(!myProjects || myProjects.length === 0) && (
                <p className="text-sm text-navy-400 text-center py-8">No projects yet</p>
              )}
            </div>
          </Card>

          <Card>
            <div className="mb-4">
              <h3 className="font-semibold text-navy-900 dark:text-white">Recent Tickets</h3>
              <p className="text-sm text-navy-500">Your support tickets</p>
            </div>
            <div className="space-y-2">
              {(myTickets || []).slice(0, 5).map((ticket) => (
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
              {(!myTickets || myTickets.length === 0) && (
                <p className="text-sm text-navy-400 text-center py-8">No tickets yet</p>
              )}
            </div>
          </Card>
        </div>

        {/* Create Ticket Modal */}
        <Modal
          open={showTicketModal}
          onClose={() => setShowTicketModal(false)}
          title="Create Support Ticket"
          description="Submit a new support request to your team"
        >
          <form onSubmit={handleCreateTicket} className="space-y-4">
            <Input
              label="Subject"
              required
              value={ticketForm.subject}
              onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
              placeholder="Brief description of the issue"
            />
            <Select
              label="Category"
              value={ticketForm.category}
              onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
              options={[
                { value: 'technical', label: 'Technical' },
                { value: 'customer_support', label: 'Customer Support' },
                { value: 'operations', label: 'Operations' },
                { value: 'it', label: 'IT' },
                { value: 'other', label: 'Other' },
              ]}
            />
            <Select
              label="Priority"
              value={ticketForm.priority}
              onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
              options={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
                { value: 'urgent', label: 'Urgent' },
              ]}
            />
            <Textarea
              label="Description"
              required
              rows={4}
              value={ticketForm.description}
              onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
              placeholder="Provide detailed information about your request..."
            />
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowTicketModal(false)}>
                Cancel
              </Button>
              <Button type="submit" loading={createTicket.isPending}>
                Create Ticket
              </Button>
            </div>
          </form>
        </Modal>
      </motion.div>
    </DashboardLayout>
  );
}
