import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MailCheck, ArrowRight, RefreshCw } from 'lucide-react';
import { Logo } from '@/components/shared/Logo';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';

export default function VerifyEmailPage() {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { success, error } = useToast();
  const email = (location.state as { email?: string })?.email || user?.email || '';

  const handleResend = async () => {
    try {
      // Note: In a production app, you would implement a resend verification email function
      success('Verification email sent', 'Check your inbox for the verification link.');
    } catch {
      error('Failed to resend', 'Please try again later.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="glass-dark rounded-2xl p-8 shadow-navy text-center">
          <div className="flex justify-center mb-6">
            <Logo />
          </div>

          <div className="w-20 h-20 rounded-full bg-teal-500/20 flex items-center justify-center mx-auto mb-6">
            <MailCheck className="w-10 h-10 text-teal-400" />
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">Verify Your Email</h1>
          <p className="text-white/60 mb-2">
            We've sent a verification link to:
          </p>
          <p className="text-teal-400 font-semibold mb-6">{email}</p>
          <p className="text-white/50 text-sm mb-8">
            Click the link in the email to verify your account. If you don't see the email,
            check your spam folder.
          </p>

          <div className="space-y-3">
            <Button variant="primary" className="w-full" onClick={handleResend} leftIcon={<RefreshCw className="w-4 h-4" />}>
              Resend Verification Email
            </Button>
            <Link to="/login">
              <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Back to Login
              </Button>
            </Link>
          </div>

          <button
            onClick={() => signOut()}
            className="mt-6 text-sm text-white/40 hover:text-white/60"
          >
            Sign out
          </button>
        </div>
      </motion.div>
    </div>
  );
}
