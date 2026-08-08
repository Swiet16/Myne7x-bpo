import { MessageSquare } from 'lucide-react';
import { ServiceTemplate } from '../ServiceTemplate';

export default function LiveChatPage() {
  return (
    <ServiceTemplate
      title="Live Chat Support"
      tagline="Live Chat"
      description="Real-time chat support for your website and app, providing instant assistance to your customers when they need it most."
      icon={<MessageSquare className="w-8 h-8 text-white" />}
      features={[
        { title: 'Website Chat', desc: 'Embed live chat on your website for instant customer assistance and sales support.' },
        { title: 'App Chat', desc: 'In-app chat integration for mobile and desktop applications.' },
        { title: 'Real-Time Assistance', desc: 'Immediate responses to customer questions, reducing abandonment and improving satisfaction.' },
        { title: 'Proactive Engagement', desc: 'Proactively reach out to visitors based on behavior and page triggers.' },
        { title: 'Chat Transcripts', desc: 'Complete chat history and transcripts for quality monitoring and training.' },
        { title: 'Multi-Agent Handling', desc: 'Efficient chat routing and multiple concurrent chat handling.' },
      ]}
      benefits={[
        { title: 'Higher Conversions', desc: 'Real-time assistance helps convert visitors into customers.' },
        { title: 'Reduced Costs', desc: 'Agents can handle multiple chats simultaneously, reducing cost per interaction.' },
        { title: 'Better Experience', desc: 'Customers prefer chat for quick questions and instant resolutions.' },
        { title: '24/7 Availability', desc: 'Round-the-clock chat support ensures you never miss a customer inquiry.' },
      ]}
      process={[
        { step: '01', title: 'Integration', desc: 'We integrate live chat into your website or app.' },
        { step: '02', title: 'Training', desc: 'Agents trained on your products and chat best practices.' },
        { step: '03', title: 'Go Live', desc: 'Launch 24/7 live chat support for your customers.' },
        { step: '04', title: 'Optimize', desc: 'Continuous optimization based on chat analytics and feedback.' },
      ]}
    />
  );
}
