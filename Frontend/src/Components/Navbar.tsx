import { Globe, ChevronDown, UserPlus, LogIn, Menu, X, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { Language } from '../i18n/content';
import { content } from '../i18n/content';
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
  currentLang: Language;
  onLangChange: (lang: Language) => void;
}

export const Navbar = ({ currentLang, onLangChange }: NavbarProps) => {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, isAdmin } = useAuth();
  const t = content[currentLang].nav;

  const languages: Language[] = ['English', 'Kinyarwanda'];

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', label: t.home },
    { path: '/services', label: t.services },
    { path: '/report', label: t.report },
    { path: '/about', label: t.about },
    { path: '/contact', label: t.contact },
  ];

  return (
    <nav className="w-full bg-white shadow-sm border-b border-slate-100 sticky top-0 z-50">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center py-3 sm:py-4">
        {/* Left Side: Logo & Navigation */}
        <div className="flex items-center gap-10">
          <Link 
            to="/" 
            className="text-2xl font-bold tracking-tighter transition-colors"
            style={{ color: '#0066CC' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#0052A3'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#0066CC'}
          >
            PublicVoice
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="transition-colors duration-200"
                style={isActive(link.path) 
                  ? { color: '#0066CC', fontWeight: '600' }
                  : { color: '#64748B' }
                }
                onMouseEnter={(e) => {
                  if (!isActive(link.path)) {
                    e.currentTarget.style.color = '#0066CC';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(link.path)) {
                    e.currentTarget.style.color = '#64748B';
                  }
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        
        {/* Right Side: Language & Auth */}
        <div className="flex items-center gap-4">
          {/* Language Switcher */}
          <div className="relative">
            <button 
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-lg transition-all border border-slate-200"
              style={{ color: '#64748B' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#E3F2FD';
                e.currentTarget.style.color = '#0066CC';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#F8FAFC';
                e.currentTarget.style.color = '#64748B';
              }}
            >
              <Globe size={18} />
              <span className="text-xs font-normal">{currentLang === 'English' ? 'en' : 'rw'}</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`} />
            </button>

            {isLangOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsLangOpen(false)}
                />
                <div className="absolute top-12 right-0 bg-white text-slate-800 rounded-xl shadow-2xl py-2 w-40 z-50 border border-slate-100 overflow-hidden">
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => { onLangChange(lang); setIsLangOpen(false); }}
                      className="w-full text-left px-4 py-3 text-sm font-medium transition-colors"
                      style={currentLang === lang 
                        ? { color: '#0066CC', backgroundColor: '#E3F2FD' }
                        : { color: '#64748B' }
                      }
                      onMouseEnter={(e) => {
                        if (currentLang !== lang) {
                          e.currentTarget.style.backgroundColor = '#F8FAFC';
                          e.currentTarget.style.color = '#0066CC';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (currentLang !== lang) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#64748B';
                        }
                      }}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          
          <div className="hidden md:block h-6 w-[1px] bg-slate-200 mx-2" />
          
          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to={isAdmin ? '/admin/dashboard' : '/user/dashboard'}
                  className="flex items-center gap-2 text-sm font-medium transition-colors px-3 py-2"
                  style={{ color: '#64748B' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#0066CC'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#64748B'}
                >
                  <LayoutDashboard size={18} /> Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-2 text-sm font-medium transition-colors px-3 py-2"
                  style={{ color: '#64748B' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#0066CC'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#64748B'}
                >
                  <LogIn size={18} /> {t.login}
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-2 text-white px-5 py-2 rounded-lg font-medium shadow-sm transition-all"
                  style={{ backgroundColor: '#0066CC' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0052A3'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0066CC'}
                >
                  <UserPlus size={18} /> {t.register}
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 transition-colors"
            style={{ color: '#64748B' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#0066CC'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#64748B'}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-2 rounded-lg transition-colors"
                style={isActive(link.path)
                  ? { color: '#0066CC', fontWeight: '600', backgroundColor: '#E3F2FD' }
                  : { color: '#64748B' }
                }
                onMouseEnter={(e) => {
                  if (!isActive(link.path)) {
                    e.currentTarget.style.color = '#0066CC';
                    e.currentTarget.style.backgroundColor = '#F8FAFC';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(link.path)) {
                    e.currentTarget.style.color = '#64748B';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              {isAuthenticated ? (
                <Link
                  to={isAdmin ? '/admin/dashboard' : '/user/dashboard'}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 transition-colors"
                  style={{ color: '#64748B' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#0066CC'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#64748B'}
                >
                  <LayoutDashboard size={18} /> Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 transition-colors"
                    style={{ color: '#64748B' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#0066CC'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#64748B'}
                  >
                    <LogIn size={18} /> {t.login}
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-white rounded-lg font-medium transition-colors"
                    style={{ backgroundColor: '#0066CC' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0052A3'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0066CC'}
                  >
                    <UserPlus size={18} /> {t.register}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};