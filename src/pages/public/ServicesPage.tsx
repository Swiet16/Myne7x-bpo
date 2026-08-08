import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Headphones, PhoneCall, MessageSquare, Mail, ClipboardList, HelpCircle, ArrowRight } from 'lucide-react';
import { PublicLayout } from '@/layouts/PublicLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const services = [
  { icon: Headphones, title: 'Customer Support', desc: 'Dedicated support teams for inquiries, complaints, and account assistance.', path: '/customer-support' },
  { icon: PhoneCall, title: 'Call Center', desc: 'Inbound call handling, order support, and appointment scheduling.', path: '/call-center' },
  { icon: MessageSquare, title: 'Live Chat', desc: 'Real-time website and in-app chat support for instant assistance.', path: '/live-chat' },
  { icon: Mail, title: 'Email Support', desc: 'Inbox management, ticket responses, and follow-up workflows.', path: '/email-support' },
  { icon: ClipboardList, title: 'Back Office', desc: 'Data entry, CRM updates, order processing, and admin operations.', path: '/back-office' },
  { icon: HelpCircle, title: 'Help Desk', desc: 'Tiered technical support with escalation paths and SLA tracking.', path: '/contact' },
];

export default function ServicesPage() {
  return (
    <PublicLayout title="Services" description="Comprehensive BPO services including customer support, call center, live chat, email support, and back-office operations.">
      <section className="relative pt-32 pb-20 bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl" />
        </div>
        <div className="container-app relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
            <span className="text-teal-400 text-sm font-semibold tracking-wide uppercase">Our Services</span>
            <h1 className="heading-1 text-white mt-4 mb-6">
              Complete BPO Solutions for <span className="text-gradient">Growing Businesses</span>
            </h1>
            <p className="text-lg text-white/70 leading-relaxed">
              From front-line customer support to back-office operations, we provide end-to-end
              outsourcing solutions designed to scale with your business.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section bg-white dark:bg-navy-950">
        <div className="container-app">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link to={service.path}>
                  <Card hover className="h-full group">
                    <div className="w-12 h-12 rounded-xl bg-gradient-teal flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <service.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-navy-900 dark:text-white">{service.title}</h3>
                    <p className="text-sm text-navy-500 dark:text-navy-300 mb-4">{service.desc}</p>
                    <span className="inline-flex items-center gap-1 text-sm text-teal-600 dark:text-teal-400 font-medium group-hover:gap-2 transition-all">
                      Learn more <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-gradient-hero">
        <div className="container-app text-center max-w-2xl mx-auto">
          <h2 className="heading-2 text-white mb-4">Need a Custom Solution?</h2>
          <p className="text-white/70 mb-8">
            We tailor our services to meet your specific business needs. Let's discuss how we can help.
          </p>
          <Link to="/request-quote">
            <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Request a Quote
            </Button>
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
