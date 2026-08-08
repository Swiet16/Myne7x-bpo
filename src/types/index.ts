export type UserRole = 'super_admin' | 'admin' | 'team_lead' | 'agent' | 'client';

export type UserStatus = 'active' | 'inactive' | 'suspended' | 'terminated';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  role: UserRole;
  status: UserStatus;
  is_demo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Employee {
  id: string;
  user_id: string;
  employee_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  department: string | null;
  team_id: string | null;
  team_lead_id: string | null;
  designation: string | null;
  status: 'active' | 'inactive' | 'on_leave' | 'suspended' | 'terminated';
  skills: string[] | null;
  languages: string[] | null;
  experience: number | null;
  joining_date: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  user_id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string | null;
  industry: string | null;
  website: string | null;
  country: string | null;
  status: 'active' | 'inactive' | 'suspended';
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Team {
  id: string;
  name: string;
  description: string | null;
  team_lead_id: string | null;
  status: 'active' | 'inactive';
  created_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  employee_id: string;
  joined_date: string;
  status: 'active' | 'inactive';
}

export interface Project {
  id: string;
  name: string;
  client_id: string;
  industry: string | null;
  description: string | null;
  start_date: string;
  end_date: string | null;
  status: 'planning' | 'onboarding' | 'active' | 'paused' | 'completed' | 'cancelled';
  team_id: string | null;
  team_lead_id: string | null;
  support_channels: string[] | null;
  contract_url: string | null;
  sla: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type TaskStatus = 'pending' | 'assigned' | 'in_progress' | 'waiting' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'completed' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  project_id: string | null;
  assigned_to: string | null;
  assigned_by: string | null;
  team_id: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  deadline: string | null;
  instructions: string | null;
  feedback: string | null;
  created_at: string;
  updated_at: string;
}

export type TicketStatus = 'open' | 'in_progress' | 'waiting_for_client' | 'escalated' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TicketCategory = 'technical' | 'customer_support' | 'hr' | 'operations' | 'payroll' | 'it' | 'client_escalation' | 'other';

export interface Ticket {
  id: string;
  subject: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  created_by: string;
  assigned_to: string | null;
  project_id: string | null;
  attachment_url: string | null;
  created_at: string;
  updated_at: string;
}

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost' | 'archived';
export type LeadSource = 'website' | 'clutch' | 'linkedin' | 'email' | 'referral' | 'whatsapp' | 'other';

export interface Lead {
  id: string;
  company: string;
  contact_name: string;
  email: string;
  phone: string | null;
  country: string | null;
  industry: string | null;
  website: string | null;
  service_required: string | null;
  agents_required: number | null;
  budget: string | null;
  source: LeadSource;
  assigned_to: string | null;
  status: LeadStatus;
  notes: string | null;
  last_contacted: string | null;
  next_follow_up: string | null;
  created_at: string;
  updated_at: string;
}

export interface Attendance {
  id: string;
  employee_id: string;
  date: string;
  clock_in: string | null;
  break_start: string | null;
  break_end: string | null;
  clock_out: string | null;
  total_hours: number | null;
  status: 'present' | 'late' | 'absent' | 'half_day' | 'on_leave' | 'holiday';
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Performance {
  id: string;
  employee_id: string;
  period: string;
  tickets_handled: number;
  calls_handled: number;
  chats_handled: number;
  emails_handled: number;
  resolution_rate: number;
  response_time: number;
  quality_score: number;
  attendance_score: number;
  customer_satisfaction: number;
  manager_rating: number;
  overall_score: number;
  created_at: string;
  updated_at: string;
}

export type PayrollStatus = 'pending' | 'approved' | 'paid' | 'cancelled';

export interface Payroll {
  id: string;
  employee_id: string;
  salary_period: string;
  base_salary: number;
  bonus: number;
  deductions: number;
  overtime: number;
  net_salary: number;
  payment_status: PayrollStatus;
  payment_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  audience: 'everyone' | 'agents' | 'team_leads' | 'admins' | 'clients' | 'specific_team';
  team_id: string | null;
  priority: 'low' | 'medium' | 'high';
  published: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  data: Record<string, unknown> | null;
  read: boolean;
  created_at: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  author_name: string;
  author_title: string;
  company: string | null;
  content: string;
  rating: number;
  published: boolean;
  created_at: string;
}

export interface LegalPage {
  id: string;
  slug: string;
  title: string;
  content: string;
  last_updated: string;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  description: string;
  features: string[] | null;
  icon: string | null;
  published: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  entity: string;
  entity_id: string | null;
  metadata: Record<string, unknown> | null;
  ip_address: string | null;
  created_at: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  created_at: string;
}

export interface QuoteRequest {
  id: string;
  full_name: string;
  company_name: string;
  email: string;
  phone: string;
  country: string;
  industry: string;
  website: string | null;
  service_required: string;
  estimated_monthly_volume: string;
  preferred_channel: string;
  agents_required: number;
  required_hours: string;
  current_setup: string | null;
  message: string | null;
  status: LeadStatus;
  created_at: string;
}

export interface WebsiteContent {
  id: string;
  section: string;
  key: string;
  value: string;
  type: 'text' | 'json' | 'html';
  updated_at: string;
}
