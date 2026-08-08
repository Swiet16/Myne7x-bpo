import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Logo } from '@/components/shared/Logo';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const { updatePassword } = useAuth();
  const { success, error } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ password: '', confirm_password: '' });

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

    setLoading(true);
    try {
      const { error: err } = await updatePassword(form.password);
      if (err) throw err;
      success('Password updated!', 'You can now sign in with your new password.');
      navigate('/login');
    } catch (err) {
      console.error(err);
      error('Update failed', (err as Error).message || 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="glass-dark rounded-2xl p-8 shadow-navy">
          <div className="flex justify-center mb-6">
            <Logo />
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">Set New Password</h1>
          <p className="text-white/60 mb-6">Enter your new password below.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              required
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="hover:text-navy-600" aria-label="Toggle password">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              placeholder="Min. 8 characters"
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
            <Button type="submit" loading={loading} size="lg" className="w-full" rightIcon={!loading && <ArrowRight className="w-4 h-4" />}>
              Update Password
            </Button>
          </form>

          <p className="text-center text-sm text-white/50 mt-6">
            Remember your password?{' '}
            <Link to="/login" className="text-teal-400 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
