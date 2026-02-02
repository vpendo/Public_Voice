import { Globe, ChevronDown, UserPlus, LogIn } from 'lucide-react';
import { useState } from 'react';
import type { Language } from '../i18n/content';
import { content } from '../i18n/content';

interface NavbarProps {
  currentLang: Language;
  onLangChange: (lang: Language) => void;
}

export const Navbar = ({ currentLang, onLangChange }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const t = content[currentLang].nav;

  const languages: Language[] = ['English', 'Kinyarwanda'];

  return (
    <nav className="w-full bg-white shadow-sm border-b border-slate-100 sticky top-0 z-50">
      {/* 11/12 Width Container centered with mx-auto */}
      <div className="w-11/12 mx-auto flex justify-between items-center py-4">
        
        {/* Left Side: Logo & Navigation */}
        <div className="flex items-center gap-10">
          <div className="text-2xl font-medium tracking-tighter cursor-pointer text-[#007bff]">
            PublicVoice
          </div>
          
          <div className="hidden lg:flex gap-8 text-sm font-normal tracking-wide text-slate-500">
            <a href="/" className="hover:text-orange-500 transition-colors duration-200">{t.home}</a>
            <a href="#services" className="hover:text-orange-500 transition-colors duration-200">{t.services}</a>
            <a href="#about" className="hover:text-orange-500 transition-colors duration-200">{t.about}</a>
            <a href="#contact" className="hover:text-orange-500 transition-colors duration-200">{t.contact}</a>
          </div>
        </div>
        
        {/* Right Side: Language & Auth */}
        <div className="flex items-center gap-4">
          
          {/* Language Switcher */}
          <div className="relative">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-all border border-slate-200 text-slate-600"
            >
              <Globe size={18} />
              <span className="text-xs font-normal">{currentLang === 'English' ? 'en' : 'rw'}</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
              <div className="absolute top-12 right-0 bg-white text-slate-800 rounded-xl shadow-2xl py-2 w-40 z-50 border border-slate-100 overflow-hidden">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => { onLangChange(lang); setIsOpen(false); }}
                    className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors ${
                      currentLang === lang ? 'text-orange-600 bg-orange-50' : 'hover:bg-slate-50 hover:text-orange-500'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="h-6 w-[1px] bg-slate-200 mx-2" />
          
          {/* Auth Buttons */}
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 text-sm font-normal text-slate-500 hover:text-orange-500 transition-colors px-3 py-2">
              <LogIn size={18} /> {t.login}
            </button>
            <button className="flex items-center gap-2 bg-[#007bff] text-white px-5 py-2 rounded-lg font-medium shadow-sm hover:bg-orange-600 transition-all transform active:scale-95">
              <UserPlus size={18} /> {t.register}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};