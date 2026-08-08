import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, Clock, TrendingUp, Eye, FileBarChart, Workflow, ShieldCheck, HeartHandshake, ArrowRight, Award, Globe2, Zap } from 'lucide-react';
import { PublicLayout } from '@/layouts/PublicLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const advantages = [
  { icon: Users, title: 'Dedicated Teams', desc: 'Agents who work exclusively for your business, understanding your products, customers, and brand voice. They become a true extension of your in-house team, not a shared resource.' },
  { icon: Clock, title: 'Flexible Coverage', desc: 'Choose 24/7 coverage, business hours, or overflow support based on your operational needs. Adjust coverage as your business grows or during seasonal peaks.' },
  { icon: TrendingUp, title: 'Scalable Operations', desc: 'Start with a small team and scale effortlessly as your support volume grows. We handle recruitment, training, and onboarding so you can focus on your business.' },
  { icon: Eye, title: 'Quality Monitoring', desc: 'Continuous quality assurance with call monitoring, chat reviews, and feedback loops. Every interaction is evaluated against your customized quality standards.' },
  { icon: FileBarChart, title: 'Performance Reporting', desc: 'Detailed analytics and KPI dashboards giving you complete visibility into support performance. Regular reports on volume, response times, satisfaction, and more.' },
  { icon: Workflow, title: 'Business-Focused Workflows', desc: 'Customized processes aligned with your business goals and customer journey. We adapt to your existing workflows, not the other way around.' },
  { icon: ShieldCheck, title: 'Data Security', desc: 'Enterprise-grade security with role-based access control, audit logging, and compliance with industry best practices for data protection.' },
  { icon: HeartHandshake, title: 'Partnership Approach', desc: 'We act as your strategic partner, not just a vendor. Regular business reviews, proactive recommendations, and shared commitment to your success.' },
];

const stats = [
  { value: '24/7', label: 'Support Coverage' },
  { value: '99%', label: 'SLA Compliance' },
  { value: '<2min', label: 'Avg Response Time' },
  { value: '4.8/5', label: 'Customer Satisfaction' },
];

export default function WhyUsPage() {
  return (
    <PublicLayout title="Why Choose Us" description="Discover why growing businesses choose Myne7x BPO for professional customer support and BPO services.">
      <section className="relative pt-32 pb-20 bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl" />
        </div>
        <div className="container-app relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
            <span className="text-teal-400 text-sm font-semibold tracking-wide uppercase">Why Choose Myne7x</span>
            <h1 className="heading-1 text-white mt-4 mb-6">
              Support That Feels Like <span className="text-gradient">Your Own Team</span>
            </h1>
            <p className="text-lg text-white/70 leading-relaxed">
              We combine dedicated talent, flexible operations, and quality monitoring to deliver
              support that genuinely feels like an extension of your in-house team.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-teal-500 text-white">
        <div className="container-app">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="text-center"
              >
                <p className="text-4xl lg:text-5xl font-bold mb-1">{stat.value}</p>
                <p className="text-white/80 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-white dark:bg-navy-950">
        <div className="container-app">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {advantages.map((adv, i) => (
              <motion.div
                key={adv.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="h-full">
                  <div className="w-12 h-12 rounded-xl bg-gradient-teal flex items-center justify-center mb-4">
                    <adv.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2 text-navy-900 dark:text-white">{adv.title}</h3>
                  <p className="text-sm text-navy-500 dark:text-navy-300">{adv.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-navy-50 dark:bg-navy-900">
        <div className="container-app">
          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="text-center">
              <Award className="w-10 h-10 text-teal-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2 text-navy-900 dark:text-white">Quality First</h3>
              <p className="text-sm text-navy-500 dark:text-navy-300">Every interaction meets your quality standards through continuous monitoring and feedback.</p>
            </Card>
            <Card className="text-center">
              <Zap className="w-10 h-10 text-teal-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2 text-navy-900 dark:text-white">Fast Onboarding</h3>
              <p className="text-sm text-navy-500 dark:text-navy-300">Get your support operation live in weeks, not months, with our structured onboarding process.</p>
            </Card>
            <Card className="text-center">
              <Globe2 className="w-10 h-10 text-teal-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2 text-navy-900 dark:text-white">Global Coverage</h3>
              <p className="text-sm text-navy-500 dark:text-navy-300">Round-the-clock support across multiple languages and time zones for global businesses.</p>
            </Card>
          </div>
        </div>
      </section>

      <section className="section bg-gradient-hero">
        <div className="container-app text-center max-w-2xl mx-auto">
          <h2 className="heading-2 text-white mb-4">Experience the Myne7x Difference</h2>
          <p className="text-white/70 mb-8">Ready to see how we can transform your customer support operations?</p>
          <Link to="/request-quote">
            <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
