import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Scale, AlertCircle } from 'lucide-react';
import { PublicLayout } from '@/layouts/PublicLayout';
import { Card } from '@/components/ui/Card';
import { supabase } from '@/lib/supabase';

const defaultContent: Record<string, { title: string; content: string }> = {
  'terms': {
    title: 'Terms & Conditions',
    content: `These Terms and Conditions ("Terms") govern your use of the Myne7x BPO website and services. By accessing or using our services, you agree to be bound by these Terms.

1. ACCEPTANCE OF TERMS
By accessing and using Myne7x BPO services, you accept and agree to be bound by these Terms. If you do not agree to these Terms, please do not use our services.

2. SERVICES
Myne7x BPO provides customer support outsourcing, call center services, live chat support, email support, and back-office outsourcing solutions. Specific service details are outlined in individual service agreements.

3. CLIENT RESPONSIBILITIES
Clients are responsible for providing accurate information, necessary access to systems, timely feedback, and adherence to agreed-upon processes and workflows.

4. CONFIDENTIALITY
Both parties agree to maintain confidentiality of all proprietary and sensitive information shared during the course of the business relationship.

5. INTELLECTUAL PROPERTY
All content, trademarks, and intellectual property on this website are owned by Myne7x BPO. Unauthorized use is prohibited.

6. LIMITATION OF LIABILITY
Myne7x BPO shall not be liable for indirect, incidental, or consequential damages arising from the use of our services.

7. TERMINATION
Either party may terminate services in accordance with the terms specified in individual service agreements.

8. GOVERNING LAW
These Terms are governed by applicable laws. Any disputes will be resolved through appropriate legal channels.

NOTE: This is placeholder legal language provided for demonstration purposes. It must be reviewed and approved by qualified legal counsel before publication.`,
  },
  'privacy': {
    title: 'Privacy Policy',
    content: `This Privacy Policy describes how Myne7x BPO collects, uses, and protects your personal information.

1. INFORMATION WE COLLECT
We collect information you provide directly to us, including name, email, phone number, company information, and communication preferences. We also collect usage data through cookies and similar technologies.

2. HOW WE USE YOUR INFORMATION
We use your information to provide and improve our services, communicate with you, process transactions, send notifications, and comply with legal obligations.

3. INFORMATION SHARING
We do not sell your personal information. We may share information with service providers who assist in delivering our services, and as required by law.

4. DATA SECURITY
We implement appropriate technical and organizational measures to protect your personal information, including encryption, access controls, and regular security assessments.

5. DATA RETENTION
We retain personal information only as long as necessary to fulfill the purposes outlined in this policy or as required by law.

6. YOUR RIGHTS
You have the right to access, correct, or delete your personal information. Contact us at myne7x@gmail.com to exercise these rights.

7. COOKIES
We use cookies to improve user experience and analyze website traffic. See our Cookie Policy for more information.

8. THIRD-PARTY SERVICES
We use third-party services including Supabase for database management and authentication. These services have their own privacy policies.

NOTE: This is placeholder legal language provided for demonstration purposes. It must be reviewed and approved by qualified legal counsel before publication.`,
  },
  'cookie-policy': {
    title: 'Cookie Policy',
    content: `This Cookie Policy explains how Myne7x BPO uses cookies and similar technologies.

1. WHAT ARE COOKIES?
Cookies are small text files stored on your device when you visit a website. They help improve user experience and enable certain functionality.

2. TYPES OF COOKIES WE USE
- Essential Cookies: Required for the website to function properly.
- Analytics Cookies: Help us understand how visitors use our website.
- Preference Cookies: Remember your settings and preferences.
- Marketing Cookies: Used to deliver relevant content and advertisements.

3. THIRD-PARTY COOKIES
We use third-party services that may set their own cookies, including analytics providers and authentication services.

4. MANAGING COOKIES
You can control and manage cookies through your browser settings. Disabling certain cookies may affect website functionality.

5. UPDATES
We may update this Cookie Policy from time to time. Changes will be posted on this page with an updated revision date.

NOTE: This is placeholder legal language provided for demonstration purposes. It must be reviewed and approved by qualified legal counsel before publication.`,
  },
  'refund-policy': {
    title: 'Refund Policy',
    content: `This Refund Policy outlines the terms and conditions for refunds related to Myne7x BPO services.

1. SERVICE FEES
Service fees are billed in advance based on the agreed-upon service plan. Fees are non-refundable once services have commenced for the billing period.

2. CANCELLATION
Clients may cancel services with 30 days written notice. Cancellation takes effect at the end of the current billing cycle. No refunds are provided for partial months.

3. SERVICE LEVEL AGREEMENTS
If we fail to meet agreed-upon SLAs, service credits may be issued as outlined in individual service agreements.

4. DISPUTES
Any billing disputes must be reported within 30 days of the invoice date. We will investigate and resolve disputes in good faith.

5. EARLY TERMINATION
Early termination of long-term contracts may incur termination fees as specified in individual service agreements.

NOTE: This is placeholder legal language provided for demonstration purposes. It must be reviewed and approved by qualified legal counsel before publication.`,
  },
  'service-agreement': {
    title: 'Service Agreement',
    content: `This Service Agreement outlines the terms under which Myne7x BPO provides outsourcing services to clients.

1. SCOPE OF SERVICES
Myne7x BPO agrees to provide customer support and BPO services as specified in individual Statements of Work (SOW) agreed upon with each client.

2. TERM
The term of service agreements is specified in individual contracts. Services commence on the agreed start date and continue for the specified term.

3. FEES AND PAYMENT
Clients agree to pay all fees as specified in their service agreement. Invoices are issued according to the agreed billing cycle and are due within 30 days.

4. CLIENT OBLIGATIONS
Clients must provide necessary access, information, training materials, and cooperation required for service delivery.

5. CONFIDENTIALITY
Both parties agree to maintain confidentiality of all proprietary information exchanged during the business relationship.

6. DATA PROTECTION
Both parties comply with applicable data protection regulations and implement appropriate security measures.

7. INDEMNIFICATION
Each party agrees to indemnify the other for losses arising from their negligence or breach of agreement.

8. FORCE MAJEURE
Neither party is liable for delays or failures due to circumstances beyond reasonable control.

NOTE: This is placeholder legal language provided for demonstration purposes. It must be reviewed and approved by qualified legal counsel before publication.`,
  },
  'sla': {
    title: 'Service Level Agreement (SLA)',
    content: `This Service Level Agreement (SLA) defines the performance standards for Myne7x BPO services.

1. AVAILABILITY
Myne7x BPO commits to 99% service availability, excluding scheduled maintenance and force majeure events.

2. RESPONSE TIMES
- Critical Issues: Within 1 hour
- High Priority: Within 2 hours
- Medium Priority: Within 4 hours
- Low Priority: Within 8 hours

3. RESOLUTION TIMES
- Critical Issues: Within 4 hours
- High Priority: Within 8 hours
- Medium Priority: Within 24 hours
- Low Priority: Within 48 hours

4. QUALITY STANDARDS
- Quality Score: Minimum 90%
- Customer Satisfaction: Minimum 4.0/5.0
- First Contact Resolution: Minimum 70%

5. MONITORING AND REPORTING
Performance is monitored continuously. Monthly reports are provided detailing SLA compliance and key metrics.

6. SERVICE CREDITS
If SLAs are not met, service credits are calculated as a percentage of monthly fees based on the severity and duration of non-compliance.

7. ESCALATION PROCEDURES
Issues are escalated through defined channels: Agent > Team Lead > Operations Manager > Account Manager.

8. REVIEW AND REVISION
This SLA is reviewed quarterly and may be updated based on performance data and client feedback.

NOTE: This is placeholder legal language provided for demonstration purposes. It must be reviewed and approved by qualified legal counsel before publication.`,
  },
};

export default function LegalPage({ slug }: { slug: string }) {
  const params = useParams<{ slug: string }>();
  const currentSlug = slug || params.slug || '';
  const [content, setContent] = useState(defaultContent[currentSlug] || null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    supabase
      .from('legal_pages')
      .select('title, content, last_updated')
      .eq('slug', currentSlug)
      .single()
      .then(({ data }) => {
        if (data) {
          setContent({ title: data.title, content: data.content });
          setLastUpdated(data.last_updated);
        } else {
          setContent(defaultContent[currentSlug] || null);
          setLastUpdated(new Date().toISOString());
        }
      });
  }, [currentSlug]);

  if (!content) {
    return (
      <PublicLayout title="Not Found">
        <section className="pt-32 pb-20 min-h-[60vh] flex items-center">
          <div className="container-app text-center">
            <AlertCircle className="w-16 h-16 text-navy-300 mx-auto mb-4" />
            <h1 className="heading-2 text-navy-900 dark:text-white mb-2">Page Not Found</h1>
            <p className="text-navy-500">The requested legal page could not be found.</p>
          </div>
        </section>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout title={content.title} description={content.content.substring(0, 160)}>
      <section className="relative pt-32 pb-20 bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl" />
        </div>
        <div className="container-app relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-teal-300 text-xs font-medium mb-6">
              <Scale className="w-3.5 h-3.5" /> Legal
            </div>
            <h1 className="heading-1 text-white mt-4 mb-2">{content.title}</h1>
            <p className="text-white/50 text-sm">Last Updated: {new Date(lastUpdated || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </motion.div>
        </div>
      </section>

      <section className="section bg-white dark:bg-navy-950">
        <div className="container-app max-w-3xl">
          <Card className="p-8">
            <div className="prose prose-navy dark:prose-invert max-w-none">
              {content.content.split('\n\n').map((paragraph, i) => (
                <p key={i} className="text-navy-600 dark:text-navy-300 leading-relaxed mb-4 whitespace-pre-line">
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  This document contains placeholder legal language for demonstration purposes and
                  must be reviewed and approved by qualified legal counsel before publication.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </PublicLayout>
  );
}
