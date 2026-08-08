import { Mail } from 'lucide-react';
import { ServiceTemplate } from '../ServiceTemplate';

export default function EmailSupportPage() {
  return (
    <ServiceTemplate
      title="Email Support Services"
      tagline="Email Support"
      description="Professional email support including inbox management, ticket responses, and structured follow-up workflows."
      icon={<Mail className="w-8 h-8 text-white" />}
      features={[
        { title: 'Inbox Management', desc: 'Professional management of shared inboxes with categorization and prioritization.' },
        { title: 'Ticket Responses', desc: 'Timely and accurate responses to customer emails and support tickets.' },
        { title: 'Follow-Ups', desc: 'Structured follow-up processes to ensure customer issues are fully resolved.' },
        { title: 'Escalations', desc: 'Proper escalation of complex issues to appropriate teams or management.' },
        { title: 'Template Management', desc: 'Customized email templates for consistent and professional communication.' },
        { title: 'Multi-Language Support', desc: 'Email support in multiple languages to serve diverse customer bases.' },
      ]}
      benefits={[
        { title: 'Organized Inbox', desc: 'Never miss an important email with structured inbox management.' },
        { title: 'Faster Responses', desc: 'Dedicated agents ensure emails are answered promptly within SLA.' },
        { title: 'Consistent Quality', desc: 'Templates and quality checks ensure consistent, professional responses.' },
        { title: 'Complete Tracking', desc: 'Full visibility into email threads, response times, and resolution rates.' },
      ]}
      process={[
        { step: '01', title: 'Setup', desc: 'Configure email forwarding and ticketing system integration.' },
        { step: '02', title: 'Training', desc: 'Agents trained on your products, tone, and email policies.' },
        { step: '03', title: 'Launch', desc: 'Start managing customer emails with SLA-driven responses.' },
        { step: '04', title: 'Report', desc: 'Regular reporting on volume, response times, and satisfaction.' },
      ]}
    />
  );
}
