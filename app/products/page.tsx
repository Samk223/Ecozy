"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Package, Plus, Search, Tag, Leaf, ChevronDown, ChevronUp, Filter, X, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { db, Product } from "@/lib/db";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

const ITEMS_PER_PAGE = 10;

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(() => db.products.getAll());
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Filters & Sorting
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<'none' | 'asc' | 'desc'>('none');
  const [isFiltering, setIsFiltering] = useState(false);

  useEffect(() => {
    // State is now initialized synchronously
  }, []);

  // Extract unique categories and filters
  const allCategories = useMemo(() => Array.from(new Set(products.map(p => p.category))), [products]);
  const allFilters = useMemo(() => {
    const filters = new Set<string>();
    products.forEach(p => p.sustainabilityFilters.forEach(f => filters.add(f)));
    return Array.from(filters);
  }, [products]);

  // Filter and Sort products
  const filteredProducts = useMemo(() => {
    let result = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
      const matchesFilters = selectedFilters.length === 0 || selectedFilters.every(f => product.sustainabilityFilters.includes(f));
      
      return matchesSearch && matchesCategory && matchesFilters;
    });

    if (sortOrder === 'asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'desc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, searchTerm, selectedCategories, selectedFilters, sortOrder]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Reset page when filters change
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setIsFiltering(true);
      setCurrentPage(1);
    }, 0);
    const timer2 = setTimeout(() => setIsFiltering(false), 400);
    return () => { clearTimeout(timer1); clearTimeout(timer2); };
  }, [searchTerm, selectedCategories, selectedFilters, sortOrder]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]);
  };

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev => prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedFilters([]);
    setSearchTerm("");
    setSortOrder('none');
  };

  const handleAddProduct = () => {
    setIsNavigating(true);
    setTimeout(() => {
      router.push('/products/add');
    }, 400); // Wait for animation
  };

  return (
    <motion.div 
      className="container mx-auto pt-32 pb-10 px-4 md:px-8 max-w-7xl"
      animate={{ opacity: isNavigating ? 0 : 1, y: isNavigating ? -20 : 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-50">Products</h1>
          <p className="text-slate-400">Manage your sustainable product catalog.</p>
        </div>
        <Button 
          onClick={handleAddProduct}
          className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all duration-500 hover:scale-105"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      {products.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 border border-slate-800/60 rounded-3xl border-dashed bg-slate-900/40 backdrop-blur-xl shadow-xl"
        >
          <div className="w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
            <Package className="h-12 w-12 text-emerald-400" />
          </div>
          <h3 className="text-2xl font-bold text-slate-100 mb-2">Your catalog is empty</h3>
          <p className="text-slate-400 mb-8 max-w-md text-center leading-relaxed">
            Start building your sustainable commerce empire. Add your first product and let our AI automatically categorize and tag it for you.
          </p>
          <Button 
            onClick={handleAddProduct}
            className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all duration-500 hover:scale-110 h-12 px-8 text-lg"
          >
            <Plus className="mr-2 h-5 w-5" /> Add Your First Product
          </Button>
        </motion.div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="w-full lg:w-64 shrink-0 space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input 
                placeholder="Search products..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-slate-900/50 border-slate-800 text-slate-100 rounded-full focus-visible:ring-emerald-500"
              />
            </div>

            <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-200 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-emerald-400" /> Filters
                </h3>
                {(selectedCategories.length > 0 || selectedFilters.length > 0 || sortOrder !== 'none') && (
                  <button onClick={clearFilters} className="text-xs text-slate-400 hover:text-emerald-400 transition-colors flex items-center bg-slate-800/50 px-2 py-1 rounded-md">
                    <X className="w-3 h-3 mr-1" /> Clear All
                  </button>
                )}
              </div>

              <div className="mb-6">
                <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <ArrowUpDown className="w-3 h-3" /> Sort by Price
                </h4>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={`flex-1 text-xs rounded-full border-slate-700 ${sortOrder === 'asc' ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/50' : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800'}`}
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'none' : 'asc')}
                  >
                    Low to High
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={`flex-1 text-xs rounded-full border-slate-700 ${sortOrder === 'desc' ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/50' : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800'}`}
                    onClick={() => setSortOrder(sortOrder === 'desc' ? 'none' : 'desc')}
                  >
                    High to Low
                  </Button>
                </div>
              </div>

              {allCategories.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">Categories</h4>
                  <div className="space-y-2">
                    {allCategories.map(category => (
                      <label key={category} className="flex items-center gap-2 cursor-pointer group" onClick={() => toggleCategory(category)}>
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedCategories.includes(category) ? 'bg-emerald-500 border-emerald-500' : 'border-slate-700 group-hover:border-emerald-500/50'}`}>
                          {selectedCategories.includes(category) && <CheckCircle2 className="w-3 h-3 text-white" />}
                        </div>
                        <span className={`text-sm transition-colors ${selectedCategories.includes(category) ? 'text-slate-200' : 'text-slate-400 group-hover:text-slate-300'}`}>{category}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {allFilters.length > 0 && (
                <div>
                  <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">Sustainability</h4>
                  <div className="space-y-2">
                    {allFilters.map(filter => (
                      <motion.label 
                        key={filter} 
                        className="flex items-center gap-2 cursor-pointer group" 
                        onClick={() => toggleFilter(filter)}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.div 
                          className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedFilters.includes(filter) ? 'bg-emerald-500 border-emerald-500' : 'border-slate-700 group-hover:border-emerald-500/50'}`}
                          animate={selectedFilters.includes(filter) ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          {selectedFilters.includes(filter) && <CheckCircle2 className="w-3 h-3 text-white" />}
                        </motion.div>
                        <span className={`text-sm transition-colors ${selectedFilters.includes(filter) ? 'text-slate-200' : 'text-slate-400 group-hover:text-slate-300'}`}>{filter}</span>
                      </motion.label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="mb-4 text-sm text-slate-400">
              Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <AnimatePresence mode="wait">
                {isFiltering ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <motion.div
                      key={`skeleton-${i}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="h-full"
                    >
                      <Card className="h-full flex flex-col overflow-hidden border-slate-800/60 bg-slate-900/20">
                        <CardHeader className="pb-4 space-y-3">
                          <div className="flex justify-between items-start mb-2">
                            <div className="h-6 w-24 bg-slate-800 rounded animate-pulse" />
                            <div className="h-6 w-16 bg-slate-800 rounded animate-pulse" />
                          </div>
                          <div className="h-7 w-3/4 bg-slate-800 rounded animate-pulse" />
                          <div className="h-4 w-full bg-slate-800 rounded animate-pulse mt-2" />
                          <div className="h-4 w-5/6 bg-slate-800 rounded animate-pulse" />
                        </CardHeader>
                        <CardContent className="flex-1">
                          <div className="flex flex-wrap gap-2 mb-4">
                            <div className="h-6 w-20 bg-slate-800 rounded animate-pulse" />
                            <div className="h-6 w-24 bg-slate-800 rounded animate-pulse" />
                          </div>
                        </CardContent>
                        <CardFooter className="pt-4 pb-4 border-t border-slate-800/60 flex justify-center">
                          <div className="h-4 w-24 bg-slate-800 rounded animate-pulse" />
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))
                ) : paginatedProducts.length > 0 ? (
                  paginatedProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ scale: 1.02, y: -5 }}
                      className="h-full"
                    >
                      <Card 
                        className="h-full flex flex-col cursor-pointer transition-all duration-300 hover:shadow-[0_10px_30px_rgba(16,185,129,0.15)] hover:border-emerald-500/30 overflow-hidden"
                        onClick={() => setExpandedId(expandedId === product.id ? null : product.id)}
                      >
                        <CardHeader className="pb-4">
                          <div className="flex justify-between items-start mb-2">
                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-medium">
                              {product.category}
                            </Badge>
                            <span className="font-bold text-lg text-slate-100">${product.price.toFixed(2)}</span>
                          </div>
                          <CardTitle className="text-xl leading-tight">{product.name}</CardTitle>
                          <CardDescription className="text-slate-400 line-clamp-2 mt-2">{product.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                          <div className="flex flex-wrap gap-2 mb-4">
                            {product.sustainabilityFilters.slice(0, 2).map((filter, i) => (
                              <span key={i} className="inline-flex items-center px-2 py-1 rounded-md bg-slate-800/50 text-xs text-slate-300 border border-slate-700/50">
                                <Leaf className="w-3 h-3 mr-1 text-emerald-400" /> {filter}
                              </span>
                            ))}
                            {product.sustainabilityFilters.length > 2 && (
                              <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-800/50 text-xs text-slate-400 border border-slate-700/50">
                                +{product.sustainabilityFilters.length - 2} more
                              </span>
                            )}
                          </div>
                        </CardContent>
                        
                        <AnimatePresence>
                          {expandedId === product.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden border-t border-slate-800/60 bg-slate-900/50"
                            >
                              <div className="p-5 space-y-4">
                                <div>
                                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">All Sustainability Filters</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {product.sustainabilityFilters.map((filter, i) => (
                                      <span key={i} className="inline-flex items-center px-2 py-1 rounded-md bg-emerald-500/10 text-xs text-emerald-300 border border-emerald-500/20">
                                        <Leaf className="w-3 h-3 mr-1" /> {filter}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">AI-Generated SEO Tags</h4>
                                  <div className="flex flex-wrap gap-1.5">
                                    {product.seoTags.map((tag, i) => (
                                      <span key={i} className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-500/10 text-xs text-blue-300 border border-blue-500/20">
                                        <Tag className="w-3 h-3 mr-1" /> {tag}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-2 text-sm text-slate-400">
                                  <div><span className="text-slate-500">Material:</span> {product.material}</div>
                                  <div><span className="text-slate-500">Weight:</span> {product.weight}kg</div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
  
                        <CardFooter className="pt-4 pb-4 border-t border-slate-800/60 flex justify-center text-slate-500 hover:text-emerald-400 transition-colors">
                          {expandedId === product.id ? (
                            <span className="flex items-center text-xs font-medium"><ChevronUp className="w-4 h-4 mr-1" /> Show Less</span>
                          ) : (
                            <span className="flex items-center text-xs font-medium"><ChevronDown className="w-4 h-4 mr-1" /> View Details</span>
                          )}
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="col-span-full py-12 text-center text-slate-500"
                  >
                    No products found matching your filters.
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-10 gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white rounded-full bg-slate-900/50"
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${currentPage === i + 1 ? 'bg-emerald-600 text-white shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white rounded-full bg-slate-900/50"
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}

// Add CheckCircle2 icon component since it's used but not imported
function CheckCircle2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}
