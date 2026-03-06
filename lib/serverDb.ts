import { v4 as uuidv4 } from "uuid";

export interface Product {
  id: string;
  name: string;
  description: string;
  material: string;
  price: number;
  weight: number;
  category: string;
  subCategory: string;
  seoTags: string[];
  sustainabilityFilters: string[];
  createdAt: string;
}

export interface Proposal {
  id: string;
  clientName: string;
  budget: number;
  recommendedProducts: {
    product: string;
    quantity: number;
    cost: number;
  }[];
  totalCost: number;
  budgetRemaining: number;
  impactSummary: string;
  createdAt: string;
}

export interface AILog {
  id: string;
  module: string;
  prompt: string;
  response: string;
  timestamp: string;
}

// In-memory store for serverless environment (will reset on cold starts)
// In a real app, this would be a connection to Supabase or MongoDB
const products: Product[] = [];
const proposals: Proposal[] = [];
const aiLogs: AILog[] = [];

export const serverDb = {
  products: {
    getAll: () => [...products],
    add: (product: Omit<Product, "id" | "createdAt">) => {
      const newProduct = { ...product, id: uuidv4(), createdAt: new Date().toISOString() };
      products.push(newProduct);
      return newProduct;
    },
  },
  proposals: {
    getAll: () => [...proposals],
    add: (proposal: Omit<Proposal, "id" | "createdAt">) => {
      const newProposal = { ...proposal, id: uuidv4(), createdAt: new Date().toISOString() };
      proposals.push(newProposal);
      return newProposal;
    },
  },
  aiLogs: {
    getAll: () => [...aiLogs],
    add: (log: Omit<AILog, "id" | "timestamp">) => {
      const newLog = { ...log, id: uuidv4(), timestamp: new Date().toISOString() };
      aiLogs.push(newLog);
      return newLog;
    },
  },
};
