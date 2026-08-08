import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Phone, Mail } from 'lucide-react';
import { Logo } from '@/components/shared/Logo';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  {
    label: 'Services',
    path: '/services',
    children: [
      { label: 'Customer Support', path: '/customer-support' },
      { label: 'Call Center', path: '/call-center' },
      { label: 'Live Chat', path: '/live-chat' },
      { label: 'Email Support', path: '/email-support' },
      { label: 'Back Office', path: '/back-office' },
    ],
  },
  {
    label: 'Industries',
    path: '/industries',
    children: [
      { label: 'E-commerce', path: '/industries/ecommerce' },
      { label: 'Technology & SaaS', path: '/industries/technology' },
      { label: 'Transportation', path: '/industries/transportation' },
      { label: 'Consumer Products', path: '/industries/consumer' },
    ],
  },
  { label: 'Why Us', path: '/why-us' },
  { label: 'Careers', path: '/careers' },
  { label: 'FAQ', path: '/faq' },
  { label: 'Contact', path: '/contact' },
];

export function PublicNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        scrolled
          ? 'glass-dark shadow-navy py-3'
          : 'bg-transparent py-5'
      )}
    >
      <div className="container-app flex items-center justify-between">
        <Link to="/" aria-label="MYNE7X BPO Home">
          <Logo />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <div
              key={item.path}
              className="relative"
              onMouseEnter={() => item.children && setOpenDropdown(item.path)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1',
                    isActive
                      ? 'text-teal-400'
                      : 'text-white/80 hover:text-white hover:bg-white/5'
                  )
                }
              >
                {item.label}
                {item.children && <ChevronDown className="w-3.5 h-3.5" />}
              </NavLink>
              {item.children && openDropdown === item.path && (
                <div className="absolute top-full left-0 pt-2 w-56">
                  <div className="card p-2 animate-slide-down">
                    {item.children.map((child) => (
                      <Link
                        key={child.path}
                        to={child.path}
                        className="block px-3 py-2 text-sm text-navy-700 dark:text-navy-200 hover:bg-navy-50 dark:hover:bg-navy-800 rounded-lg transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
              Login
            </Button>
          </Link>
          <Link to="/request-quote">
            <Button variant="primary" size="sm">
              Request a Quote
            </Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="lg:hidden p-2 text-white"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 glass-dark border-t border-white/10 max-h-[80vh] overflow-y-auto">
          <nav className="container-app py-6 space-y-1">
            {navItems.map((item) => (
              <div key={item.path}>
                <Link
                  to={item.path}
                  className="block px-4 py-3 text-white/80 hover:text-teal-400 hover:bg-white/5 rounded-lg font-medium"
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="pl-4 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.path}
                        to={child.path}
                        className="block px-4 py-2 text-sm text-white/60 hover:text-teal-400"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-4 flex flex-col gap-3">
              <Link to="/login" className="btn-outline w-full justify-center text-white border-white/20">
                Login
              </Link>
              <Link to="/request-quote" className="btn-primary w-full justify-center">
                Request a Quote
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export function PublicFooter() {
  const footerLinks = {
    Services: [
      { label: 'Customer Support', path: '/customer-support' },
      { label: 'Call Center', path: '/call-center' },
      { label: 'Live Chat', path: '/live-chat' },
      { label: 'Email Support', path: '/email-support' },
      { label: 'Back Office', path: '/back-office' },
    ],
    Company: [
      { label: 'About Us', path: '/about' },
      { label: 'Why Choose Us', path: '/why-us' },
      { label: 'Industries', path: '/industries' },
      { label: 'Careers', path: '/careers' },
      { label: 'Contact', path: '/contact' },
    ],
    Legal: [
      { label: 'Terms & Conditions', path: '/terms' },
      { label: 'Privacy Policy', path: '/privacy' },
      { label: 'Cookie Policy', path: '/cookie-policy' },
      { label: 'Refund Policy', path: '/refund-policy' },
      { label: 'Service Agreement', path: '/service-agreement' },
      { label: 'SLA', path: '/sla' },
    ],
  };

  return (
    <footer className="bg-navy-950 text-white pt-16 pb-8 border-t border-white/5">
      <div className="container-app">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          <div className="lg:col-span-2">
            <Logo />
            <p className="text-white/60 text-sm mt-4 max-w-xs leading-relaxed">
              Professional Customer Support & Business Process Outsourcing. We help growing
              businesses deliver better customer experiences.
            </p>
            <div className="mt-6 space-y-2">
              <a
                href="mailto:myne7x@gmail.com"
                className="flex items-center gap-2 text-sm text-white/70 hover:text-teal-400 transition-colors"
              >
                <Mail className="w-4 h-4" />
                myne7x@gmail.com
              </a>
              <a
                href="https://myne7xbpo.online"
                className="flex items-center gap-2 text-sm text-white/70 hover:text-teal-400 transition-colors"
              >
                <Phone className="w-4 h-4" />
                myne7xbpo.online
              </a>
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-white mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-sm text-white/60 hover:text-teal-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/50">
            © {new Date().getFullYear()} MYNE7X BPO. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/terms" className="text-sm text-white/50 hover:text-teal-400">
              Terms
            </Link>
            <Link to="/privacy" className="text-sm text-white/50 hover:text-teal-400">
              Privacy
            </Link>
            <Link to="/cookie-policy" className="text-sm text-white/50 hover:text-teal-400">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
