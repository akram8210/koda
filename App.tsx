import React, { useState } from 'react';
import { ChevronDown, Globe, CheckCircle2 } from 'lucide-react';

import { Lesson, Language, BlockType, CommandLabBlock } from './types';
import { INITIAL_LESSONS, LANGUAGES, UI_TRANSLATIONS } from './constants';
import CommandLab from './components/CommandLab';

// --- Contexts ---

const AppContext = React.createContext<{
  lang: Language;
  setLang: (l: Language) => void;
} | null>(null);

const useAppContext = () => {
  const ctx = React.useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppContext");
  return ctx;
};

// --- Helper Components ---

const LanguageSwitcher = () => {
  const { lang, setLang } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-300 bg-slate-800/50 hover:bg-slate-800 rounded-md transition-all border border-transparent hover:border-slate-700"
      >
        <Globe size={16} />
        <span className="uppercase">{lang}</span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-100 overflow-hidden z-20 animate-in fade-in slide-in-from-top-2">
            {LANGUAGES.map(l => (
              <button
                key={l.code}
                onClick={() => { setLang(l.code); setIsOpen(false); }}
                className={`flex items-center w-full px-4 py-3 text-sm text-left hover:bg-slate-50 transition-colors ${lang === l.code ? 'text-brand-600 font-bold bg-brand-50' : 'text-slate-700'}`}
              >
                <span className="flex-1">{l.label}</span>
                {lang === l.code && <CheckCircle2 size={14} />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// --- Main Page Component ---

const SinglePageLesson = () => {
  const { lang } = useAppContext();
  // We only show the first lesson (Intro)
  const baseLesson = INITIAL_LESSONS[0];
  const t = UI_TRANSLATIONS[lang];

  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-12 pb-24">
      {/* Lesson Header */}
      <div className="mb-8 border-b border-slate-200 pb-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">{t.lesson1Title}</h1>
          <LanguageSwitcher />
        </div>
        <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-3xl">{t.lesson1Desc}</p>
      </div>

      {/* Blocks */}
      <div className="space-y-12">
        {baseLesson.blocks.map((block, idx) => (
          <div
            key={block.id}
            className="animate-in fade-in duration-700 slide-in-from-bottom-8 fill-mode-backwards"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            {block.type === BlockType.COMMAND_LAB && (
              <div className="space-y-4">
                {/* IMPORTANT: Instruction text + sound buttons removed exactly as requested */}
                <div className="w-full overflow-x-auto">
                  <CommandLab block={block as CommandLabBlock} lang={lang} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* GDPR Footer */}
      <footer className="mt-24 pt-8 border-t border-slate-200 text-center">
        <p className="text-slate-500 text-sm font-medium">{t.gdprFooter}</p>
      </footer>
    </div>
  );
};

// --- App Root ---

const App = () => {
  const [lang, setLang] = useState<Language>('sv');

  return (
    <AppContext.Provider value={{ lang, setLang }}>
      <div className="min-h-screen bg-slate-50">
        <SinglePageLesson />
      </div>
    </AppContext.Provider>
  );
};

export default App;
