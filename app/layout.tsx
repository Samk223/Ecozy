import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SmoothScroll } from '@/components/SmoothScroll';
import { FirebaseProvider } from '@/components/FirebaseProvider';
import { NavBar } from '@/components/NavBar';
import { ToastProvider } from '@/components/ToastProvider';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Ecozy Commerce Platform',
  description: 'Ecozy is an AI-powered platform that simplifies sustainable commerce by automating product categorization and generating intelligent B2B proposals for eco-friendly businesses.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} font-sans dark`} suppressHydrationWarning>
      <body className="min-h-screen bg-[#060b14] text-slate-50 antialiased flex flex-col selection:bg-emerald-500/30">
        <FirebaseProvider>
          <ToastProvider>
            <SmoothScroll />
            <NavBar />
            <main className="flex-1">
              {children}
            </main>
          </ToastProvider>
        </FirebaseProvider>
      </body>
    </html>
  );
}
