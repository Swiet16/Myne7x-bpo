import { useParams, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Cpu, Truck, Building2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { PublicLayout } from '@/layouts/PublicLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const industryData: Record<string, {
  title: string;
  icon: typeof ShoppingBag;
  tagline: string;
  description: string;
  challenges: string[];
  solutions: string[];
  features: { title: string; desc: string }[];
}> = {
  ecommerce: {
    title: 'E-commerce Support',
    icon: ShoppingBag,
    tagline: 'E-commerce',
    description: 'Comprehensive customer support for online retailers, marketplaces, and direct-to-consumer brands.',
    challenges: [
      'High volume of order inquiries during peak seasons',
      'Complex returns and exchange processes',
      'Cart abandonment and conversion optimization',
      'Multi-channel customer touchpoints',
    ],
    solutions: [
      '24/7 order status and tracking support',
      'Streamlined returns and exchange handling',
      'Proactive cart abandonment outreach',
      'Unified support across web, email, chat, and social',
    ],
    features: [
      { title: 'Order Management', desc: 'Real-time order tracking, modifications, and cancellation support.' },
      { title: 'Returns & Exchanges', desc: 'Efficient returns processing with restocking and refund coordination.' },
      { title: 'Product Inquiries', desc: 'Detailed product information and recommendation support.' },
      { title: 'Payment Support', desc: 'Payment issue resolution and billing inquiry handling.' },
    ],
  },
  technology: {
    title: 'Technology & SaaS Support',
    icon: Cpu,
    tagline: 'Technology & SaaS',
    description: 'Technical support and customer success operations for software companies and SaaS providers.',
    challenges: [
      'Complex technical issues requiring specialized knowledge',
      'Onboarding new users effectively',
      'Reducing churn through proactive support',
      'Managing tiered support levels efficiently',
    ],
    solutions: [
      'Tiered technical support with escalation paths',
      'Guided onboarding and product walkthroughs',
      'Proactive outreach to at-risk accounts',
      'Efficient ticket routing and resolution tracking',
    ],
    features: [
      { title: 'Technical Troubleshooting', desc: 'Tier 1 and 2 technical support with documented solutions.' },
      { title: 'User Onboarding', desc: 'Guided setup and product education for new users.' },
      { title: 'Account Management', desc: 'Subscription management and account configuration support.' },
      { title: 'Bug Reporting', desc: 'Structured bug reporting and developer escalation processes.' },
    ],
  },
  transportation: {
    title: 'Transportation Support',
    icon: Truck,
    tagline: 'Transportation',
    description: 'Logistics coordination and customer support for transportation, shipping, and delivery businesses.',
    challenges: [
      'Real-time shipment tracking inquiries',
      'Delivery exception handling',
      'Coordination between customers and drivers',
      'Time-sensitive issue resolution',
    ],
    solutions: [
      'Real-time shipment status updates',
      'Proactive delivery exception management',
      'Driver-customer communication coordination',
      'Rapid response for urgent delivery issues',
    ],
    features: [
      { title: 'Shipment Tracking', desc: 'Real-time tracking information and delivery estimates.' },
      { title: 'Delivery Coordination', desc: 'Scheduling and rescheduling delivery appointments.' },
      { title: 'Driver Support', desc: 'Communication relay between dispatch, drivers, and customers.' },
      { title: 'Exception Handling', desc: 'Management of delays, damages, and delivery disputes.' },
    ],
  },
  consumer: {
    title: 'Consumer Products & Services',
    icon: Building2,
    tagline: 'Consumer Products',
    description: 'Product support, warranty management, and service desk operations for consumer brands.',
    challenges: [
      'High volume of product inquiries',
      'Complex warranty and repair processes',
      'Brand reputation management',
      'Service appointment scheduling',
    ],
    solutions: [
      'Comprehensive product knowledge base',
      'Streamlined warranty claim processing',
      'Professional brand representation',
      'Efficient service appointment scheduling',
    ],
    features: [
      { title: 'Product Support', desc: 'Detailed product information and usage guidance.' },
      { title: 'Warranty Claims', desc: 'Warranty verification and claim processing.' },
      { title: 'Service Scheduling', desc: 'Repair and service appointment management.' },
      { title: 'Complaint Resolution', desc: 'Structured complaint handling and resolution.' },
    ],
  },
};

export default function IndustryDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const data = industryData[slug || ''];

  if (!data) {
    return <Navigate to="/industries" replace />;
  }

  const Icon = data.icon;

  return (
    <PublicLayout title={data.title} description={data.description}>
      <section className="relative pt-32 pb-20 bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl" />
        </div>
        <div className="container-app relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-teal-300 text-xs font-medium mb-6">
              {data.tagline}
            </div>
            <div className="w-16 h-16 rounded-2xl bg-gradient-teal flex items-center justify-center mb-6">
              <Icon className="w-8 h-8 text-white" />
            </div>
            <h1 className="heading-1 text-white mb-6">{data.title}</h1>
            <p className="text-lg text-white/70 leading-relaxed">{data.description}</p>
          </motion.div>
        </div>
      </section>

      <section className="section bg-white dark:bg-navy-950">
        <div className="container-app">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="heading-3 mb-6 text-navy-900 dark:text-white">Common Challenges</h2>
              <div className="space-y-4">
                {data.challenges.map((challenge) => (
                  <Card key={challenge} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-amber-600 text-xs font-bold">!</span>
                    </div>
                    <p className="text-sm text-navy-600 dark:text-navy-300">{challenge}</p>
                  </Card>
                ))}
              </div>
            </div>
            <div>
              <h2 className="heading-3 mb-6 text-navy-900 dark:text-white">Our Solutions</h2>
              <div className="space-y-4">
                {data.solutions.map((solution) => (
                  <Card key={solution} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    </div>
                    <p className="text-sm text-navy-600 dark:text-navy-300">{solution}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-navy-50 dark:bg-navy-900">
        <div className="container-app">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="heading-2 mb-4 text-navy-900 dark:text-white">Service Features</h2>
            <p className="text-navy-500 dark:text-navy-300">Comprehensive support features tailored for the {data.tagline.toLowerCase()} industry.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.features.map((feature) => (
              <Card key={feature.title}>
                <h3 className="font-semibold mb-2 text-navy-900 dark:text-white">{feature.title}</h3>
                <p className="text-sm text-navy-500 dark:text-navy-300">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-gradient-hero">
        <div className="container-app text-center max-w-2xl mx-auto">
          <h2 className="heading-2 text-white mb-4">Ready to enhance your {data.tagline.toLowerCase()} support?</h2>
          <p className="text-white/70 mb-8">Let's discuss how we can help your business deliver better customer experiences.</p>
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
