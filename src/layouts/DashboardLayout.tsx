import { type ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserCog,
  UsersRound,
  Headphones,
  Briefcase,
  FolderKanban,
  ListTodo,
  Ticket,
  UserPlus,
  CalendarClock,
  CalendarDays,
  BarChart3,
  DollarSign,
  FileText,
  Megaphone,
  FileBarChart,
  TrendingUp,
  Globe,
  Settings,
  ScrollText,
  Bell,
  Search,
  Menu,
  X,
  LogOut,
  ChevronDown,
  Moon,
  Sun,
  User,
  ShieldCheck,
  BookOpen,
  MessageSquareQuote,
  Scale,
} from 'lucide-react';
import { Logo } from '@/components/shared/Logo';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { cn, getInitials } from '@/utils';
import type { UserRole } from '@/types';

interface NavItem {
  label: string;
  path: string;
  icon: ReactNode;
  roles: UserRole[];
}

const allNavItems: NavItem[] = [
  // Dashboard
  { label: 'Dashboard', path: '', icon: <LayoutDashboard className="w-4.5 h-4.5" />, roles: ['super_admin', 'admin', 'team_lead', 'agent', 'client'] },

  // Users
  { label: 'Users', path: '/users', icon: <Users className="w-4.5 h-4.5" />, roles: ['super_admin'] },
  { label: 'Admins', path: '/admins', icon: <ShieldCheck className="w-4.5 h-4.5" />, roles: ['super_admin'] },
  { label: 'Team Leads', path: '/team-leads', icon: <UserCog className="w-4.5 h-4.5" />, roles: ['super_admin', 'admin'] },
  { label: 'Agents', path: '/agents', icon: <Headphones className="w-4.5 h-4.5" />, roles: ['super_admin', 'admin', 'team_lead'] },
  { label: 'Clients', path: '/clients', icon: <Briefcase className="w-4.5 h-4.5" />, roles: ['super_admin', 'admin'] },

  // Operations
  { label: 'Teams', path: '/teams', icon: <UsersRound className="w-4.5 h-4.5" />, roles: ['super_admin', 'admin', 'team_lead'] },
  { label: 'Projects', path: '/projects', icon: <FolderKanban className="w-4.5 h-4.5" />, roles: ['super_admin', 'admin', 'team_lead', 'client'] },
  { label: 'Tasks', path: '/tasks', icon: <ListTodo className="w-4.5 h-4.5" />, roles: ['super_admin', 'admin', 'team_lead', 'agent'] },
  { label: 'Tickets', path: '/tickets', icon: <Ticket className="w-4.5 h-4.5" />, roles: ['super_admin', 'admin', 'team_lead', 'agent', 'client'] },
  { label: 'Leads', path: '/leads', icon: <UserPlus className="w-4.5 h-4.5" />, roles: ['super_admin', 'admin'] },

  // HR
  { label: 'Attendance', path: '/attendance', icon: <CalendarClock className="w-4.5 h-4.5" />, roles: ['super_admin', 'admin', 'team_lead', 'agent'] },
  { label: 'Schedules', path: '/schedules', icon: <CalendarDays className="w-4.5 h-4.5" />, roles: ['super_admin', 'admin', 'team_lead', 'agent'] },
  { label: 'Performance', path: '/performance', icon: <BarChart3 className="w-4.5 h-4.5" />, roles: ['super_admin', 'admin', 'team_lead', 'agent'] },
  { label: 'Payroll', path: '/payroll', icon: <DollarSign className="w-4.5 h-4.5" />, roles: ['super_admin', 'admin', 'agent'] },

  // Content
  { label: 'Documents', path: '/documents', icon: <FileText className="w-4.5 h-4.5" />, roles: ['super_admin', 'admin', 'team_lead', 'agent', 'client'] },
  { label: 'Announcements', path: '/announcements', icon: <Megaphone className="w-4.5 h-4.5" />, roles: ['super_admin', 'admin', 'team_lead', 'agent', 'client'] },
  { label: 'Reports', path: '/reports', icon: <FileBarChart className="w-4.5 h-4.5" />, roles: ['super_admin', 'admin', 'team_lead'] },
  { label: 'Analytics', path: '/analytics', icon: <TrendingUp className="w-4.5 h-4.5" />, roles: ['super_admin'] },

  // CMS (super admin only)
  { label: 'Website CMS', path: '/cms', icon: <Globe className="w-4.5 h-4.5" />, roles: ['super_admin'] },
  { label: 'Services', path: '/services-cms', icon: <BookOpen className="w-4.5 h-4.5" />, roles: ['super_admin'] },
  { label: 'Testimonials', path: '/testimonials', icon: <MessageSquareQuote className="w-4.5 h-4.5" />, roles: ['super_admin'] },
  { label: 'FAQs', path: '/faqs', icon: <BookOpen className="w-4.5 h-4.5" />, roles: ['super_admin', 'admin'] },
  { label: 'Legal Pages', path: '/legal-pages', icon: <Scale className="w-4.5 h-4.5" />, roles: ['super_admin'] },

  // Settings
  { label: 'Settings', path: '/settings', icon: <Settings className="w-4.5 h-4.5" />, roles: ['super_admin', 'admin'] },
  { label: 'Audit Logs', path: '/audit-logs', icon: <ScrollText className="w-4.5 h-4.5" />, roles: ['super_admin'] },

  // Agent-specific
  { label: 'My Profile', path: '/profile', icon: <User className="w-4.5 h-4.5" />, roles: ['agent', 'team_lead', 'client'] },
];

const roleLabels: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  team_lead: 'Team Lead',
  agent: 'Agent',
  client: 'Client',
};

const roleDashboardPaths: Record<UserRole, string> = {
  super_admin: '/dashboard/super-admin',
  admin: '/dashboard/admin',
  team_lead: '/dashboard/team-lead',
  agent: '/dashboard/agent',
  client: '/dashboard/client',
};

interface DashboardLayoutProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  title: string;
}

export function DashboardLayout({ children, allowedRoles, title }: DashboardLayoutProps) {
  const { profile, signOut, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-50 dark:bg-navy-950">
        <div className="w-10 h-10 border-3 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(profile.role)) {
    return <Navigate to={roleDashboardPaths[profile.role]} replace />;
  }

  const basePath = roleDashboardPaths[profile.role];
  const filteredNavItems = allNavItems.filter((item) => item.roles.includes(profile.role));

  const isActive = (path: string) => {
    const fullPath = path === '' ? basePath : `${basePath}${path}`;
    if (path === '') return location.pathname === basePath;
    return location.pathname.startsWith(fullPath);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-navy-50 dark:bg-navy-950 flex">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-white dark:bg-navy-900 border-r border-navy-100 dark:border-navy-800 flex flex-col transition-transform duration-300',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="p-5 border-b border-navy-100 dark:border-navy-800 flex items-center justify-between">
          <Link to="/">
            <Logo variant="full" dark={theme === 'dark'} />
          </Link>
          <button
            className="lg:hidden p-1 text-navy-500"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5 scrollbar-thin">
          {filteredNavItems.map((item) => {
            const fullPath = item.path === '' ? basePath : `${basePath}${item.path}`;
            return (
              <Link
                key={item.path || 'dashboard'}
                to={fullPath}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive(item.path)
                    ? 'bg-gradient-teal text-white shadow-soft'
                    : 'text-navy-600 dark:text-navy-300 hover:bg-navy-50 dark:hover:bg-navy-800'
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-navy-100 dark:border-navy-800">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="w-4.5 h-4.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-navy-950/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-20 bg-white/80 dark:bg-navy-900/80 backdrop-blur-md border-b border-navy-100 dark:border-navy-800">
          <div className="px-4 lg:px-8 h-16 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                className="lg:hidden p-2 text-navy-600 dark:text-navy-300"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-lg font-semibold">{title}</h1>
                <p className="text-xs text-navy-400 hidden sm:block">{roleLabels[profile.role]} Portal</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="hidden md:flex items-center relative">
                <Search className="absolute left-3 w-4 h-4 text-navy-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-9 pr-4 py-2 text-sm bg-navy-50 dark:bg-navy-800 rounded-lg border border-transparent focus:border-teal-400 focus:outline-none w-64"
                />
              </div>

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-navy-50 dark:hover:bg-navy-800 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
              </button>

              {/* Notifications */}
              <button
                className="relative p-2 rounded-lg hover:bg-navy-50 dark:hover:bg-navy-800 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-4.5 h-4.5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-teal-500 rounded-full" />
              </button>

              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 pr-2 rounded-lg hover:bg-navy-50 dark:hover:bg-navy-800 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-teal flex items-center justify-center text-white text-xs font-semibold">
                    {getInitials(profile.full_name)}
                  </div>
                  <span className="hidden md:block text-sm font-medium max-w-[120px] truncate">
                    {profile.full_name || profile.email}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-navy-400" />
                </button>
                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-1 w-56 card p-2 z-20 animate-slide-down">
                      <div className="px-3 py-2 border-b border-navy-100 dark:border-navy-800 mb-1">
                        <p className="text-sm font-medium truncate">{profile.full_name || 'User'}</p>
                        <p className="text-xs text-navy-400 truncate">{profile.email}</p>
                        <span className="badge-teal mt-1.5 inline-block">{roleLabels[profile.role]}</span>
                      </div>
                      <Link
                        to={`${basePath}/profile`}
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-navy-50 dark:hover:bg-navy-800 rounded-lg"
                      >
                        <User className="w-4 h-4" />
                        My Profile
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg w-full"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}

// Protected route wrapper
interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-50 dark:bg-navy-950">
        <div className="w-10 h-10 border-3 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(profile.role)) {
    return <Navigate to={roleDashboardPaths[profile.role]} replace />;
  }

  return <>{children}</>;
}
