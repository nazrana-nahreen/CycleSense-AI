import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  Copy, 
  Check, 
  ThumbsUp, 
  ThumbsDown, 
  Trash2, 
  AlertTriangle, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { Button } from '../common/Button';

export const ChatDrawer: React.FC = () => {
  const { 
    isChatDrawerOpen, 
    setIsChatDrawerOpen, 
    chatMessages, 
    sendChatMessage, 
    clearChatMessages, 
    isAssistantTyping,
    language, 
    t 
  } = useApp();

  const [input, setInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, 'up' | 'down'>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    { en: 'Why might my period be irregular?', bn: 'পিরিয়ড অনিয়মিত হওয়ার কারণ কী?' },
    { en: 'What is PCOS?', bn: 'পিসিওএস (PCOS) কী?' },
    { en: 'How can I track period pain?', bn: 'মাসিকের ব্যথা কীভাবে ট্র্যাক করব?' },
    { en: 'When should I talk to a doctor?', bn: 'কখন ডাক্তারের পরামর্শ নেওয়া উচিত?' },
    { en: 'Explain my cycle history in Bangla.', bn: 'আমার সাইকেলের তথ্য বাংলায় বুঝিয়ে দিন।' },
  ];

  useEffect(() => {
    if (isChatDrawerOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatDrawerOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isChatDrawerOpen) {
        setIsChatDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isChatDrawerOpen, setIsChatDrawerOpen]);

  if (!isChatDrawerOpen) return null;

  const handleSend = (textToSend?: string) => {
    const q = textToSend || input;
    if (!q.trim()) return;
    sendChatMessage(q.trim());
    if (!textToSend) setInput('');
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleFeedback = (id: string, val: 'up' | 'down') => {
    setFeedback(prev => ({ ...prev, [id]: val }));
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex justify-end bg-plum-950/40 backdrop-blur-xs animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsChatDrawerOpen(false);
      }}
    >
      <div className="bg-surface w-full max-w-lg h-full flex flex-col shadow-2xl border-l border-rose-100 animate-slideLeft">
        {/* Header */}
        <div className="p-4 border-b border-rose-100 flex items-center justify-between bg-gradient-to-r from-rose-50/80 to-lavender-50/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-rose-500 to-lavender-500 text-white rounded-2xl shadow-sm">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm text-plum-900">
                  {t.aiChat.title}
                </h3>
                <span className="text-[10px] font-semibold bg-lavender-200/70 text-lavender-900 px-2 py-0.5 rounded-full border border-lavender-300/50">
                  Dual-NLP
                </span>
              </div>
              <p className="text-[11px] text-plum-500 truncate max-w-[240px]">
                {language === 'bn' ? 'বাংলা ও ইংরেজিতে স্বাস্থ্য সহায়তা' : 'Evidence-backed reproductive guidance'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={clearChatMessages}
              className="p-1.5 text-plum-400 hover:text-plum-700 hover:bg-rose-100/50 rounded-xl transition-colors cursor-pointer"
              title={t.aiChat.clearChat}
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsChatDrawerOpen(false)}
              className="p-1.5 text-plum-400 hover:text-plum-700 hover:bg-rose-100/50 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Persistent Medical Disclaimer Notice */}
        <div className="bg-peach-50/70 border-b border-peach-200/60 px-4 py-2 text-[11px] text-plum-700 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-rose-500 shrink-0" />
          <p className="leading-snug">
            {t.aiChat.disclaimerNotice}
          </p>
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {chatMessages.map(msg => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              {/* Message Bubble */}
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs md:text-sm shadow-xs leading-relaxed whitespace-pre-line ${
                  msg.sender === 'user'
                    ? 'bg-rose-500 text-white rounded-br-none'
                    : msg.urgentCareWarning
                    ? 'bg-rose-50 border-2 border-rose-400 text-plum-900 rounded-bl-none'
                    : 'bg-canvas text-plum-900 border border-rose-100/80 rounded-bl-none'
                }`}
              >
                {msg.text}

                {/* Citations block */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-rose-200/60 text-[11px] text-plum-600">
                    <span className="font-semibold text-rose-700 block mb-1">
                      {t.aiChat.sourcesHeading}
                    </span>
                    <ul className="space-y-1 list-disc list-inside">
                      {msg.citations.map((cite, i) => (
                        <li key={i} className="text-[10px] text-plum-500">
                          {cite}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Action Toolbar for Assistant Messages */}
              {msg.sender === 'assistant' && (
                <div className="flex items-center gap-2 mt-1.5 text-[10px] text-plum-400 px-1">
                  <span>{msg.timestamp}</span>
                  <span>•</span>
                  <button
                    onClick={() => handleCopy(msg.id, msg.text)}
                    className="hover:text-plum-700 inline-flex items-center gap-1 cursor-pointer"
                  >
                    {copiedId === msg.id ? (
                      <>
                        <Check className="w-3 h-3 text-sage-600" />
                        <span className="text-sage-600">{t.aiChat.copied}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>{t.aiChat.copy}</span>
                      </>
                    )}
                  </button>

                  <span>•</span>
                  <button
                    onClick={() => handleFeedback(msg.id, 'up')}
                    className={`hover:text-rose-600 cursor-pointer ${
                      feedback[msg.id] === 'up' ? 'text-rose-600 font-bold' : ''
                    }`}
                    title="Helpful"
                  >
                    <ThumbsUp className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleFeedback(msg.id, 'down')}
                    className={`hover:text-plum-800 cursor-pointer ${
                      feedback[msg.id] === 'down' ? 'text-plum-900 font-bold' : ''
                    }`}
                    title="Not helpful"
                  >
                    <ThumbsDown className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          ))}
          {isAssistantTyping && (
            <div className="flex items-start">
              <div className="bg-canvas border border-rose-100 rounded-2xl rounded-bl-none p-3 shadow-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-lavender-400 animate-bounce delay-100" />
                <span className="w-2 h-2 rounded-full bg-peach-400 animate-bounce delay-200" />
                <span className="text-[11px] text-plum-400 font-medium ml-1.5">
                  {language === 'bn' ? 'উত্তর প্রস্তুত হচ্ছে...' : 'Synthesizing response...'}
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions Pills */}
        <div className="px-4 py-2 border-t border-rose-100/60 bg-surface">
          <p className="text-[10px] font-semibold text-plum-400 uppercase tracking-wider mb-1.5">
            {t.aiChat.suggestedQuestions}
          </p>
          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {suggestedQuestions.map((q, idx) => {
              const text = language === 'bn' ? q.bn : q.en;
              return (
                <button
                  key={idx}
                  onClick={() => handleSend(text)}
                  className="px-2.5 py-1 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-medium border border-rose-200/60 whitespace-nowrap transition-colors cursor-pointer shrink-0"
                >
                  {text}
                </button>
              );
            })}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-rose-100 bg-surface">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={t.aiChat.inputPlaceholder}
              className="flex-1 bg-canvas border border-rose-200 rounded-xl px-3.5 py-2.5 text-xs md:text-sm text-plum-900 placeholder:text-plum-400 focus:outline-none focus:ring-2 focus:ring-rose-400/40"
            />
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={!input.trim()}
              className="!px-3.5 shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
