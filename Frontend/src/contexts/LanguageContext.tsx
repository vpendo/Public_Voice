import { createContext, useContext, type ReactNode } from 'react';
import type { Language } from '../i18n/content';
import { content } from '../i18n/content';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: typeof content.English;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}

interface LanguageProviderProps {
  children: ReactNode;
  lang: Language;
  setLang: (lang: Language) => void;
}

export function LanguageProvider({ children, lang, setLang }: LanguageProviderProps) {
  const t = content[lang] ?? content.English;
  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
