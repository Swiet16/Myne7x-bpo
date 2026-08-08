-- ============================================================================
-- MYNE7X BPO - Complete Supabase Database Migration
-- ============================================================================
-- This migration creates the complete database schema with:
-- - All required tables
-- - Enums and custom types
-- - Indexes for performance
-- - Foreign key constraints
-- - Row Level Security (RLS) policies
-- - Storage bucket policies
-- - Trigger functions for audit logging and timestamps
-- - Role helper functions
-- ============================================================================

-- ============================================================================
-- EXTENSIONS & UTILITY FUNCTIONS
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Function to update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to check if current user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_role TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = _role
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Function to check if current user is super_admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN public.has_role('super_admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Function to check if current user is admin or above
CREATE OR REPLACE FUNCTION public.is_admin_or_above()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN public.has_role('super_admin') OR public.has_role('admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Function to get current user's employee record
CREATE OR REPLACE FUNCTION public.get_my_employee_id()
RETURNS UUID AS $$
DECLARE
    emp_id UUID;
BEGIN
    SELECT id INTO emp_id FROM public.employees WHERE user_id = auth.uid() LIMIT 1;
    RETURN emp_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================================================
-- PROFILES TABLE (extends Supabase auth.users)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'client' CHECK (
        role IN ('super_admin', 'admin', 'team_lead', 'agent', 'client')
    ),
    status TEXT NOT NULL DEFAULT 'active' CHECK (
        status IN ('active', 'inactive', 'suspended', 'terminated')
    ),
    is_demo BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- EMPLOYEES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    employee_id TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    department TEXT,
    team_id UUID,
    team_lead_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    designation TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (
        status IN ('active', 'inactive', 'on_leave', 'suspended', 'terminated')
    ),
    skills TEXT[],
    languages TEXT[],
    experience INTEGER,
    joining_date DATE NOT NULL DEFAULT CURRENT_DATE,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_employees_user_id ON public.employees(user_id);
CREATE INDEX IF NOT EXISTS idx_employees_team_id ON public.employees(team_id);
CREATE INDEX IF NOT EXISTS idx_employees_status ON public.employees(status);
CREATE INDEX IF NOT EXISTS idx_employees_email ON public.employees(email);

CREATE TRIGGER update_employees_updated_at
    BEFORE UPDATE ON public.employees
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- CLIENTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    industry TEXT,
    website TEXT,
    country TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (
        status IN ('active', 'inactive', 'suspended')
    ),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_clients_user_id ON public.clients(user_id);
CREATE INDEX IF NOT EXISTS idx_clients_status ON public.clients(status);

CREATE TRIGGER update_clients_updated_at
    BEFORE UPDATE ON public.clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TEAMS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    team_lead_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_teams_team_lead_id ON public.teams(team_lead_id);
CREATE INDEX IF NOT EXISTS idx_teams_status ON public.teams(status);

CREATE TRIGGER update_teams_updated_at
    BEFORE UPDATE ON public.teams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TEAM MEMBERS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    joined_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON public.team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_employee_id ON public.team_members(employee_id);

-- ============================================================================
-- PROJECTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
    industry TEXT,
    description TEXT,
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE,
    status TEXT NOT NULL DEFAULT 'planning' CHECK (
        status IN ('planning', 'onboarding', 'active', 'paused', 'completed', 'cancelled')
    ),
    team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
    team_lead_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    support_channels TEXT[],
    contract_url TEXT,
    sla TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_client_id ON public.projects(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_team_id ON public.projects(team_id);

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TASKS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    assigned_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (
        status IN ('pending', 'assigned', 'in_progress', 'waiting', 'submitted',
                   'under_review', 'approved', 'rejected', 'completed', 'cancelled')
    ),
    deadline TIMESTAMPTZ,
    instructions TEXT,
    feedback TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON public.tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_by ON public.tasks(assigned_by);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON public.tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON public.tasks(project_id);

CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON public.tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TASK COMMENTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.task_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_task_comments_task_id ON public.task_comments(task_id);

-- ============================================================================
-- TICKETS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'other' CHECK (
        category IN ('technical', 'customer_support', 'hr', 'operations', 'payroll',
                     'it', 'client_escalation', 'other')
    ),
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status TEXT NOT NULL DEFAULT 'open' CHECK (
        status IN ('open', 'in_progress', 'waiting_for_client', 'escalated', 'resolved', 'closed')
    ),
    created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    attachment_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tickets_created_by ON public.tickets(created_by);
CREATE INDEX IF NOT EXISTS idx_tickets_assigned_to ON public.tickets(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON public.tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_priority ON public.tickets(priority);
CREATE INDEX IF NOT EXISTS idx_tickets_category ON public.tickets(category);

CREATE TRIGGER update_tickets_updated_at
    BEFORE UPDATE ON public.tickets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TICKET COMMENTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.ticket_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ticket_comments_ticket_id ON public.ticket_comments(ticket_id);

-- ============================================================================
-- LEADS TABLE (CRM)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    country TEXT,
    industry TEXT,
    website TEXT,
    service_required TEXT,
    agents_required INTEGER,
    budget TEXT,
    source TEXT NOT NULL DEFAULT 'website' CHECK (
        source IN ('website', 'clutch', 'linkedin', 'email', 'referral', 'whatsapp', 'other')
    ),
    assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'new' CHECK (
        status IN ('new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost', 'archived')
    ),
    notes TEXT,
    last_contacted TIMESTAMPTZ,
    next_follow_up TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_source ON public.leads(source);
CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON public.leads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(email);

CREATE TRIGGER update_leads_updated_at
    BEFORE UPDATE ON public.leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- LEAD ACTIVITIES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.lead_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    activity_type TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lead_activities_lead_id ON public.lead_activities(lead_id);

-- ============================================================================
-- ATTENDANCE TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    clock_in TIMESTAMPTZ,
    break_start TIMESTAMPTZ,
    break_end TIMESTAMPTZ,
    clock_out TIMESTAMPTZ,
    total_hours DECIMAL(5,2),
    status TEXT NOT NULL DEFAULT 'absent' CHECK (
        status IN ('present', 'late', 'absent', 'half_day', 'on_leave', 'holiday')
    ),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_attendance_employee_id ON public.attendance(employee_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON public.attendance(date);
CREATE INDEX IF NOT EXISTS idx_attendance_status ON public.attendance(status);
CREATE UNIQUE INDEX IF NOT EXISTS idx_attendance_employee_date ON public.attendance(employee_id, date);

CREATE TRIGGER update_attendance_updated_at
    BEFORE UPDATE ON public.attendance
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SCHEDULES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    break_duration INTEGER DEFAULT 60,
    shift_type TEXT DEFAULT 'regular' CHECK (shift_type IN ('regular', 'night', 'weekend', 'flexible')),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_schedules_employee_id ON public.schedules(employee_id);
CREATE INDEX IF NOT EXISTS idx_schedules_date ON public.schedules(date);

-- ============================================================================
-- PERFORMANCE TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.performance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    period TEXT NOT NULL,
    tickets_handled INTEGER DEFAULT 0,
    calls_handled INTEGER DEFAULT 0,
    chats_handled INTEGER DEFAULT 0,
    emails_handled INTEGER DEFAULT 0,
    resolution_rate DECIMAL(5,2) DEFAULT 0,
    response_time DECIMAL(8,2) DEFAULT 0,
    quality_score DECIMAL(5,2) DEFAULT 0,
    attendance_score DECIMAL(5,2) DEFAULT 0,
    customer_satisfaction DECIMAL(3,2) DEFAULT 0,
    manager_rating DECIMAL(3,2) DEFAULT 0,
    overall_score DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_performance_employee_id ON public.performance(employee_id);
CREATE INDEX IF NOT EXISTS idx_performance_period ON public.performance(period);

CREATE TRIGGER update_performance_updated_at
    BEFORE UPDATE ON public.performance
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- PAYROLL TABLE (PRIVATE - STRICT RLS)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.payroll (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    salary_period TEXT NOT NULL,
    base_salary DECIMAL(12,2) NOT NULL DEFAULT 0,
    bonus DECIMAL(12,2) DEFAULT 0,
    deductions DECIMAL(12,2) DEFAULT 0,
    overtime DECIMAL(12,2) DEFAULT 0,
    net_salary DECIMAL(12,2) NOT NULL DEFAULT 0,
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (
        payment_status IN ('pending', 'approved', 'paid', 'cancelled')
    ),
    payment_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payroll_employee_id ON public.payroll(employee_id);
CREATE INDEX IF NOT EXISTS idx_payroll_status ON public.payroll(payment_status);
CREATE INDEX IF NOT EXISTS idx_payroll_period ON public.payroll(salary_period);

CREATE TRIGGER update_payroll_updated_at
    BEFORE UPDATE ON public.payroll
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- DOCUMENTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL DEFAULT 'general' CHECK (
        category IN ('employee', 'client', 'project', 'contract', 'report', 'general')
    ),
    file_url TEXT NOT NULL,
    file_type TEXT,
    file_size BIGINT,
    uploaded_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    employee_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    is_private BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_documents_category ON public.documents(category);
CREATE INDEX IF NOT EXISTS idx_documents_uploaded_by ON public.documents(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_documents_employee_id ON public.documents(employee_id);
CREATE INDEX IF NOT EXISTS idx_documents_client_id ON public.documents(client_id);

-- ============================================================================
-- ANNOUNCEMENTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    audience TEXT NOT NULL DEFAULT 'everyone' CHECK (
        audience IN ('everyone', 'agents', 'team_leads', 'admins', 'clients', 'specific_team')
    ),
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    published BOOLEAN DEFAULT TRUE,
    created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_announcements_audience ON public.announcements(audience);
CREATE INDEX IF NOT EXISTS idx_announcements_published ON public.announcements(published);

CREATE TRIGGER update_announcements_updated_at
    BEFORE UPDATE ON public.announcements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- NOTIFICATIONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);

-- ============================================================================
-- SERVICES TABLE (CMS)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    features TEXT[],
    icon TEXT,
    published BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_services_updated_at
    BEFORE UPDATE ON public.services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- INDUSTRIES TABLE (CMS)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.industries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT,
    published BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_industries_updated_at
    BEFORE UPDATE ON public.industries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- FAQS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.faqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'General',
    sort_order INTEGER DEFAULT 0,
    published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_faqs_published ON public.faqs(published);
CREATE INDEX IF NOT EXISTS idx_faqs_category ON public.faqs(category);

CREATE TRIGGER update_faqs_updated_at
    BEFORE UPDATE ON public.faqs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TESTIMONIALS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_name TEXT NOT NULL,
    author_title TEXT,
    company TEXT,
    content TEXT NOT NULL,
    rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    avatar_url TEXT,
    published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_testimonials_published ON public.testimonials(published);

CREATE TRIGGER update_testimonials_updated_at
    BEFORE UPDATE ON public.testimonials
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- WEBSITE CONTENT TABLE (CMS)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.website_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section TEXT NOT NULL,
    key TEXT NOT NULL,
    value TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'text' CHECK (type IN ('text', 'json', 'html')),
    updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_website_content_section_key ON public.website_content(section, key);

-- ============================================================================
-- LEGAL PAGES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.legal_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    last_updated DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_legal_pages_updated_at
    BEFORE UPDATE ON public.legal_pages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- AUDIT LOGS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity TEXT NOT NULL,
    entity_id UUID,
    metadata JSONB,
    ip_address INET,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON public.audit_logs(entity);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at);

-- ============================================================================
-- CONTACT SUBMISSIONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.contact_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON public.contact_submissions(status);

-- ============================================================================
-- QUOTE REQUESTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.quote_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    company_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    country TEXT NOT NULL,
    industry TEXT,
    website TEXT,
    service_required TEXT NOT NULL,
    estimated_monthly_volume TEXT,
    preferred_channel TEXT,
    agents_required INTEGER DEFAULT 1,
    required_hours TEXT,
    current_setup TEXT,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'new' CHECK (
        status IN ('new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost', 'archived')
    ),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quote_requests_status ON public.quote_requests(status);

-- ============================================================================
-- SUPPORT MESSAGES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.support_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    recipient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_support_messages_sender_id ON public.support_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_support_messages_recipient_id ON public.support_messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_support_messages_project_id ON public.support_messages(project_id);

-- ============================================================================
-- TRIGGER: Auto-create profile on user signup
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role, status)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        'client',  -- Default role is 'client' - NEVER allow public registration as admin
        'active'
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- TRIGGER: Audit log for role changes
-- ============================================================================

CREATE OR REPLACE FUNCTION public.log_role_change()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.role IS DISTINCT FROM OLD.role THEN
        INSERT INTO public.audit_logs (user_id, action, entity, entity_id, metadata)
        VALUES (
            auth.uid(),
            'role_change',
            'profiles',
            NEW.id,
            jsonb_build_object('old_role', OLD.role, 'new_role', NEW.role)
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_profile_role_change ON public.profiles;
CREATE TRIGGER on_profile_role_change
    AFTER UPDATE OF role ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.log_role_change();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.industries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES: PROFILES
-- ============================================================================

-- Users can view their own profile
-- Super admins can view all profiles
-- Admins can view all profiles
-- Team leads can view their team members
-- Agents can view their own profile only
-- Clients can view their own profile only

CREATE POLICY "profiles_select_own_or_admin" ON public.profiles
    FOR SELECT USING (
        id = auth.uid() OR
        public.is_super_admin() OR
        public.is_admin_or_above()
    );

CREATE POLICY "profiles_update_own" ON public.profiles
    FOR UPDATE USING (
        id = auth.uid() OR
        public.is_super_admin() OR
        (public.is_admin_or_above() AND role != 'super_admin')
    );

-- Only super_admin can delete profiles, and never the first super_admin
CREATE POLICY "profiles_delete_super_admin_only" ON public.profiles
    FOR DELETE USING (
        public.is_super_admin() AND
        role != 'super_admin'
    );

-- Prevent users from changing their own role
-- (The update policy above allows self-update, but we add a trigger constraint)
CREATE OR REPLACE FUNCTION public.prevent_role_escalation()
RETURNS TRIGGER AS $$
BEGIN
    -- Users cannot change their own role
    IF NEW.role IS DISTINCT FROM OLD.role AND auth.uid() = OLD.id AND NOT public.is_super_admin() THEN
        RAISE EXCEPTION 'You cannot change your own role';
    END IF;

    -- Only super_admin can create admin or super_admin roles
    IF (NEW.role = 'super_admin' OR NEW.role = 'admin') AND NOT public.is_super_admin() THEN
        RAISE EXCEPTION 'Only super admins can assign admin roles';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS prevent_role_escalation ON public.profiles;
CREATE TRIGGER prevent_role_escalation
    BEFORE UPDATE OF role ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.prevent_role_escalation();

-- ============================================================================
-- RLS POLICIES: EMPLOYEES
-- ============================================================================

CREATE POLICY "employees_select_authorized" ON public.employees
    FOR SELECT USING (
        user_id = auth.uid() OR
        public.is_super_admin() OR
        public.is_admin_or_above() OR
        public.has_role('team_lead')
    );

CREATE POLICY "employees_modify_admin" ON public.employees
    FOR ALL USING (
        public.is_super_admin() OR
        public.is_admin_or_above()
    ) WITH CHECK (
        public.is_super_admin() OR
        public.is_admin_or_above()
    );

-- ============================================================================
-- RLS POLICIES: CLIENTS
-- ============================================================================

CREATE POLICY "clients_select_own_or_admin" ON public.clients
    FOR SELECT USING (
        user_id = auth.uid() OR
        public.is_super_admin() OR
        public.is_admin_or_above()
    );

CREATE POLICY "clients_modify_admin" ON public.clients
    FOR ALL USING (
        public.is_super_admin() OR
        public.is_admin_or_above()
    ) WITH CHECK (
        public.is_super_admin() OR
        public.is_admin_or_above()
    );

-- ============================================================================
-- RLS POLICIES: TEAMS
-- ============================================================================

CREATE POLICY "teams_select_authorized" ON public.teams
    FOR SELECT USING (
        public.is_super_admin() OR
        public.is_admin_or_above() OR
        public.has_role('team_lead') OR
        public.has_role('agent') OR
        public.has_role('client')
    );

CREATE POLICY "teams_modify_admin" ON public.teams
    FOR ALL USING (
        public.is_super_admin() OR
        public.is_admin_or_above()
    ) WITH CHECK (
        public.is_super_admin() OR
        public.is_admin_or_above()
    );

-- ============================================================================
-- RLS POLICIES: TEAM MEMBERS
-- ============================================================================

CREATE POLICY "team_members_select_authorized" ON public.team_members
    FOR SELECT USING (
        public.is_super_admin() OR
        public.is_admin_or_above() OR
        public.has_role('team_lead') OR
        employee_id IN (SELECT id FROM public.employees WHERE user_id = auth.uid())
    );

CREATE POLICY "team_members_modify_admin" ON public.team_members
    FOR ALL USING (
        public.is_super_admin() OR
        public.is_admin_or_above()
    ) WITH CHECK (
        public.is_super_admin() OR
        public.is_admin_or_above()
    );

-- ============================================================================
-- RLS POLICIES: PROJECTS
-- ============================================================================

CREATE POLICY "projects_select_authorized" ON public.projects
    FOR SELECT USING (
        public.is_super_admin() OR
        public.is_admin_or_above() OR
        public.has_role('team_lead') OR
        public.has_role('agent') OR
        (public.has_role('client') AND client_id IN (
            SELECT id FROM public.clients WHERE user_id = auth.uid()
        ))
    );

CREATE POLICY "projects_modify_admin" ON public.projects
    FOR ALL USING (
        public.is_super_admin() OR
        public.is_admin_or_above()
    ) WITH CHECK (
        public.is_super_admin() OR
        public.is_admin_or_above()
    );

-- ============================================================================
-- RLS POLICIES: TASKS
-- ============================================================================

CREATE POLICY "tasks_select_authorized" ON public.tasks
    FOR SELECT USING (
        assigned_to = auth.uid() OR
        assigned_by = auth.uid() OR
        public.is_super_admin() OR
        public.is_admin_or_above() OR
        public.has_role('team_lead')
    );

CREATE POLICY "tasks_insert_authorized" ON public.tasks
    FOR INSERT WITH CHECK (
        public.is_super_admin() OR
        public.is_admin_or_above() OR
        public.has_role('team_lead')
    );

CREATE POLICY "tasks_update_authorized" ON public.tasks
    FOR UPDATE USING (
        assigned_to = auth.uid() OR
        assigned_by = auth.uid() OR
        public.is_super_admin() OR
        public.is_admin_or_above() OR
        public.has_role('team_lead')
    );

CREATE POLICY "tasks_delete_admin" ON public.tasks
    FOR DELETE USING (
        public.is_super_admin() OR
        public.is_admin_or_above()
    );

-- ============================================================================
-- RLS POLICIES: TICKETS
-- ============================================================================

CREATE POLICY "tickets_select_authorized" ON public.tickets
    FOR SELECT USING (
        created_by = auth.uid() OR
        assigned_to = auth.uid() OR
        public.is_super_admin() OR
        public.is_admin_or_above() OR
        public.has_role('team_lead') OR
        public.has_role('agent')
    );

CREATE POLICY "tickets_insert_any" ON public.tickets
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "tickets_update_authorized" ON public.tickets
    FOR UPDATE USING (
        created_by = auth.uid() OR
        assigned_to = auth.uid() OR
        public.is_super_admin() OR
        public.is_admin_or_above() OR
        public.has_role('team_lead')
    );

-- ============================================================================
-- RLS POLICIES: LEADS (CRM)
-- ============================================================================

CREATE POLICY "leads_select_admin" ON public.leads
    FOR SELECT USING (
        public.is_super_admin() OR
        public.is_admin_or_above() OR
        assigned_to = auth.uid()
    );

CREATE POLICY "leads_modify_admin" ON public.leads
    FOR ALL USING (
        public.is_super_admin() OR
        public.is_admin_or_above()
    ) WITH CHECK (
        public.is_super_admin() OR
        public.is_admin_or_above()
    );

-- ============================================================================
-- RLS POLICIES: ATTENDANCE
-- ============================================================================

-- Agents can only see their own attendance
-- Team leads can see their team's attendance
-- Admins can see all attendance

CREATE POLICY "attendance_select_own_or_admin" ON public.attendance
    FOR SELECT USING (
        employee_id = auth.uid() OR
        public.is_super_admin() OR
        public.is_admin_or_above() OR
        public.has_role('team_lead')
    );

CREATE POLICY "attendance_insert_own_or_admin" ON public.attendance
    FOR INSERT WITH CHECK (
        employee_id = auth.uid() OR
        public.is_super_admin() OR
        public.is_admin_or_above()
    );

CREATE POLICY "attendance_update_own_or_admin" ON public.attendance
    FOR UPDATE USING (
        employee_id = auth.uid() OR
        public.is_super_admin() OR
        public.is_admin_or_above()
    );

-- ============================================================================
-- RLS POLICIES: PERFORMANCE
-- ============================================================================

CREATE POLICY "performance_select_own_or_admin" ON public.performance
    FOR SELECT USING (
        employee_id = auth.uid() OR
        public.is_super_admin() OR
        public.is_admin_or_above() OR
        public.has_role('team_lead')
    );

CREATE POLICY "performance_modify_admin" ON public.performance
    FOR ALL USING (
        public.is_super_admin() OR
        public.is_admin_or_above()
    ) WITH CHECK (
        public.is_super_admin() OR
        public.is_admin_or_above()
    );

-- ============================================================================
-- RLS POLICIES: PAYROLL (STRICT - MOST SENSITIVE)
-- ============================================================================

-- Agents can ONLY see their own payroll
-- Clients CANNOT see any payroll
-- Admins can see authorized payroll
-- Super admin can see all

CREATE POLICY "payroll_select_strict" ON public.payroll
    FOR SELECT USING (
        (employee_id = auth.uid() AND public.has_role('agent')) OR
        public.is_super_admin() OR
        (public.is_admin_or_above() AND NOT public.has_role('client'))
    );

CREATE POLICY "payroll_modify_admin_only" ON public.payroll
    FOR ALL USING (
        public.is_super_admin() OR
        public.is_admin_or_above()
    ) WITH CHECK (
        public.is_super_admin() OR
        public.is_admin_or_above()
    );

-- ============================================================================
-- RLS POLICIES: DOCUMENTS
-- ============================================================================

CREATE POLICY "documents_select_authorized" ON public.documents
    FOR SELECT USING (
        uploaded_by = auth.uid() OR
        employee_id = auth.uid() OR
        public.is_super_admin() OR
        public.is_admin_or_above() OR
        (public.has_role('client') AND client_id IN (
            SELECT id FROM public.clients WHERE user_id = auth.uid()
        ))
    );

CREATE POLICY "documents_insert_authenticated" ON public.documents
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "documents_modify_own_or_admin" ON public.documents
    FOR UPDATE USING (
        uploaded_by = auth.uid() OR
        public.is_super_admin() OR
        public.is_admin_or_above()
    );

CREATE POLICY "documents_delete_admin" ON public.documents
    FOR DELETE USING (
        public.is_super_admin() OR
        public.is_admin_or_above()
    );

-- ============================================================================
-- RLS POLICIES: ANNOUNCEMENTS
-- ============================================================================

-- Published announcements visible based on audience
CREATE POLICY "announcements_select_authorized" ON public.announcements
    FOR SELECT USING (
        public.is_super_admin() OR
        public.is_admin_or_above() OR
        (published = TRUE AND (
            audience = 'everyone' OR
            (audience = 'agents' AND public.has_role('agent')) OR
            (audience = 'team_leads' AND public.has_role('team_lead')) OR
            (audience = 'admins' AND public.is_admin_or_above()) OR
            (audience = 'clients' AND public.has_role('client'))
        ))
    );

CREATE POLICY "announcements_modify_admin" ON public.announcements
    FOR ALL USING (
        public.is_super_admin() OR
        public.is_admin_or_above() OR
        public.has_role('team_lead')
    ) WITH CHECK (
        public.is_super_admin() OR
        public.is_admin_or_above() OR
        public.has_role('team_lead')
    );

-- ============================================================================
-- RLS POLICIES: NOTIFICATIONS
-- ============================================================================

CREATE POLICY "notifications_select_own" ON public.notifications
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "notifications_insert_own_or_system" ON public.notifications
    FOR INSERT WITH CHECK (user_id = auth.uid() OR auth.uid() IS NOT NULL);

CREATE POLICY "notifications_update_own" ON public.notifications
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "notifications_delete_own" ON public.notifications
    FOR DELETE USING (user_id = auth.uid());

-- ============================================================================
-- RLS POLICIES: PUBLIC CMS TABLES (Services, Industries, FAQs, Testimonials, Legal Pages, Website Content)
-- ============================================================================

-- Services: Public can read published, admin can modify
CREATE POLICY "services_select_public" ON public.services
    FOR SELECT USING (published = TRUE OR public.is_super_admin());

CREATE POLICY "services_modify_admin" ON public.services
    FOR ALL USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

-- Industries: Public can read published, admin can modify
CREATE POLICY "industries_select_public" ON public.industries
    FOR SELECT USING (published = TRUE OR public.is_super_admin());

CREATE POLICY "industries_modify_admin" ON public.industries
    FOR ALL USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

-- FAQs: Public can read published, admin can modify
CREATE POLICY "faqs_select_public" ON public.faqs
    FOR SELECT USING (published = TRUE OR public.is_super_admin() OR public.is_admin_or_above());

CREATE POLICY "faqs_modify_admin" ON public.faqs
    FOR ALL USING (public.is_super_admin() OR public.is_admin_or_above())
    WITH CHECK (public.is_super_admin() OR public.is_admin_or_above());

-- Testimonials: Public can read published, admin can modify
CREATE POLICY "testimonials_select_public" ON public.testimonials
    FOR SELECT USING (published = TRUE OR public.is_super_admin());

CREATE POLICY "testimonials_modify_admin" ON public.testimonials
    FOR ALL USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

-- Website Content: Public can read, only super admin can modify
CREATE POLICY "website_content_select_public" ON public.website_content
    FOR SELECT USING (TRUE);

CREATE POLICY "website_content_modify_admin" ON public.website_content
    FOR ALL USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

-- Legal Pages: Public can read, only super admin can modify
CREATE POLICY "legal_pages_select_public" ON public.legal_pages
    FOR SELECT USING (TRUE);

CREATE POLICY "legal_pages_modify_admin" ON public.legal_pages
    FOR ALL USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

-- ============================================================================
-- RLS POLICIES: AUDIT LOGS (Super Admin Only)
-- ============================================================================

CREATE POLICY "audit_logs_select_super_admin" ON public.audit_logs
    FOR SELECT USING (public.is_super_admin());

CREATE POLICY "audit_logs_insert_authenticated" ON public.audit_logs
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================================================
-- RLS POLICIES: CONTACT SUBMISSIONS
-- ============================================================================

-- Anyone can submit, only admin can view
CREATE POLICY "contact_submissions_insert_public" ON public.contact_submissions
    FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "contact_submissions_select_admin" ON public.contact_submissions
    FOR SELECT USING (public.is_super_admin() OR public.is_admin_or_above());

CREATE POLICY "contact_submissions_modify_admin" ON public.contact_submissions
    FOR UPDATE USING (public.is_super_admin() OR public.is_admin_or_above());

CREATE POLICY "contact_submissions_delete_admin" ON public.contact_submissions
    FOR DELETE USING (public.is_super_admin());

-- ============================================================================
-- RLS POLICIES: QUOTE REQUESTS
-- ============================================================================

-- Anyone can submit, only admin can view
CREATE POLICY "quote_requests_insert_public" ON public.quote_requests
    FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "quote_requests_select_admin" ON public.quote_requests
    FOR SELECT USING (public.is_super_admin() OR public.is_admin_or_above());

CREATE POLICY "quote_requests_modify_admin" ON public.quote_requests
    FOR ALL USING (public.is_super_admin() OR public.is_admin_or_above())
    WITH CHECK (public.is_super_admin() OR public.is_admin_or_above());

-- ============================================================================
-- RLS POLICIES: SUPPORT MESSAGES
-- ============================================================================

CREATE POLICY "support_messages_select_participants" ON public.support_messages
    FOR SELECT USING (
        sender_id = auth.uid() OR
        recipient_id = auth.uid() OR
        public.is_super_admin() OR
        public.is_admin_or_above()
    );

CREATE POLICY "support_messages_insert_authenticated" ON public.support_messages
    FOR INSERT WITH CHECK (sender_id = auth.uid());

CREATE POLICY "support_messages_update_own" ON public.support_messages
    FOR UPDATE USING (
        sender_id = auth.uid() OR
        recipient_id = auth.uid()
    );

-- ============================================================================
-- STORAGE BUCKETS
-- ============================================================================

-- Insert storage buckets (using storage schema)
INSERT INTO storage.buckets (id, name, public) VALUES
    ('avatars', 'avatars', true),
    ('employee-documents', 'employee-documents', false),
    ('client-documents', 'client-documents', false),
    ('project-files', 'project-files', false),
    ('ticket-attachments', 'ticket-attachments', false),
    ('reports', 'reports', false)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- STORAGE POLICIES
-- ============================================================================

-- Avatars: Users can upload their own, everyone can view
CREATE POLICY "avatars_select_public" ON storage.objects
    FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "avatars_insert_own" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'avatars' AND auth.uid() IS NOT NULL
    );

CREATE POLICY "avatars_update_own" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'avatars' AND auth.uid() = owner
    );

-- Employee documents: Private, only authorized users
CREATE POLICY "employee_docs_select_authorized" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'employee-documents' AND (
            public.is_super_admin() OR
            public.is_admin_or_above() OR
            auth.uid() IS NOT NULL  -- Refined by document table RLS
        )
    );

CREATE POLICY "employee_docs_insert_authorized" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'employee-documents' AND auth.uid() IS NOT NULL
    );

-- Client documents: Private, only client and admin
CREATE POLICY "client_docs_select_authorized" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'client-documents' AND (
            public.is_super_admin() OR
            public.is_admin_or_above()
        )
    );

CREATE POLICY "client_docs_insert_authorized" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'client-documents' AND auth.uid() IS NOT NULL
    );

-- Project files: Private, authorized users only
CREATE POLICY "project_files_select_authorized" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'project-files' AND (
            public.is_super_admin() OR
            public.is_admin_or_above() OR
            auth.uid() IS NOT NULL
        )
    );

CREATE POLICY "project_files_insert_authorized" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'project-files' AND auth.uid() IS NOT NULL
    );

-- Ticket attachments
CREATE POLICY "ticket_attachments_select_authorized" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'ticket-attachments' AND auth.uid() IS NOT NULL
    );

CREATE POLICY "ticket_attachments_insert_authorized" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'ticket-attachments' AND auth.uid() IS NOT NULL
    );

-- Reports
CREATE POLICY "reports_select_authorized" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'reports' AND (
            public.is_super_admin() OR
            public.is_admin_or_above() OR
            public.has_role('client')
        )
    );

CREATE POLICY "reports_insert_authorized" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'reports' AND (
            public.is_super_admin() OR
            public.is_admin_or_above()
        )
    );

-- ============================================================================
-- SEED DATA: DEFAULT CONTENT
-- ============================================================================

-- Insert default services
INSERT INTO public.services (slug, title, description, features, icon, published, sort_order) VALUES
    ('customer-support', 'Customer Support', 'Comprehensive customer support outsourcing solutions.', ARRAY['Customer inquiries', 'Complaint handling', 'Account assistance', 'Escalation handling'], 'headphones', true, 1),
    ('call-center', 'Call Center', 'Professional inbound call center services.', ARRAY['Inbound calls', 'Order support', 'Appointment support', 'Escalations'], 'phone', true, 2),
    ('live-chat', 'Live Chat', 'Real-time website and app chat support.', ARRAY['Website chat', 'App chat', 'Real-time assistance', 'Proactive engagement'], 'message-square', true, 3),
    ('email-support', 'Email Support', 'Professional email support services.', ARRAY['Inbox management', 'Ticket responses', 'Follow-ups', 'Escalations'], 'mail', true, 4),
    ('back-office', 'Back Office', 'Reliable back-office outsourcing services.', ARRAY['Data entry', 'CRM updates', 'Order processing', 'Administrative operations'], 'clipboard-list', true, 5)
ON CONFLICT (slug) DO NOTHING;

-- Insert default industries
INSERT INTO public.industries (slug, title, description, icon, published, sort_order) VALUES
    ('ecommerce', 'E-commerce', 'Order support, returns, and customer care for online retailers.', 'shopping-bag', true, 1),
    ('technology', 'Technology & SaaS', 'Technical support and onboarding for software companies.', 'cpu', true, 2),
    ('transportation', 'Transportation', 'Logistics coordination and customer support for transport businesses.', 'truck', true, 3),
    ('consumer', 'Consumer Products & Services', 'Product support and service desk for consumer brands.', 'building', true, 4)
ON CONFLICT (slug) DO NOTHING;

-- Insert default legal pages
INSERT INTO public.legal_pages (slug, title, content, last_updated) VALUES
    ('terms', 'Terms & Conditions', 'These Terms and Conditions govern your use of the Myne7x BPO website and services. By accessing or using our services, you agree to be bound by these Terms.', CURRENT_DATE),
    ('privacy', 'Privacy Policy', 'This Privacy Policy describes how Myne7x BPO collects, uses, and protects your personal information.', CURRENT_DATE),
    ('cookie-policy', 'Cookie Policy', 'This Cookie Policy explains how Myne7x BPO uses cookies and similar technologies.', CURRENT_DATE),
    ('refund-policy', 'Refund Policy', 'This Refund Policy outlines the terms and conditions for refunds related to Myne7x BPO services.', CURRENT_DATE),
    ('service-agreement', 'Service Agreement', 'This Service Agreement outlines the terms under which Myne7x BPO provides outsourcing services to clients.', CURRENT_DATE),
    ('sla', 'Service Level Agreement', 'This Service Level Agreement (SLA) defines the performance standards for Myne7x BPO services.', CURRENT_DATE)
ON CONFLICT (slug) DO NOTHING;

-- Insert default FAQs
INSERT INTO public.faqs (question, answer, category, sort_order, published) VALUES
    ('What services does Myne7x BPO offer?', 'Myne7x BPO offers customer support outsourcing, call center services, live chat support, email support, back-office outsourcing, and help desk services.', 'General', 1, true),
    ('How quickly can we get started?', 'Typical onboarding takes 2-4 weeks depending on your requirements.', 'General', 2, true),
    ('How is pricing structured?', 'Our pricing is customized based on your specific needs. Contact us for a custom quote.', 'Pricing', 3, true),
    ('What hours can you provide coverage?', 'We offer 24/7 coverage, business hours, extended hours, and weekend-only options.', 'Operations', 4, true),
    ('How do you ensure quality?', 'We implement continuous quality monitoring including call recording and feedback sessions.', 'Operations', 5, true)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- COMPLETE
-- ============================================================================

-- Note: To create demo users, run the seed.sql file separately.
-- Demo users require auth.users entries which must be created through Supabase Auth API.
