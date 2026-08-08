# MYNE7X BPO — Professional Customer Support & BPO Platform

> **Professional Support. Better Customer Experiences.**

A complete, production-ready BPO company platform built with React, Vite, TypeScript, Tailwind CSS, and Supabase. Includes a public website, client portal, employee portal, Team Lead portal, Admin dashboard, and Super Admin dashboard with full role-based access control.

---

## 🚀 Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | React 18 + Vite 5 |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 3 |
| **Backend** | Supabase (PostgreSQL, Auth, Storage, Realtime) |
| **Routing** | React Router v6 |
| **State** | Zustand + TanStack Query |
| **Charts** | Recharts |
| **Animation** | Framer Motion |
| **Icons** | Lucide React |
| **Forms** | React Hook Form + Zod |
| **PWA** | vite-plugin-pwa |
| **Deployment** | Vercel |

---

## 📁 Project Structure

```
myne7x-bpo/
├── public/                    # Static assets (favicon, robots.txt, sitemap.xml)
├── src/
│   ├── components/
│   │   ├── ui/               # Reusable UI components (Button, Card, Modal, etc.)
│   │   ├── shared/           # Shared components (Logo, Navbar, Footer)
│   │   └── dashboard/        # Dashboard-specific components
│   ├── pages/
│   │   ├── public/           # Public website pages
│   │   ├── auth/             # Authentication pages
│   │   └── dashboard/        # Dashboard pages (super-admin, admin, team-lead, agent, client)
│   ├── layouts/              # Layout components (PublicLayout, DashboardLayout)
│   ├── contexts/             # React contexts (Auth, Theme, Toast)
│   ├── hooks/                # Custom hooks
│   ├── lib/                  # Supabase client & database types
│   ├── types/                # TypeScript type definitions
│   └── utils/                # Utility functions
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql  # Complete SQL schema with RLS
├── .env.example
├── vercel.json
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🔧 Environment Setup

1. **Clone and install dependencies:**

```bash
npm install
```

2. **Configure environment variables:**

Copy `.env.example` to `.env` and update with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_APP_NAME=MYNE7X BPO
VITE_APP_URL=https://myne7xbpo.online
```

> ⚠️ **SECURITY WARNING**: Never put `SUPABASE_SERVICE_ROLE_KEY` in frontend environment variables. It must only be used in secure server-side environments.

---

## 🗄️ Database Setup

1. **Go to your Supabase project dashboard.**

2. **Run the SQL migration:**
   - Navigate to SQL Editor
   - Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
   - Click "Run" to execute
   - This creates all tables, RLS policies, storage buckets, and seed data

3. **Create demo users (optional):**
   - Register users through the app's `/register` page or Supabase Auth dashboard
   - Create these demo accounts:
     - `super.admin@myne7x.com`
     - `admin@myne7x.com`
     - `team.lead@myne7x.com`
     - `agent@myne7x.com`
     - `client@myne7x.com`
   - Run `supabase/seed.sql` in SQL Editor to update roles and add demo data

4. **Verify storage buckets:**
   - Navigate to Storage in Supabase dashboard
   - Confirm these buckets exist: `avatars`, `employee-documents`, `client-documents`, `project-files`, `ticket-attachments`, `reports`

---

## 🏃 Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run typecheck
```

The development server runs on `http://localhost:5173`.

---

## 🚢 Deployment to Vercel

1. **Push your code to GitHub/GitLab/Bitbucket.**

2. **Import the project in Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository
   - Framework preset: **Vite**
   - Build command: `npm run build`
   - Output directory: `dist`

3. **Add environment variables in Vercel:**
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_APP_NAME`
   - `VITE_APP_URL`

4. **Deploy.** The `vercel.json` file handles SPA routing fallback automatically.

---

## 👥 Roles & Permissions

| Role | Access Level |
|------|-------------|
| **super_admin** | Full platform access, including CMS, audit logs, and all management functions |
| **admin** | Operational management (agents, teams, projects, leads, tickets) |
| **team_lead** | Team management, task assignment, performance monitoring |
| **agent** | Personal dashboard, tasks, attendance, clock-in/out |
| **client** | Client portal, projects, tickets, documents |

### Default Registration
Public registration creates **client** accounts only. Employee accounts (agents, team leads, admins) must be created by authorized administrators.

---

## 🔒 Security Features

- ✅ **Row Level Security (RLS)** on all sensitive tables
- ✅ Role-based access control at database level
- ✅ Prevent role escalation (users cannot change own role)
- ✅ Prevent public registration as admin
- ✅ Client data isolation (clients cannot access other clients' data)
- ✅ Payroll privacy (agents see only their own payroll)
- ✅ Private storage buckets with access policies
- ✅ Audit logging for sensitive actions
- ✅ Protected super_admin (cannot be deleted by regular admins)
- ✅ No service-role keys in frontend code

---

## 📊 Features

### Public Website
- Home, About, Services, Industries, Why Us, Careers, Contact
- Service detail pages (Customer Support, Call Center, Live Chat, Email Support, Back Office)
- Industry pages (E-commerce, Technology, Transportation, Consumer)
- Request Quote form with Supabase integration
- Book Consultation Call
- FAQ (reads from database)
- Legal pages (Terms, Privacy, Cookie, Refund, Service Agreement, SLA)

### Authentication
- Login with role-based redirect
- Client registration (public)
- Forgot/Reset password
- Email verification
- Protected routes based on role

### Super Admin Dashboard
- Complete platform overview with analytics
- User management (all roles)
- CRM/Leads management
- Project & task management
- Attendance, performance, payroll
- Website CMS
- FAQ, Testimonials, Legal Pages management
- Audit logs
- System settings

### Admin Dashboard
- Agent & team management
- Project & task operations
- Lead CRM
- Attendance & performance monitoring
- Reports & analytics

### Team Lead Dashboard
- Team overview
- Task assignment & monitoring
- Team attendance & performance
- Escalation handling

### Agent Portal
- Personal dashboard
- Clock-in/out system with break tracking
- Task management
- Attendance history
- Performance metrics
- Announcements

### Client Portal
- Project overview
- Support ticket creation & tracking
- Document access
- Team communication
- Reports

---

## 🎨 Design System

- **Primary Color**: Dark Navy (`#0B1F3A`)
- **Accent Color**: Teal/Cyan (`#14b8a6`)
- **Typography**: Inter (body), Plus Jakarta Sans (headings)
- **Dark/Light Mode**: Toggle in dashboard topbar
- **Responsive**: Desktop, tablet, mobile
- **PWA**: Installable as a native app

---

## 📝 License

This is a proprietary project for MYNE7X BPO. All rights reserved.

---

## 📧 Contact

- **Email**: myne7x@gmail.com
- **Website**: [myne7xbpo.online](https://myne7xbpo.online)

---

Built with ❤️ for professional customer support operations.
