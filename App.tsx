import React, { useState, useCallback } from 'react';
import { CodeType, Language } from './types';
import { repairCode } from './services/geminiService';
import { Header } from './components/Header';
import { CodePanel } from './components/CodePanel';
import { HelpModal } from './components/HelpModal';
import { getTranslation } from './translations';
import { Play, Terminal, FileJson, Hash, MessageSquareText, Loader2, AlertCircle, Wand2 } from 'lucide-react';

const App: React.FC = () => {
  const [inputCode, setInputCode] = useState<string>('');
  const [outputCode, setOutputCode] = useState<string>('');
  const [selectedType, setSelectedType] = useState<CodeType>(CodeType.JSON);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [showHelp, setShowHelp] = useState<boolean>(false);

  const t = getTranslation(language);

  const handleToggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'vi' : 'en');
  };

  const handleRepair = useCallback(async () => {
    if (!inputCode.trim()) return;

    setIsLoading(true);
    setError(null);
    setOutputCode('');

    try {
      // Pass the current language to the service
      const result = await repairCode(inputCode, selectedType, language);
      setOutputCode(result);
    } catch (err: any) {
      // If error is generic, use translated generic error, else use string
      if (err.message && err.message.includes("API key")) {
          setError(t.errorGemini);
      } else {
          setError(err.message || t.errorUnexpected);
      }
    } finally {
      setIsLoading(false);
    }
  }, [inputCode, selectedType, language, t]);

  const handleClearInput = () => {
    setInputCode('');
    setError(null);
  };

  const handleClearOutput = () => {
    setOutputCode('');
    setError(null);
  };

  const handleLoadExample = () => {
    let example = '';
    switch (selectedType) {
      case CodeType.PYTHON:
        example = t.examples.python;
        break;
      case CodeType.JSON:
        example = t.examples.json;
        break;
      case CodeType.PROMPT:
        example = t.examples.prompt;
        break;
    }
    setInputCode(example);
    setError(null);
  };

  const getIconForType = (type: CodeType) => {
    switch (type) {
      case CodeType.PYTHON: return <Hash className="w-4 h-4 text-blue-400" />;
      case CodeType.JSON: return <FileJson className="w-4 h-4 text-yellow-400" />;
      case CodeType.PROMPT: return <MessageSquareText className="w-4 h-4 text-purple-400" />;
    }
  };

  const getPlaceholder = (type: CodeType) => {
    switch (type) {
      case CodeType.JSON: return t.placeholders.json;
      case CodeType.PYTHON: return t.placeholders.python;
      case CodeType.PROMPT: return t.placeholders.prompt;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-white">
      <Header 
        language={language} 
        onToggleLanguage={handleToggleLanguage}
        onShowHelp={() => setShowHelp(true)}
        texts={{
          appTitle: t.appTitle,
          appSubtitle: t.appSubtitle,
          systemOnline: t.systemOnline
        }}
      />

      <HelpModal 
        isOpen={showHelp} 
        onClose={() => setShowHelp(false)}
        texts={{
          helpTitle: t.helpTitle,
          helpDescription: t.helpDescription,
          helpSteps: t.helpSteps,
          close: t.close
        }}
      />

      <main className="flex-1 flex flex-col md:flex-row gap-4 p-4 md:p-6 overflow-hidden">
        {/* Left Panel: Input */}
        <section className="flex-1 flex flex-col h-full min-h-[400px]">
          <div className="mb-4 flex items-center gap-4">
            <div className="flex p-1 bg-gray-900 rounded-lg border border-gray-800">
              {Object.values(CodeType).map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                    selectedType === type
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  {getIconForType(type)}
                  {type}
                </button>
              ))}
            </div>
          </div>

          <CodePanel 
            title={t.inputTitle}
            icon={<Terminal className="w-4 h-4 text-red-400" />}
            code={inputCode}
            onChange={setInputCode}
            onClear={handleClearInput}
            placeholder={getPlaceholder(selectedType)}
            copyTooltip={t.copy}
            clearTooltip={t.clear}
            actions={
              <div className="flex items-center gap-2">
                <button
                  onClick={handleLoadExample}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors border border-gray-700"
                  title={t.example}
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>{t.example}</span>
                </button>
                <button
                  onClick={handleRepair}
                  disabled={isLoading || !inputCode.trim()}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
                    isLoading || !inputCode.trim()
                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/20'
                  }`}
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                  {isLoading ? t.repairing : t.runRepair}
                </button>
              </div>
            }
          />
        </section>

        {/* Right Panel: Output */}
        <section className="flex-1 flex flex-col h-full min-h-[400px]">
          <div className="mb-4 h-[42px] flex items-center text-gray-400 text-sm">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              {language === 'vi' ? 'Luồng đầu ra' : 'Output Stream'}
            </span>
          </div>

          <div className="relative flex-1">
             {error ? (
              <div className="absolute inset-0 bg-gray-900 rounded-xl border border-red-900/50 flex flex-col items-center justify-center text-red-400 p-6 text-center">
                <AlertCircle className="w-12 h-12 mb-4 opacity-50" />
                <h3 className="text-lg font-bold mb-2">{t.repairFailed}</h3>
                <p className="max-w-md opacity-80">{error}</p>
                <button 
                  onClick={() => setError(null)}
                  className="mt-4 px-4 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-300 rounded-md text-sm transition-colors border border-red-800/50"
                >
                  {t.dismiss}
                </button>
              </div>
             ) : (
               <CodePanel 
                title={t.outputTitle}
                icon={<Terminal className="w-4 h-4 text-green-400" />}
                code={outputCode}
                readOnly={true}
                onClear={handleClearOutput}
                copyTooltip={t.copy}
                clearTooltip={t.clear}
                placeholder={isLoading ? t.outputPlaceholderLoading : t.outputPlaceholderDefault}
              />
             )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;
