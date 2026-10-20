import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Copy, 
  Check, 
  ThumbsUp, 
  ThumbsDown, 
  Trash2, 
  ShieldCheck, 
  AlertTriangle,
  Info
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';

export const AiAssistantPage: React.FC = () => {
  const { 
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
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

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
    <div className="space-y-3 sm:space-y-4 max-w-4xl mx-auto pb-4 animate-fadeIn flex flex-col h-[calc(100vh-210px)] sm:h-[calc(100vh-150px)] min-h-[460px]">
      {/* Title Bar */}
      <div className="flex items-center justify-between pb-1 sm:pb-2">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="p-2 sm:p-2.5 rounded-2xl bg-gradient-to-br from-rose-500 to-lavender-500 text-white shadow-sm">
            <Bot className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-2xl font-bold text-plum-900 tracking-tight">
              {t.aiChat.title}
            </h2>
            <p className="text-[11px] sm:text-xs text-plum-500">
              {t.aiChat.subtitle}
            </p>
          </div>
        </div>

        <button
          onClick={clearChatMessages}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-plum-500 hover:text-rose-600 bg-surface px-2.5 sm:px-3 py-1.5 rounded-xl border border-rose-100 transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t.aiChat.clearChat}</span>
        </button>
      </div>

      {/* Persistent Medical Disclaimer Notice */}
      <div className="bg-peach-50/80 border border-peach-200/80 rounded-2xl px-4 py-2.5 text-xs text-plum-800 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-rose-500 shrink-0" />
        <p className="leading-snug">
          <strong>{language === 'bn' ? 'জরুরি বিজ্ঞপ্তি:' : 'Medical Guardrail:'}</strong> {t.aiChat.disclaimerNotice}
        </p>
      </div>

      {/* Main Chat Conversation Container */}
      <Card className="flex-1 p-4 md:p-6 flex flex-col justify-between overflow-hidden shadow-soft">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {chatMessages.map(msg => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              {/* Message Bubble */}
              <div
                className={`max-w-[85%] rounded-3xl p-4 text-xs sm:text-sm shadow-xs leading-relaxed whitespace-pre-line ${
                  msg.sender === 'user'
                    ? 'bg-rose-500 text-white rounded-br-none'
                    : msg.urgentCareWarning
                    ? 'bg-rose-50 border-2 border-rose-400 text-plum-900 rounded-bl-none'
                    : 'bg-canvas text-plum-900 border border-rose-100/80 rounded-bl-none'
                }`}
              >
                {msg.text}

                {/* Clinical Citations */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-rose-200/60 text-xs text-plum-600">
                    <span className="font-bold text-rose-700 block mb-1">
                      {t.aiChat.sourcesHeading}
                    </span>
                    <ul className="space-y-1 list-disc list-inside">
                      {msg.citations.map((cite, i) => (
                        <li key={i} className="text-[11px] text-plum-500">
                          {cite}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Action Toolbar for Assistant Messages */}
              {msg.sender === 'assistant' && (
                <div className="flex items-center gap-2 mt-1.5 text-xs text-plum-400 px-2">
                  <span>{msg.timestamp}</span>
                  <span>•</span>
                  <button
                    onClick={() => handleCopy(msg.id, msg.text)}
                    className="hover:text-plum-700 inline-flex items-center gap-1 cursor-pointer"
                  >
                    {copiedId === msg.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-sage-600" />
                        <span className="text-sage-600 font-semibold">{t.aiChat.copied}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
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
                    title={t.aiChat.thumbsUp}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleFeedback(msg.id, 'down')}
                    className={`hover:text-plum-800 cursor-pointer ${
                      feedback[msg.id] === 'down' ? 'text-plum-900 font-bold' : ''
                    }`}
                    title={t.aiChat.thumbsDown}
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}
          {isAssistantTyping && (
            <div className="flex items-start">
              <div className="bg-canvas border border-rose-100 rounded-3xl rounded-bl-none p-3.5 shadow-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-lavender-400 animate-bounce delay-100" />
                <span className="w-2 h-2 rounded-full bg-peach-400 animate-bounce delay-200" />
                <span className="text-xs text-plum-400 font-medium ml-2">
                  {language === 'bn' ? 'এআই উত্তর তৈরি করছে...' : 'CycleSense AI is evaluating clinical evidence...'}
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Question Chips */}
        <div className="pt-3 border-t border-rose-50 space-y-1.5">
          <span className="text-[11px] font-bold text-plum-400 uppercase tracking-wider block">
            {t.aiChat.suggestedQuestions}
          </span>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {suggestedQuestions.map((q, idx) => {
              const text = language === 'bn' ? q.bn : q.en;
              return (
                <button
                  key={idx}
                  onClick={() => handleSend(text)}
                  className="px-3 py-1 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold border border-rose-200/60 whitespace-nowrap transition-colors cursor-pointer shrink-0"
                >
                  {text}
                </button>
              );
            })}
          </div>
        </div>

        {/* Input Bar */}
        <div className="pt-3">
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
              className="flex-1 bg-canvas border border-rose-200 rounded-2xl px-4 py-3 text-xs sm:text-sm text-plum-900 placeholder:text-plum-400 focus:outline-none focus:ring-2 focus:ring-rose-400/40"
            />
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={!input.trim()}
              className="!px-5 shrink-0 rounded-2xl"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};
