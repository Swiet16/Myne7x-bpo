import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, CheckCircle2, Video } from 'lucide-react';
import { PublicLayout } from '@/layouts/PublicLayout';
import { Button } from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { useToast } from '@/contexts/ToastContext';
import { supabase } from '@/lib/supabase';

const timeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
];
const durations = ['30 minutes', '45 minutes', '60 minutes'];

export default function BookCallPage() {
  const { success, error } = useToast();
  const [loading, setLoading] = useState(false);
  const [booked, setBooked] = useState(false);
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    company: '',
    date: '',
    time: '',
    duration: '30 minutes',
    topic: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error: err } = await supabase.from('contact_submissions').insert({
        name: form.full_name,
        email: form.email,
        phone: form.phone,
        subject: `Consultation Call - ${form.date} ${form.time}`,
        message: `Company: ${form.company}\nDuration: ${form.duration}\nTopic: ${form.topic}\n\n${form.message}`,
      });

      if (err) throw err;

      success('Call scheduled!', 'We will send you a calendar invite and meeting link shortly.');
      setBooked(true);
    } catch (err) {
      console.error(err);
      error('Failed to book call', 'Please try again or email us directly.');
    } finally {
      setLoading(false);
    }
  };

  if (booked) {
    return (
      <PublicLayout title="Book a Call">
        <section className="pt-32 pb-20 min-h-[80vh] flex items-center bg-gradient-hero">
          <div className="container-app">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg mx-auto text-center">
              <div className="w-20 h-20 rounded-full bg-teal-500/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-teal-400" />
              </div>
              <h1 className="heading-2 text-white mb-4">Call Scheduled!</h1>
              <p className="text-white/70 mb-8">
                Thank you for booking a consultation. We'll send you a calendar invite with the
                meeting link to {form.email} shortly.
              </p>
            </motion.div>
          </div>
        </section>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout title="Book a Consultation" description="Schedule a free consultation with Myne7x BPO to discuss your customer support needs.">
      <section className="relative pt-32 pb-20 bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl" />
        </div>
        <div className="container-app relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-teal-300 text-xs font-medium mb-6">
              <Video className="w-3.5 h-3.5" /> Free Consultation
            </div>
            <h1 className="heading-1 text-white mt-4 mb-6">Book a Consultation Call</h1>
            <p className="text-lg text-white/70 leading-relaxed">
              Schedule a free 30-minute consultation with our team to discuss your customer
              support needs and how we can help.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section bg-white dark:bg-navy-950">
        <div className="container-app max-w-2xl">
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="card p-4 text-center">
              <Calendar className="w-6 h-6 text-teal-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-navy-900 dark:text-white">Pick a Date</p>
            </div>
            <div className="card p-4 text-center">
              <Clock className="w-6 h-6 text-teal-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-navy-900 dark:text-white">Choose a Time</p>
            </div>
            <div className="card p-4 text-center">
              <Video className="w-6 h-6 text-teal-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-navy-900 dark:text-white">Join the Call</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="card p-8 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Input label="Full Name" required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
              <Input label="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <Input label="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <Input label="Preferred Date" type="date" required min={new Date().toISOString().split('T')[0]} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              <Select label="Time Slot" required value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} options={timeSlots.map((t) => ({ value: t, label: t }))} placeholder="Select time" />
              <Select label="Duration" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} options={durations.map((d) => ({ value: d, label: d }))} />
            </div>
            <Input label="Topic" value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} placeholder="What would you like to discuss?" />
            <Textarea label="Message" rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Any additional details..." />
            <Button type="submit" loading={loading} size="lg" className="w-full" rightIcon={!loading && <ArrowRight className="w-4 h-4" />}>
              Schedule Call
            </Button>
          </form>
        </div>
      </section>
    </PublicLayout>
  );
}
