import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Globe, Send, MessageSquare, Clock } from 'lucide-react';
import { PublicLayout } from '@/layouts/PublicLayout';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { useToast } from '@/contexts/ToastContext';
import { supabase } from '@/lib/supabase';

export default function ContactPage() {
  const { success, error } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error: err } = await supabase.from('contact_submissions').insert({
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        subject: form.subject,
        message: form.message,
      });

      if (err) throw err;

      success('Message sent!', 'We will get back to you within 24 hours.');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      console.error(err);
      error('Failed to send message', 'Please try again or email us directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout title="Contact" description="Get in touch with Myne7x BPO. We're here to help with your customer support and BPO needs.">
      <section className="relative pt-32 pb-20 bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl" />
        </div>
        <div className="container-app relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
            <span className="text-teal-400 text-sm font-semibold tracking-wide uppercase">Contact Us</span>
            <h1 className="heading-1 text-white mt-4 mb-6">Let's Start a Conversation</h1>
            <p className="text-lg text-white/70 leading-relaxed">
              Whether you have a question about our services, need a custom quote, or want to
              explore partnership opportunities, we're here to help.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section bg-white dark:bg-navy-950">
        <div className="container-app">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="heading-3 mb-6 text-navy-900 dark:text-white">Get in Touch</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy-900 dark:text-white">Email Us</h3>
                    <a href="mailto:myne7x@gmail.com" className="text-sm text-navy-500 dark:text-navy-300 hover:text-teal-600">
                      myne7x@gmail.com
                    </a>
                    <p className="text-xs text-navy-400 mt-1">We respond within 24 hours</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center flex-shrink-0">
                    <Globe className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy-900 dark:text-white">Website</h3>
                    <a href="https://myne7xbpo.online" className="text-sm text-navy-500 dark:text-navy-300 hover:text-teal-600">
                      myne7xbpo.online
                    </a>
                    <p className="text-xs text-navy-400 mt-1">Visit our website for more info</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy-900 dark:text-white">Business Hours</h3>
                    <p className="text-sm text-navy-500 dark:text-navy-300">24/7 Support Operations</p>
                    <p className="text-xs text-navy-400 mt-1">Sales: Mon-Fri, 9am-6pm</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy-900 dark:text-white">Response Time</h3>
                    <p className="text-sm text-navy-500 dark:text-navy-300">Within 24 hours</p>
                    <p className="text-xs text-navy-400 mt-1">Faster for urgent inquiries</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <form onSubmit={handleSubmit} className="card p-6 space-y-4">
                <h2 className="text-xl font-semibold text-navy-900 dark:text-white">Send Us a Message</h2>
                <Input
                  label="Full Name"
                  name="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  placeholder="John Doe"
                />
                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  placeholder="john@company.com"
                />
                <Input
                  label="Phone (optional)"
                  name="phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                />
                <Input
                  label="Subject"
                  name="subject"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  required
                  placeholder="How can we help?"
                />
                <Textarea
                  label="Message"
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                  placeholder="Tell us about your needs..."
                />
                <Button type="submit" loading={loading} className="w-full" rightIcon={!loading && <Send className="w-4 h-4" />}>
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
