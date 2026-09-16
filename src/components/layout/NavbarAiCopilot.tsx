import React, { useState } from 'react';
import { Sparkles, X, Send, Bot, User, Thermometer, Truck, CloudSun, CheckCircle2, ChevronRight } from 'lucide-react';

interface NavbarAiCopilotProps {
  isOpen: boolean;
  onClose: () => void;
}

interface QAPair {
  question: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  answer: string;
  recommendation: string;
}

const PRESET_QUERIES: QAPair[] = [
  {
    question: 'What are optimal cold storage settings for Sonaka Export Grapes?',
    category: 'Storage Telemetry',
    icon: Thermometer,
    answer: 'Sonaka grapes require 0.5°C to 1.5°C with 90–95% Relative Humidity and rapid forced-air pre-cooling within 4 hours of harvest to prevent rachis browning.',
    recommendation: 'Chamber B4 at Sahyadri Cold Hub is currently operating at 2.4°C / 62% RH. Recommend lowering chamber setpoint by 1.2°C prior to evening intake.',
  },
  {
    question: 'What is the transit weather risk along the Nashik to Vashi NH-60 corridor?',
    category: 'Logistics Advisory',
    icon: CloudSun,
    answer: 'Showers predicted between 18:30–21:00 along Kasara Ghat section. Surface road transit times likely to increase by 25–35 minutes.',
    recommendation: 'Dispatch reefer truck MH-15-EG-4821 before 16:00 to avoid ghat slowdown and prevent temperature breach in stop-and-go congestion.',
  },
  {
    question: 'How does AgriSync verify cold-chain compliance without leaking proprietary data?',
    category: 'Blockchain Ledger',
    icon: Truck,
    answer: 'AgriSync computes SHA-256 cryptographic hashes of temperature compliance proofs, waypoint timestamps, and driver handoffs, anchoring only proofs on-chain while keeping full sensor streams secure on private telemetry nodes.',
    recommendation: 'Wholesale buyers can verify batch integrity via QR scan without accessing farm operational financials.',
  },
  {
    question: 'What is the current mandi price spread between Nashik and Mumbai Vashi?',
    category: 'Market Intelligence',
    icon: Sparkles,
    answer: 'Sonaka Grade A+ is trading at ₹84/kg at Nashik APMC and ₹104/kg at Vashi Wholesale APMC. Net margin after ₹4.20/kg reefer transport is approximately +₹15.80/kg.',
    recommendation: 'Coordinating batch consolidation with adjacent Dindori farmers saves an additional 14% on freight haulage costs.',
  },
];

export const NavbarAiCopilot: React.FC<NavbarAiCopilotProps> = ({ isOpen, onClose }) => {
  const [activeQA, setActiveQA] = useState<QAPair>(PRESET_QUERIES[0]);
  const [customInput, setCustomInput] = useState('');
  const [history, setHistory] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: 'Namaste! I am your AgriSync AI Copilot. How can I assist your harvest, cold storage allocation, or freight dispatch today?',
    },
  ]);

  if (!isOpen) return null;

  const handleSelectPreset = (qa: QAPair) => {
    setActiveQA(qa);
    setHistory((prev) => [
      ...prev,
      { role: 'user', text: qa.question },
      { role: 'assistant', text: `${qa.answer} \n\nActionable Advice: ${qa.recommendation}` },
    ]);
  };

  const handleSendCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;

    const userText = customInput.trim();
    setCustomInput('');

    // Generate intelligent contextual response
    let responseText = `Regarding "${userText}": Based on current pilot sensor telemetry and agricultural guidelines, maintain uninterrupted reefer transport at 2-4°C, verify pallet humidity sensors, and lock the cryptographic attestation prior to mandi dispatch.`;
    if (userText.toLowerCase().includes('price') || userText.toLowerCase().includes('mandi') || userText.toLowerCase().includes('rate')) {
      responseText = `Market Intelligence: Current farm-gate spot rates show premium export Sonaka grapes at ₹84/kg with upward demand in Mumbai Vashi (+4.2%). Transportation cost averages ₹42/km along the NH-60 corridor.`;
    } else if (userText.toLowerCase().includes('weather') || userText.toLowerCase().includes('rain')) {
      responseText = `Weather Advisory: 32% rain probability tonight in Nashik cluster with 67% humidity. We advise staging sensitive table grape harvests under covered bays before 18:00.`;
    }

    setHistory((prev) => [
      ...prev,
      { role: 'user', text: userText },
      { role: 'assistant', text: responseText },
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-stone-950/70 backdrop-blur-xs">
      {/* Background overlay click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Slide-over panel */}
      <div className="relative w-full max-w-md h-full bg-stone-900 border-l border-stone-800 text-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 bg-stone-950 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-sm border border-emerald-400/40">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold font-heading text-white">Agri-AI Kisan Intelligence</h3>
                <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-mono border border-emerald-800">
                  v2.6 Model
                </span>
              </div>
              <p className="text-[11px] text-stone-400">Ground-truth agricultural supply chain advisory</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preset Topics Carousel */}
        <div className="p-3 bg-stone-950/60 border-b border-stone-800 overflow-x-auto">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-2 px-1">
            Quick Operational Insights
          </span>
          <div className="flex gap-2">
            {PRESET_QUERIES.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectPreset(item)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-850 hover:bg-stone-800 text-stone-200 hover:text-emerald-300 border border-stone-750 text-xs shrink-0 transition-colors"
                >
                  <Icon className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{item.category}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Conversation Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {history.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 text-xs leading-relaxed ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-emerald-950 border border-emerald-600/40 text-emerald-400 flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
              )}
              <div
                className={`p-3.5 rounded-2xl max-w-[85%] whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-emerald-700 text-white rounded-tr-xs'
                    : 'bg-stone-800 text-stone-200 border border-stone-700 rounded-tl-xs'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-stone-950 border-t border-stone-800">
          <form onSubmit={handleSendCustom} className="flex items-center gap-2">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Ask about storage, mandi rates, route risks..."
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-750 text-white placeholder-stone-500 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={!customInput.trim()}
              className="p-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl transition-colors"
              title="Send query"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-[10px] text-stone-400 text-center mt-2 font-mono">
            AgriSync Agricultural Intelligence Network • Powered by Farm-to-Mandi Telemetry
          </p>
        </div>
      </div>
    </div>
  );
};
