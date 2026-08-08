import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Target, Eye, Heart, Users, Award, Globe, TrendingUp } from 'lucide-react';
import { PublicLayout } from '@/layouts/PublicLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const values = [
  { icon: Heart, title: 'Customer First', desc: 'Every decision we make starts with what is best for our customers and their customers.' },
  { icon: Award, title: 'Excellence', desc: 'We pursue excellence in every interaction, every call, and every email we handle.' },
  { icon: Users, title: 'Partnership', desc: 'We see ourselves as an extension of your team, not just an external service provider.' },
  { icon: TrendingUp, title: 'Continuous Improvement', desc: 'We constantly learn, adapt, and improve to deliver better results over time.' },
  { icon: Globe, title: 'Global Mindset', desc: 'We serve diverse customers across industries and geographies with cultural sensitivity.' },
  { icon: Target, title: 'Accountability', desc: 'We take ownership of our work and deliver on our commitments with transparency.' },
];

export default function AboutPage() {
  return (
    <PublicLayout title="About Us" description="Learn about Myne7x BPO - Professional Customer Support & Business Process Outsourcing.">
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl" />
        </div>
        <div className="container-app relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <span className="text-teal-400 text-sm font-semibold tracking-wide uppercase">About Myne7x BPO</span>
            <h1 className="heading-1 text-white mt-4 mb-6">
              Professional Support. <span className="text-gradient">Better Customer Experiences.</span>
            </h1>
            <p className="text-lg text-white/70 leading-relaxed">
              Myne7x BPO is a professional customer support and business process outsourcing company
              dedicated to helping growing businesses deliver exceptional customer experiences. We
              combine dedicated talent, flexible operations, and quality monitoring to provide support
              that feels like an extension of your own team.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section bg-white dark:bg-navy-950">
        <div className="container-app">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-teal flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-semibold mb-3 text-navy-900 dark:text-white">Our Mission</h2>
              <p className="text-navy-600 dark:text-navy-300 leading-relaxed">
                To empower growing businesses with professional customer support operations that
                enhance customer satisfaction, reduce operational burden, and drive business growth.
                We achieve this by providing dedicated, well-trained teams that understand your
                business and deliver support with the same care and commitment as your own employees.
              </p>
            </Card>
            <Card className="p-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-teal flex items-center justify-center mb-4">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-semibold mb-3 text-navy-900 dark:text-white">Our Vision</h2>
              <p className="text-navy-600 dark:text-navy-300 leading-relaxed">
                To be the most trusted BPO partner for growing businesses worldwide, recognized for
                our commitment to quality, our people-first culture, and our ability to deliver
                measurable improvements in customer experience. We envision a future where every
                business, regardless of size, can access world-class customer support operations.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section bg-navy-50 dark:bg-navy-900">
        <div className="container-app">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-teal-600 dark:text-teal-400 text-sm font-semibold tracking-wide uppercase">Our Values</span>
            <h2 className="heading-2 mt-3 mb-4 text-navy-900 dark:text-white">What Drives Us Every Day</h2>
            <p className="text-navy-500 dark:text-navy-300">
              Our core values shape every decision we make and every interaction we have with
              our clients and their customers.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="h-full">
                  <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center mb-4">
                    <value.icon className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  </div>
                  <h3 className="font-semibold mb-2 text-navy-900 dark:text-white">{value.title}</h3>
                  <p className="text-sm text-navy-500 dark:text-navy-300">{value.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-gradient-hero">
        <div className="container-app text-center max-w-2xl mx-auto">
          <h2 className="heading-2 text-white mb-4">Let's Build Something Great Together</h2>
          <p className="text-white/70 mb-8">
            Discover how Myne7x BPO can help your business deliver better customer experiences.
          </p>
          <Link to="/contact">
            <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Get in Touch
            </Button>
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
