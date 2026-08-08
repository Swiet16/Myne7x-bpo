import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Logo } from '@/components/shared/Logo';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { success, error } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    confirm_password: '',
    company: '',
    agree: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirm_password) {
      error('Passwords do not match', 'Please make sure both passwords are identical.');
      return;
    }

    if (form.password.length < 8) {
      error('Password too short', 'Password must be at least 8 characters long.');
      return;
    }

    if (!form.agree) {
      error('Terms not accepted', 'Please accept the Terms & Conditions to continue.');
      return;
    }

    setLoading(true);
    try {
      // Client registration only - role is set to 'client' by database trigger
      const { error: err } = await signUp(form.email, form.password, form.full_name);
      if (err) throw err;

      success('Account created!', 'Please check your email to verify your account.');
      navigate('/verify-email', { state: { email: form.email } });
    } catch (err) {
      console.error(err);
      error('Registration failed', (err as Error).message || 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
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
              Join <span className="text-gradient">MYNE7X BPO</span>
            </h1>
            <p className="text-white/60 text-lg max-w-md">
              Create your client account to access our platform, submit support requests, and
              manage your projects.
            </p>
            <div className="mt-6 space-y-2">
              {['Professional support solutions', 'Dedicated account management', 'Real-time project tracking'].map((item) => (
                <div key={item} className="flex items-center gap-2 text-white/70 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-teal-400" />
                  {item}
                </div>
              ))}
            </div>
          </div>
          <p className="text-white/40 text-sm">© {new Date().getFullYear()} MYNE7X BPO</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-white dark:bg-navy-950">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Link to="/">
              <Logo dark={false} />
            </Link>
          </div>

          <h2 className="text-2xl font-bold text-navy-900 dark:text-white mb-2">Create Account</h2>
          <p className="text-navy-500 dark:text-navy-400 mb-8">Register as a client to get started with Myne7x BPO</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              required
              leftIcon={<User className="w-4 h-4" />}
              placeholder="John Doe"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            />
            <Input
              label="Business Email"
              type="email"
              required
              leftIcon={<Mail className="w-4 h-4" />}
              placeholder="you@company.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <Input
              label="Company Name"
              required
              placeholder="Your Company Inc."
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
            />
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              required
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="hover:text-navy-600" aria-label="Toggle password">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              placeholder="Min. 8 characters"
              hint="Use at least 8 characters with a mix of letters, numbers, and symbols"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <Input
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              required
              leftIcon={<Lock className="w-4 h-4" />}
              placeholder="Re-enter password"
              value={form.confirm_password}
              onChange={(e) => setForm({ ...form, confirm_password: e.target.value })}
            />

            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.agree}
                onChange={(e) => setForm({ ...form, agree: e.target.checked })}
                className="rounded border-navy-300 text-teal-600 focus:ring-teal-400 mt-1"
              />
              <span className="text-sm text-navy-600 dark:text-navy-300">
                I agree to the{' '}
                <Link to="/terms" className="text-teal-600 dark:text-teal-400 hover:underline">Terms</Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-teal-600 dark:text-teal-400 hover:underline">Privacy Policy</Link>
              </span>
            </label>

            <Button type="submit" loading={loading} size="lg" className="w-full" rightIcon={!loading && <ArrowRight className="w-4 h-4" />}>
              Create Account
            </Button>
          </form>

          <div className="mt-4 p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
            <p className="text-xs text-teal-800 dark:text-teal-200">
              <strong>Note:</strong> Public registration is for client accounts only. Employee
              accounts (agents, team leads, admins) are created by authorized administrators.
            </p>
          </div>

          <p className="text-center text-sm text-navy-500 dark:text-navy-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-teal-600 dark:text-teal-400 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
