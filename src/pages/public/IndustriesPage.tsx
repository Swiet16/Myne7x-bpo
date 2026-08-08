import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingBag, Cpu, Truck, Building2, ArrowRight } from 'lucide-react';
import { PublicLayout } from '@/layouts/PublicLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const industries = [
  { slug: 'ecommerce', icon: ShoppingBag, title: 'E-commerce', desc: 'Order support, returns management, and customer care for online retailers and marketplaces.', points: ['Order tracking & status', 'Returns & exchanges', 'Product inquiries', 'Payment support'] },
  { slug: 'technology', icon: Cpu, title: 'Technology & SaaS', desc: 'Technical support, onboarding, and account management for software and technology companies.', points: ['Technical troubleshooting', 'User onboarding', 'Account management', 'Tier 1 & 2 support'] },
  { slug: 'transportation', icon: Truck, title: 'Transportation', desc: 'Logistics coordination, shipment tracking, and customer support for transport businesses.', points: ['Shipment tracking', 'Delivery coordination', 'Driver support', 'Customer inquiries'] },
  { slug: 'consumer', icon: Building2, title: 'Consumer Products & Services', desc: 'Product support, warranty claims, and service desk for consumer brands and services.', points: ['Product support', 'Warranty claims', 'Service scheduling', 'Complaint resolution'] },
];

export default function IndustriesPage() {
  return (
    <PublicLayout title="Industries" description="Specialized BPO support for E-commerce, Technology & SaaS, Transportation, and Consumer Products industries.">
      <section className="relative pt-32 pb-20 bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl" />
        </div>
        <div className="container-app relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
            <span className="text-teal-400 text-sm font-semibold tracking-wide uppercase">Industries We Serve</span>
            <h1 className="heading-1 text-white mt-4 mb-6">
              Specialized Support for <span className="text-gradient">Your Industry</span>
            </h1>
            <p className="text-lg text-white/70 leading-relaxed">
              We understand that every industry has unique support requirements. Our teams are
              trained to handle industry-specific scenarios and customer expectations.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section bg-white dark:bg-navy-950">
        <div className="container-app">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {industries.map((industry, i) => (
              <motion.div
                key={industry.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link to={`/industries/${industry.slug}`}>
                  <Card hover className="h-full group">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-teal flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <industry.icon className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-navy-900 dark:text-white">{industry.title}</h3>
                        <p className="text-sm text-navy-500 dark:text-navy-300 mt-1">{industry.desc}</p>
                      </div>
                    </div>
                    <ul className="space-y-2 mb-4">
                      {industry.points.map((point) => (
                        <li key={point} className="flex items-center gap-2 text-sm text-navy-600 dark:text-navy-300">
                          <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                          {point}
                        </li>
                      ))}
                    </ul>
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
    </PublicLayout>
  );
}
