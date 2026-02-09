import React from 'react';
import { Copy, Check, Trash2 } from 'lucide-react';

interface CodePanelProps {
  title: string;
  code: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  onClear?: () => void;
  copyTooltip?: string;
  clearTooltip?: string;
}

export const CodePanel: React.FC<CodePanelProps> = ({ 
  title, 
  code, 
  onChange, 
  readOnly = false, 
  placeholder,
  icon,
  actions,
  onClear,
  copyTooltip = "Copy to clipboard",
  clearTooltip = "Clear content"
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 rounded-xl border border-gray-800 overflow-hidden shadow-xl">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-850 border-b border-gray-800">
        <div className="flex items-center gap-2 text-gray-300 font-medium">
          {icon}
          <span>{title}</span>
        </div>
        <div className="flex items-center gap-2">
          {actions}
          <div className="h-4 w-px bg-gray-700 mx-1"></div>
           {onClear && (
             <button 
              onClick={onClear}
              className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-md transition-colors"
              title={clearTooltip}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <button 
            onClick={handleCopy}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
            title={copyTooltip}
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>
      <div className="flex-1 relative">
        <textarea
          value={code}
          onChange={(e) => onChange?.(e.target.value)}
          readOnly={readOnly}
          className={`w-full h-full p-4 bg-gray-950 font-mono text-sm resize-none focus:outline-none focus:ring-1 focus:ring-blue-500/50 ${readOnly ? 'text-green-300' : 'text-gray-300'}`}
          placeholder={placeholder}
          spellCheck={false}
        />
      </div>
    </div>
  );
};
