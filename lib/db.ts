import { v4 as uuidv4 } from "uuid";

export interface AILog {
  id: string;
  module: string;
  prompt: string;
  response: string;
  timestamp: string;
}

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

const isBrowser = typeof window !== "undefined";

const getStore = <T>(key: string): T[] => {
  if (!isBrowser) return [];
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const setStore = <T>(key: string, data: T[]) => {
  if (!isBrowser) return;
  localStorage.setItem(key, JSON.stringify(data));
};

export const db = {
  products: {
    getAll: () => getStore<Product>("products"),
    add: (product: Omit<Product, "id" | "createdAt">) => {
      const newProduct = {
        ...product,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
      };
      const products = getStore<Product>("products");
      setStore("products", [...products, newProduct]);
      return newProduct;
    },
  },
  proposals: {
    getAll: () => getStore<Proposal>("proposals"),
    add: (proposal: Omit<Proposal, "id" | "createdAt">) => {
      const newProposal = {
        ...proposal,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
      };
      const proposals = getStore<Proposal>("proposals");
      setStore("proposals", [...proposals, newProposal]);
      return newProposal;
    },
  },
  aiLogs: {
    getAll: () => getStore<AILog>("aiLogs"),
    add: (log: Omit<AILog, "id" | "timestamp">) => {
      const newLog = {
        ...log,
        id: uuidv4(),
        timestamp: new Date().toISOString(),
      };
      const logs = getStore<AILog>("aiLogs");
      setStore("aiLogs", [...logs, newLog]);
      return newLog;
    },
  },
};
