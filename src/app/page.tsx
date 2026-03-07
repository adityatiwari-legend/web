'use client';

import Link from 'next/link';
import { Leaf, BarChart3, ShieldCheck, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Navbar */}
      <nav className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="h-8 w-8 text-green-500" />
            <span className="text-2xl font-bold text-white">
              Krishi<span className="text-green-500">Carbon</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-gray-300 hover:text-white transition px-4 py-2"
            >
              Log In
            </Link>
            <Link
              href="/register"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-1.5 mb-8">
          <Leaf className="h-4 w-4 text-green-400" />
          <span className="text-sm text-green-400">Carbon Credits for Indian Agriculture</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Turn Your Farm Into a<br />
          <span className="text-green-500">Carbon Revenue Stream</span>
        </h1>
        <p className="text-xl text-gray-400 mb-10 max-w-3xl mx-auto">
          KrishiCarbon helps Indian farmers measure carbon absorption, predict profits,
          and sell aggregated carbon credits to ESG-focused corporations.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/register"
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition flex items-center gap-2 justify-center"
          >
            Start as Farmer <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            href="/register?role=corporate"
            className="border border-gray-700 hover:border-green-500 text-white px-8 py-4 rounded-xl text-lg font-semibold transition"
          >
            ESG Buyer Portal
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:border-green-500/50 transition">
            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-6">
              <Leaf className="h-6 w-6 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Carbon Tracking</h3>
            <p className="text-gray-400">
              Calculate carbon absorption and emissions from your farm inputs. Track your net
              carbon footprint and estimated credit value.
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:border-green-500/50 transition">
            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-6">
              <BarChart3 className="h-6 w-6 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Profit Prediction</h3>
            <p className="text-gray-400">
              AI-powered profit forecasting based on crop yields, mandi prices, and
              organic farming practices.
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:border-green-500/50 transition">
            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-6">
              <ShieldCheck className="h-6 w-6 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">ESG Marketplace</h3>
            <p className="text-gray-400">
              Aggregated carbon credits from multiple small farmers create
              investable batches for corporate ESG buyers.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-10 text-center text-gray-500">
        <p>&copy; 2026 KrishiCarbon. Built for ACEHACK 5.0</p>
      </footer>
    </div>
  );
}
