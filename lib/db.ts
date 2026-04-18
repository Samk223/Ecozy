import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, addDoc, serverTimestamp, query, orderBy, where, doc, deleteDoc } from 'firebase/firestore';
import { db as firestoreDb } from './firebase';
import { useFirebase } from '@/components/FirebaseProvider';
import { useMemo } from 'react';

export interface AILog {
  id?: string;
  userId: string;
  module: string;
  prompt: string;
  response: string;
  timestamp: any;
}

export interface Product {
  id?: string;
  userId: string;
  name: string;
  description: string;
  material: string;
  price: number;
  weight: number;
  category: string;
  subCategory: string;
  seoTags: string[];
  sustainabilityFilters: string[];
  createdAt: any;
}

export interface Proposal {
  id?: string;
  userId: string;
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
  createdAt: any;
}

export const useStore = () => {
  const { user } = useFirebase();

  // Queries
  const productsQuery = user ? query(collection(firestoreDb, 'products'), where('userId', '==', user.uid), orderBy('createdAt', 'desc')) : null;
  const proposalsQuery = user ? query(collection(firestoreDb, 'proposals'), where('userId', '==', user.uid), orderBy('createdAt', 'desc')) : null;
  const aiLogsQuery = user ? query(collection(firestoreDb, 'aiLogs'), where('userId', '==', user.uid), orderBy('timestamp', 'desc')) : null;

  const [productsSnap, productsLoading] = useCollection(productsQuery);
  const [proposalsSnap, proposalsLoading] = useCollection(proposalsQuery);
  const [aiLogsSnap, aiLogsLoading] = useCollection(aiLogsQuery);

  // Manually map IDs from snapshot
  const products = useMemo(() => {
    return (productsSnap?.docs || []).map((d) => ({
      ...(d.data() as any),
      id: d.id
    })) as Product[];
  }, [productsSnap]);

  const proposals = useMemo(() => {
    return (proposalsSnap?.docs || []).map((d) => ({
      ...(d.data() as any),
      id: d.id
    })) as Proposal[];
  }, [proposalsSnap]);

  const aiLogs = useMemo(() => {
    return (aiLogsSnap?.docs || []).map((d) => ({
      ...(d.data() as any),
      id: d.id
    })) as AILog[];
  }, [aiLogsSnap]);

  return {
    products,
    productsLoading,
    proposals,
    proposalsLoading,
    aiLogs,
    aiLogsLoading,
    db: {
      products: {
        add: async (product: Omit<Product, 'id' | 'createdAt' | 'userId'>) => {
          if (!user) throw new Error("Must be logged in to add products");
          const docRef = await addDoc(collection(firestoreDb, 'products'), {
            ...product,
            userId: user.uid,
            createdAt: serverTimestamp(),
          });
          return docRef;
        },
        delete: async (id: string) => {
          if (!user) throw new Error("Must be logged in to delete");
          await deleteDoc(doc(firestoreDb, 'products', id));
        }
      },
      proposals: {
        add: async (proposal: Omit<Proposal, 'id' | 'createdAt' | 'userId'>) => {
          if (!user) throw new Error("Must be logged in to add proposals");
          const docRef = await addDoc(collection(firestoreDb, 'proposals'), {
            ...proposal,
            userId: user.uid,
            createdAt: serverTimestamp(),
          });
          return docRef;
        },
        delete: async (id: string) => {
          if (!user) throw new Error("Must be logged in to delete");
          await deleteDoc(doc(firestoreDb, 'proposals', id));
        }
      },
      aiLogs: {
        add: async (log: Omit<AILog, 'id' | 'timestamp' | 'userId'>) => {
          if (!user) throw new Error("Must be logged in to add logs");
          const docRef = await addDoc(collection(firestoreDb, 'aiLogs'), {
            ...log,
            userId: user.uid,
            timestamp: serverTimestamp(),
          });
          return docRef;
        }
      }
    }
  };
};
