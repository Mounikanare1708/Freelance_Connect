import { Link } from 'react-router-dom';
import { Zap, MessageCircle, Globe, Users, Mail, Heart } from 'lucide-react';
import { CATEGORIES } from '../../utils/helpers';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-surface-border bg-surface-card mt-20">
      <div className="container-app py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-violet-500 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-lg text-white">
                Freelance<span className="text-gradient">Connect</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              The modern micro-task marketplace for students and local communities. 
              Connect, collaborate, and grow together.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: MessageCircle, href: '#', label: 'Twitter' },
                { icon: Globe, href: '#', label: 'GitHub' },
                { icon: Users, href: '#', label: 'LinkedIn' },
                { icon: Mail, href: 'mailto:lourdhumounikanare@gmail.com', label: 'Email' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-surface-elevated border border-surface-border flex items-center justify-center
                             text-gray-400 hover:text-primary-400 hover:border-primary-500/40 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-white mb-5">Categories</h4>
            <ul className="space-y-2.5">
              {CATEGORIES.slice(0, 6).map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/gigs?category=${encodeURIComponent(cat)}`}
                    className="text-gray-400 hover:text-primary-400 text-sm transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-semibold text-white mb-5">Platform</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Browse Gigs', href: '/gigs' },
                { label: 'Post a Gig', href: '/dashboard/create-gig' },
                { label: 'My Orders', href: '/dashboard/my-orders' },
                { label: 'My Gigs', href: '/dashboard/my-gigs' },
                { label: 'Dashboard', href: '/dashboard' },
                { label: 'About Us', href: '/about' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link to={href} className="text-gray-400 hover:text-primary-400 text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-white mb-5">Support</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Help Center', href: '#' },
                { label: 'Contact Us', href: '/contact' },
                { label: 'Privacy Policy', href: '#' },
                { label: 'Terms of Service', href: '#' },
                { label: 'Cookie Policy', href: '#' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link to={href} className="text-gray-400 hover:text-primary-400 text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Newsletter */}
            <div className="mt-6">
              <p className="text-sm text-gray-300 mb-3">Stay updated</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 text-sm rounded-lg bg-surface-elevated border border-surface-border
                             text-gray-200 placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-all"
                />
                <button className="btn-primary py-2 px-3 text-sm">
                  <Mail className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-surface-border mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {currentYear} Freelance Connect. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm flex items-center gap-1.5">
            Made with <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" /> for the community
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
