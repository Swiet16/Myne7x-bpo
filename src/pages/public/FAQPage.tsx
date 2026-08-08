import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { PublicLayout } from '@/layouts/PublicLayout';
import { Card } from '@/components/ui/Card';
import { supabase } from '@/lib/supabase';
import { cn } from '@/utils';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const defaultFaqs = [
  { category: 'General', question: 'What services does Myne7x BPO offer?', answer: 'Myne7x BPO offers customer support outsourcing, call center services, live chat support, email support, back-office outsourcing, and help desk services. We tailor our solutions to meet your specific business needs.' },
  { category: 'General', question: 'How quickly can we get started?', answer: 'Typical onboarding takes 2-4 weeks depending on the complexity of your requirements, number of agents needed, and training requirements. We work efficiently to get your support operation live as quickly as possible.' },
  { category: 'Pricing', question: 'How is pricing structured?', answer: 'Our pricing is customized based on your specific needs including the number of agents, hours of coverage, channels required, and complexity of support. Contact us for a custom quote tailored to your business.' },
  { category: 'Pricing', question: 'Do you require long-term contracts?', answer: 'We offer flexible contract terms including month-to-month, quarterly, and annual options. We believe in earning your business through quality service, not locking you into long contracts.' },
  { category: 'Operations', question: 'What hours can you provide coverage?', answer: 'We offer 24/7 coverage, business hours, extended hours, after-hours, and weekend-only options. We can adjust coverage based on your operational needs and customer time zones.' },
  { category: 'Operations', question: 'How do you ensure quality?', answer: 'We implement continuous quality monitoring including call recording, chat reviews, customer satisfaction surveys, and regular feedback sessions. We establish quality metrics tailored to your business standards.' },
  { category: 'Operations', question: 'Can agents speak multiple languages?', answer: 'Yes, we have agents proficient in multiple languages. Let us know your language requirements during the consultation and we will match you with appropriately skilled agents.' },
  { category: 'Security', question: 'How do you handle data security?', answer: 'We implement enterprise-grade security with role-based access control, audit logging, encryption, and compliance with industry best practices. We never expose sensitive data through public APIs.' },
  { category: 'Security', question: 'Do you sign NDAs?', answer: 'Yes, we are happy to sign non-disclosure agreements to protect your confidential information and business data.' },
  { category: 'Partnership', question: 'What makes Myne7x different from other BPOs?', answer: 'We focus on dedicated teams, flexible operations, and a true partnership approach. Our agents work exclusively for your business, understanding your products and customers like an in-house team.' },
  { category: 'Partnership', question: 'Can we scale up or down?', answer: 'Absolutely. We design our operations to be scalable. You can add or reduce agents based on seasonal demand, business growth, or changing needs with appropriate notice.' },
  { category: 'Partnership', question: 'How do we communicate with our support team?', answer: 'We establish clear communication channels including regular business reviews, direct access to team leads, reporting dashboards, and dedicated account management.' },
];

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>(defaultFaqs.map((f, i) => ({ id: String(i), ...f })));
  const [openId, setOpenId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    supabase
      .from('faqs')
      .select('id, question, answer, category')
      .eq('published', true)
      .order('order', { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setFaqs(data as FAQ[]);
        }
      });
  }, []);

  const categories = ['All', ...Array.from(new Set(faqs.map((f) => f.category)))];
  const filteredFaqs = selectedCategory === 'All' ? faqs : faqs.filter((f) => f.category === selectedCategory);

  return (
    <PublicLayout title="FAQ" description="Frequently asked questions about Myne7x BPO services, pricing, operations, and partnership.">
      <section className="relative pt-32 pb-20 bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl" />
        </div>
        <div className="container-app relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-teal-300 text-xs font-medium mb-6">
              <HelpCircle className="w-3.5 h-3.5" /> FAQ
            </div>
            <h1 className="heading-1 text-white mt-4 mb-6">Frequently Asked Questions</h1>
            <p className="text-lg text-white/70 leading-relaxed">
              Find answers to common questions about our services, operations, and partnership process.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section bg-white dark:bg-navy-950">
        <div className="container-app max-w-3xl">
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  selectedCategory === cat
                    ? 'bg-gradient-teal text-white'
                    : 'bg-navy-50 dark:bg-navy-800 text-navy-600 dark:text-navy-300 hover:bg-navy-100 dark:hover:bg-navy-700'
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredFaqs.map((faq, i) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
              >
                <Card className="overflow-hidden p-0">
                  <button
                    onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                    className="w-full flex items-center justify-between gap-4 p-5 text-left"
                  >
                    <span className="font-semibold text-navy-900 dark:text-white">{faq.question}</span>
                    <ChevronDown
                      className={cn(
                        'w-5 h-5 text-navy-400 flex-shrink-0 transition-transform',
                        openId === faq.id && 'rotate-180'
                      )}
                    />
                  </button>
                  {openId === faq.id && (
                    <div className="px-5 pb-5 text-sm text-navy-600 dark:text-navy-300 leading-relaxed animate-slide-down">
                      {faq.answer}
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
