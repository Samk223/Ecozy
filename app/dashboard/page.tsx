'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Package, 
  FileText, 
  Globe, 
  Leaf, 
  Search, 
  Bell, 
  LayoutDashboard, 
  Settings, 
  HelpCircle,
  TrendingUp,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Plus,
  History,
  TreePine,
  Sprout,
  Trees,
  User,
  X,
  Eye,
  Trash2,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore, Product, Proposal } from '@/lib/db';
import Link from 'next/link';
import { ProposalDetailsModal } from '@/components/ProposalDetailsModal';
import { useToast } from '@/components/ToastProvider';
import { Button } from '@/components/ui/button';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';

const SustainabilityMeter = ({ score }: { score: number }) => {
  const bubbles = [
    { id: 0, duration: 2.5, delay: 0.2, left: '25%' },
    { id: 1, duration: 3.1, delay: 0.8, left: '45%' },
    { id: 2, duration: 2.8, delay: 1.5, left: '65%' },
    { id: 3, duration: 3.5, delay: 0.5, left: '35%' },
    { id: 4, duration: 2.2, delay: 1.2, left: '75%' },
  ];

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-6 bg-slate-900/40 border border-slate-800/60 rounded-3xl backdrop-blur-xl shadow-xl h-full group">
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest group-hover:text-emerald-400 transition-colors">Eco-Pulse</h3>
      <div className="relative h-56 w-16 bg-slate-950/80 rounded-full border-2 border-slate-800/60 overflow-hidden shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
        {/* Glowing Background */}
        <div className="absolute inset-0 bg-emerald-500/5 animate-pulse" />
        
        {/* The "Radio" Bar */}
        <motion.div 
          initial={{ height: 0 }}
          animate={{ height: `${Math.min(score, 100)}%` }}
          transition={{ type: "spring", stiffness: 40, damping: 12 }}
          className="absolute bottom-0 w-full bg-gradient-to-t from-emerald-600 via-emerald-400 to-emerald-300"
        >
          {/* Bubbles animation */}
          <div className="absolute inset-0 overflow-hidden">
            {bubbles.map((b) => (
              <motion.div
                key={b.id}
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: -20, opacity: [0, 0.5, 0] }}
                transition={{ 
                  duration: b.duration, 
                  repeat: Infinity, 
                  delay: b.delay 
                }}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{ left: b.left }}
              />
            ))}
          </div>
        </motion.div>

        {/* The "Knob" / Indicator */}
        <motion.div 
          animate={{ bottom: `${Math.min(score, 100)}%` }}
          transition={{ type: "spring", stiffness: 40, damping: 12 }}
          className="absolute left-0 right-0 h-1 bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] z-20 -translate-y-1/2"
        />

        {/* Scale Marks */}
        <div className="absolute inset-0 flex flex-col justify-between py-6 pointer-events-none px-2">
          {[100, 80, 60, 40, 20, 0].map((val) => (
            <div key={val} className="flex items-center gap-1">
              <div className="h-0.5 w-2 bg-slate-700/50" />
              <span className="text-[8px] text-slate-600 font-bold">{val}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col items-center">
        <div className="text-3xl font-black text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">{score}%</div>
        <div className="text-[10px] text-slate-500 font-bold uppercase">Sustainability</div>
      </div>
    </div>
  );
};

const GrowthAnimation = ({ score }: { score: number }) => {
  const stages = [
    { threshold: 0, icon: Sprout, label: "Seedling", color: "text-emerald-300", bg: "bg-emerald-500/10" },
    { threshold: 25, icon: TreePine, label: "Sapling", color: "text-emerald-400", bg: "bg-emerald-500/20" },
    { threshold: 50, icon: Trees, label: "Forest", color: "text-emerald-500", bg: "bg-emerald-500/30" },
    { threshold: 75, icon: Globe, label: "Gaia", color: "text-emerald-600", bg: "bg-emerald-500/40" }
  ];

  const currentStageIndex = stages.reduce((acc, stage, idx) => score >= stage.threshold ? idx : acc, 0);
  const stage = stages[currentStageIndex];
  const Icon = stage.icon;

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-900/40 border border-slate-800/60 rounded-3xl backdrop-blur-xl shadow-xl h-full relative overflow-hidden group">
      {/* Background Decoration */}
      <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors" />
      
      <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full shadow-lg">
        <User className="h-3 w-3 text-emerald-400" />
        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-tighter">Guardian of Earth</span>
      </div>
      
      <div className="relative mb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={stage.label}
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 1.5, opacity: 0, y: -20 }}
            transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
            className="relative"
          >
            <div className={`absolute inset-0 ${stage.bg} blur-3xl rounded-full animate-pulse`} />
            <Icon className={`h-28 w-28 ${stage.color} relative z-10 drop-shadow-[0_0_20px_rgba(16,185,129,0.4)]`} />
            
            {/* Appreciation Symbol */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute -top-2 -right-2 bg-amber-400 text-slate-900 p-1.5 rounded-full shadow-lg border-2 border-slate-900"
            >
              <TrendingUp className="h-4 w-4" />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="text-center space-y-2 relative z-10">
        <div className="text-xs font-bold text-emerald-500 uppercase tracking-[0.2em]">Stage {currentStageIndex + 1}</div>
        <h4 className="text-2xl font-black text-slate-100 tracking-tight">{stage.label}</h4>
        <p className="text-sm text-slate-400 max-w-[180px] leading-relaxed">
          You&apos;ve nurtured this world into a <span className="text-emerald-400 font-bold">{stage.label.toLowerCase()}</span>.
        </p>
      </div>

      <motion.div 
        whileHover={{ scale: 1.05 }}
        className="mt-8 flex items-center gap-3 px-5 py-2.5 bg-slate-800/40 rounded-2xl border border-slate-700/50 backdrop-blur-md"
      >
        <div className="p-1.5 bg-emerald-500/20 rounded-lg">
          <Leaf className="h-4 w-4 text-emerald-400" />
        </div>
        <span className="text-xs font-bold text-slate-200">Eco-Hero Token</span>
      </motion.div>
    </div>
  );
};

const StatCard = ({ title, value, change, icon: Icon, color }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-slate-900/40 border border-slate-800/60 p-6 rounded-2xl backdrop-blur-xl shadow-xl hover:border-emerald-500/30 transition-all duration-500"
  >
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl bg-${color}-500/10 border border-${color}-500/20`}>
        <Icon className={`h-6 w-6 text-${color}-400`} />
      </div>
      <div className={`flex items-center text-xs font-medium ${change.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
        {change}
        {change.startsWith('+') ? <ArrowUpRight className="h-3 w-3 ml-1" /> : <ArrowDownRight className="h-3 w-3 ml-1" />}
      </div>
    </div>
    <h3 className="text-slate-400 text-sm font-medium mb-1">{title}</h3>
    <p className="text-2xl font-bold text-slate-100">{value}</p>
  </motion.div>
);

const ProductDetailsModal = ({ product, onClose }: { product: Product; onClose: () => void }) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden"
      >
        <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <Package className="h-6 w-6 text-emerald-400" />
             </div>
             <div>
                <h2 className="text-2xl font-bold text-slate-100">{product.name}</h2>
                <p className="text-slate-400 text-sm">{product.category}</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-800 text-slate-400 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div 
          data-lenis-prevent="true" 
          onWheel={(e) => e.stopPropagation()}
          className="p-8 max-h-[60vh] overflow-y-auto space-y-6"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-800/30 border border-slate-800/50">
              <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Price</div>
              <div className="text-xl font-bold text-slate-100">${product.price.toLocaleString()}</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-800/30 border border-slate-800/50">
              <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Weight</div>
              <div className="text-xl font-bold text-slate-100">{product.weight} kg</div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Description</h3>
            <p className="text-slate-300 leading-relaxed">{product.description}</p>
          </div>

          <div className="flex items-center gap-2 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
            <Leaf className="h-5 w-5 text-emerald-400" />
            <span className="text-sm text-emerald-400 font-medium">Sustainable & Eco-friendly product</span>
          </div>
        </div>

        <div className="p-6 bg-slate-950/50 border-t border-slate-800 flex justify-end gap-4">
          <Button variant="outline" onClick={onClose} className="border-slate-800 text-slate-300">Close</Button>
          <Button className="bg-emerald-600 hover:bg-emerald-500 text-white">Edit Product</Button>
        </div>
      </motion.div>
    </div>
  );
};

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'proposals' | 'impact'>('overview');
  const { products, proposals: rawProposals, db } = useStore();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { success, error: toastError } = useToast();

  const proposals = useMemo(() => {
    return [...rawProposals].sort((a, b) => new Date(b.createdAt?.toMillis?.() || b.createdAt || 0).getTime() - new Date(a.createdAt?.toMillis?.() || a.createdAt || 0).getTime());
  }, [rawProposals]);

  const handleDeleteProposal = async (id: string, name: string) => {
    console.log("Attempting to delete proposal:", id, name);
    try {
      await db.proposals.delete(id);
      success(`Proposal for ${name} deleted successfully`);
    } catch (err) {
      console.error("Delete Proposal Error:", err);
      toastError("Failed to delete proposal. Check console for details.");
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    console.log("Attempting to delete product:", id, name);
    try {
      await db.products.delete(id);
      success(`Product "${name}" deleted successfully`);
    } catch (err) {
      console.error("Delete Product Error:", err);
      toastError("Failed to delete product. Check console for details.");
    }
  };

  // Derived sidebar state
  const isExpanded = !isSidebarCollapsed || isSidebarHovered;

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;
    const q = searchQuery.toLowerCase();
    return products.filter(p => 
      p.name?.toLowerCase().includes(q) || 
      p.description?.toLowerCase().includes(q) || 
      p.category?.toLowerCase().includes(q)
    );
  }, [products, searchQuery]);

  const filteredProposals = useMemo(() => {
    if (!searchQuery) return proposals;
    const q = searchQuery.toLowerCase();
    return proposals.filter(p => 
      p.clientName?.toLowerCase().includes(q) || 
      p.recommendedProducts?.some(rp => rp.product?.toLowerCase().includes(q))
    );
  }, [proposals, searchQuery]);

  const notifications = useMemo(() => {
    const pNotifications = products.map(p => {
      const dateVal = p.createdAt?.toMillis?.() || Date.parse(p.createdAt) || 0;
      return {
        id: `prod-${p.id}`,
        title: 'New Product Added',
        description: p.name,
        time: new Date(dateVal).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date(dateVal),
        icon: Package,
        color: 'purple'
      };
    });

    const propNotifications = proposals.map(p => {
      const dateVal = p.createdAt?.toMillis?.() || Date.parse(p.createdAt) || 0;
      return {
        id: `prop-${p.id}`,
        title: 'New Proposal Generated',
        description: `For ${p.clientName}`,
        time: new Date(dateVal).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date(dateVal),
        icon: FileText,
        color: 'blue'
      };
    });

    return [...pNotifications, ...propNotifications]
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 5);
  }, [products, proposals]);

  const totalImpact = useMemo(() => {
    // Zero base values - impact is purely derived from user data
    const baseCO2 = 0;
    const basePlastic = 0;
    const proposalCount = proposals.length;
    
    return {
      co2: (baseCO2 + (proposalCount * 0.8)).toFixed(1),
      plastic: basePlastic + (proposalCount * 25)
    };
  }, [proposals]);

  const sustainabilityScore = useMemo(() => {
    const productWeight = 2;
    const proposalWeight = 5;
    const score = (products.length * productWeight) + (proposals.length * proposalWeight);
    return Math.min(score, 100);
  }, [products, proposals]);

  const dailyGrowthData = useMemo(() => {
    const dataMap: { [key: string]: { score: number, date: Date } } = {};
    
    products.forEach(p => {
      const dateVal = p.createdAt?.toMillis?.() || (typeof p.createdAt === 'string' ? Date.parse(p.createdAt) : 0) || 0;
      if (!dateVal) return;
      const d = new Date(dateVal);
      const dateKey = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
      if (!dataMap[dateKey]) dataMap[dateKey] = { score: 0, date: d };
      dataMap[dateKey].score += 2;
    });

    proposals.forEach(p => {
      const dateVal = p.createdAt?.toMillis?.() || (typeof p.createdAt === 'string' ? Date.parse(p.createdAt) : 0) || 0;
      if (!dateVal) return;
      const d = new Date(dateVal);
      const dateKey = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
      if (!dataMap[dateKey]) dataMap[dateKey] = { score: 0, date: d };
      dataMap[dateKey].score += 5;
    });

    const sortedDays = Object.values(dataMap).sort((a, b) => a.date.getTime() - b.date.getTime());
    
    const finalData: any[] = [];
    let cumulativeSum = 0;
    sortedDays.forEach((day, i) => {
      cumulativeSum += day.score;
      const percentage = Math.min(cumulativeSum * 5, 100); 
      finalData.push({
        label: `Day ${i + 1}`,
        height: percentage,
        percentage: percentage
      });
    });

    // If no data, show a placeholder day with 0
    if (finalData.length === 0) {
      return [{ label: 'Day 1', height: 0, percentage: 0 }];
    }

    return finalData;
  }, [products, proposals]);

  const chartData = useMemo(() => [
    { name: 'Products', value: products.length, color: '#10b981' },
    { name: 'Proposals', value: proposals.length, color: '#3b82f6' },
  ], [products, proposals]);

  const handleSearchEnter = () => {
    if (!searchQuery) return;
    
    // Prioritize exact matches or first results
    if (filteredProducts.length > 0) {
      setSelectedProduct(filteredProducts[0]);
    } else if (filteredProposals.length > 0) {
      setSelectedProposal(filteredProposals[0]);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#060b14] pt-24">
      {/* Modals */}
      <AnimatePresence>
        {selectedProposal && (
          <ProposalDetailsModal 
            proposal={selectedProposal} 
            onClose={() => setSelectedProposal(null)} 
          />
        )}
        {selectedProduct && (
          <ProductDetailsModal 
            product={selectedProduct} 
            onClose={() => setSelectedProduct(null)} 
          />
        )}
      </AnimatePresence>
      {/* Sidebar */}
      <aside 
        onMouseEnter={() => setIsSidebarHovered(true)}
        onMouseLeave={() => setIsSidebarHovered(false)}
        className={`fixed left-6 top-28 bottom-8 z-40 bg-slate-900/40 border border-slate-800/60 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl transition-all duration-500 ease-in-out transform ${isExpanded ? 'w-56' : 'w-20'}`}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex justify-end mb-6">
            <button 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-2 rounded-xl bg-slate-800/50 text-slate-400 hover:text-emerald-400 transition-colors"
            >
              <motion.div
                animate={{ rotate: isSidebarCollapsed ? 180 : 0 }}
              >
                <ArrowDownRight className="h-4 w-4 rotate-45" />
              </motion.div>
            </button>
          </div>
          
          <nav className="space-y-3 flex-1">
            {[
              { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
              { id: 'products', icon: Package, label: 'Products' },
              { id: 'proposals', icon: FileText, label: 'Proposals' },
              { id: 'impact', icon: Globe, label: 'Impact' },
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center px-4 py-4 rounded-2xl transition-all duration-300 group ${activeTab === item.id ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'}`}
              >
                <item.icon className={`h-5 w-5 flex-shrink-0 ${isExpanded ? 'mr-3' : 'mx-auto'}`} />
                {isExpanded && (
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="font-bold tracking-tight whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
                {!isExpanded && (
                  <div className="absolute left-24 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                    {item.label}
                  </div>
                )}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-500 ${isSidebarCollapsed ? 'ml-32' : 'ml-72'} p-6 lg:p-10`}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-100 mb-2">Ecozy Dashboard</h1>
              <p className="text-slate-400">Welcome back. Your sustainable catalog is growing.</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Search catalog..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearchEnter();
                    }
                  }}
                  className="bg-slate-900/50 border border-slate-800/60 rounded-full py-2 pl-10 pr-4 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 w-64"
                />
              </div>
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-full bg-slate-900/50 border border-slate-800/60 text-slate-400 hover:text-emerald-400 transition-colors relative"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border-2 border-[#060b14]"></span>
                </button>

                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-4 w-80 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl"
                    >
                      <div className="p-4 border-bottom border-slate-800 flex justify-between items-center">
                        <h3 className="font-bold text-slate-100">Recent Activity</h3>
                        <span className="text-[10px] font-bold text-emerald-400 uppercase">Live</span>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map((n) => (
                          <div key={n.id} className="p-4 hover:bg-slate-800/50 transition-colors border-t border-slate-800/50 flex items-start gap-4">
                            <div className={`p-2 rounded-xl bg-${n.color}-500/10 border border-${n.color}-500/20`}>
                              <n.icon className={`h-4 w-4 text-${n.color}-400`} />
                            </div>
                            <div>
                            <div className="text-sm font-semibold text-slate-200">{n.title}</div>
                            <div className="text-[10px] text-slate-400">{n.description}</div>
                            <div className="text-[10px] text-slate-500 mt-1">{n.time}</div>
                          </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-3 bg-slate-950/50 text-center">
                        <button className="text-xs font-bold text-slate-500 hover:text-slate-300 transition-colors">Mark all as read</button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                  <StatCard 
                    title="Total Products" 
                    value={products.length} 
                    change={`+${products.length > 0 ? (products.length * 1.5).toFixed(1) : '0'}%`} 
                    icon={Package} 
                    color="emerald" 
                  />
                  <StatCard 
                    title="Active Proposals" 
                    value={proposals.length} 
                    change={`+${proposals.length > 0 ? (proposals.length * 2.1).toFixed(1) : '0'}%`} 
                    icon={FileText} 
                    color="blue" 
                  />
                  <StatCard 
                    title="CO2 Offset" 
                    value={`${totalImpact.co2} Tons`} 
                    change={`+${totalImpact.co2 !== "0.0" ? (parseFloat(totalImpact.co2) * 1.2).toFixed(1) : '0'}%`} 
                    icon={Leaf} 
                    color="emerald" 
                  />
                  <StatCard 
                    title="Plastic Diverted" 
                    value={`${totalImpact.plastic} kg`} 
                    change={`+${totalImpact.plastic > 0 ? (totalImpact.plastic * 0.05).toFixed(1) : '0'}%`} 
                    icon={Zap} 
                    color="amber" 
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10">
                  <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800/60 p-8 rounded-3xl backdrop-blur-xl shadow-xl min-h-[350px]">
                    <h3 className="text-lg font-bold text-slate-100 mb-6">Activity Distribution</h3>
                    <div className="h-[250px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                          <XAxis 
                            dataKey="name" 
                            stroke="#64748b" 
                            fontSize={12} 
                            tickLine={false} 
                            axisLine={false} 
                          />
                          <YAxis 
                            stroke="#64748b" 
                            fontSize={12} 
                            tickLine={false} 
                            axisLine={false} 
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#0f172a', 
                              border: '1px solid #1e293b',
                              borderRadius: '12px',
                              color: '#f1f5f9'
                            }}
                            itemStyle={{ color: '#f1f5f9' }}
                            cursor={{ fill: '#1e293b', opacity: 0.4 }}
                          />
                          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="lg:col-span-1">
                    <SustainabilityMeter score={sustainabilityScore} />
                  </div>
                  <div className="lg:col-span-1">
                    <GrowthAnimation score={sustainabilityScore} />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800/60 p-8 rounded-3xl backdrop-blur-xl shadow-xl">
                    <div className="flex justify-between items-center mb-8">
                      <h3 className="text-xl font-bold text-slate-100">Recent Proposals</h3>
                      <Link href="/proposal-generator">
                        <Button variant="ghost" size="sm" className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10">
                          View All <ArrowUpRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                    <div className="space-y-4">
                      {filteredProposals.slice(0, 3).map((proposal, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-800/30 border border-slate-800/50 hover:border-emerald-500/30 transition-all">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                              <FileText className="h-5 w-5 text-blue-400" />
                            </div>
                            <div>
                              <div className="font-semibold text-slate-200">{proposal.clientName}</div>
                                <div className="text-xs text-slate-500">{new Date(proposal.createdAt?.toMillis?.() || Date.parse(proposal.createdAt) || 0).toLocaleDateString()}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="font-bold text-emerald-400">${proposal.totalCost.toLocaleString()}</div>
                              <div className="text-xs text-slate-500">Approved</div>
                            </div>
                            <button 
                              onClick={() => setSelectedProposal(proposal)}
                              className="p-2 rounded-xl bg-slate-800/50 text-slate-400 hover:text-emerald-400 transition-colors"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); if(proposal.id) db.proposals.delete(proposal.id); }}
                              className="p-2 rounded-xl bg-slate-800/50 text-slate-400 hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                      {filteredProposals.length === 0 && (
                        <div className="text-center py-10 text-slate-500">
                          {searchQuery ? 'No matching proposals found.' : 'No proposals generated yet.'}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-slate-900/40 border border-slate-800/60 p-8 rounded-3xl backdrop-blur-xl shadow-xl">
                    <h3 className="text-xl font-bold text-slate-100 mb-8">Quick Actions</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <Link href="/products/add">
                        <button className="w-full flex items-center gap-4 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all group">
                          <Plus className="h-5 w-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                          <span className="text-sm font-semibold text-emerald-100">Add New Product</span>
                        </button>
                      </Link>
                      <Link href="/proposal-generator">
                        <button className="w-full flex items-center gap-4 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-all group">
                          <Zap className="h-5 w-5 text-blue-400 group-hover:scale-110 transition-transform" />
                          <span className="text-sm font-semibold text-blue-100">Generate Proposal</span>
                        </button>
                      </Link>
                      <button className="w-full flex items-center gap-4 p-4 rounded-2xl bg-slate-800/50 border border-slate-700 hover:bg-slate-800 transition-all group">
                        <History className="h-5 w-5 text-slate-400 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-semibold text-slate-300">View Audit Logs</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'products' && (
              <motion.div
                key="products"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-slate-900/40 border border-slate-800/60 p-8 rounded-3xl backdrop-blur-xl shadow-xl"
              >
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold text-slate-100">Catalog Overview</h2>
                  <Link href="/products/add">
                    <Button className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-full">
                      + Add Product
                    </Button>
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.slice(0, 6).map((product, i) => (
                    <div 
                      key={i} 
                      onClick={() => setSelectedProduct(product)}
                      className="p-5 rounded-2xl border border-slate-800/60 bg-slate-800/30 hover:border-emerald-500/40 transition-all group cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="text-xs px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">{product.category}</div>
                        <div className="flex items-center gap-3">
                          <div className="font-bold text-slate-100">${product.price}</div>
                          <button onClick={(e) => { e.stopPropagation(); if(product.id) handleDeleteProduct(product.id, product.name); }} className="p-1 text-slate-500 hover:text-red-400 transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <h4 className="font-bold text-slate-200 mb-2 group-hover:text-emerald-400 transition-colors">{product.name}</h4>
                      <p className="text-sm text-slate-400 line-clamp-2 mb-4">{product.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {product.sustainabilityFilters.slice(0, 2).map((f, j) => (
                          <span key={j} className="text-[10px] px-2 py-0.5 bg-slate-900/50 text-slate-500 rounded-md border border-slate-800">{f}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                  {filteredProducts.length === 0 && (
                    <div className="col-span-full py-20 text-center">
                      <div className="relative mb-8 inline-block">
                        <div className="absolute inset-0 bg-emerald-500/10 blur-xl rounded-full scale-110" />
                        <div className="relative w-24 h-24 rounded-full border-2 border-slate-800 bg-slate-900 flex items-center justify-center shadow-lg mx-auto">
                          <Package className="h-10 w-10 text-emerald-500" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-slate-100 mb-2">
                        {searchQuery ? `No products matching "${searchQuery}"` : 'Your catalog is empty'}
                      </h3>
                      <p className="text-slate-400 mb-8 max-w-sm mx-auto">
                        {searchQuery ? 'Try adjusting your search terms.' : 'Add your first sustainable product to start building your eco-friendly catalog and tracking your impact.'}
                      </p>
                      {!searchQuery && (
                        <Link href="/products/add">
                           <Button className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-full px-8 transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)]">
                              <Plus className="w-5 h-5 mr-2" />
                              Add Your First Product
                           </Button>
                        </Link>
                      )}
                    </div>
                  )}
                </div>
                {products.length > 6 && (
                  <div className="mt-8 text-center">
                    <Link href="/products">
                      <Button variant="outline" className="border-slate-800 text-slate-400 hover:text-white">View Full Catalog</Button>
                    </Link>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'proposals' && (
              <motion.div
                key="proposals"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-slate-900/40 border border-slate-800/60 p-8 rounded-3xl backdrop-blur-xl shadow-xl"
              >
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold text-slate-100">B2B Proposals</h2>
                  <Link href="/proposal-generator">
                    <Button className="bg-blue-600 hover:bg-blue-500 text-white rounded-full">
                      Generate New
                    </Button>
                  </Link>
                </div>
                <div className="space-y-4">
                  {filteredProposals.map((proposal, i) => (
                    <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-2xl bg-slate-800/30 border border-slate-800/50 hover:border-blue-500/30 transition-all gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                          <FileText className="h-6 w-6 text-blue-400" />
                        </div>
                        <div>
                          <div className="text-lg font-bold text-slate-100">{proposal.clientName}</div>
                          <div className="text-sm text-slate-500">{proposal.recommendedProducts.length} items • {new Date(proposal.createdAt?.toMillis?.() || Date.parse(proposal.createdAt) || 0).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Total Value</div>
                          <div className="text-xl font-bold text-emerald-400">${proposal.totalCost.toLocaleString()}</div>
                        </div>
                        <button 
                          onClick={() => setSelectedProposal(proposal)}
                          className="p-2 rounded-xl bg-slate-800/50 text-slate-400 hover:text-blue-400 transition-colors"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); if(proposal.id) handleDeleteProposal(proposal.id, proposal.clientName); }}
                          className="p-2 rounded-xl bg-slate-800/50 text-slate-400 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                        <div className="px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 text-xs font-bold">
                          APPROVED
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredProposals.length === 0 && (
                    <div className="py-20 text-center">
                      <div className="relative mb-8 inline-block">
                        <div className="absolute inset-0 bg-blue-500/10 blur-xl rounded-full scale-110" />
                        <div className="relative w-24 h-24 rounded-full border-2 border-slate-800 bg-slate-900 flex items-center justify-center shadow-lg mx-auto">
                          <FileText className="h-10 w-10 text-blue-500" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-slate-100 mb-2">
                        {searchQuery ? `No proposals matching "${searchQuery}"` : 'No proposals yet'}
                      </h3>
                      <p className="text-slate-400 mb-8 max-w-sm mx-auto">
                        {searchQuery ? 'Try adjusting your search terms.' : 'Generate your first B2B proposal to offer compelling eco-friendly packages to your clients.'}
                      </p>
                      {!searchQuery && (
                        <Link href="/proposal-generator">
                           <Button className="bg-blue-600 hover:bg-blue-500 text-white rounded-full px-8 transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_25px_rgba(37,99,235,0.4)]">
                              <Sparkles className="w-5 h-5 mr-2" />
                              Generate First Proposal
                           </Button>
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'impact' && (
              <motion.div
                key="impact"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-slate-900/40 border border-slate-800/60 p-8 rounded-3xl backdrop-blur-xl shadow-xl"
              >
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold text-slate-100">Impact Report</h2>
                  <div className="px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider">
                    {products.length === 0 && proposals.length === 0 ? 'Getting Started' : 'Live Metrics'}
                  </div>
                </div>
                
                {products.length === 0 && proposals.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center py-20 text-center max-w-2xl mx-auto"
                  >
                    <div className="relative mb-12">
                      <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full scale-150 animate-pulse" />
                      <div className="relative w-32 h-32 rounded-full border-4 border-slate-800 bg-slate-900/50 flex items-center justify-center shadow-2xl">
                         <Sparkles className="h-16 w-16 text-emerald-400 animate-bounce" />
                      </div>
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute -inset-4 border border-dashed border-emerald-500/30 rounded-full"
                      />
                    </div>
                    
                    <h3 className="text-3xl font-black text-slate-100 mb-4 tracking-tight">Your Journey Begins Here</h3>
                    <p className="text-lg text-slate-400 mb-12 leading-relaxed">
                      Your impact report is currently a blank canvas. Start populating your catalog and generating proposals to see your sustainability metrics come to life in real-time.
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                      <Link href="/products/add" className="contents">
                        <button className="flex flex-col items-center p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all group">
                          <Package className="h-8 w-8 text-emerald-400 mb-4 group-hover:scale-110 transition-transform" />
                          <span className="font-bold text-slate-100 mb-1">Add Your First Product</span>
                          <span className="text-xs text-slate-400">Initialize your sustainable catalog</span>
                        </button>
                      </Link>
                      <Link href="/proposal-generator" className="contents">
                        <button className="flex flex-col items-center p-6 rounded-3xl bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-all group">
                          <FileText className="h-8 w-8 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
                          <span className="font-bold text-slate-100 mb-1">Create Your First Proposal</span>
                          <span className="text-xs text-slate-400">Calculate your environmental impact</span>
                        </button>
                      </Link>
                    </div>
                  </motion.div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                      <div className="p-8 rounded-3xl bg-slate-800/30 border border-slate-800/50 flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6">
                          <Globe className="h-8 w-8 text-blue-400" />
                        </div>
                        <div className="text-4xl font-extrabold text-slate-100 mb-2">{totalImpact.co2} Tons</div>
                        <div className="text-slate-400 font-medium">Estimated CO2 Offset</div>
                      </div>
                      <div className="p-8 rounded-3xl bg-slate-800/30 border border-slate-800/50 flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
                          <Leaf className="h-8 w-8 text-emerald-400" />
                        </div>
                        <div className="text-4xl font-extrabold text-slate-100 mb-2">{totalImpact.plastic} kg</div>
                        <div className="text-slate-400 font-medium">Plastic Waste Diverted</div>
                      </div>
                    </div>

                    <div className="bg-slate-950/50 rounded-3xl p-8 border border-slate-800/60 shadow-inner">
                      <h3 className="text-lg font-bold text-slate-200 mb-8 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-emerald-400" />
                        Sustainability Growth
                      </h3>
                      <div className="h-64 flex items-end justify-between gap-4 px-4 pb-4">
                        {dailyGrowthData.map((d, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center gap-6 h-full justify-end">
                            <div className="w-full flex-1 flex flex-col justify-end">
                              <motion.div 
                                initial={{ height: 0 }}
                                animate={{ height: `${d.height}%` }}
                                transition={{ duration: 1.5, delay: i * 0.1, ease: "circOut" }}
                                className="w-full bg-gradient-to-t from-emerald-600/20 via-emerald-500/50 to-emerald-400 rounded-t-xl relative group shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                              >
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 text-[10px] font-bold text-emerald-400 bg-slate-900 border border-slate-800 px-2 py-1 rounded-md shadow-xl whitespace-nowrap">
                                   +{Math.round(d.percentage)}% Growth
                                </div>
                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-xl" />
                              </motion.div>
                            </div>
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{d.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

