import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Headphones,
  PhoneCall,
  MessageSquare,
  Mail,
  ClipboardList,
  HelpCircle,
  Users,
  Clock,
  TrendingUp,
  Eye,
  FileBarChart,
  Workflow,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Building2,
  Cpu,
  Truck,
  ShoppingBag,
  Star,
} from 'lucide-react';
import { PublicLayout } from '@/layouts/PublicLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const services = [
  { icon: Headphones, title: 'Customer Support', desc: 'Dedicated support teams for inquiries, complaints, and account assistance.', path: '/customer-support' },
  { icon: PhoneCall, title: 'Call Center', desc: 'Inbound call handling, order support, and appointment scheduling.', path: '/call-center' },
  { icon: MessageSquare, title: 'Live Chat', desc: 'Real-time website and in-app chat support for instant assistance.', path: '/live-chat' },
  { icon: Mail, title: 'Email Support', desc: 'Inbox management, ticket responses, and follow-up workflows.', path: '/email-support' },
  { icon: ClipboardList, title: 'Back Office', desc: 'Data entry, CRM updates, order processing, and admin operations.', path: '/back-office' },
  { icon: HelpCircle, title: 'Help Desk', desc: 'Tiered technical support with escalation paths and SLA tracking.', path: '/services' },
];

const whyUs = [
  { icon: Users, title: 'Dedicated Teams', desc: 'Agents dedicated to your business who understand your products and customers.' },
  { icon: Clock, title: 'Flexible Coverage', desc: '24/7, business hours, or overflow coverage tailored to your operational needs.' },
  { icon: TrendingUp, title: 'Scalable Operations', desc: 'Scale your support team up or down based on seasonal demand and growth.' },
  { icon: Eye, title: 'Quality Monitoring', desc: 'Continuous quality assurance with call monitoring and feedback loops.' },
  { icon: FileBarChart, title: 'Performance Reporting', desc: 'Detailed analytics and KPI dashboards for complete operational visibility.' },
  { icon: Workflow, title: 'Business-Focused Workflows', desc: 'Customized processes aligned with your business goals and customer journey.' },
];

const process = [
  { step: '01', title: 'Tell Us Your Requirements', desc: 'Share your support volume, channels, and business objectives with our team.' },
  { step: '02', title: 'We Design Your Operation', desc: 'Our experts design a tailored support operation with the right team structure.' },
  { step: '03', title: 'Team Onboarding', desc: 'We recruit, train, and onboard agents specifically for your business needs.' },
  { step: '04', title: 'Launch', desc: 'Go live with full support coverage across your chosen channels.' },
  { step: '05', title: 'Monitor & Optimize', desc: 'Continuous improvement through performance monitoring and optimization.' },
];

const industries = [
  { icon: ShoppingBag, title: 'E-commerce', desc: 'Order support, returns, and customer care for online retailers.', path: '/industries/ecommerce' },
  { icon: Cpu, title: 'Technology & SaaS', desc: 'Technical support and onboarding for software companies.', path: '/industries/technology' },
  { icon: Truck, title: 'Transportation', desc: 'Logistics coordination and customer support for transport businesses.', path: '/industries/transportation' },
  { icon: Building2, title: 'Consumer Products', desc: 'Product support and service desk for consumer brands.', path: '/industries/consumer' },
];

export default function HomePage() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-hero pt-20">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-400/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-teal-500/5 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="container-app relative z-10 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-teal-300 text-xs font-medium mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                Professional Customer Support & BPO
              </div>
              <h1 className="heading-1 text-white mb-6">
                Customer Support That Works Like{' '}
                <span className="text-gradient">Your Own Team.</span>
              </h1>
              <p className="text-lg text-white/70 mb-8 max-w-xl leading-relaxed">
                Myne7x BPO provides professional customer support and business process outsourcing
                solutions designed around your business, your customers and your workflow.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/contact">
                  <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Talk to Our Team
                  </Button>
                </Link>
                <Link to="/request-quote">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Request a Quote
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/10">
                <div>
                  <p className="text-3xl font-bold text-white">24/7</p>
                  <p className="text-sm text-white/60">Support Coverage</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">100+</p>
                  <p className="text-sm text-white/60">Support Channels</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">99%</p>
                  <p className="text-sm text-white/60">SLA Compliance</p>
                </div>
              </div>
            </motion.div>

            {/* Hero Visual - Dashboard mockup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative glass-dark rounded-2xl p-6 shadow-navy">
                {/* Dashboard header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-white/60 text-xs">Support Operations</p>
                    <p className="text-white font-semibold">Live Dashboard</p>
                  </div>
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  </div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="glass rounded-xl p-4">
                    <p className="text-white/50 text-xs mb-1">Active Tickets</p>
                    <p className="text-2xl font-bold text-white">147</p>
                    <p className="text-teal-400 text-xs">↑ 12% today</p>
                  </div>
                  <div className="glass rounded-xl p-4">
                    <p className="text-white/50 text-xs mb-1">Avg Response</p>
                    <p className="text-2xl font-bold text-white">2.4m</p>
                    <p className="text-teal-400 text-xs">↓ 0.3m faster</p>
                  </div>
                </div>

                {/* Live activity */}
                <div className="glass rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-white/60 text-xs font-medium">Live Activity</p>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-green-400 text-xs">Live</span>
                    </div>
                  </div>
                  {[
                    { type: 'Chat', agent: 'Sarah M.', status: 'Active', color: 'bg-teal-400' },
                    { type: 'Call', agent: 'James L.', status: 'On call', color: 'bg-blue-400' },
                    { type: 'Email', agent: 'Maria K.', status: 'Resolved', color: 'bg-green-400' },
                    { type: 'Ticket', agent: 'Ahmed R.', status: 'In progress', color: 'bg-amber-400' },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <div className={`w-2 h-2 rounded-full ${item.color}`} />
                      <span className="text-white/80 text-xs flex-1">{item.type}</span>
                      <span className="text-white/60 text-xs">{item.agent}</span>
                      <span className="text-white/40 text-xs">{item.status}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Floating card */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -top-6 -right-6 glass-dark rounded-xl p-3 shadow-navy hidden md:block"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-teal flex items-center justify-center">
                      <Star className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-white text-xs font-semibold">CSAT Score</p>
                      <p className="text-teal-400 text-sm font-bold">4.8 / 5.0</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-12 bg-white dark:bg-navy-900 border-y border-navy-100 dark:border-navy-800">
        <div className="container-app">
          <p className="text-center text-sm text-navy-400 mb-8">
            Trusted by growing businesses across industries
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16 opacity-50">
            {['E-COMMERCE', 'SAAS', 'FINTECH', 'HEALTHCARE', 'LOGISTICS', 'RETAIL'].map((name) => (
              <div key={name} className="text-navy-400 dark:text-navy-500 font-display font-bold text-lg tracking-wider">
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section bg-white dark:bg-navy-950">
        <div className="container-app">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <span className="text-teal-600 dark:text-teal-400 text-sm font-semibold tracking-wide uppercase">
              Our Services
            </span>
            <h2 className="heading-2 mt-3 mb-4 text-navy-900 dark:text-white">
              Comprehensive Support Solutions
            </h2>
            <p className="text-navy-500 dark:text-navy-300">
              From customer support to back-office operations, we provide end-to-end BPO services
              designed to scale with your business.
            </p>
          </motion.div>

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

      {/* Why Myne7x Section */}
      <section className="section bg-navy-50 dark:bg-navy-900">
        <div className="container-app">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <span className="text-teal-600 dark:text-teal-400 text-sm font-semibold tracking-wide uppercase">
              Why Myne7x
            </span>
            <h2 className="heading-2 mt-3 mb-4 text-navy-900 dark:text-white">
              The Myne7x Advantage
            </h2>
            <p className="text-navy-500 dark:text-navy-300">
              We combine dedicated talent, flexible operations, and quality monitoring to deliver
              support that feels like an extension of your own team.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyUs.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="h-full bg-white dark:bg-navy-800">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1 text-navy-900 dark:text-white">{item.title}</h3>
                      <p className="text-sm text-navy-500 dark:text-navy-300">{item.desc}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section bg-white dark:bg-navy-950">
        <div className="container-app">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <span className="text-teal-600 dark:text-teal-400 text-sm font-semibold tracking-wide uppercase">
              Our Process
            </span>
            <h2 className="heading-2 mt-3 mb-4 text-navy-900 dark:text-white">
              How We Get You Live
            </h2>
            <p className="text-navy-500 dark:text-navy-300">
              A structured onboarding process that gets your support operation running quickly
              and efficiently.
            </p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-navy-100 dark:bg-navy-800 hidden lg:block" />
            <div className="space-y-8 lg:space-y-0">
              {process.map((step, i) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className={`lg:grid lg:grid-cols-2 lg:gap-8 ${i % 2 === 0 ? '' : 'lg:flex-row-reverse'}`}
                >
                  <div className={`${i % 2 === 0 ? 'lg:text-right lg:pr-12' : 'lg:order-2 lg:pl-12'}`}>
                    <Card className="relative">
                      <div className={`flex items-center gap-4 mb-3 ${i % 2 === 0 ? 'lg:flex-row-reverse' : ''}`}>
                        <div className="w-12 h-12 rounded-xl bg-gradient-teal text-white font-bold flex items-center justify-center flex-shrink-0">
                          {step.step}
                        </div>
                        <h3 className="text-lg font-semibold text-navy-900 dark:text-white">{step.title}</h3>
                      </div>
                      <p className="text-sm text-navy-500 dark:text-navy-300">{step.desc}</p>
                    </Card>
                  </div>
                  <div className="hidden lg:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="section bg-navy-50 dark:bg-navy-900">
        <div className="container-app">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <span className="text-teal-600 dark:text-teal-400 text-sm font-semibold tracking-wide uppercase">
              Industries We Serve
            </span>
            <h2 className="heading-2 mt-3 mb-4 text-navy-900 dark:text-white">
              Specialized Support for Your Industry
            </h2>
            <p className="text-navy-500 dark:text-navy-300">
              We understand that every industry has unique support requirements. Our teams are
              trained to handle industry-specific scenarios.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {industries.map((industry, i) => (
              <motion.div
                key={industry.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link to={industry.path}>
                  <Card hover className="h-full text-center">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-teal flex items-center justify-center mx-auto mb-4">
                      <industry.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-semibold mb-2 text-navy-900 dark:text-white">{industry.title}</h3>
                    <p className="text-sm text-navy-500 dark:text-navy-300">{industry.desc}</p>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-400/5 rounded-full blur-3xl" />
        </div>
        <div className="container-app relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="heading-2 text-white mb-4">
              Ready to improve your customer support?
            </h2>
            <p className="text-white/70 mb-8 text-lg">
              Let's discuss how Myne7x BPO can help you deliver better customer experiences
              while reducing operational costs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/request-quote">
                <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Request a Quote
                </Button>
              </Link>
              <Link to="/book-call">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Book a Consultation
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-center gap-6 mt-10 text-white/50 text-sm">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                No long-term contracts
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                Free consultation
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                24/7 support
              </span>
            </div>
          </motion.div>
        </div>
      </section>
    </PublicLayout>
  );
}
