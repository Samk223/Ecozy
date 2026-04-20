"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Loader2, FileText, Download, CheckCircle2, ArrowRight, History, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ProposalDetailsModal } from "@/components/ProposalDetailsModal";
import { generateB2BProposal, ProposalInput, ProposalResult } from "@/lib/proposalEngine";
import { printProposalReport } from "@/lib/printReport";
import { useStore, Product, Proposal } from "@/lib/db";
import { useToast } from "@/components/ToastProvider";

export default function ProposalGeneratorPage() {
  const { products: availableProducts, proposals: rawProposals, db } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'create' | 'history'>('create');
  
  const pastProposals = [...rawProposals].sort((a, b) => new Date(b.createdAt?.toMillis?.() || b.createdAt || 0).getTime() - new Date(a.createdAt?.toMillis?.() || a.createdAt || 0).getTime());

  const [formData, setFormData] = useState<ProposalInput>({
    clientName: "",
    budget: 0,
    categoryPreference: "",
  });
  const [aiResult, setAiResult] = useState<ProposalResult | null>(null);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);

  const { success, error: toastError } = useToast();

  const handleExportPDF = () => {
    if (!aiResult) return;
    printProposalReport({
      clientName: formData.clientName,
      budget: formData.budget,
      ...aiResult,
      createdAt: new Date()
    });
    success("PDF Report generated!");
  };

  const handleApproveProposal = async () => {
    if (!aiResult) return;
    setIsLoading(true);
    try {
      await db.proposals.add({
        clientName: formData.clientName,
        budget: formData.budget,
        ...aiResult,
      });
      success(`Proposal for ${formData.clientName} approved and saved!`);
      setViewMode('history');
      setAiResult(null);
      setFormData({
        clientName: "",
        budget: 0,
        categoryPreference: "",
      });
    } catch (error) {
      toastError("Failed to save proposal");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProposal = async (id: string, name: string) => {
    try {
      await db.proposals.delete(id);
      success(`Proposal for ${name} deleted`);
    } catch (err) {
      toastError("Failed to delete proposal");
    }
  };

  const handleDiscardProposal = () => {
    setAiResult(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "budget" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (availableProducts.length === 0) {
      alert("No products available in the catalog. Please add some products first.");
      return;
    }

    setIsLoading(true);
    setAiResult(null);
    success("AI is analyzing your catalog...");

    try {
      // 1. Call AI to generate proposal
      const { result, prompt, rawResponse } = await generateB2BProposal(formData, availableProducts);
      
      // 2. Save directly to Firestore using our secure hook
      await db.aiLogs.add({
        module: "proposal-generator",
        prompt,
        response: rawResponse,
      });

      // Show result for approval before saving
      setAiResult(result);
      success("Proposal generated successfully!");
    } catch (error: any) {
      console.error("Failed to generate proposal:", error);
      if (error?.message?.includes("exceeded") || error?.message?.includes("429")) {
        toastError("AI Quota Exceeded. Please try again in a few seconds or check your Gemini API plan.");
      } else {
        toastError("Failed to generate proposal. Please check your API key.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto pt-32 pb-10 px-4 md:px-8 max-w-6xl">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-50">AI B2B Proposal Generator</h1>
          <p className="text-slate-400">Generate smart purchase proposals for sustainable products based on client budget.</p>
        </div>
        <div className="flex bg-slate-900/50 p-1 rounded-full border border-slate-800">
          <button 
            onClick={() => setViewMode('create')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${viewMode === 'create' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <span className="flex items-center gap-2"><Plus className="w-4 h-4" /> Create New</span>
          </button>
          <button 
            onClick={() => setViewMode('history')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${viewMode === 'history' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <span className="flex items-center gap-2"><History className="w-4 h-4" /> Past Proposals</span>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === 'create' ? (
          <motion.div
            key="create-mode"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            <div className="lg:col-span-4">
              <Card className="sticky top-24 border-slate-800/60 bg-slate-900/40 backdrop-blur-xl shadow-xl">
                <CardHeader>
                  <CardTitle className="text-slate-100">Client Requirements</CardTitle>
                  <CardDescription className="text-slate-400">Enter the client&apos;s details and budget constraints.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="clientName" className="text-slate-300">Client Name</Label>
                      <Input id="clientName" name="clientName" required placeholder="e.g., EcoCorp Inc." value={formData.clientName} onChange={handleInputChange} disabled={isLoading} className="bg-slate-950 border-slate-800 text-slate-100 focus-visible:ring-emerald-500" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="budget" className="text-slate-300">Budget ($)</Label>
                      <Input id="budget" name="budget" type="number" step="100" min="100" required value={formData.budget || ""} onChange={handleInputChange} disabled={isLoading} className="bg-slate-950 border-slate-800 text-slate-100 focus-visible:ring-emerald-500" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="categoryPreference" className="text-slate-300">Category Preference (Optional)</Label>
                      <Input id="categoryPreference" name="categoryPreference" placeholder="e.g., Packaging, Office Supplies" value={formData.categoryPreference} onChange={handleInputChange} disabled={isLoading} className="bg-slate-950 border-slate-800 text-slate-100 focus-visible:ring-emerald-500" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white transition-all duration-300 hover:shadow-[0_0_15px_rgba(16,185,129,0.4)]" disabled={isLoading || availableProducts.length === 0}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating Proposal...
                        </>
                      ) : (
                        <>
                          <FileText className="mr-2 h-4 w-4" />
                          Generate Proposal
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </form>
                {availableProducts.length === 0 && (
                  <div className="px-6 pb-6 text-sm text-rose-400 text-center">
                    You need to add products to the catalog before generating a proposal.
                  </div>
                )}
              </Card>
            </div>

            <div className="lg:col-span-8">
              {isLoading ? (
                <Card className="h-full min-h-[500px] flex flex-col items-center justify-center border-dashed border-slate-800 bg-slate-900/20 backdrop-blur-sm">
                  <Loader2 className="h-10 w-10 animate-spin text-emerald-500 mb-4" />
                  <h3 className="text-lg font-medium text-slate-200">Analyzing Catalog & Budget...</h3>
                  <p className="text-sm text-slate-400 max-w-xs text-center mt-2">
                    Our AI is selecting the optimal mix of sustainable products to maximize impact within the client&apos;s budget.
                  </p>
                </Card>
              ) : aiResult ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card id="proposal-pdf-container" className="overflow-hidden border-emerald-900/50 shadow-[0_0_40px_-10px_rgba(16,185,129,0.2)] bg-slate-900/60 backdrop-blur-xl">
                    <div className="bg-emerald-950/40 px-6 py-8 border-b border-emerald-900/50 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />
                      <div className="flex flex-col md:flex-row justify-between items-start mb-6 relative z-10">
                        <div className="mb-4 md:mb-0">
                          <h2 className="text-2xl font-bold text-emerald-50">Sustainable Commerce Proposal</h2>
                          <p className="text-emerald-400/80 mt-1">Prepared for <span className="text-emerald-300 font-semibold">{formData.clientName}</span></p>
                        </div>
                        <div className="text-left md:text-right">
                          <div className="text-sm text-emerald-500 uppercase tracking-wider font-semibold">Total Investment</div>
                          <div className="text-3xl font-extrabold text-emerald-400">${aiResult.totalCost.toLocaleString()}</div>
                          <div className="text-xs text-emerald-500/80 mt-1">Budget Remaining: ${aiResult.budgetRemaining.toLocaleString()}</div>
                        </div>
                      </div>
                      
                      <div className="bg-slate-950/50 rounded-xl p-5 backdrop-blur-sm border border-emerald-900/50 relative z-10">
                        <h4 className="text-sm font-semibold text-emerald-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" /> Impact Summary
                        </h4>
                        <p className="text-emerald-100/90 leading-relaxed text-sm">{aiResult.impactSummary}</p>
                      </div>
                    </div>
                    
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                          <thead className="text-xs text-slate-400 uppercase bg-slate-950/50 border-b border-slate-800/60">
                            <tr>
                              <th className="px-6 py-4 font-medium">Recommended Product</th>
                              <th className="px-6 py-4 font-medium text-right">Quantity</th>
                              <th className="px-6 py-4 font-medium text-right">Total Cost</th>
                            </tr>
                          </thead>
                          <tbody>
                            {aiResult.recommendedProducts.map((item, index) => (
                              <tr key={index} className="border-b border-slate-800/60 last:border-0 hover:bg-slate-800/30 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-200">{item.product}</td>
                                <td className="px-6 py-4 text-right text-slate-300">{item.quantity.toLocaleString()}</td>
                                <td className="px-6 py-4 text-right font-medium text-emerald-400">${item.cost.toLocaleString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-slate-950/30 p-6 flex flex-wrap justify-end gap-4 border-t border-slate-800/60">
                      <Button variant="ghost" onClick={handleDiscardProposal} className="border-slate-800 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors">
                        Discard
                      </Button>
                      <Button variant="outline" onClick={handleExportPDF} className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                        <Download className="mr-2 h-4 w-4" />
                        Export PDF
                      </Button>
                      <Button onClick={handleApproveProposal} disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Approve & Save
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ) : (
                <Card className="h-full min-h-[500px] flex flex-col items-center justify-center border-dashed border-slate-800/60 bg-slate-900/20 text-center px-6 backdrop-blur-sm">
                  <div className="h-20 w-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                    <FileText className="h-10 w-10 text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-slate-100">Ready to Generate</h3>
                  <p className="text-slate-400 max-w-md leading-relaxed">
                    Enter the client&apos;s details and budget on the left to generate a customized, AI-powered sustainable product proposal.
                  </p>
                </Card>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="history-mode"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {pastProposals.length === 0 ? (
              <Card className="min-h-[400px] flex flex-col items-center justify-center border-dashed border-slate-800/60 bg-slate-900/20 text-center px-6 backdrop-blur-sm">
                <div className="h-16 w-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
                  <History className="h-8 w-8 text-slate-500" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-slate-200">No Past Proposals</h3>
                <p className="text-slate-400 max-w-sm">
                  You haven&apos;t generated any proposals yet. Switch to &quot;Create New&quot; to get started.
                </p>
                <Button 
                  onClick={() => setViewMode('create')}
                  className="mt-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full"
                >
                  Create Your First Proposal
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastProposals.map((proposal, idx) => (
                  <motion.div
                    key={proposal.id || idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Card className="h-full flex flex-col border-slate-800/60 bg-slate-900/40 backdrop-blur-sm hover:border-emerald-500/40 transition-all duration-300 hover:shadow-[0_10px_30px_-10px_rgba(16,185,129,0.2)] group cursor-pointer">
                      <CardHeader className="pb-4 border-b border-slate-800/60">
                        <div className="flex justify-between items-start mb-2">
                          <CardTitle className="text-lg text-emerald-400 truncate pr-2">{proposal.clientName}</CardTitle>
                          <span className="text-xs text-slate-500 whitespace-nowrap bg-slate-950 px-2 py-1 rounded-md border border-slate-800">
                            {new Date(proposal.createdAt?.toMillis?.() || Date.parse(proposal.createdAt) || 0).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-end">
                          <div className="text-sm text-slate-400">Budget: ${proposal.budget.toLocaleString()}</div>
                          <div className="text-lg font-bold text-slate-100">${proposal.totalCost.toLocaleString()}</div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4 flex-1">
                        <p className="text-sm text-slate-300 line-clamp-3 leading-relaxed">
                          {proposal.impactSummary}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded-md">
                            {proposal.recommendedProducts.length} Products
                          </span>
                          <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-1 rounded-md">
                            ${proposal.budgetRemaining.toLocaleString()} Remaining
                          </span>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0 pb-4 flex gap-2">
                        <Button onClick={() => setSelectedProposal(proposal)} variant="ghost" className="flex-1 text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors">
                          View Details <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                        <Button 
                          onClick={(e) => { e.stopPropagation(); if (proposal.id) handleDeleteProposal(proposal.id, proposal.clientName); }} 
                          variant="ghost" 
                          size="icon"
                          className="text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedProposal && (
          <ProposalDetailsModal 
             proposal={selectedProposal} 
             onClose={() => setSelectedProposal(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
