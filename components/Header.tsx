import React from 'react';
import { Wrench, ShieldCheck, Languages, HelpCircle } from 'lucide-react';
import { Language } from '../types';

interface HeaderProps {
  language: Language;
  onToggleLanguage: () => void;
  onShowHelp: () => void;
  texts: {
    appTitle: string;
    appSubtitle: string;
    systemOnline: string;
  };
}

export const Header: React.FC<HeaderProps> = ({ language, onToggleLanguage, onShowHelp, texts }) => {
  return (
    <header className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-gray-900 border-b border-gray-800 gap-4">
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="p-2 bg-blue-600 rounded-lg shrink-0">
          <Wrench className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight leading-tight">{texts.appTitle}</h1>
          <p className="text-xs text-gray-400">{texts.appSubtitle}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onShowHelp}
          className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-colors text-gray-300 hover:text-white"
          title="Protocol Info"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
        <button
          onClick={onToggleLanguage}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-colors text-xs font-medium text-gray-300"
          title={language === 'en' ? "Switch to Vietnamese" : "Switch to English"}
        >
          <Languages className="w-3.5 h-3.5" />
          <span>{language === 'en' ? 'EN' : 'VI'}</span>
        </button>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-900/30 border border-green-800 rounded-full">
          <ShieldCheck className="w-4 h-4 text-green-400" />
          <span className="text-xs font-medium text-green-400 whitespace-nowrap">{texts.systemOnline}</span>
        </div>
      </div>
    </header>
  );
};
