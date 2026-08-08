import { ClipboardList } from 'lucide-react';
import { ServiceTemplate } from '../ServiceTemplate';

export default function BackOfficePage() {
  return (
    <ServiceTemplate
      title="Back Office Outsourcing"
      tagline="Back Office"
      description="Reliable back-office support including data entry, CRM updates, order processing, and administrative operations."
      icon={<ClipboardList className="w-8 h-8 text-white" />}
      features={[
        { title: 'Data Entry', desc: 'Accurate and efficient data entry services for various business applications and databases.' },
        { title: 'CRM Updates', desc: 'Keep your CRM system updated with customer information, interactions, and notes.' },
        { title: 'Order Processing', desc: 'End-to-end order processing from order receipt to fulfillment confirmation.' },
        { title: 'Administrative Operations', desc: 'General administrative tasks including document management and reporting.' },
        { title: 'Data Verification', desc: 'Data validation and verification to ensure accuracy across systems.' },
        { title: 'Reporting', desc: 'Generate regular reports and analytics from back-office operations.' },
      ]}
      benefits={[
        { title: 'Cost Efficiency', desc: 'Reduce operational costs by outsourcing routine back-office tasks.' },
        { title: 'Improved Accuracy', desc: 'Dedicated teams with quality checks ensure high data accuracy.' },
        { title: 'Focus on Core Business', desc: 'Free up your team to focus on strategic initiatives and growth.' },
        { title: 'Scalable Capacity', desc: 'Scale back-office operations based on workload and business needs.' },
      ]}
      process={[
        { step: '01', title: 'Assessment', desc: 'We assess your back-office needs and current workflows.' },
        { step: '02', title: 'Setup', desc: 'Configure systems, access, and workflows for seamless operations.' },
        { step: '03', title: 'Execute', desc: 'Dedicated team starts handling back-office tasks efficiently.' },
        { step: '04', title: 'Optimize', desc: 'Continuous process improvement and productivity optimization.' },
      ]}
    />
  );
}
