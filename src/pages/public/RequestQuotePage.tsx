import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { PublicLayout } from '@/layouts/PublicLayout';
import { Button } from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { useToast } from '@/contexts/ToastContext';
import { supabase } from '@/lib/supabase';

const services = [
  'Customer Support',
  'Call Center',
  'Live Chat',
  'Email Support',
  'Back Office',
  'Help Desk',
  'Multiple Services',
  'Other',
];

const channels = ['Phone', 'Email', 'Live Chat', 'Social Media', 'Multi-Channel'];
const hours = ['Business Hours', 'Extended Hours', '24/7', 'After Hours', 'Weekend Only'];
const volumes = ['< 1,000/month', '1,000-5,000/month', '5,000-10,000/month', '10,000-50,000/month', '50,000+/month'];

export default function RequestQuotePage() {
  const { success, error } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    full_name: '',
    company_name: '',
    email: '',
    phone: '',
    country: '',
    industry: '',
    website: '',
    service_required: '',
    estimated_monthly_volume: '',
    preferred_channel: '',
    agents_required: 1,
    required_hours: '',
    current_setup: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error: err } = await supabase.from('quote_requests').insert({
        ...form,
        status: 'new',
      });

      if (err) throw err;

      success('Quote request submitted!', 'Our team will contact you within 24 hours.');
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      error('Failed to submit request', 'Please try again or contact us directly.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <PublicLayout title="Request a Quote">
        <section className="pt-32 pb-20 min-h-[80vh] flex items-center bg-gradient-hero">
          <div className="container-app">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-lg mx-auto text-center"
            >
              <div className="w-20 h-20 rounded-full bg-teal-500/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-teal-400" />
              </div>
              <h1 className="heading-2 text-white mb-4">Request Received!</h1>
              <p className="text-white/70 mb-8">
                Thank you for your interest in Myne7x BPO. Our team will review your requirements
                and contact you within 24 hours with a customized quote.
              </p>
              <Button
                variant="primary"
                onClick={() => {
                  setSubmitted(false);
                  setForm({
                    full_name: '', company_name: '', email: '', phone: '', country: '',
                    industry: '', website: '', service_required: '', estimated_monthly_volume: '',
                    preferred_channel: '', agents_required: 1, required_hours: '', current_setup: '', message: '',
                  });
                }}
              >
                Submit Another Request
              </Button>
            </motion.div>
          </div>
        </section>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout title="Request a Quote" description="Get a custom BPO quote tailored to your business needs. Professional customer support and outsourcing solutions.">
      <section className="relative pt-32 pb-20 bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl" />
        </div>
        <div className="container-app relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
            <span className="text-teal-400 text-sm font-semibold tracking-wide uppercase">Request a Quote</span>
            <h1 className="heading-1 text-white mt-4 mb-6">Get Your Custom Quote</h1>
            <p className="text-lg text-white/70 leading-relaxed">
              Tell us about your support needs and we'll prepare a customized quote tailored to
              your business requirements.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section bg-white dark:bg-navy-950">
        <div className="container-app max-w-3xl">
          <form onSubmit={handleSubmit} className="card p-8 space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-1 text-navy-900 dark:text-white">Contact Information</h2>
              <p className="text-sm text-navy-500">Let us know how to reach you.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <Input label="Full Name" required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="John Doe" />
              <Input label="Company Name" required value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} placeholder="Acme Inc." />
              <Input label="Business Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="john@acme.com" />
              <Input label="Phone" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+1 (555) 000-0000" />
              <Input label="Country" required value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} placeholder="United States" />
              <Input label="Industry" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} placeholder="E-commerce, SaaS, etc." />
              <Input label="Website" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="https://" />
            </div>

            <div className="pt-4 border-t border-navy-100 dark:border-navy-800">
              <h2 className="text-xl font-semibold mb-1 text-navy-900 dark:text-white">Support Requirements</h2>
              <p className="text-sm text-navy-500">Help us understand your support needs.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <Select
                label="Service Required"
                required
                placeholder="Select service"
                value={form.service_required}
                onChange={(e) => setForm({ ...form, service_required: e.target.value })}
                options={services.map((s) => ({ value: s, label: s }))}
              />
              <Select
                label="Estimated Monthly Volume"
                value={form.estimated_monthly_volume}
                onChange={(e) => setForm({ ...form, estimated_monthly_volume: e.target.value })}
                options={volumes.map((v) => ({ value: v, label: v }))}
              />
              <Select
                label="Preferred Support Channel"
                value={form.preferred_channel}
                onChange={(e) => setForm({ ...form, preferred_channel: e.target.value })}
                options={channels.map((c) => ({ value: c, label: c }))}
              />
              <Input
                label="Number of Agents Required"
                type="number"
                min="1"
                value={form.agents_required}
                onChange={(e) => setForm({ ...form, agents_required: parseInt(e.target.value) || 1 })}
              />
              <Select
                label="Required Hours"
                value={form.required_hours}
                onChange={(e) => setForm({ ...form, required_hours: e.target.value })}
                options={hours.map((h) => ({ value: h, label: h }))}
              />
              <Input
                label="Current Support Setup"
                value={form.current_setup}
                onChange={(e) => setForm({ ...form, current_setup: e.target.value })}
                placeholder="In-house, outsourced, none"
              />
            </div>

            <Textarea
              label="Additional Message"
              rows={4}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Tell us more about your requirements..."
            />

            <Button type="submit" loading={loading} size="lg" className="w-full" rightIcon={!loading && <ArrowRight className="w-4 h-4" />}>
              Submit Quote Request
            </Button>
          </form>
        </div>
      </section>
    </PublicLayout>
  );
}
