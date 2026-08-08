import { useState, useMemo } from 'react';
import { useTableData, useDelete } from '@/hooks/useSupabase';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { DataTable } from '@/components/ui/DataTable';
import { EmptyState, ErrorState } from '@/components/ui/EmptyState';
import { ConfirmDialog } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Download, Plus, Search, Trash2, Eye, Edit } from 'lucide-react';
import { downloadCSV, formatDate, formatCurrency, titleCase } from '@/utils';
import type { UserRole } from '@/types';

interface GenericListPageProps {
  page: string;
  role: UserRole;
}

// Configuration for each page type
type ColumnDef = {
  key: string;
  header: string;
  render?: (row: Record<string, unknown>) => React.ReactNode;
};

const pageConfig: Record<string, {
  table: string;
  title: string;
  columns: ColumnDef[];
  searchFields: string[];
  filters?: { field: string; label: string; options: { value: string; label: string }[] }[];
  canExport?: boolean;
  canCreate?: boolean;
  canDelete?: boolean;
}> = {
  users: {
    table: 'profiles',
    title: 'Users',
    columns: [
      { key: 'full_name', header: 'Name', render: (row): React.ReactNode => String(row.full_name || '—') },
      { key: 'email', header: 'Email' },
      { key: 'role', header: 'Role', render: (row): React.ReactNode => <Badge variant="teal">{titleCase(row.role as string)}</Badge> },
      { key: 'status', header: 'Status', render: (row): React.ReactNode => <Badge variant={row.status === 'active' ? 'success' : 'danger'}>{titleCase(row.status as string)}</Badge> },
      { key: 'created_at', header: 'Joined', render: (row): React.ReactNode => formatDate(row.created_at as string) },
    ],
    searchFields: ['full_name', 'email'],
    canExport: true,
    canDelete: true,
  },
  agents: {
    table: 'profiles',
    title: 'Agents',
    columns: [
      { key: 'full_name', header: 'Name', render: (row): React.ReactNode => String(row.full_name || '—') },
      { key: 'email', header: 'Email' },
      { key: 'status', header: 'Status', render: (row): React.ReactNode => <Badge variant={row.status === 'active' ? 'success' : 'danger'}>{titleCase(row.status as string)}</Badge> },
      { key: 'created_at', header: 'Joined', render: (row): React.ReactNode => formatDate(row.created_at as string) },
    ],
    searchFields: ['full_name', 'email'],
    filters: [{ field: 'status', label: 'Status', options: [{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }, { value: 'suspended', label: 'Suspended' }] }],
    canExport: true,
  },
  clients: {
    table: 'profiles',
    title: 'Clients',
    columns: [
      { key: 'full_name', header: 'Contact Name', render: (row): React.ReactNode => String(row.full_name || '—') },
      { key: 'email', header: 'Email' },
      { key: 'status', header: 'Status', render: (row): React.ReactNode => <Badge variant={row.status === 'active' ? 'success' : 'danger'}>{titleCase(row.status as string)}</Badge> },
      { key: 'created_at', header: 'Joined', render: (row): React.ReactNode => formatDate(row.created_at as string) },
    ],
    searchFields: ['full_name', 'email'],
    canExport: true,
  },
  'team-leads': {
    table: 'profiles',
    title: 'Team Leads',
    columns: [
      { key: 'full_name', header: 'Name', render: (row): React.ReactNode => String(row.full_name || '—') },
      { key: 'email', header: 'Email' },
      { key: 'status', header: 'Status', render: (row): React.ReactNode => <Badge variant={row.status === 'active' ? 'success' : 'danger'}>{titleCase(row.status as string)}</Badge> },
      { key: 'created_at', header: 'Joined', render: (row): React.ReactNode => formatDate(row.created_at as string) },
    ],
    searchFields: ['full_name', 'email'],
    canExport: true,
  },
  admins: {
    table: 'profiles',
    title: 'Admins',
    columns: [
      { key: 'full_name', header: 'Name', render: (row): React.ReactNode => String(row.full_name || '—') },
      { key: 'email', header: 'Email' },
      { key: 'status', header: 'Status', render: (row): React.ReactNode => <Badge variant={row.status === 'active' ? 'success' : 'danger'}>{titleCase(row.status as string)}</Badge> },
      { key: 'created_at', header: 'Joined', render: (row): React.ReactNode => formatDate(row.created_at as string) },
    ],
    searchFields: ['full_name', 'email'],
    canExport: true,
  },
  teams: {
    table: 'teams',
    title: 'Teams',
    columns: [
      { key: 'name', header: 'Team Name' },
      { key: 'status', header: 'Status', render: (row) => <Badge variant={row.status === 'active' ? 'success' : 'neutral'}>{titleCase(row.status as string)}</Badge> },
      { key: 'created_at', header: 'Created', render: (row) => formatDate(row.created_at as string) },
    ],
    searchFields: ['name'],
    canExport: true,
    canCreate: true,
  },
  projects: {
    table: 'projects',
    title: 'Projects',
    columns: [
      { key: 'name', header: 'Project Name' },
      { key: 'status', header: 'Status', render: (row) => <Badge variant={row.status === 'active' ? 'success' : row.status === 'completed' ? 'teal' : 'neutral'}>{titleCase(row.status as string)}</Badge> },
      { key: 'start_date', header: 'Start Date', render: (row) => formatDate(row.start_date as string) },
      { key: 'end_date', header: 'End Date', render: (row) => formatDate(row.end_date as string) },
    ],
    searchFields: ['name', 'description'],
    filters: [{ field: 'status', label: 'Status', options: [{ value: 'planning', label: 'Planning' }, { value: 'onboarding', label: 'Onboarding' }, { value: 'active', label: 'Active' }, { value: 'paused', label: 'Paused' }, { value: 'completed', label: 'Completed' }] }],
    canExport: true,
    canCreate: true,
  },
  tasks: {
    table: 'tasks',
    title: 'Tasks',
    columns: [
      { key: 'title', header: 'Title' },
      { key: 'priority', header: 'Priority', render: (row) => <Badge variant={row.priority === 'urgent' ? 'danger' : row.priority === 'high' ? 'warning' : 'neutral'}>{titleCase(row.priority as string)}</Badge> },
      { key: 'status', header: 'Status', render: (row) => <Badge variant={row.status === 'completed' ? 'success' : row.status === 'in_progress' ? 'warning' : 'neutral'}>{titleCase(row.status as string)}</Badge> },
      { key: 'deadline', header: 'Deadline', render: (row) => formatDate(row.deadline as string) },
    ],
    searchFields: ['title', 'description'],
    filters: [
      { field: 'status', label: 'Status', options: [{ value: 'pending', label: 'Pending' }, { value: 'in_progress', label: 'In Progress' }, { value: 'completed', label: 'Completed' }] },
      { field: 'priority', label: 'Priority', options: [{ value: 'low', label: 'Low' }, { value: 'medium', label: 'Medium' }, { value: 'high', label: 'High' }, { value: 'urgent', label: 'Urgent' }] },
    ],
    canExport: true,
    canCreate: true,
  },
  tickets: {
    table: 'tickets',
    title: 'Tickets',
    columns: [
      { key: 'subject', header: 'Subject' },
      { key: 'category', header: 'Category', render: (row) => titleCase(row.category as string) },
      { key: 'priority', header: 'Priority', render: (row) => <Badge variant={row.priority === 'urgent' ? 'danger' : row.priority === 'high' ? 'warning' : 'neutral'}>{titleCase(row.priority as string)}</Badge> },
      { key: 'status', header: 'Status', render: (row) => <Badge variant={row.status === 'open' ? 'info' : row.status === 'resolved' ? 'success' : 'warning'}>{titleCase((row.status as string).replace(/_/g, ' '))}</Badge> },
      { key: 'created_at', header: 'Created', render: (row) => formatDate(row.created_at as string) },
    ],
    searchFields: ['subject', 'description'],
    filters: [
      { field: 'status', label: 'Status', options: [{ value: 'open', label: 'Open' }, { value: 'in_progress', label: 'In Progress' }, { value: 'resolved', label: 'Resolved' }, { value: 'closed', label: 'Closed' }] },
      { field: 'priority', label: 'Priority', options: [{ value: 'low', label: 'Low' }, { value: 'medium', label: 'Medium' }, { value: 'high', label: 'High' }, { value: 'urgent', label: 'Urgent' }] },
    ],
    canExport: true,
    canCreate: true,
  },
  leads: {
    table: 'leads',
    title: 'Leads',
    columns: [
      { key: 'company', header: 'Company' },
      { key: 'contact_name', header: 'Contact' },
      { key: 'email', header: 'Email' },
      { key: 'source', header: 'Source', render: (row) => titleCase(row.source as string) },
      { key: 'status', header: 'Status', render: (row) => <Badge variant={row.status === 'won' ? 'success' : row.status === 'lost' ? 'danger' : 'info'}>{titleCase(row.status as string)}</Badge> },
      { key: 'created_at', header: 'Created', render: (row) => formatDate(row.created_at as string) },
    ],
    searchFields: ['company', 'contact_name', 'email'],
    filters: [
      { field: 'status', label: 'Status', options: [{ value: 'new', label: 'New' }, { value: 'contacted', label: 'Contacted' }, { value: 'qualified', label: 'Qualified' }, { value: 'proposal', label: 'Proposal' }, { value: 'won', label: 'Won' }, { value: 'lost', label: 'Lost' }] },
      { field: 'source', label: 'Source', options: [{ value: 'website', label: 'Website' }, { value: 'linkedin', label: 'LinkedIn' }, { value: 'referral', label: 'Referral' }, { value: 'email', label: 'Email' }] },
    ],
    canExport: true,
    canCreate: true,
  },
  attendance: {
    table: 'attendance',
    title: 'Attendance',
    columns: [
      { key: 'date', header: 'Date', render: (row) => formatDate(row.date as string) },
      { key: 'clock_in', header: 'Clock In', render: (row) => row.clock_in ? new Date(row.clock_in as string).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '—' },
      { key: 'clock_out', header: 'Clock Out', render: (row) => row.clock_out ? new Date(row.clock_out as string).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '—' },
      { key: 'total_hours', header: 'Hours', render: (row) => row.total_hours ? `${row.total_hours}h` : '—' },
      { key: 'status', header: 'Status', render: (row) => <Badge variant={row.status === 'present' ? 'success' : row.status === 'absent' ? 'danger' : 'warning'}>{titleCase(row.status as string)}</Badge> },
    ],
    searchFields: ['employee_id'],
    filters: [{ field: 'status', label: 'Status', options: [{ value: 'present', label: 'Present' }, { value: 'late', label: 'Late' }, { value: 'absent', label: 'Absent' }, { value: 'on_leave', label: 'On Leave' }] }],
    canExport: true,
  },
  performance: {
    table: 'performance',
    title: 'Performance',
    columns: [
      { key: 'period', header: 'Period' },
      { key: 'tickets_handled', header: 'Tickets' },
      { key: 'resolution_rate', header: 'Resolution', render: (row) => `${row.resolution_rate}%` },
      { key: 'quality_score', header: 'Quality', render: (row) => `${row.quality_score}/100` },
      { key: 'overall_score', header: 'Overall', render: (row) => <Badge variant={Number(row.overall_score) >= 80 ? 'success' : 'warning'}>{String(row.overall_score)}/100</Badge> },
    ],
    searchFields: ['period'],
    canExport: true,
  },
  payroll: {
    table: 'payroll',
    title: 'Payroll',
    columns: [
      { key: 'salary_period', header: 'Period' },
      { key: 'base_salary', header: 'Base', render: (row) => formatCurrency(row.base_salary as number) },
      { key: 'bonus', header: 'Bonus', render: (row) => formatCurrency(row.bonus as number) },
      { key: 'net_salary', header: 'Net', render: (row) => formatCurrency(row.net_salary as number) },
      { key: 'payment_status', header: 'Status', render: (row) => <Badge variant={row.payment_status === 'paid' ? 'success' : row.payment_status === 'pending' ? 'warning' : 'neutral'}>{titleCase(row.payment_status as string)}</Badge> },
    ],
    searchFields: ['salary_period'],
    canExport: true,
  },
  documents: {
    table: 'documents',
    title: 'Documents',
    columns: [
      { key: 'name', header: 'Name' },
      { key: 'category', header: 'Category', render: (row) => titleCase(row.category as string) },
      { key: 'created_at', header: 'Uploaded', render: (row) => formatDate(row.created_at as string) },
    ],
    searchFields: ['name'],
    canCreate: true,
  },
  announcements: {
    table: 'announcements',
    title: 'Announcements',
    columns: [
      { key: 'title', header: 'Title' },
      { key: 'audience', header: 'Audience', render: (row) => titleCase((row.audience as string).replace(/_/g, ' ')) },
      { key: 'priority', header: 'Priority', render: (row) => <Badge variant={row.priority === 'high' ? 'danger' : row.priority === 'medium' ? 'warning' : 'neutral'}>{titleCase(row.priority as string)}</Badge> },
      { key: 'published', header: 'Published', render: (row) => <Badge variant={row.published ? 'success' : 'neutral'}>{row.published ? 'Yes' : 'No'}</Badge> },
      { key: 'created_at', header: 'Created', render: (row) => formatDate(row.created_at as string) },
    ],
    searchFields: ['title', 'message'],
    canCreate: true,
  },
  faqs: {
    table: 'faqs',
    title: 'FAQs',
    columns: [
      { key: 'question', header: 'Question' },
      { key: 'category', header: 'Category' },
      { key: 'published', header: 'Published', render: (row) => <Badge variant={row.published ? 'success' : 'neutral'}>{row.published ? 'Yes' : 'No'}</Badge> },
      { key: 'order', header: 'Order' },
    ],
    searchFields: ['question', 'answer'],
    canCreate: true,
    canDelete: true,
  },
  testimonials: {
    table: 'testimonials',
    title: 'Testimonials',
    columns: [
      { key: 'author_name', header: 'Author' },
      { key: 'author_title', header: 'Title' },
      { key: 'rating', header: 'Rating', render: (row) => `★ ${row.rating}` },
      { key: 'published', header: 'Published', render: (row) => <Badge variant={row.published ? 'success' : 'neutral'}>{row.published ? 'Yes' : 'No'}</Badge> },
    ],
    searchFields: ['author_name', 'content'],
    canCreate: true,
    canDelete: true,
  },
  'legal-pages': {
    table: 'legal_pages',
    title: 'Legal Pages',
    columns: [
      { key: 'title', header: 'Title' },
      { key: 'slug', header: 'Slug' },
      { key: 'last_updated', header: 'Last Updated', render: (row) => formatDate(row.last_updated as string) },
    ],
    searchFields: ['title', 'slug'],
    canCreate: true,
  },
  'audit-logs': {
    table: 'audit_logs',
    title: 'Audit Logs',
    columns: [
      { key: 'action', header: 'Action' },
      { key: 'entity', header: 'Entity' },
      { key: 'created_at', header: 'Time', render: (row) => formatDate(row.created_at as string) },
    ],
    searchFields: ['action', 'entity'],
    canExport: true,
  },
};

export function GenericListPage({ page, role }: GenericListPageProps) {
  const { profile } = useAuth();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const config = pageConfig[page];

  // Build filter object for query
  const queryFilter = useMemo(() => {
    const result: Record<string, unknown> = {};
    if (config?.filters) {
      config.filters.forEach((f) => {
        if (filters[f.field]) result[f.field] = filters[f.field];
      });
    }
    // Role-based filtering
    if (page === 'agents' || page === 'clients' || page === 'team-leads' || page === 'admins') {
      const roleMap: Record<string, string> = {
        agents: 'agent',
        clients: 'client',
        'team-leads': 'team_lead',
        admins: 'admin',
      };
      result.role = roleMap[page];
    }
    return result;
  }, [config, filters, page]);

  const { data, isLoading, error, refetch } = useTableData<Record<string, unknown>>(
    config?.table || 'profiles',
    {
      filter: queryFilter,
      limit: 100,
    }
  );

  const deleteMutation = useDelete(config?.table || 'profiles');

  // Client-side search filtering
  const filteredData = useMemo(() => {
    if (!data) return [];
    if (!search) return data;
    const searchLower = search.toLowerCase();
    return data.filter((row) =>
      config?.searchFields.some((field) =>
        String(row[field] || '').toLowerCase().includes(searchLower)
      )
    );
  }, [data, search, config]);

  const handleExport = () => {
    if (filteredData.length > 0) {
      downloadCSV(`${page}-${new Date().toISOString().split('T')[0]}.csv`, filteredData);
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteMutation.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  if (!config) {
    return (
      <Card className="p-12">
        <EmptyState
          icon="inbox"
          title="Page Coming Soon"
          description={`The ${page} page is under development. Check back soon.`}
        />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-8">
        <ErrorState
          title="Failed to load data"
          description={error instanceof Error ? error.message : 'Please try again later.'}
          onRetry={() => refetch()}
        />
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-navy-900 dark:text-white">{config.title}</h2>
          <p className="text-sm text-navy-500">{filteredData.length} {filteredData.length === 1 ? 'record' : 'records'} found</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {config.canExport && (
            <Button variant="outline" size="sm" leftIcon={<Download className="w-4 h-4" />} onClick={handleExport} disabled={filteredData.length === 0}>
              Export
            </Button>
          )}
          {config.canCreate && role !== 'agent' && role !== 'client' && (
            <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
              Add New
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-10"
            />
          </div>
          {config.filters?.map((filter) => (
            <select
              key={filter.field}
              value={filters[filter.field] || ''}
              onChange={(e) => setFilters({ ...filters, [filter.field]: e.target.value })}
              className="input sm:w-48 cursor-pointer"
            >
              <option value="">{filter.label}: All</option>
              {filter.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ))}
        </div>
      </Card>

      {/* Data Table */}
      <DataTable
        columns={[
          ...config.columns.map((col) => ({
            key: col.key,
            header: col.header,
            render: col.render as ((row: { id: string }) => React.ReactNode) | undefined,
          })),
          ...(config.canDelete || role === 'super_admin'
            ? [{
                key: 'actions',
                header: 'Actions',
                render: (row: { id: string }) => (
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 rounded-lg hover:bg-navy-100 dark:hover:bg-navy-700" aria-label="View">
                      <Eye className="w-4 h-4 text-navy-500" />
                    </button>
                    {config.canDelete && (
                      <button
                        onClick={() => setDeleteId(row.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                        aria-label="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    )}
                  </div>
                ),
              }]
            : []),
        ]}
        data={filteredData as unknown as { id: string }[]}
        loading={isLoading}
        emptyState={
          <EmptyState
            icon="inbox"
            title={`No ${config.title.toLowerCase()} found`}
            description="Try adjusting your filters or search terms."
          />
        }
      />

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Record"
        message="Are you sure you want to delete this record? This action cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
}
