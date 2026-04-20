"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Loader2, ArrowLeft, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { generateProductCategorization, ProductInput, CategorizationResult } from "@/lib/categorizer";
import { useStore } from "@/lib/db";
import { useFirebase } from "@/components/FirebaseProvider";
import { useToast } from "@/components/ToastProvider";
import Link from "next/link";

export default function AddProductPage() {
  const router = useRouter();
  const { db } = useStore();
  const { user } = useFirebase();
  const { success, error: toastError } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<ProductInput>({
    name: "",
    description: "",
    material: "",
    price: 0,
    weight: 0,
  });
  const [aiResult, setAiResult] = useState<CategorizationResult | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "weight" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toastError("You must Sign In to add a product.");
      return;
    }

    setIsLoading(true);
    setAiResult(null);

    try {
      // 1. Call AI to categorize
      const { result, prompt, rawResponse } = await generateProductCategorization(formData);

      // 2. Save directly to Firestore using our secure hook
      await db.aiLogs.add({
        module: "categorization",
        prompt,
        response: rawResponse,
      });

      await db.products.add({
        ...formData,
        ...result,
      });

      setAiResult(result);
      setIsSuccess(true);
      success(`Product "${formData.name}" added successfully!`);
      
      // Reset form after a delay or let user navigate away
      setTimeout(() => {
        router.push("/products");
      }, 3000);

    } catch (error: any) {
      console.error("Failed to categorize product:", error);
      if (error?.message?.includes("exceeded") || error?.message?.includes("429")) {
        toastError("AI Quota Exceeded. Please try again in a few seconds or check your Gemini API plan.");
      } else if (error?.message?.toLowerCase().includes("logged in") || error?.message?.includes("permission")) {
        toastError("You must Sign In to add a product.");
      } else {
        toastError("Failed to categorize product. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto pt-32 pb-10 px-4 md:px-8 max-w-4xl">
      <Link href="/products" className="inline-flex items-center text-sm text-slate-400 hover:text-emerald-400 mb-6 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
      </Link>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-50">Add Product</h1>
        <p className="text-slate-400">Upload a product and let AI automatically categorize it.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="border-slate-800/60 bg-slate-900/40 backdrop-blur-xl shadow-xl">
            <CardHeader>
              <CardTitle className="text-slate-100">Product Details</CardTitle>
              <CardDescription className="text-slate-400">Enter the basic information about your sustainable product.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-300">Product Name</Label>
                  <Input id="name" name="name" required placeholder="e.g., Bamboo Cutlery Set" value={formData.name} onChange={handleInputChange} disabled={isLoading || isSuccess} className="bg-slate-950 border-slate-800 text-slate-100 focus-visible:ring-emerald-500 transition-all hover:border-emerald-500/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-slate-300">Description</Label>
                  <Textarea id="description" name="description" required placeholder="Describe the product..." value={formData.description} onChange={handleInputChange} disabled={isLoading || isSuccess} className="min-h-[100px] bg-slate-950 border-slate-800 text-slate-100 focus-visible:ring-emerald-500 transition-all hover:border-emerald-500/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="material" className="text-slate-300">Material</Label>
                  <Input id="material" name="material" required placeholder="e.g., 100% Bamboo" value={formData.material} onChange={handleInputChange} disabled={isLoading || isSuccess} className="bg-slate-950 border-slate-800 text-slate-100 focus-visible:ring-emerald-500 transition-all hover:border-emerald-500/50" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-slate-300">Price ($)</Label>
                    <Input id="price" name="price" type="number" step="0.01" min="0" required value={formData.price || ""} onChange={handleInputChange} disabled={isLoading || isSuccess} className="bg-slate-950 border-slate-800 text-slate-100 focus-visible:ring-emerald-500 transition-all hover:border-emerald-500/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight" className="text-slate-300">Weight (g)</Label>
                    <Input id="weight" name="weight" type="number" min="0" required value={formData.weight || ""} onChange={handleInputChange} disabled={isLoading || isSuccess} className="bg-slate-950 border-slate-800 text-slate-100 focus-visible:ring-emerald-500 transition-all hover:border-emerald-500/50" />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white transition-all duration-300 hover:shadow-[0_0_15px_rgba(16,185,129,0.4)]" disabled={isLoading || isSuccess}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing & Saving...
                    </>
                  ) : isSuccess ? (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-100" />
                      Saved Successfully
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Auto-Categorize & Save
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="h-full bg-slate-900/20 border-dashed border-slate-800/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-100">
                <Sparkles className="h-5 w-5 text-emerald-400" />
                AI Categorization Result
              </CardTitle>
              <CardDescription className="text-slate-400">The AI will automatically generate these fields based on your product details.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-64 space-y-4 text-slate-400">
                  <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
                  <p className="text-sm animate-pulse">Analyzing product materials and generating SEO tags...</p>
                </div>
              ) : aiResult ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-slate-500">Primary Category</Label>
                    <div className="font-medium text-lg text-slate-200">{aiResult.category}</div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-slate-500">Sub-Category</Label>
                    <div className="font-medium text-slate-300">{aiResult.subCategory}</div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-slate-500">Sustainability Filters</Label>
                    <div className="flex flex-wrap gap-2">
                      {aiResult.sustainabilityFilters.map((filter) => (
                        <span key={filter} className="inline-flex items-center rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                          {filter}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-slate-500">SEO Tags</Label>
                    <div className="flex flex-wrap gap-2">
                      {aiResult.seoTags.map((tag) => (
                        <span key={tag} className="inline-flex items-center rounded-md border border-slate-700 bg-slate-800/50 px-2.5 py-0.5 text-xs font-semibold text-slate-300">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-slate-500 text-center px-4">
                  <div className="h-16 w-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4 border border-slate-700/50">
                    <Sparkles className="h-8 w-8 text-slate-600" />
                  </div>
                  <p className="text-sm max-w-[250px]">Fill out the form and submit to see the AI-generated categorization, tags, and sustainability filters.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
