import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Logo } from '@/components/shared/Logo';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const { success, error } = useToast();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error: err } = await resetPassword(email);
      if (err) throw err;
      setSent(true);
      success('Reset link sent', 'Check your email for password reset instructions.');
    } catch (err) {
      console.error(err);
      error('Failed to send reset link', (err as Error).message || 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="glass-dark rounded-2xl p-8 shadow-navy">
          <Link to="/login" className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to login
          </Link>

          <div className="flex justify-center mb-6">
            <Logo />
          </div>

          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-teal-500/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-teal-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Check Your Email</h1>
              <p className="text-white/60 mb-6">
                We've sent a password reset link to <strong className="text-white">{email}</strong>.
                Follow the link to reset your password.
              </p>
              <Button variant="primary" className="w-full" onClick={() => setSent(false)}>
                Send to different email
              </Button>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-white mb-2">Forgot Password?</h1>
              <p className="text-white/60 mb-6">
                Enter your email address and we'll send you a link to reset your password.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Email Address"
                  type="email"
                  required
                  leftIcon={<Mail className="w-4 h-4" />}
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button type="submit" loading={loading} size="lg" className="w-full" rightIcon={!loading && <ArrowRight className="w-4 h-4" />}>
                  Send Reset Link
                </Button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
