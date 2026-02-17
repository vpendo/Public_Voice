import { Link } from 'react-router-dom';
import { Mail, MapPin, Facebook, Twitter, Linkedin } from 'lucide-react';
import type { Language } from '../i18n/content';
import { content } from '../i18n/content';

interface FooterProps {
  currentLang: Language;
}

export const Footer = ({ currentLang }: FooterProps) => {
  const t = content[currentLang];

  const quickLinks = [
    { path: '/', label: t.nav.home },
    { path: '/services', label: t.nav.services },
    { path: '/about', label: t.nav.about },
    { path: '/contact', label: t.nav.contact },
  ];

  return (
    <footer className="text-white mt-auto" style={{ backgroundColor: 'var(--color-primary)' }}>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">PublicVoice</h3>
            <p className="text-sm leading-relaxed" style={{ color: '#E0F2F1' }}>
              {t.footer.tagline}
            </p>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg transition-all duration-200 hover:scale-110"
                style={{ backgroundColor: 'var(--color-primary-hover)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)';
                  e.currentTarget.style.filter = 'brightness(0.9)';
                  e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)';
                  e.currentTarget.style.filter = 'none';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
                aria-label="Facebook"
              >
                <Facebook size={18} className="text-white" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg transition-all duration-200 hover:scale-110"
                style={{ backgroundColor: 'var(--color-primary-hover)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.filter = 'brightness(0.9)';
                  e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.filter = 'none';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
                aria-label="Twitter"
              >
                <Twitter size={18} className="text-white" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg transition-all duration-200 hover:scale-110"
                style={{ backgroundColor: 'var(--color-primary-hover)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.filter = 'brightness(0.9)';
                  e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.filter = 'none';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
                aria-label="LinkedIn"
              >
                <Linkedin size={18} className="text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t.footer.quickLinks}</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm transition-all duration-200 inline-block"
                    style={{ color: '#E0F2F1' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#FFFFFF';
                      e.currentTarget.style.transform = 'translateX(4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#E0F2F1';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t.nav.services}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  to="/report" 
                  className="transition-all duration-200 inline-block"
                  style={{ color: '#E0F2F1' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#FFFFFF';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#E0F2F1';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  Report a Problem
                </Link>
              </li>
              <li>
                <Link 
                  to="/services" 
                  className="transition-all duration-200 inline-block"
                  style={{ color: '#E0F2F1' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#FFFFFF';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#E0F2F1';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  View All Services
                </Link>
              </li>
              <li>
                <Link 
                  to="/login" 
                  className="transition-all duration-200 inline-block"
                  style={{ color: '#E0F2F1' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#FFFFFF';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#E0F2F1';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  {t.nav.login}
                </Link>
              </li>
              <li>
                <Link 
                  to="/register" 
                  className="transition-all duration-200 inline-block"
                  style={{ color: '#E0F2F1' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#FFFFFF';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#E0F2F1';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  {t.nav.register}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t.footer.contact}</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Mail size={18} className="mt-0.5 flex-shrink-0" style={{ color: '#FFFFFF' }} />
                <div>
                  <p className="text-white font-medium">Email</p>
                  <a
                    href="mailto:contact@publicvoice.org"
                    className="transition-all duration-200 inline-block"
                    style={{ color: '#E0F2F1' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#FFFFFF';
                      e.currentTarget.style.textDecoration = 'underline';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#E0F2F1';
                      e.currentTarget.style.textDecoration = 'none';
                    }}
                  >
                    contact@publicvoice.org
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 flex-shrink-0" style={{ color: '#FFFFFF' }} />
                <div>
                  <p className="text-white font-medium">Location</p>
                  <p style={{ color: '#E0F2F1' }}>Kigali in Rwanda</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.2)' }}>
          <div className="text-center">
            <p className="text-sm" style={{ color: '#E0F2F1' }}>
              {t.footer.copyright}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
