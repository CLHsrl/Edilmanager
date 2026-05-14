'use client';

import { useState, useTransition } from 'react';
import { 
  Wand2, Send, Loader2, ShieldCheck, 
  AlertTriangle, FileText, CheckCircle, 
  Plus, Trash2, Printer, ChevronRight,
  Bot, User, Sparkles
} from 'lucide-react';
import { createSafetyPlan } from '@/app/(app)/safety-actions';
import { processSafetyConversation } from '@/app/(app)/ai-actions';

type SafetyWizardProps = {
  projectId: string;
  projectName: string;
  onClose: () => void;
};

type Message = {
  role: 'assistant' | 'user';
  content: string;
};

export default function AISafetyWizard({ projectId, projectName, onClose }: SafetyWizardProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: `Ciao! Sono il tuo AI Safety Copilot. Ti aiuterò a generare il POS per il cantiere: **${projectName}**. Descrivimi brevemente i lavori principali che verranno eseguiti.` }
  ]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [step, setStep] = useState(1);
  const [posDraft, setPosDraft] = useState<any>(null);
  const [isPending, startTransition] = useTransition();

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input } as Message];
    setMessages(newMessages);
    setInput('');
    setIsGenerating(true);

    try {
        const response = await processSafetyConversation(newMessages);
        setMessages([...newMessages, { role: 'assistant', content: response.content } as Message]);
        setStep(response.nextStep);
        if (response.draft) {
            setPosDraft(response.draft);
        }
    } catch (err) {
        setMessages([...newMessages, { role: 'assistant', content: "Mmm, ho avuto un piccolo problema tecnico nell'analisi. Puoi ripetere o descrivere meglio i lavori?" } as Message]);
    } finally {
        setIsGenerating(false);
    }
  };

  const finalizePlan = () => {
    startTransition(async () => {
        const content = JSON.stringify(posDraft);
        const result = await createSafetyPlan(
            projectId, 
            `POS Assistito - ${new Date().toLocaleDateString()}`, 
            content, 
            JSON.stringify(messages)
        );
        
        if (result.success) {
            onClose();
        } else {
            alert(result.error || "Errore durante il salvataggio del piano.");
        }
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto space-y-6 p-2 scrollbar-hide">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white flex-shrink-0 mt-1 shadow-lg shadow-blue-100">
                <Bot size={16} />
              </div>
            )}
            <div className={`max-w-[85%] px-5 py-4 rounded-[1.5rem] text-sm font-medium shadow-sm border ${
              m.role === 'assistant' 
                ? 'bg-white text-gray-800 border-gray-100' 
                : 'bg-blue-600 text-white border-blue-500'
            }`}>
              {m.content.split('\n').map((line, idx) => (
                <p key={idx} className={idx > 0 ? 'mt-1' : ''} dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') }} />
              ))}
            </div>
          </div>
        ))}

        {isGenerating && (
          <div className="flex gap-3 justify-start animate-pulse">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
              <Sparkles size={16} />
            </div>
            <div className="bg-gray-100 px-5 py-3 rounded-[1.5rem] border border-gray-100">
              <div className="flex gap-1.5">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        )}

        {posDraft && step === 3 && (
            <div className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-100 p-6 rounded-[2rem] shadow-xl animate-in zoom-in-95">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                        <CheckCircle size={20} />
                    </div>
                    <div>
                        <h4 className="font-black text-gray-900 uppercase tracking-tighter">Bozza POS Generata</h4>
                        <p className="text-[9px] font-black text-green-600 uppercase tracking-widest">Analisi AI Completata Correttamente</p>
                    </div>
                </div>
                
                <div className="space-y-3 mb-6">
                    <div className="flex flex-wrap gap-1.5">
                       {posDraft.risks.map((r: string) => (
                         <span key={r} className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-red-200">{r}</span>
                       ))}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                       {posDraft.equipment.map((e: string) => (
                         <span key={e} className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-blue-200">{e}</span>
                       ))}
                    </div>
                </div>

                <button 
                    onClick={finalizePlan}
                    disabled={isPending}
                    className="w-full bg-gray-900 hover:bg-black text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                    {isPending ? <Loader2 size={18} className="animate-spin" /> : <><FileText size={18} /> SALVA E GENERA DOCUMENTO</>}
                </button>
            </div>
        )}
      </div>

      {/* Input Area */}
      {step < 3 && (
        <div className="mt-4 pt-4 border-t border-gray-100 relative">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Scrivi qui la tua descrizione..."
            className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-2xl px-5 py-4 pr-16 text-sm font-bold outline-none transition-all"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isGenerating}
            className="absolute right-3 top-[30px] p-2 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
