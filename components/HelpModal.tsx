import React from 'react';
import { X, ShieldCheck, Terminal } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  texts: {
    helpTitle: string;
    helpDescription: string;
    helpSteps: string[];
    close: string;
  };
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose, texts }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-850">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-bold text-white">{texts.helpTitle}</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          <p className="text-gray-300 mb-4">{texts.helpDescription}</p>
          
          <div className="bg-gray-950 rounded-lg p-4 border border-gray-800 mb-6">
            <ul className="space-y-3">
              {texts.helpSteps.map((step, index) => (
                <li key={index} className="flex gap-3 text-sm text-gray-300">
                  <Terminal className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
            >
              {texts.close}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
