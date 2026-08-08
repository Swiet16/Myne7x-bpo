import { PhoneCall } from 'lucide-react';
import { ServiceTemplate } from '../ServiceTemplate';

export default function CallCenterPage() {
  return (
    <ServiceTemplate
      title="Call Center Services"
      tagline="Call Center"
      description="Professional inbound call center services for customer inquiries, order support, and appointment management."
      icon={<PhoneCall className="w-8 h-8 text-white" />}
      features={[
        { title: 'Inbound Calls', desc: 'Handle incoming customer calls with professionally trained agents and call routing.' },
        { title: 'Customer Inquiries', desc: 'Answer product questions, service inquiries, and provide general information.' },
        { title: 'Order Support', desc: 'Assist with order placement, tracking, modifications, and cancellations.' },
        { title: 'Appointment Support', desc: 'Schedule, reschedule, and manage appointments for your customers.' },
        { title: 'Escalations', desc: 'Handle escalated calls with empathy and structured resolution processes.' },
        { title: 'Call Recording', desc: 'Quality monitoring with call recording and performance analytics.' },
      ]}
      benefits={[
        { title: 'Professional Image', desc: 'Every call answered professionally, enhancing your brand reputation.' },
        { title: 'Reduced Wait Times', desc: 'Adequate staffing ensures minimal wait times and better customer experience.' },
        { title: 'Extended Coverage', desc: '24/7 call coverage ensures you never miss important customer calls.' },
        { title: 'Performance Insights', desc: 'Detailed call analytics and reporting for continuous improvement.' },
      ]}
      process={[
        { step: '01', title: 'Requirements', desc: 'Define call volume, hours, and scripting requirements.' },
        { step: '02', title: 'Training', desc: 'Agents trained on your products, services, and call scripts.' },
        { step: '03', title: 'Launch', desc: 'Go live with professional call center operations.' },
        { step: '04', title: 'Monitor', desc: 'Ongoing quality monitoring and performance optimization.' },
      ]}
    />
  );
}
