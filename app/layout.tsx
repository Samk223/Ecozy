import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import { Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SmoothScroll } from '@/components/SmoothScroll';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Ecozy Commerce Platform',
  description: 'Ecozy is an AI-powered platform that simplifies sustainable commerce by automating product categorization and generating intelligent B2B proposals for eco-friendly businesses.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} font-sans dark`} suppressHydrationWarning>
      <body className="min-h-screen bg-[#060b14] text-slate-50 antialiased flex flex-col selection:bg-emerald-500/30">
        <SmoothScroll />
        <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl rounded-full border border-slate-800/60 bg-slate-900/70 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-500">
          <div className="flex h-14 items-center justify-between px-6">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 group-hover:scale-110 group-hover:bg-emerald-500/30 transition-all duration-500">
                <Leaf className="h-4 w-4 text-emerald-400" />
              </div>
              <span className="font-bold text-xl text-slate-100 tracking-wide">Ecozy</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
              <Link href="/dashboard" className="transition-all duration-500 ease-in-out hover:text-emerald-400 text-slate-300 hover:-translate-y-1 text-emerald-400">Dashboard</Link>
              <Link href="/products" className="transition-all duration-500 ease-in-out hover:text-emerald-400 text-slate-300 hover:-translate-y-1">Products</Link>
              <Link href="/proposal-generator" className="transition-all duration-500 ease-in-out hover:text-emerald-400 text-slate-300 hover:-translate-y-1">Proposals</Link>
            </nav>
            <div className="flex items-center">
              <Link href="/products/add">
                <Button size="sm" className="rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all duration-500 ease-in-out hover:scale-110 hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] font-medium">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </header>
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
