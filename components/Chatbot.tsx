"use client";

import { useState, useRef, useEffect, useCallback, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, X, Send, Bot, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoogleGenAI } from "@google/genai";
import { useRouter } from "next/navigation";

type Message = {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
};

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

const ChatMessage = memo(({ msg }: { msg: Message }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(msg.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} group`}>
      <div className={`flex items-end gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`relative p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-emerald-600 text-white rounded-tr-sm' : 'bg-slate-800/80 border border-slate-700/50 rounded-tl-sm text-slate-100'}`}>
          {msg.content}
          
          {msg.role === 'model' && (
            <button 
              onClick={handleCopy}
              className="absolute -right-8 top-2 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out p-1.5 rounded-md bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-200 hover:scale-110"
              title="Copy to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>
      <span className="text-[10px] text-slate-500 mt-1 px-1 opacity-60">
        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  );
});
ChatMessage.displayName = "ChatMessage";

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 'welcome',
      role: 'model', 
      content: "Hi! I'm Lumi ✨, your Ecozy assistant. I'm here to illuminate your journey and guide you through the platform effortlessly. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    setInput("");
    
    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userMsg,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newUserMsg]);
    setIsLoading(true);

    try {
      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: `You are Lumi, Ecozy's intelligent assistant that guides users through the platform, helping them understand features, navigate workflows, and solve issues effortlessly. The name Lumi is derived from "Luminous", bringing light, clarity, and guidance.
          You are friendly, intelligent, simple to interact with, and supportive during onboarding and exploration.
          If the user asks about products, suggest they add items to their catalog.
          If they ask about proposals, suggest generating one.
          Keep your answers concise and helpful.`,
        }
      });

      // Send the current message in a new chat session with context
      const response = await chat.sendMessage({ message: userMsg });

      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(),
        role: 'model', 
        content: response.text || "I'm not sure what to say to that.",
        timestamp: new Date()
      }]);
      
    } catch (error) {
      console.error("Chat API Error:", error);
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(),
        role: 'model', 
        content: "I'm having trouble connecting right now. Please check your connection and try again. ✨",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [input]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-[380px] h-[550px] bg-slate-900/90 backdrop-blur-2xl border border-slate-700/50 rounded-3xl shadow-[0_0_40px_rgba(16,185,129,0.15)] flex flex-col z-50 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 p-5 flex justify-between items-center text-white border-b border-emerald-400/20">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2.5 rounded-2xl shadow-inner">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Lumi ✨</h3>
                  <p className="text-xs text-emerald-100 font-medium tracking-wide">Your Intelligent Ecozy Guide</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="text-white hover:bg-emerald-700/50 rounded-full h-9 w-9 transition-colors" onClick={() => setIsOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-slate-900/40">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} msg={msg} />
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-800/80 border border-slate-700/50 shadow-sm p-4 rounded-2xl rounded-tl-sm flex gap-1.5 items-center">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-75" />
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-150" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-slate-900/80 border-t border-slate-800/60 backdrop-blur-md">
              <form onSubmit={handleSend} className="flex gap-3">
                <Input 
                  value={input} 
                  onChange={e => setInput(e.target.value)} 
                  placeholder="Share your thoughts with Lumi..." 
                  className="rounded-full bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-400 focus-visible:ring-emerald-500 h-11 px-4"
                />
                <Button type="submit" size="icon" className="rounded-full bg-emerald-600 hover:bg-emerald-500 shrink-0 text-white h-11 w-11 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all duration-500 ease-in-out hover:scale-110 hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]" disabled={isLoading || !input.trim()}>
                  <Send className="w-5 h-5" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-[0_0_30px_rgba(16,185,129,0.4)] bg-emerald-600 hover:bg-emerald-500 text-white z-50 flex items-center justify-center p-0 hover:scale-110 transition-all duration-500 ease-in-out hover:shadow-[0_0_50px_rgba(16,185,129,0.6)]"
      >
        {isOpen ? <X className="w-7 h-7" /> : <MessageCircle className="w-7 h-7" />}
      </Button>
    </>
  );
}
