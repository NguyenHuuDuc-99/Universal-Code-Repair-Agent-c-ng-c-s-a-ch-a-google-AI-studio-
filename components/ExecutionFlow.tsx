import React from 'react';
import { CheckCircle2, Circle, Loader2, XCircle, Terminal, Wrench, PlayCircle, ShieldCheck } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../translations';

interface ExecutionFlowProps {
  status: 'idle' | 'loading' | 'success' | 'error';
  resultText?: string;
  language: Language;
}

export const ExecutionFlow: React.FC<ExecutionFlowProps> = ({ status, resultText, language }) => {
  const t = getTranslation(language);

  // Helper to determine step status based on global status and regex on resultText
  const getStepStatus = (stepIndex: number): 'pending' | 'loading' | 'success' | 'error' => {
    if (status === 'idle') return 'pending';
    if (status === 'error') return 'error';
    if (status === 'loading') return 'loading'; // Simplified: all show loading or we could stagger them
    
    // Status is success, analyze text for specific steps
    if (stepIndex <= 2) return 'success'; // Init, Check, Fix assumed success if we got a response
    
    if (stepIndex === 3) {
      // Step 4: Verification. Check for specific markers in text.
      if (resultText && (resultText.includes("✅") || resultText.includes("Syntax OK"))) {
        return 'success';
      }
      if (resultText && (resultText.includes("❌") || resultText.includes("Error"))) {
        return 'error';
      }
      // Fallback if markers missing but response exists
      return 'success';
    }
    return 'success';
  };

  const steps = [
    { id: 1, label: t.executionFlow.step1, icon: Terminal },
    { id: 2, label: t.executionFlow.step2, icon: ShieldCheck },
    { id: 3, label: t.executionFlow.step3, icon: Wrench },
    { id: 4, label: t.executionFlow.step4, icon: PlayCircle },
  ];

  return (
    <div className="w-full bg-gray-900 border-b border-gray-800 px-4 py-3">
      <div className="flex items-center justify-between max-w-2xl mx-auto relative">
        {/* Connecting Line */}
        <div className="absolute left-0 top-1/2 w-full h-0.5 bg-gray-800 -z-0"></div>
        
        {steps.map((step, index) => {
          const stepStatus = getStepStatus(index);
          const Icon = step.icon;
          
          let statusColor = "text-gray-600 bg-gray-900 border-gray-700";
          let iconColor = "text-gray-600";
          
          if (stepStatus === 'loading') {
            statusColor = "text-blue-400 bg-gray-900 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]";
            iconColor = "text-blue-400";
          } else if (stepStatus === 'success') {
            statusColor = "text-green-400 bg-gray-900 border-green-500";
            iconColor = "text-green-400";
          } else if (stepStatus === 'error') {
            statusColor = "text-red-400 bg-gray-900 border-red-500";
            iconColor = "text-red-400";
          }

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center gap-2 group">
              <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${statusColor}`}>
                {stepStatus === 'loading' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : stepStatus === 'success' ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : stepStatus === 'error' ? (
                  <XCircle className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
              <span className={`text-[10px] font-medium uppercase tracking-wider bg-gray-900 px-1 ${
                stepStatus === 'pending' ? 'text-gray-600' : 'text-gray-300'
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
