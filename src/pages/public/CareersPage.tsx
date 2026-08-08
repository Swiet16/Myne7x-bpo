import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Briefcase, Users, Heart, TrendingUp, ArrowRight, Mail, GraduationCap, Home, Plane } from 'lucide-react';
import { PublicLayout } from '@/layouts/PublicLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const perks = [
  { icon: GraduationCap, title: 'Training & Development', desc: 'Continuous learning opportunities, skill development programs, and career growth paths.' },
  { icon: Heart, title: 'Health & Wellness', desc: 'Comprehensive health benefits and wellness programs for all team members.' },
  { icon: TrendingUp, title: 'Career Growth', desc: 'Clear advancement opportunities from agent to team lead and beyond.' },
  { icon: Home, title: 'Remote Friendly', desc: 'Flexible work arrangements including remote and hybrid options.' },
  { icon: Plane, title: 'Paid Time Off', desc: 'Generous PTO, holidays, and sick leave to maintain work-life balance.' },
  { icon: Users, title: 'Inclusive Culture', desc: 'Diverse, inclusive workplace where everyone feels valued and respected.' },
];

const positions = [
  { title: 'Customer Support Agent', dept: 'Operations', type: 'Full-time', location: 'Remote' },
  { title: 'Team Lead', dept: 'Operations', type: 'Full-time', location: 'Remote' },
  { title: 'Technical Support Specialist', dept: 'Technical', type: 'Full-time', location: 'Remote' },
  { title: 'Quality Assurance Analyst', dept: 'Quality', type: 'Full-time', location: 'Remote' },
];

export default function CareersPage() {
  return (
    <PublicLayout title="Careers" description="Join the Myne7x BPO team. Explore career opportunities in customer support and BPO services.">
      <section className="relative pt-32 pb-20 bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl" />
        </div>
        <div className="container-app relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
            <span className="text-teal-400 text-sm font-semibold tracking-wide uppercase">Careers at Myne7x</span>
            <h1 className="heading-1 text-white mt-4 mb-6">
              Build Your Career in <span className="text-gradient">Customer Support</span>
            </h1>
            <p className="text-lg text-white/70 leading-relaxed">
              Join a team that values professional growth, quality service, and a customer-first
              mindset. We are always looking for talented individuals to help us deliver exceptional
              customer experiences.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section bg-white dark:bg-navy-950">
        <div className="container-app">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="heading-2 mb-4 text-navy-900 dark:text-white">Why Work With Us</h2>
            <p className="text-navy-500 dark:text-navy-300">We invest in our people because they are the foundation of our success.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {perks.map((perk, i) => (
              <motion.div
                key={perk.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="h-full">
                  <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center mb-4">
                    <perk.icon className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  </div>
                  <h3 className="font-semibold mb-2 text-navy-900 dark:text-white">{perk.title}</h3>
                  <p className="text-sm text-navy-500 dark:text-navy-300">{perk.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-navy-50 dark:bg-navy-900">
        <div className="container-app">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="heading-2 mb-4 text-navy-900 dark:text-white">Open Positions</h2>
            <p className="text-navy-500 dark:text-navy-300">Explore current opportunities to join our team.</p>
          </div>
          <div className="max-w-4xl mx-auto space-y-4">
            {positions.map((pos, i) => (
              <motion.div
                key={pos.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Card hover className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-teal flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-navy-900 dark:text-white">{pos.title}</h3>
                      <div className="flex items-center gap-3 mt-1 text-sm text-navy-500 dark:text-navy-400">
                        <span>{pos.dept}</span>
                        <span>•</span>
                        <span>{pos.type}</span>
                        <span>•</span>
                        <span>{pos.location}</span>
                      </div>
                    </div>
                  </div>
                  <Link to="/contact">
                    <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                      Apply
                    </Button>
                  </Link>
                </Card>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <p className="text-navy-500 dark:text-navy-300 mb-4">Don't see a position that fits? Send us your resume.</p>
            <a href="mailto:myne7x@gmail.com">
              <Button variant="primary" leftIcon={<Mail className="w-4 h-4" />}>
                Send Your Resume
              </Button>
            </a>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
