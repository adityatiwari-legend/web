'use client';

import { ArrowRight, Leaf, TrendingUp, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

interface HeroStatsCardProps {
  totalCredits: number;
  estimatedIncome: number;
  sustainabilityScore: number;
}

export default function HeroStatsCard({ totalCredits, estimatedIncome, sustainabilityScore }: HeroStatsCardProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-green-600 to-emerald-800 rounded-2xl p-8 text-white shadow-lg border border-green-500/20">
      {/* Abstract background shapes */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-32 -mb-20 w-48 h-48 rounded-full bg-emerald-400/20 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold backdrop-blur-sm mb-4">
            <Leaf className="h-3.5 w-3.5" />
            Seasonal Performance
          </span>
          <h2 className="text-3xl font-bold mb-2">Great progress this season!</h2>
          <p className="text-green-100 max-w-md text-sm leading-relaxed mb-6">
            Your regenerative farming practices have shown a significant increase in carbon sequestration. Here's your current projection.
          </p>
          <Link 
            href="/farmer/carbon-report" 
            className="inline-flex items-center gap-2 bg-white text-green-700 hover:bg-green-50 font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all focus:ring-2 focus:ring-white/50"
          >
            View Full Report
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="flex bg-black/20 backdrop-blur-md rounded-2xl p-2 border border-white/10">
          <div className="px-6 py-4">
            <div className="flex items-center gap-2 text-green-200 mb-1">
              <Leaf className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Credits</span>
            </div>
            <p className="text-2xl font-bold">{totalCredits.toFixed(1)} <span className="text-lg font-normal text-white/70">tCO₂e</span></p>
          </div>
          <div className="w-px bg-white/10 my-4" />
          <div className="px-6 py-4">
            <div className="flex items-center gap-2 text-green-200 mb-1">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Est. Income</span>
            </div>
            <p className="text-2xl font-bold">₹{estimatedIncome.toLocaleString('en-IN')}</p>
          </div>
          <div className="w-px bg-white/10 my-4 hidden sm:block" />
          <div className="px-6 py-4 hidden sm:block">
            <div className="flex items-center gap-2 text-green-200 mb-1">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wider">ESG Score</span>
            </div>
            <p className="text-2xl font-bold">{sustainabilityScore}<span className="text-lg font-normal text-white/70">/100</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
