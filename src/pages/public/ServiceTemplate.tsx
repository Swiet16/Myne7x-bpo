import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Phone, Mail, Clock, Users } from 'lucide-react';
import { PublicLayout } from '@/layouts/PublicLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface ServiceTemplateProps {
  title: string;
  tagline: string;
  description: string;
  icon: React.ReactNode;
  features: { title: string; desc: string }[];
  benefits: { title: string; desc: string }[];
  process: { step: string; title: string; desc: string }[];
}

export function ServiceTemplate({
  title,
  tagline,
  description,
  icon,
  features,
  benefits,
  process,
}: ServiceTemplateProps) {
  return (
    <PublicLayout title={title} description={description}>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl" />
        </div>
        <div className="container-app relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-teal-300 text-xs font-medium mb-6">
              {tagline}
            </div>
            <div className="w-16 h-16 rounded-2xl bg-gradient-teal flex items-center justify-center mb-6">
              {icon}
            </div>
            <h1 className="heading-1 text-white mb-6">{title}</h1>
            <p className="text-lg text-white/70 mb-8 max-w-2xl leading-relaxed">{description}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/request-quote">
                <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Get Started
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
                  Talk to Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="section bg-white dark:bg-navy-950">
        <div className="container-app">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-teal-600 dark:text-teal-400 text-sm font-semibold tracking-wide uppercase">
              What We Offer
            </span>
            <h2 className="heading-2 mt-3 mb-4 text-navy-900 dark:text-white">
              Comprehensive {title} Services
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="h-full">
                  <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  </div>
                  <h3 className="font-semibold mb-2 text-navy-900 dark:text-white">{feature.title}</h3>
                  <p className="text-sm text-navy-500 dark:text-navy-300">{feature.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section bg-navy-50 dark:bg-navy-900">
        <div className="container-app">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-teal-600 dark:text-teal-400 text-sm font-semibold tracking-wide uppercase">
                Benefits
              </span>
              <h2 className="heading-2 mt-3 mb-6 text-navy-900 dark:text-white">
                Why Choose Our {title} Service
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit) => (
                  <div key={benefit.title} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-navy-900 dark:text-white">{benefit.title}</h3>
                      <p className="text-sm text-navy-500 dark:text-navy-300">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="text-center">
                <Users className="w-8 h-8 text-teal-500 mx-auto mb-2" />
                <p className="text-3xl font-bold text-navy-900 dark:text-white">Dedicated</p>
                <p className="text-sm text-navy-500">Support Teams</p>
              </Card>
              <Card className="text-center">
                <Clock className="w-8 h-8 text-teal-500 mx-auto mb-2" />
                <p className="text-3xl font-bold text-navy-900 dark:text-white">24/7</p>
                <p className="text-sm text-navy-500">Coverage</p>
              </Card>
              <Card className="text-center">
                <Phone className="w-8 h-8 text-teal-500 mx-auto mb-2" />
                <p className="text-3xl font-bold text-navy-900 dark:text-white">Multi</p>
                <p className="text-sm text-navy-500">Channel Support</p>
              </Card>
              <Card className="text-center">
                <Mail className="w-8 h-8 text-teal-500 mx-auto mb-2" />
                <p className="text-3xl font-bold text-navy-900 dark:text-white">Real-time</p>
                <p className="text-sm text-navy-500">Reporting</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section bg-white dark:bg-navy-950">
        <div className="container-app">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-teal-600 dark:text-teal-400 text-sm font-semibold tracking-wide uppercase">
              How It Works
            </span>
            <h2 className="heading-2 mt-3 mb-4 text-navy-900 dark:text-white">
              Simple Onboarding Process
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {process.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="text-center h-full">
                  <div className="w-12 h-12 rounded-xl bg-gradient-teal text-white font-bold flex items-center justify-center mx-auto mb-4">
                    {step.step}
                  </div>
                  <h3 className="font-semibold mb-2 text-navy-900 dark:text-white">{step.title}</h3>
                  <p className="text-sm text-navy-500 dark:text-navy-300">{step.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-gradient-hero">
        <div className="container-app text-center max-w-2xl mx-auto">
          <h2 className="heading-2 text-white mb-4">Ready to enhance your {title.toLowerCase()}?</h2>
          <p className="text-white/70 mb-8">
            Get a custom quote tailored to your business needs. Our team will help you design
            the perfect support operation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/request-quote">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Request a Quote
              </Button>
            </Link>
            <Link to="/book-call">
              <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
                Book a Call
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
