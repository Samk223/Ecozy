"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import Link from "next/link";
import { ArrowRight, Leaf, Package, FileText, Sparkles, Globe, Zap, CheckCircle2, Bot, Recycle, HeartHandshake, CloudRain, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Chatbot } from "@/components/Chatbot";
import { useRef, useState, useEffect } from "react";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const [activeTab, setActiveTab] = useState<'products' | 'proposals' | 'impact'>('products');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleEmailSubmit = () => {
    const email = emailInputRef.current?.value;
    if (!email || !email.trim()) {
      showToast("Please enter your work email instead.");
      return;
    }
    // Simple email validation
    if (!email.includes('@') || !email.includes('.')) {
      showToast("Please enter a valid work email.");
      return;
    }
    showToast("Demo invitation sent! Check your email.");
  };

  const handleStartupSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    showToast("Please enter your work email to submit your startup.");
    emailInputRef.current?.focus();
    emailInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  // Auto-cycle tabs
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab(prev => {
        if (prev === 'products') return 'proposals';
        if (prev === 'proposals') return 'impact';
        return 'products';
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={containerRef} className="flex flex-col min-h-screen bg-[#060b14] text-slate-50 selection:bg-emerald-500/30 font-sans overflow-hidden">
      
      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-[#1a1a1a] text-white px-6 py-3.5 rounded-full flex items-center gap-3 shadow-2xl border border-white/10"
          >
            <div className="w-5 h-5 rounded-full border-2 border-emerald-500 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <span className="font-medium text-sm whitespace-nowrap">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-32 px-4 overflow-hidden">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[800px] h-[400px] md:h-[600px] bg-emerald-500/20 blur-[120px] rounded-full pointer-events-none" />
        
        {/* Winding Lines SVG Background */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" viewBox="0 0 1440 800" fill="none" xmlns="http://www.w3.org/2000/svg">
          <motion.path 
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            d="M-100 200 C 200 200, 300 600, 600 500 C 900 400, 1000 100, 1500 300" 
            stroke="#10b981" strokeWidth="3" strokeDasharray="10 10" 
          />
          <motion.path 
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2.5, ease: "easeInOut", delay: 0.5 }}
            d="M-100 600 C 300 600, 400 200, 800 300 C 1200 400, 1300 700, 1500 600" 
            stroke="#3b82f6" strokeWidth="2" strokeDasharray="5 5" 
          />
        </svg>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl z-10 mt-10"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
            Meet the <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">green shift.</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 mb-10 max-w-3xl mx-auto leading-relaxed">
            Ecozy makes sustainable commerce simple, intelligent, and accessible. Automate product categorization and generate intelligent B2B proposals effortlessly.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="h-14 px-8 text-lg bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] transition-all duration-500 ease-in-out hover:scale-110 hover:shadow-[0_0_50px_-5px_rgba(16,185,129,0.6)]">
                Get Started Free
              </Button>
            </Link>
            <Link href="/proposal-generator">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white rounded-full bg-slate-900/50 backdrop-blur-sm transition-all duration-500 ease-in-out hover:scale-110 hover:border-slate-500">
                Try Proposal Generator
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Mockup Window */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mt-20 z-10 w-full max-w-5xl rounded-2xl border border-slate-800/60 bg-[#0f172a]/80 backdrop-blur-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] overflow-hidden"
        >
          <div className="h-12 border-b border-slate-800/60 flex items-center px-4 gap-2 bg-[#0f172a]/90">
            <div className="w-3 h-3 rounded-full bg-rose-500" />
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <div className="ml-4 px-3 py-1 rounded-md bg-slate-800/50 text-xs text-slate-400 flex items-center gap-2">
              <Leaf className="w-3 h-3 text-emerald-400" /> ecozy.app
            </div>
          </div>
          <div className="flex h-[400px] md:h-[500px]">
            {/* Sidebar */}
            <div className="w-48 md:w-64 border-r border-slate-800/60 p-4 hidden sm:block bg-slate-900/40">
              <div className="space-y-2">
                <button 
                  onClick={() => setActiveTab('products')} 
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-500 ease-in-out ${activeTab === 'products' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 hover:translate-x-1'}`}
                >
                  <Package className="w-4 h-4" /> Products
                </button>
                <button 
                  onClick={() => setActiveTab('proposals')} 
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-500 ease-in-out ${activeTab === 'proposals' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 hover:translate-x-1'}`}
                >
                  <FileText className="w-4 h-4" /> Proposals
                </button>
                <button 
                  onClick={() => setActiveTab('impact')} 
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-500 ease-in-out ${activeTab === 'impact' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 hover:translate-x-1'}`}
                >
                  <Globe className="w-4 h-4" /> Impact Report
                </button>
              </div>
            </div>
            {/* Main Content */}
            <div className="flex-1 p-6 md:p-8 overflow-hidden relative bg-slate-900/20">
              <AnimatePresence mode="wait">
                {activeTab === 'products' && (
                  <motion.div 
                    key="products"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-slate-100">Catalog Overview</h2>
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)] hover:scale-110 hover:shadow-[0_0_20px_rgba(16,185,129,0.5)]">
                        + Add Product
                      </Button>
                    </div>
                    
                    {/* Search Bar Simulation */}
                    <div className="mb-6 bg-slate-800/50 border border-slate-700 rounded-lg p-3 flex items-center gap-3">
                      <Search className="w-5 h-5 text-slate-400" />
                      <motion.span 
                        initial={{ width: 0 }}
                        animate={{ width: "auto" }}
                        transition={{ duration: 2, ease: "linear" }}
                        className="text-slate-200 overflow-hidden whitespace-nowrap border-r-2 border-emerald-500 pr-1"
                      >
                        bamboo products
                      </motion.span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { name: "Bamboo Toothbrush", cat: "Personal Care", desc: "100% biodegradable handle", tags: ["Zero Waste", "Plastic-Free"] },
                        { name: "Bamboo Cutlery Set", cat: "Kitchen", desc: "Reusable travel utensil set", tags: ["Reusable", "Compostable"] },
                        { name: "Bamboo Fiber Towel", cat: "Home", desc: "Ultra-soft and sustainable", tags: ["Organic", "Ethical"] },
                        { name: "Bamboo Cotton Swabs", cat: "Personal Care", desc: "Eco-friendly alternative", tags: ["Biodegradable"] }
                      ].map((item, i) => (
                        <motion.div 
                          key={i} 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 2 + i * 0.2 }}
                          className="p-4 rounded-xl border border-slate-800/60 bg-slate-800/30 flex flex-col gap-3 hover:border-emerald-500/50 hover:bg-slate-800/50 transition-all duration-500 ease-in-out cursor-default"
                        >
                          <div className="flex justify-between items-start">
                            <div className="font-medium text-slate-200">{item.name}</div>
                            <div className="text-xs px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full">{item.cat}</div>
                          </div>
                          <div className="text-sm text-slate-400">{item.desc}</div>
                          <div className="flex gap-2 mt-2 flex-wrap">
                            {item.tags.map(tag => (
                              <div key={tag} className="text-xs px-2 py-1 bg-slate-700/50 text-slate-300 rounded-md border border-slate-600">
                                {tag}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'proposals' && (
                  <motion.div 
                    key="proposals"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="h-full flex flex-col"
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-slate-100">B2B Proposals</h2>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-[0_0_10px_rgba(59,130,246,0.3)] hover:scale-110 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                        Generate New
                      </Button>
                    </div>
                    <div className="flex-1 rounded-xl border border-slate-800/60 bg-slate-800/20 p-6 flex flex-col gap-4">
                      <div className="flex items-center gap-4 border-b border-slate-800/60 pb-4">
                        <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                          <FileText className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                          <div className="font-medium text-slate-200 text-lg">EcoHotels Inc. Bulk Order</div>
                          <div className="text-sm text-slate-400">Generated by Ecozy AI</div>
                        </div>
                        <div className="ml-auto px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30 text-sm font-medium">
                          Approved
                        </div>
                      </div>
                      <div className="space-y-3 mt-2">
                        {[
                          { item: "10,000x Bamboo Toothbrushes", cost: "$5,000", impact: "-150kg Plastic" },
                          { item: "5,000x Bamboo Towels", cost: "$12,500", impact: "-500L Water" },
                          { item: "2,000x Cutlery Sets", cost: "$8,000", impact: "-80kg Plastic" }
                        ].map((row, i) => (
                          <motion.div 
                            key={i} 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.2 }}
                            className="flex justify-between items-center p-3 rounded-lg bg-slate-800/30 border border-slate-800/50"
                          >
                            <div className="text-slate-300 text-sm">{row.item}</div>
                            <div className="text-slate-400 text-sm">{row.cost}</div>
                            <div className="text-emerald-400 text-sm font-medium">{row.impact}</div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'impact' && (
                  <motion.div 
                    key="impact"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.4 }}
                    className="h-full flex flex-col gap-6"
                  >
                    <div className="flex justify-between items-end">
                      <div>
                        <h2 className="text-sm font-mono text-emerald-500 uppercase tracking-widest mb-1">Impact Analytics</h2>
                        <h3 className="text-2xl font-bold text-slate-100 italic">Environmental ROI</h3>
                      </div>
                      <div className="px-3 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono whitespace-nowrap">
                        REAL-TIME SYNC • Q3 2026
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="p-5 rounded-2xl border border-slate-800 bg-slate-900/50 relative overflow-hidden group"
                      >
                        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                          <Globe className="w-12 h-12 text-blue-400" />
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-tighter mb-1">Total Carbon Offset</div>
                        <div className="text-3xl font-bold text-slate-100 mb-1">12.5 <span className="text-sm font-normal text-slate-500">tCO2e</span></div>
                        <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                          <Zap className="w-3 h-3" /> +14.2% vs last month
                        </div>
                      </motion.div>

                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="p-5 rounded-2xl border border-slate-800 bg-slate-900/50 relative overflow-hidden group"
                      >
                        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                          <Recycle className="w-12 h-12 text-emerald-400" />
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-tighter mb-1">Waste Diverted</div>
                        <div className="text-3xl font-bold text-slate-100 mb-1">450 <span className="text-sm font-normal text-slate-500">kg</span></div>
                        <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                          <Zap className="w-3 h-3" /> +22.0% vs last month
                        </div>
                      </motion.div>
                    </div>

                    <div className="flex-1 rounded-2xl border border-slate-800 bg-slate-950/50 p-6 flex flex-col gap-4">
                      <div className="flex justify-between items-center px-1">
                        <span className="text-[10px] font-mono text-slate-500 uppercase">Weekly Progress</span>
                        <div className="flex gap-2">
                           <div className="w-2 h-2 rounded-full bg-emerald-400" />
                           <div className="w-2 h-2 rounded-full bg-blue-400" />
                        </div>
                      </div>
                      <div className="flex-1 flex items-end gap-3 justify-between pt-4">
                        {[40, 75, 55, 95, 65, 85, 100].map((h, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                            <motion.div 
                              initial={{ height: 0 }}
                              animate={{ height: `${h}%` }}
                              transition={{ duration: 1, delay: 0.5 + i * 0.1, ease: 'circOut' }}
                              className="w-full bg-gradient-to-t from-emerald-600/40 via-emerald-500 to-emerald-400 rounded-lg relative shadow-[0_0_20px_rgba(16,185,129,0.1)] group-hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all" 
                            >
                               <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-[10px] font-mono text-emerald-400 transition-opacity">
                                 {h}%
                               </div>
                            </motion.div>
                            <span className="text-[8px] font-mono text-slate-600 group-hover:text-slate-400 uppercase tracking-tighter">Day 0{i+1}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Overlay gradient for fade out effect */}
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0f172a]/90 to-transparent pointer-events-none" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* IMPACT / CONGRATULATORY SECTION */}
      <section className="py-40 relative overflow-hidden bg-[#060b14]">
        {/* Abstract background elements */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-emerald-500/5 blur-[100px] rounded-full" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-sm font-mono text-emerald-500 uppercase tracking-[0.3em] mb-6">Collective Impact</h2>
              <h3 className="text-4xl md:text-6xl font-bold mb-8 text-white tracking-tight leading-[1.1]">
                Leading the world towards a <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400">conscious future.</span>
              </h3>
              <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
                By automating your eco-commerce workflows, you aren&apos;t just saving time—you&apos;re accelerating the global transition to a circular economy.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative group"
            >
              <div className="absolute -inset-4 bg-emerald-500/5 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-all duration-700 blur-xl" />
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all duration-500">
                  <Recycle className="w-7 h-7 text-emerald-400" />
                </div>
                <h4 className="text-2xl font-bold text-white mb-4 italic">Circular Scale</h4>
                <p className="text-slate-400 leading-relaxed">Prioritize products that fit the circular economy. We help you transition from linear waste to infinite reuse at scale.</p>
                <div className="mt-8 flex items-center gap-2 text-[10px] font-mono text-emerald-500/50 uppercase tracking-widest">
                  <div className="w-1 h-1 rounded-full bg-emerald-500" /> Verified Metric
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative group"
            >
              <div className="absolute -inset-4 bg-blue-500/5 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-all duration-700 blur-xl" />
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-500">
                  <CloudRain className="w-7 h-7 text-blue-400" />
                </div>
                <h4 className="text-2xl font-bold text-white mb-4 italic">Carbon Logic</h4>
                <p className="text-slate-400 leading-relaxed">Our AI intelligence maps the carbon cost of every SKU, ensuring your proposals are as green as they are profitable.</p>
                <div className="mt-8 flex items-center gap-2 text-[10px] font-mono text-blue-500/50 uppercase tracking-widest">
                  <div className="w-1 h-1 rounded-full bg-blue-500" /> Offset Verified
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative group"
            >
              <div className="absolute -inset-4 bg-amber-500/5 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-all duration-700 blur-xl" />
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-amber-500/20 transition-all duration-500">
                  <HeartHandshake className="w-7 h-7 text-amber-400" />
                </div>
                <h4 className="text-2xl font-bold text-white mb-4 italic">Ethical IQ</h4>
                <p className="text-slate-400 leading-relaxed">Go beyond labels. We vet supply chains using decentralized data to ensure human rights are never a trade-off.</p>
                <div className="mt-8 flex items-center gap-2 text-[10px] font-mono text-amber-500/50 uppercase tracking-widest">
                  <div className="w-1 h-1 rounded-full bg-amber-500" /> Audit Ready
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FLOWCHART / PROCESS SECTION */}
      <section className="py-32 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">How Ecozy Works</h2>
            <p className="text-xl text-slate-400">A seamless flow from raw product to closed B2B deal.</p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-4 lg:gap-12">
            {/* Step 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex-1 w-full max-w-sm p-10 rounded-[2.5rem] border border-slate-800 bg-slate-900/40 backdrop-blur-xl relative group hover:border-emerald-500/50 hover:-translate-y-2 transition-all duration-700 ease-in-out shadow-2xl"
            >
              <div className="absolute -top-5 -left-5 w-14 h-14 rounded-2xl bg-[#060b14] border border-slate-700 flex items-center justify-center text-xl font-bold text-emerald-400 z-10 shadow-xl group-hover:scale-110 group-hover:border-emerald-500/50 transition-all duration-500">01</div>
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <Package className="w-24 h-24 text-emerald-400" />
              </div>
              <Package className="w-12 h-12 text-emerald-500 mb-8 group-hover:scale-110 transition-transform duration-500" />
              <h3 className="text-2xl font-bold mb-4 italic text-white">Upload Catalog</h3>
              <p className="text-slate-400 leading-relaxed text-sm">Input basic details like material and price. Our AI instantly categorizes it, identifies sustainability scores, and identifies key filters.</p>
              <div className="mt-8 flex items-center gap-2 text-[10px] font-mono text-emerald-500/40 uppercase tracking-widest">
                Automated Enrichment
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex-1 w-full max-w-sm p-10 rounded-[2.5rem] border border-slate-800 bg-slate-900/40 backdrop-blur-xl relative group hover:border-blue-500/50 hover:-translate-y-2 transition-all duration-700 ease-in-out shadow-2xl"
            >
              <div className="absolute -top-5 -left-5 w-14 h-14 rounded-2xl bg-[#060b14] border border-slate-700 flex items-center justify-center text-xl font-bold text-blue-400 z-10 shadow-xl group-hover:scale-110 group-hover:border-blue-500/50 transition-all duration-500">02</div>
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <FileText className="w-24 h-24 text-blue-400" />
              </div>
              <FileText className="w-12 h-12 text-blue-500 mb-8 group-hover:scale-110 transition-transform duration-500" />
              <h3 className="text-2xl font-bold mb-4 italic text-white">Define Parameters</h3>
              <p className="text-slate-400 leading-relaxed text-sm">Enter client budget and target impact goals. The AI scans your structured catalog to find the optimal mix of sustainable alternatives.</p>
              <div className="mt-8 flex items-center gap-2 text-[10px] font-mono text-blue-500/40 uppercase tracking-widest">
                Intelligent Matching
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex-1 w-full max-w-sm p-10 rounded-[2.5rem] border border-slate-800 bg-slate-900/40 backdrop-blur-xl relative group hover:border-amber-500/50 hover:-translate-y-2 transition-all duration-700 ease-in-out shadow-2xl"
            >
              <div className="absolute -top-5 -left-5 w-14 h-14 rounded-2xl bg-[#060b14] border border-slate-700 flex items-center justify-center text-xl font-bold text-amber-400 z-10 shadow-xl group-hover:scale-110 group-hover:border-amber-500/50 transition-all duration-500">03</div>
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <CheckCircle2 className="w-24 h-24 text-amber-400" />
              </div>
              <CheckCircle2 className="w-12 h-12 text-amber-500 mb-8 group-hover:scale-110 transition-transform duration-500" />
              <h3 className="text-2xl font-bold mb-4 italic text-white">Ship Proposal</h3>
              <p className="text-slate-400 leading-relaxed text-sm">Instantly receive a detailed B2B proposal with cost breakdown, budget allocation, and a compelling environmental impact summary.</p>
              <div className="mt-8 flex items-center gap-2 text-[10px] font-mono text-amber-500/40 uppercase tracking-widest">
                Closing Sequence
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* WHY COMBINE FEATURES (BENTO GRID) */}
      <section className="py-32 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-950/5 to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">The Synergy of Ecozy</h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">Why combining product categorization and proposal generation creates an unstoppable B2B sales engine.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
            {/* Bento Item 1 (Large) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="md:col-span-2 p-10 rounded-3xl border border-slate-800/60 bg-slate-900/40 backdrop-blur-xl overflow-hidden relative group shadow-xl"
            >
              <div className="absolute right-0 bottom-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full group-hover:bg-emerald-500/20 transition-colors duration-500" />
              <Zap className="w-10 h-10 text-emerald-400 mb-6" />
              <h3 className="text-3xl font-bold mb-4">Structured Data Meets Smart Sales</h3>
              <p className="text-lg text-slate-400 max-w-md leading-relaxed">
                By automatically categorizing products with rich sustainability filters (like &quot;compostable&quot; or &quot;plastic-free&quot;), our Proposal Generator can perfectly match client budgets with the most impactful eco-friendly alternatives.
              </p>
            </motion.div>

            {/* Bento Item 2 */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-8 rounded-3xl border border-slate-800/60 bg-slate-900/40 backdrop-blur-xl flex flex-col justify-between group hover:border-blue-500/50 hover:-translate-y-2 transition-all duration-500 ease-in-out shadow-xl"
            >
              <Globe className="w-10 h-10 text-blue-400 group-hover:scale-110 transition-transform duration-500" />
              <div>
                <h3 className="text-xl font-bold mb-2">Verified Impact</h3>
                <p className="text-slate-400">Every proposal includes an AI-generated impact summary, turning a simple quote into a compelling environmental mission.</p>
              </div>
            </motion.div>

            {/* Bento Item 3 */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-8 rounded-3xl border border-slate-800/60 bg-slate-900/40 backdrop-blur-xl flex flex-col justify-between group hover:border-amber-500/50 hover:-translate-y-2 transition-all duration-500 ease-in-out shadow-xl"
            >
              <Bot className="w-10 h-10 text-amber-400 group-hover:scale-110 transition-transform duration-500" />
              <div>
                <h3 className="text-xl font-bold mb-2">Zero Manual Entry</h3>
                <p className="text-slate-400">Never manually tag a product or calculate a proposal breakdown again. AI handles the tedious work.</p>
              </div>
            </motion.div>

            {/* Bento Item 4 (Large) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="md:col-span-2 p-10 rounded-3xl border border-emerald-900/50 bg-emerald-950/20 backdrop-blur-xl overflow-hidden relative group shadow-xl"
            >
              <div className="flex flex-col md:flex-row gap-8 items-center h-full">
                <div className="flex-1">
                  <h3 className="text-3xl font-bold mb-4 text-emerald-50">Scale Your Eco-Business</h3>
                  <p className="text-lg text-emerald-200/70 leading-relaxed">
                    The connection between catalog intelligence and proposal generation means you can respond to B2B inquiries 10x faster, winning more deals and replacing more single-use plastics with sustainable alternatives.
                  </p>
                </div>
                <div className="w-full md:w-1/3 flex justify-center">
                  <motion.div 
                    animate={{ rotate: 360 }} 
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="w-32 h-32 rounded-full border-4 border-emerald-500/30 border-t-emerald-400 flex items-center justify-center"
                  >
                    <Leaf className="w-12 h-12 text-emerald-400" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* API DOCUMENTATION SECTION */}
      <section id="api-docs" className="py-32 px-4 bg-[#0a0f1c] relative z-10 border-t border-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6">
              <Zap className="w-4 h-4" /> Developer API
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Integrate Ecozy anywhere.</h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">Connect your existing ERP, CRM, or custom storefront to our intelligence engine with our robust REST API.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                  <Globe className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Product Enrichment API</h3>
                  <p className="text-slate-400 leading-relaxed">Send raw product data and receive categorized, sustainability-scored items ready for your catalog.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Proposal Generation API</h3>
                  <p className="text-slate-400 leading-relaxed">Automate B2B sales by generating custom PDF proposals directly from your CRM workflows.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                  <Leaf className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Impact Metrics API</h3>
                  <p className="text-slate-400 leading-relaxed">Fetch real-time sustainability impact metrics to display on your public storefront or investor reports.</p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-blue-500/20 blur-3xl rounded-full" />
              <div className="relative bg-[#0f172a] border border-slate-700 rounded-2xl p-6 shadow-2xl font-mono text-sm overflow-hidden">
                <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-4">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="ml-2 text-slate-500">POST /api/v1/enrich</span>
                </div>
                <div className="text-emerald-400 mb-2">{"// Request"}</div>
                <div className="text-slate-300 mb-6">
                  <span className="text-pink-400">curl</span> -X POST https://api.ecozy.app/v1/enrich \<br/>
                  &nbsp;&nbsp;-H <span className="text-amber-300">&quot;Authorization: Bearer YOUR_API_KEY&quot;</span> \<br/>
                  &nbsp;&nbsp;-d <span className="text-amber-300">&apos;{'{'}&quot;name&quot;: &quot;Bamboo Toothbrush&quot;, &quot;material&quot;: &quot;Bamboo&quot;{'}'}&apos;</span>
                </div>
                <div className="text-blue-400 mb-2">{"// Response"}</div>
                <div className="text-slate-300">
                  {'{'}<br/>
                  &nbsp;&nbsp;<span className="text-blue-300">&quot;id&quot;</span>: <span className="text-amber-300">&quot;prod_8f92k&quot;</span>,<br/>
                  &nbsp;&nbsp;<span className="text-blue-300">&quot;category&quot;</span>: <span className="text-amber-300">&quot;Personal Care&quot;</span>,<br/>
                  &nbsp;&nbsp;<span className="text-blue-300">&quot;sustainabilityScore&quot;</span>: <span className="text-purple-400">92</span>,<br/>
                  &nbsp;&nbsp;<span className="text-blue-300">&quot;tags&quot;</span>: [<span className="text-amber-300">&quot;Biodegradable&quot;</span>, <span className="text-amber-300">&quot;Plastic-Free&quot;</span>]<br/>
                  {'}'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="py-32 px-4 bg-[#060b14] relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Simple, transparent pricing.</h2>
            <p className="text-slate-400 mb-16 max-w-2xl mx-auto">Choose the plan that fits your business needs. Scale your sustainable impact without scaling your costs.</p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left">
            {/* Starter */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -15, scale: 1.02 }}
              className="bg-slate-900/50 rounded-3xl p-8 text-slate-100 flex flex-col border border-slate-800/60 backdrop-blur-sm hover:border-emerald-500/50 hover:shadow-[0_20px_40px_rgba(16,185,129,0.1)] transition-all duration-500 ease-in-out"
            >
              <h3 className="text-xl font-bold mb-2">Seed</h3>
              <p className="text-slate-400 text-sm mb-6 h-10">Perfect for small businesses starting their green journey.</p>
              <div className="mb-8">
                <span className="text-5xl font-bold">$0</span>
                <span className="text-slate-500">/month</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-sm text-slate-300"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Up to 50 products</li>
                <li className="flex items-center gap-3 text-sm text-slate-300"><div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center"><CheckCircle2 className="w-3 h-3 text-emerald-400" /></div> Basic AI categorization</li>
                <li className="flex items-center gap-3 text-sm text-slate-300"><div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center"><CheckCircle2 className="w-3 h-3 text-emerald-400" /></div> 10 proposals/month</li>
                <li className="flex items-center gap-3 text-sm text-slate-300"><div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center"><CheckCircle2 className="w-3 h-3 text-emerald-400" /></div> Community support</li>
              </ul>
              <Link href="/dashboard">
                <Button variant="outline" className="w-full rounded-xl h-12 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">Get Started</Button>
              </Link>
            </motion.div>
            
            {/* Pro */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -20, scale: 1.05 }}
              className="bg-gradient-to-b from-emerald-900/40 to-slate-900/80 rounded-3xl p-8 text-white flex flex-col relative border border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.15)] transform md:-translate-y-4 transition-all duration-500 ease-in-out"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.5)]">Most Popular</div>
              <h3 className="text-xl font-bold mb-2">Growth</h3>
              <p className="text-emerald-100/70 text-sm mb-6 h-10">For growing brands that need deep, automated intelligence.</p>
              <div className="mb-8">
                <span className="text-5xl font-bold">$49</span>
                <span className="text-emerald-200/50">/month</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-sm text-slate-100"><div className="w-4 h-4 rounded-full bg-emerald-500/30 flex items-center justify-center"><CheckCircle2 className="w-3 h-3 text-emerald-400" /></div> Unlimited products</li>
                <li className="flex items-center gap-3 text-sm text-slate-100"><div className="w-4 h-4 rounded-full bg-emerald-500/30 flex items-center justify-center"><CheckCircle2 className="w-3 h-3 text-emerald-400" /></div> Advanced AI Enrichment</li>
                <li className="flex items-center gap-3 text-sm text-slate-100"><div className="w-4 h-4 rounded-full bg-emerald-500/30 flex items-center justify-center"><CheckCircle2 className="w-3 h-3 text-emerald-400" /></div> Unlimited proposals</li>
                <li className="flex items-center gap-3 text-sm text-slate-100"><div className="w-4 h-4 rounded-full bg-emerald-500/30 flex items-center justify-center"><CheckCircle2 className="w-3 h-3 text-emerald-400" /></div> Custom PDF branding</li>
                <li className="flex items-center gap-3 text-sm text-slate-100"><div className="w-4 h-4 rounded-full bg-emerald-500/30 flex items-center justify-center"><CheckCircle2 className="w-3 h-3 text-emerald-400" /></div> Priority support</li>
              </ul>
              <Link href="/dashboard">
                <Button className="w-full rounded-xl h-12 bg-emerald-600 hover:bg-emerald-500 text-white border-none shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all">Start 14-Day Trial</Button>
              </Link>
            </motion.div>
            
            {/* Enterprise */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -15, scale: 1.02 }}
              className="bg-slate-900/50 rounded-3xl p-8 text-slate-100 flex flex-col border border-slate-800/60 backdrop-blur-sm hover:border-emerald-500/50 hover:shadow-[0_20px_40px_rgba(16,185,129,0.1)] transition-all duration-500 ease-in-out"
            >
              <h3 className="text-xl font-bold mb-2">Forest</h3>
              <p className="text-slate-400 text-sm mb-6 h-10">For large enterprises needing custom integrations and scale.</p>
              <div className="mb-8">
                <span className="text-5xl font-bold tracking-tight">Custom</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-sm text-slate-300"><div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center"><CheckCircle2 className="w-3 h-3 text-emerald-400" /></div> Everything in Growth</li>
                <li className="flex items-center gap-3 text-sm text-slate-300"><div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center"><CheckCircle2 className="w-3 h-3 text-emerald-400" /></div> Full API Access</li>
                <li className="flex items-center gap-3 text-sm text-slate-300"><div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center"><CheckCircle2 className="w-3 h-3 text-emerald-400" /></div> Custom ERP/CRM integrations</li>
                <li className="flex items-center gap-3 text-sm text-slate-300"><div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center"><CheckCircle2 className="w-3 h-3 text-emerald-400" /></div> SSO / SAML</li>
                <li className="flex items-center gap-3 text-sm text-slate-300"><div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center"><CheckCircle2 className="w-3 h-3 text-emerald-400" /></div> Dedicated account manager</li>
              </ul>
              <Button 
                onClick={(e) => { e.preventDefault(); showToast("We will reach out to you soon, please book a demo."); }}
                variant="outline" 
                className="w-full rounded-xl h-12 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                Contact Sales
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 px-4 md:px-8 bg-[#060b14] relative z-10">
        <div className="max-w-7xl mx-auto bg-[#0a0a0a] rounded-[3rem] border border-slate-800/60 p-10 md:p-20 relative overflow-hidden shadow-2xl">
          {/* Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
          
          <div className="relative z-10 flex flex-col lg:flex-row justify-between gap-16 mb-20">
            <div className="max-w-xl">
              <h3 className="text-2xl text-slate-400 mb-2">Try Ecozy</h3>
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-10 tracking-tight">Schedule your demo today</h2>
              
              <div className="flex items-center bg-slate-900/50 border border-slate-800 rounded-full p-2 max-w-md backdrop-blur-sm transition-all duration-500 ease-in-out focus-within:border-emerald-500/50 focus-within:ring-1 focus-within:ring-emerald-500/50 focus-within:shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                <input 
                  ref={emailInputRef}
                  type="email" 
                  placeholder="Enter your work email" 
                  className="bg-transparent border-none focus:outline-none text-slate-200 px-4 w-full placeholder:text-slate-500"
                />
                <Button onClick={handleEmailSubmit} className="rounded-full bg-white text-black hover:bg-slate-200 px-8 py-6 text-base font-semibold transition-all duration-500 ease-in-out hover:scale-105">
                  Book a demo
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-10 lg:gap-16">
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-6">Company</h4>
                <ul className="space-y-4 flex flex-col items-start">
                  <li><Link href="#" className="text-slate-400 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">About Us</Link></li>
                  <li><button onClick={(e) => { e.preventDefault(); showToast("No recruitments active at the moment."); }} className="text-slate-400 hover:text-white transition-all duration-300 hover:translate-x-1 text-left">Careers</button></li>
                  <li><button onClick={handleStartupSubmit} className="text-slate-400 hover:text-white transition-all duration-300 hover:translate-x-1 text-left">Submit your startup</button></li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-6">Resources</h4>
                <ul className="space-y-4 flex flex-col items-start">
                  <li><Link href="#pricing" className="text-slate-400 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">Pricing</Link></li>
                  <li><Link href="#api-docs" className="text-slate-400 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">API documentation</Link></li>
                  <li><button onClick={(e) => { e.preventDefault(); showToast("Please use Lumi for support."); }} className="text-slate-400 hover:text-white transition-all duration-300 hover:translate-x-1 text-left">Support</button></li>
                </ul>
              </div>
              <div className="col-span-2 md:col-span-1">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-6">Case Studies</h4>
                <ul className="space-y-4 flex flex-col items-start">
                  <li><button onClick={(e) => { e.preventDefault(); showToast("Coming soon!"); }} className="text-slate-400 hover:text-white transition-all duration-300 hover:translate-x-1 flex items-center gap-2 text-left">EcoCorp <span className="text-slate-600 text-xs">× SA</span></button></li>
                  <li><button onClick={(e) => { e.preventDefault(); showToast("Coming soon!"); }} className="text-slate-400 hover:text-white transition-all duration-300 hover:translate-x-1 flex items-center gap-2 text-left">GreenTech <span className="text-slate-600 text-xs">× SA</span></button></li>
                  <li><button onClick={(e) => { e.preventDefault(); showToast("Coming soon!"); }} className="text-slate-400 hover:text-white transition-all duration-300 hover:translate-x-1 flex items-center gap-2 text-left">EarthFirst <span className="text-slate-600 text-xs">× SA</span></button></li>
                  <li><button onClick={(e) => { e.preventDefault(); showToast("Coming soon!"); }} className="text-slate-400 hover:text-white transition-all duration-300 hover:translate-x-1 flex items-center gap-2 mt-6 text-left">View all <ArrowRight className="w-4 h-4" /></button></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center pt-8 border-t border-slate-800/60 text-sm text-slate-500">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Leaf className="w-5 h-5 text-emerald-500" />
              <span className="font-bold text-white text-lg">Ecozy</span>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 w-full md:w-auto">
              <div className="flex gap-4 w-full md:w-auto justify-center md:justify-start mb-4 md:mb-0">
                <div className="flex items-center gap-2 border border-slate-800 rounded-full px-4 py-2 bg-slate-900/30">
                  <div className="w-4 h-4 rounded-full border border-slate-500 flex items-center justify-center"><div className="w-2 h-2 bg-slate-500 rounded-full" /></div>
                  <span className="text-xs">SOC 2 Type II Compliant</span>
                </div>
                <div className="flex items-center gap-2 border border-slate-800 rounded-full px-4 py-2 bg-slate-900/30">
                  <div className="w-4 h-4 rounded-full border border-slate-500 flex items-center justify-center"><div className="w-2 h-2 bg-slate-500 rounded-full" /></div>
                  <span className="text-xs">GDPR Ready</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center pt-8 mt-8 border-t border-slate-800/60 text-sm text-slate-500">
            <p>All rights reserved © {new Date().getFullYear()} Ecozy</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* CHATBOT */}
      <Chatbot />
    </div>
  );
}
