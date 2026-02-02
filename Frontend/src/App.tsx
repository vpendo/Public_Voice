import { useState } from 'react';
import { Navbar } from './Components/Navbar';
import { content } from './i18n/content'; 
import type { Language } from './i18n/content'; 
import './index.css';

function App() {
  const [lang, setLang] = useState<Language>('English');
  const t = content[lang];

  // This check prevents the "An error occurred" crash
  if (!t || !t.nav) {
    return <div className="p-10 text-center">Loading PublicVoice...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* 11/12 Width is handled inside the Navbar component */}
      <Navbar currentLang={lang} onLangChange={setLang} />

      
    </div>
  );
}

export default App;