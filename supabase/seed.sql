-- ============================================================================
-- MYNE7X BPO - Seed Data
-- ============================================================================
-- This file contains seed data for demo purposes.
-- Run this AFTER the main migration (001_initial_schema.sql).
--
-- IMPORTANT: To create demo users, you must first register them through the
-- Supabase Auth API (or the app's login page), then update their profiles
-- using the SQL below.
--
-- Demo accounts (create these users in Supabase Auth first):
--   - super.admin@myne7x.com / DemoPass123!
--   - admin@myne7x.com / DemoPass123!
--   - team.lead@myne7x.com / DemoPass123!
--   - agent@myne7x.com / DemoPass123!
--   - client@myne7x.com / DemoPass123!
-- ============================================================================

-- ============================================================================
-- UPDATE DEMO USER PROFILES (run AFTER creating auth users)
-- ============================================================================

-- Update the demo super admin
UPDATE public.profiles
SET
    role = 'super_admin',
    full_name = 'Super Admin',
    is_demo = TRUE,
    status = 'active'
WHERE email = 'super.admin@myne7x.com';

-- Update the demo admin
UPDATE public.profiles
SET
    role = 'admin',
    full_name = 'Demo Admin',
    is_demo = TRUE,
    status = 'active'
WHERE email = 'admin@myne7x.com';

-- Update the demo team lead
UPDATE public.profiles
SET
    role = 'team_lead',
    full_name = 'Demo Team Lead',
    is_demo = TRUE,
    status = 'active'
WHERE email = 'team.lead@myne7x.com';

-- Update the demo agent
UPDATE public.profiles
SET
    role = 'agent',
    full_name = 'Demo Agent',
    is_demo = TRUE,
    status = 'active'
WHERE email = 'agent@myne7x.com';

-- Update the demo client
UPDATE public.profiles
SET
    role = 'client',
    full_name = 'Demo Client',
    is_demo = TRUE,
    status = 'active'
WHERE email = 'client@myne7x.com';

-- ============================================================================
-- SEED TEAMS
-- ============================================================================

INSERT INTO public.teams (id, name, description, team_lead_id, status)
SELECT
    'a0000000-0000-0000-0000-000000000001',
    'Customer Support Team Alpha',
    'Primary customer support team handling inquiries and complaints.',
    (SELECT id FROM public.profiles WHERE email = 'team.lead@myne7x.com'),
    'active'
WHERE NOT EXISTS (SELECT 1 FROM public.teams WHERE name = 'Customer Support Team Alpha');

-- ============================================================================
-- SEED EMPLOYEES
-- ============================================================================

INSERT INTO public.employees (user_id, employee_id, full_name, email, department, team_id, designation, status, joining_date, skills, languages, experience)
SELECT
    (SELECT id FROM public.profiles WHERE email = 'agent@myne7x.com'),
    'EMP-001',
    'Demo Agent',
    'agent@myne7x.com',
    'Customer Support',
    'a0000000-0000-0000-0000-000000000001',
    'Support Agent',
    'active',
    CURRENT_DATE,
    ARRAY['Customer Service', 'Problem Solving', 'Communication'],
    ARRAY['English'],
    2
WHERE NOT EXISTS (SELECT 1 FROM public.employees WHERE email = 'agent@myne7x.com');

-- ============================================================================
-- SEED CLIENTS
-- ============================================================================

INSERT INTO public.clients (user_id, company_name, contact_name, email, industry, website, country, status)
SELECT
    (SELECT id FROM public.profiles WHERE email = 'client@myne7x.com'),
    'Demo Company Inc.',
    'Demo Client',
    'client@myne7x.com',
    'Technology',
    'https://demo-company.example.com',
    'United States',
    'active'
WHERE NOT EXISTS (SELECT 1 FROM public.clients WHERE email = 'client@myne7x.com');

-- ============================================================================
-- SEED PROJECTS
-- ============================================================================

INSERT INTO public.projects (name, client_id, industry, description, start_date, status, team_id, team_lead_id, support_channels, sla)
SELECT
    'Customer Support Operations',
    (SELECT id FROM public.clients WHERE email = 'client@myne7x.com'),
    'Technology',
    'Comprehensive customer support for Demo Company including email, chat, and phone support.',
    CURRENT_DATE,
    'active',
    'a0000000-0000-0000-0000-000000000001',
    (SELECT id FROM public.profiles WHERE email = 'team.lead@myne7x.com'),
    ARRAY['email', 'chat', 'phone'],
    '24-hour response time'
WHERE NOT EXISTS (SELECT 1 FROM public.projects WHERE name = 'Customer Support Operations');

-- ============================================================================
-- SEED DEMO LEADS
-- ============================================================================

INSERT INTO public.leads (company, contact_name, email, phone, country, industry, website, service_required, agents_required, source, status, notes)
SELECT * FROM (VALUES
    ('Acme Corp', 'John Smith', 'john@acmecorp.example', '+1-555-0101', 'United States', 'E-commerce', 'https://acmecorp.example', 'Customer Support', 5, 'website', 'new', 'Initial inquiry about support services'),
    ('TechStart Inc', 'Sarah Johnson', 'sarah@techstart.example', '+1-555-0102', 'Canada', 'Technology', 'https://techstart.example', 'Live Chat', 3, 'linkedin', 'contacted', 'Follow up scheduled for next week'),
    ('GlobalLogistics', 'Mike Chen', 'mike@globallog.example', '+44-20-1234-5678', 'United Kingdom', 'Transportation', 'https://globallog.example', 'Call Center', 10, 'referral', 'qualified', 'Budget confirmed, proposal in progress'),
    ('RetailHub', 'Emily Brown', 'emily@retailhub.example', '+61-2-9876-5432', 'Australia', 'E-commerce', 'https://retailhub.example', 'Email Support', 4, 'email', 'proposal', 'Proposal sent, awaiting response'),
    ('FinTech Solutions', 'David Wilson', 'david@fintech.example', '+1-555-0103', 'United States', 'Technology', 'https://fintech.example', 'Back Office', 6, 'website', 'negotiation', 'Negotiating terms'),
    ('HealthPlus', 'Lisa Anderson', 'lisa@healthplus.example', '+1-555-0104', 'United States', 'Healthcare', 'https://healthplus.example', 'Customer Support', 8, 'referral', 'won', 'Contract signed!'),
    ('ShopWorld', 'Tom Garcia', 'tom@shopworld.example', '+1-555-0105', 'United States', 'E-commerce', 'https://shopworld.example', 'Live Chat', 2, 'website', 'lost', 'Went with competitor')
) AS t(company, contact_name, email, phone, country, industry, website, service_required, agents_required, source, status, notes)
WHERE NOT EXISTS (SELECT 1 FROM public.leads WHERE email = 'john@acmecorp.example');

-- ============================================================================
-- SEED DEMO TICKETS
-- ============================================================================

INSERT INTO public.tickets (subject, description, category, priority, status, created_by, project_id)
SELECT
    'Login page not loading',
    'Users reporting that the login page fails to load on Safari browser.',
    'technical',
    'high',
    'open',
    (SELECT id FROM public.profiles WHERE email = 'client@myne7x.com'),
    (SELECT id FROM public.projects WHERE name = 'Customer Support Operations')
WHERE NOT EXISTS (SELECT 1 FROM public.tickets WHERE subject = 'Login page not loading');

INSERT INTO public.tickets (subject, description, category, priority, status, created_by, assigned_to)
SELECT
    'Order #12345 refund request',
    'Customer requesting refund for order #12345 due to damaged product.',
    'customer_support',
    'medium',
    'in_progress',
    (SELECT id FROM public.profiles WHERE email = 'client@myne7x.com'),
    (SELECT id FROM public.profiles WHERE email = 'agent@myne7x.com')
WHERE NOT EXISTS (SELECT 1 FROM public.tickets WHERE subject = 'Order #12345 refund request');

INSERT INTO public.tickets (subject, description, category, priority, status, created_by)
SELECT
    'Need additional agent training',
    'Requesting additional training session for new team members on product knowledge.',
    'operations',
    'low',
    'open',
    (SELECT id FROM public.profiles WHERE email = 'client@myne7x.com')
WHERE NOT EXISTS (SELECT 1 FROM public.tickets WHERE subject = 'Need additional agent training');

-- ============================================================================
-- SEED DEMO TASKS
-- ============================================================================

INSERT INTO public.tasks (title, description, assigned_to, assigned_by, priority, status, deadline, instructions)
SELECT
    'Handle pending customer emails',
    'Process all pending customer email inquiries from the weekend.',
    (SELECT id FROM public.profiles WHERE email = 'agent@myne7x.com'),
    (SELECT id FROM public.profiles WHERE email = 'team.lead@myne7x.com'),
    'high',
    'in_progress',
    NOW() + INTERVAL '2 days',
    'Prioritize by customer tier and response time SLA.'
WHERE NOT EXISTS (SELECT 1 FROM public.tasks WHERE title = 'Handle pending customer emails');

INSERT INTO public.tasks (title, description, assigned_to, assigned_by, priority, status, deadline)
SELECT
    'Update knowledge base article',
    'Update the refund process knowledge base article with new policy changes.',
    (SELECT id FROM public.profiles WHERE email = 'agent@myne7x.com'),
    (SELECT id FROM public.profiles WHERE email = 'team.lead@myne7x.com'),
    'medium',
    'pending',
    NOW() + INTERVAL '5 days'
WHERE NOT EXISTS (SELECT 1 FROM public.tasks WHERE title = 'Update knowledge base article');

-- ============================================================================
-- SEED ANNOUNCEMENTS
-- ============================================================================

INSERT INTO public.announcements (title, message, audience, priority, published, created_by)
SELECT
    'Welcome to MYNE7X BPO Platform',
    'Welcome to the new MYNE7X BPO management platform. Please explore the dashboard and reach out to your admin if you have any questions.',
    'everyone',
    'high',
    true,
    (SELECT id FROM public.profiles WHERE email = 'super.admin@myne7x.com')
WHERE NOT EXISTS (SELECT 1 FROM public.announcements WHERE title = 'Welcome to MYNE7X BPO Platform');

INSERT INTO public.announcements (title, message, audience, priority, published, created_by)
SELECT
    'Team Meeting Friday',
    'Reminder: Team meeting this Friday at 3 PM to discuss Q3 performance metrics.',
    'agents',
    'medium',
    true,
    (SELECT id FROM public.profiles WHERE email = 'team.lead@myne7x.com')
WHERE NOT EXISTS (SELECT 1 FROM public.announcements WHERE title = 'Team Meeting Friday');

-- ============================================================================
-- SEED ATTENDANCE (today's record for demo agent)
-- ============================================================================

INSERT INTO public.attendance (employee_id, date, clock_in, status)
SELECT
    (SELECT id FROM public.profiles WHERE email = 'agent@myne7x.com'),
    CURRENT_DATE,
    NOW() - INTERVAL '2 hours',
    'present'
WHERE NOT EXISTS (
    SELECT 1 FROM public.attendance
    WHERE employee_id = (SELECT id FROM public.profiles WHERE email = 'agent@myne7x.com')
    AND date = CURRENT_DATE
);

-- ============================================================================
-- SEED NOTIFICATIONS
-- ============================================================================

INSERT INTO public.notifications (user_id, type, title, message, read)
SELECT
    (SELECT id FROM public.profiles WHERE email = 'agent@myne7x.com'),
    'task_assigned',
    'New Task Assigned',
    'You have been assigned a new task: Handle pending customer emails',
    false
WHERE NOT EXISTS (SELECT 1 FROM public.notifications WHERE title = 'New Task Assigned');

INSERT INTO public.notifications (user_id, type, title, message, read)
SELECT
    (SELECT id FROM public.profiles WHERE email = 'super.admin@myne7x.com'),
    'new_lead',
    'New Lead Received',
    'A new lead from Acme Corp has been received.',
    false
WHERE NOT EXISTS (SELECT 1 FROM public.notifications WHERE title = 'New Lead Received');

-- ============================================================================
-- SEED COMPLETE
-- ============================================================================

-- Note: All demo records are marked with is_demo = TRUE where applicable.
-- In production, remove demo accounts or mark them as inactive.
