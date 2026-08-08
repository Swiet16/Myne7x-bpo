import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';
import { Logo } from '@/components/shared/Logo';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { supabase } from '@/lib/supabase';

const roleDashboardPaths: Record<string, string> = {
  super_admin: '/dashboard/super-admin',
  admin: '/dashboard/admin',
  team_lead: '/dashboard/team-lead',
  agent: '/dashboard/agent',
  client: '/dashboard/client',
};

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, profile } = useAuth();
  const { success, error } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', remember: true });

  const from = (location.state as { from?: string })?.from;

  useEffect(() => {
    if (profile) {
      navigate(roleDashboardPaths[profile.role] || '/dashboard/client', { replace: true });
    }
  }, [profile, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error: err } = await signIn(form.email, form.password);
      if (err) throw err;
      success('Welcome back!', 'You have been signed in successfully.');
      // Navigation handled by useEffect when profile loads
    } catch (err) {
      console.error(err);
      error('Sign in failed', (err as Error).message || 'Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (email: string, password: string) => {
    setForm({ email, password, remember: true });
    setLoading(true);
    try {
      const { error: err } = await signIn(email, password);
      if (err) throw err;
      success('Demo login', 'Signed in with demo account.');
    } catch (err) {
      console.error(err);
      error('Demo login failed', 'Demo accounts may not be set up yet. Please run the SQL seed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-400/5 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link to="/">
            <Logo />
          </Link>
          <div>
            <h1 className="heading-1 text-white mb-4">
              Welcome back to <span className="text-gradient">MYNE7X BPO</span>
            </h1>
            <p className="text-white/60 text-lg max-w-md">
              Professional Customer Support & Business Process Outsourcing. Sign in to access
              your dashboard.
            </p>
          </div>
          <div className="flex items-center gap-6 text-white/40 text-sm">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Secure Login
            </span>
            <span>© {new Date().getFullYear()} MYNE7X BPO</span>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-white dark:bg-navy-950">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden mb-8">
            <Link to="/">
              <Logo dark={false} />
            </Link>
          </div>

          <h2 className="text-2xl font-bold text-navy-900 dark:text-white mb-2">Sign In</h2>
          <p className="text-navy-500 dark:text-navy-400 mb-8">Enter your credentials to access your dashboard</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              required
              leftIcon={<Mail className="w-4 h-4" />}
              placeholder="you@company.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <div>
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                required
                leftIcon={<Lock className="w-4 h-4" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="hover:text-navy-600"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.remember}
                  onChange={(e) => setForm({ ...form, remember: e.target.checked })}
                  className="rounded border-navy-300 text-teal-600 focus:ring-teal-400"
                />
                <span className="text-sm text-navy-600 dark:text-navy-300">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-teal-600 dark:text-teal-400 hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" loading={loading} size="lg" className="w-full" rightIcon={!loading && <ArrowRight className="w-4 h-4" />}>
              Sign In
            </Button>
          </form>

          {/* Demo accounts */}
          <div className="mt-8 p-4 bg-navy-50 dark:bg-navy-900 rounded-xl">
            <p className="text-xs font-semibold text-navy-700 dark:text-navy-200 mb-3">Quick Demo Login:</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleDemoLogin('super.admin@myne7x.com', 'DemoPass123!')}
                className="text-xs px-3 py-2 bg-white dark:bg-navy-800 rounded-lg border border-navy-200 dark:border-navy-700 hover:border-teal-400 text-navy-700 dark:text-navy-200 transition-colors"
              >
                Super Admin
              </button>
              <button
                onClick={() => handleDemoLogin('admin@myne7x.com', 'DemoPass123!')}
                className="text-xs px-3 py-2 bg-white dark:bg-navy-800 rounded-lg border border-navy-200 dark:border-navy-700 hover:border-teal-400 text-navy-700 dark:text-navy-200 transition-colors"
              >
                Admin
              </button>
              <button
                onClick={() => handleDemoLogin('agent@myne7x.com', 'DemoPass123!')}
                className="text-xs px-3 py-2 bg-white dark:bg-navy-800 rounded-lg border border-navy-200 dark:border-navy-700 hover:border-teal-400 text-navy-700 dark:text-navy-200 transition-colors"
              >
                Agent
              </button>
              <button
                onClick={() => handleDemoLogin('client@myne7x.com', 'DemoPass123!')}
                className="text-xs px-3 py-2 bg-white dark:bg-navy-800 rounded-lg border border-navy-200 dark:border-navy-700 hover:border-teal-400 text-navy-700 dark:text-navy-200 transition-colors"
              >
                Client
              </button>
            </div>
          </div>

          <p className="text-center text-sm text-navy-500 dark:text-navy-400 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-teal-600 dark:text-teal-400 font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
