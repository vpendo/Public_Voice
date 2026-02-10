import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Navbar } from '../Components/Navbar';
import { Footer } from '../Components/Footer';
import { content } from '../i18n/content';
import type { Language } from '../i18n/content';
import { LanguageProvider } from '../contexts/LanguageContext';
import { AuthProvider } from '../contexts/AuthContext';
import Home from '../Pages/Home';
import About from '../Pages/About';
import Contact from '../Pages/Contact';
import Services from '../Pages/Services';
import Login from '../Pages/Login';
import Register from '../Pages/Register';
import Report from '../Pages/Report';
import Dashboard from '../Pages/Dashboard/Dashboard';

function AppLayout({ children, lang, setLang }: { children: React.ReactNode; lang: Language; setLang: (lang: Language) => void }) {
  const location = useLocation();
  const hideNavFooter = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/dashboard';

  if (hideNavFooter) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      <Navbar currentLang={lang} onLangChange={setLang} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer currentLang={lang} />
    </div>
  );
}

export function AppRoute() {
  const [lang, setLang] = useState<Language>('English');
  const t = content[lang];

  if (!t || !t.nav) {
    return <div className="p-10 text-center">Loading PublicVoice...</div>;
  }

  return (
    <Router>
      <LanguageProvider lang={lang} setLang={setLang}>
        <AuthProvider>
          <AppLayout lang={lang} setLang={setLang}>
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/services" element={<Services />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/report" element={<Report />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
          </AppLayout>
        </AuthProvider>
      </LanguageProvider>
    </Router>
  );
}
