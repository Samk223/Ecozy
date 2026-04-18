import React from 'react';
import { motion } from 'motion/react';
import { X, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Proposal } from '@/lib/db';
import { printProposalReport } from '@/lib/printReport';

export const ProposalDetailsModal = ({ proposal, onClose }: { proposal: Proposal; onClose: () => void }) => {
  if (!proposal) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        id="proposal-pdf-modal"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden"
      >
        <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <div>
            <h2 className="text-2xl font-bold text-slate-100">{proposal.clientName}</h2>
            <p className="text-slate-400 text-sm">Generated on {new Date(proposal.createdAt?.toMillis?.() || Date.parse(proposal.createdAt) || 0).toLocaleDateString()}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-800 text-slate-400 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div 
          data-lenis-prevent="true" 
          onWheel={(e) => e.stopPropagation()}
          className="p-8 max-h-[60vh] overflow-y-auto space-y-8"
        >
          <div className="grid grid-cols-2 gap-6">
            <div className="p-4 rounded-2xl bg-slate-800/30 border border-slate-800/50">
              <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Total Budget</div>
              <div className="text-xl font-bold text-slate-100">${proposal.budget.toLocaleString()}</div>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="text-xs text-emerald-500 uppercase tracking-wider mb-1">Total Cost</div>
              <div className="text-xl font-bold text-emerald-400">${proposal.totalCost.toLocaleString()}</div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-200 mb-4">Recommended Products</h3>
            <div className="space-y-3">
              {proposal.recommendedProducts.map((rp, idx) => (
                <div key={idx} className="flex justify-between items-center p-4 rounded-xl bg-slate-800/20 border border-slate-800/40">
                  <div>
                    <div className="font-semibold text-slate-200">{rp.product}</div>
                    <div className="text-xs text-slate-500">Quantity: {rp.quantity}</div>
                  </div>
                  <div className="font-bold text-slate-300">${rp.cost.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-200 mb-2">Impact Summary</h3>
            <p className="text-slate-400 leading-relaxed italic">&quot;{proposal.impactSummary}&quot;</p>
          </div>
        </div>

        <div className="p-6 bg-slate-950/50 border-t border-slate-800 flex justify-end gap-4">
          <Button variant="outline" onClick={onClose} className="border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">Close</Button>
          <Button onClick={() => printProposalReport(proposal)} className="bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]">
            <Printer className="mr-2 h-4 w-4" />
            Print / Save PDF
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
