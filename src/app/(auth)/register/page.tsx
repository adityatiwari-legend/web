'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Leaf, Mail, Lock, User, Phone, MapPin } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import toast from 'react-hot-toast';

function RegisterForm() {
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get('role') || 'farmer';

  const [form, setForm] = useState({
    email: '',
    password: '',
    displayName: '',
    role: defaultRole,
    phone: '',
    region: '',
  });
  const [loading, setLoading] = useState(false);
  const { signUp, signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signUp(form.email, form.password, form.displayName, form.role, form.phone, form.region);
      toast.success('Account created!');
      router.push(form.role === 'corporate' ? '/corporate/dashboard' : '/farmer/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    try {
      await signInWithGoogle(form.role);
      toast.success('Welcome!');
      router.push(form.role === 'corporate' ? '/corporate/dashboard' : '/farmer/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Google signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="bg-[#38B26D] p-2 rounded-xl text-white">
              <Leaf className="h-6 w-6" />
            </div>
            <span className="text-3xl font-bold text-[#1F2937]">
              Krishi<span className="text-[#38B26D]">Carbon</span>
            </span>
          </Link>
          <p className="text-[#6B7280] mt-2">Create your account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-[#1F2937] mb-2">I am a</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, role: 'farmer' })}
                  className={`py-3 rounded-xl font-medium transition border ${
                    form.role === 'farmer'
                      ? 'bg-[#38B26D] border-[#38B26D] text-white shadow-md shadow-[#38B26D]/20'
                      : 'bg-white border-gray-200 text-[#6B7280] hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  🌾 Farmer
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, role: 'corporate' })}
                  className={`py-3 rounded-xl font-medium transition border ${
                    form.role === 'corporate'
                      ? 'bg-[#38B26D] border-[#38B26D] text-white shadow-md shadow-[#38B26D]/20'
                      : 'bg-white border-gray-200 text-[#6B7280] hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  🏢 ESG Buyer
                </button>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-[#1F2937] mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  name="displayName"
                  type="text"
                  value={form.displayName}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-[#1F2937] placeholder-gray-400 focus:outline-none focus:border-[#38B26D] focus:ring-1 focus:ring-[#38B26D] transition"
                  placeholder="Your full name"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#1F2937] mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-[#1F2937] placeholder-gray-400 focus:outline-none focus:border-[#38B26D] focus:ring-1 focus:ring-[#38B26D] transition"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[#1F2937] mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-[#1F2937] placeholder-gray-400 focus:outline-none focus:border-[#38B26D] focus:ring-1 focus:ring-[#38B26D] transition"
                  placeholder="Min 6 characters"
                  minLength={6}
                  required
                />
              </div>
            </div>

            {/* Phone (optional) */}
            <div>
              <label className="block text-sm font-medium text-[#1F2937] mb-2">Phone (optional)</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-[#1F2937] placeholder-gray-400 focus:outline-none focus:border-[#38B26D] focus:ring-1 focus:ring-[#38B26D] transition"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            {/* Region (optional) */}
            <div>
              <label className="block text-sm font-medium text-[#1F2937] mb-2">Region (optional)</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  name="region"
                  type="text"
                  value={form.region}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-[#1F2937] placeholder-gray-400 focus:outline-none focus:border-[#38B26D] focus:ring-1 focus:ring-[#38B26D] transition"
                  placeholder="e.g. Punjab, Maharashtra"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#38B26D] hover:bg-[#2F9E5B] shadow-lg shadow-[#38B26D]/20 disabled:opacity-50 text-white py-3 rounded-xl font-semibold transition hover:translate-y-[-2px]"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-100" />
            <span className="px-4 text-gray-400 text-sm">or</span>
            <div className="flex-1 border-t border-gray-100" />
          </div>

          <button
            onClick={handleGoogleSignup}
            disabled={loading}
            className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-[#1F2937] py-3 rounded-xl font-medium transition flex items-center justify-center gap-3 shadow-sm"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign up with Google
          </button>

          <p className="text-center text-[#6B7280] mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-[#38B26D] hover:text-[#2F9E5B] font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
