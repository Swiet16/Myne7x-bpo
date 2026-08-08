import { Headphones } from 'lucide-react';
import { ServiceTemplate } from '../ServiceTemplate';

export default function CustomerSupportPage() {
  return (
    <ServiceTemplate
      title="Customer Support Outsourcing"
      tagline="Customer Support"
      description="Comprehensive customer support solutions that handle inquiries, complaints, and account management with professionalism and care."
      icon={<Headphones className="w-8 h-8 text-white" />}
      features={[
        { title: 'Customer Inquiries', desc: 'Handle product questions, service inquiries, and general customer questions across all channels.' },
        { title: 'Complaint Handling', desc: 'Professional complaint resolution with empathy, escalation paths, and follow-up procedures.' },
        { title: 'Account Assistance', desc: 'Account management, profile updates, password resets, and subscription management.' },
        { title: 'Escalation Handling', desc: 'Structured escalation processes for complex issues requiring specialized attention.' },
        { title: 'Customer Communication', desc: 'Proactive customer communication for updates, announcements, and service notifications.' },
        { title: 'Multi-Channel Support', desc: 'Seamless support across phone, email, chat, and social media channels.' },
      ]}
      benefits={[
        { title: 'Improved Satisfaction', desc: 'Professional support that keeps your customers happy and loyal.' },
        { title: 'Reduced Response Times', desc: 'Dedicated teams ensure quick responses to all customer inquiries.' },
        { title: 'Scalable Operations', desc: 'Easily scale support capacity based on seasonal demand and growth.' },
        { title: 'Quality Assurance', desc: 'Continuous monitoring and feedback ensure consistent service quality.' },
      ]}
      process={[
        { step: '01', title: 'Consultation', desc: 'We understand your support needs and customer journey.' },
        { step: '02', title: 'Team Setup', desc: 'Dedicated agents trained on your products and processes.' },
        { step: '03', title: 'Go Live', desc: 'Launch support operations across your preferred channels.' },
        { step: '04', title: 'Optimize', desc: 'Continuous improvement based on performance data.' },
      ]}
    />
  );
}
