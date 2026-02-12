import { useState } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import type { Language } from '../i18n/content';

const LANGUAGES: Language[] = ['English', 'Kinyarwanda'];

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-blue-600 transition-colors"
        aria-label="Switch language"
      >
        <Globe size={18} />
        <span className="text-xs font-medium">{lang === 'English' ? 'EN' : 'RW'}</span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} aria-hidden="true" />
          <div className="absolute top-full right-0 mt-1 py-1 bg-white rounded-xl shadow-lg border border-slate-200 min-w-[140px] z-50">
            {LANGUAGES.map((language) => (
              <button
                key={language}
                type="button"
                onClick={() => {
                  setLang(language);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                  lang === language
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {language}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
