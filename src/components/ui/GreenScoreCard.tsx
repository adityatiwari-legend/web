'use client';

import { Shield, Star, Droplets, Leaf, Sprout, Clock, BadgeCheck, Store } from 'lucide-react';

interface GreenScoreData {
  green_score: number;
  tier: string;
  water_score: number;
  carbon_score: number;
  organic_score: number;
  consistency_score: number;
  loan_eligible: boolean;
  premium_seller: boolean;
}

interface GreenScoreCardProps {
  greenscore: GreenScoreData | null;
  connected: boolean;
}

function ScoreBar({ label, score, icon: Icon }: { label: string; score: number; icon: any }) {
  const color =
    score >= 75 ? 'bg-[#38B26D]' : score >= 50 ? 'bg-yellow-500' : score >= 25 ? 'bg-orange-500' : 'bg-red-500';

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <Icon className="h-3.5 w-3.5 text-[#6B7280]" />
          <span className="text-sm text-[#6B7280]">{label}</span>
        </div>
        <span className="text-sm font-bold text-[#1F2937]">{score}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div className={`h-2 rounded-full transition-all duration-700 ${color}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

export default function GreenScoreCard({ greenscore, connected }: GreenScoreCardProps) {
  const data = greenscore || {
    green_score: 0,
    tier: 'Bronze 🥉',
    water_score: 0,
    carbon_score: 0,
    organic_score: 0,
    consistency_score: 0,
    loan_eligible: false,
    premium_seller: false,
  };

  const scoreColor =
    data.green_score >= 75 ? 'text-[#38B26D]' : data.green_score >= 50 ? 'text-yellow-600' : 'text-red-500';

  const ringPct = Math.min(data.green_score, 100);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (ringPct / 100) * circumference;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-[#1F2937]">Green Score</h3>
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
          connected ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
        }`}>
          {connected ? 'ML Computed' : 'Demo'}
        </span>
      </div>

      {/* Score Ring + Tier */}
      <div className="flex items-center gap-6 mb-6">
        <div className="relative" style={{ width: 120, height: 120 }}>
          <svg width={120} height={120} className="-rotate-90">
            <circle cx={60} cy={60} r={radius} fill="none" stroke="#e5e7eb" strokeWidth={8} />
            <circle
              cx={60} cy={60} r={radius} fill="none"
              stroke={data.green_score >= 75 ? '#38B26D' : data.green_score >= 50 ? '#ca8a04' : '#dc2626'}
              strokeWidth={8} strokeLinecap="round"
              strokeDasharray={circumference} strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 1s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-2xl font-bold ${scoreColor}`}>{Math.round(data.green_score)}</span>
            <span className="text-[10px] text-[#6B7280]">/100</span>
          </div>
        </div>

        <div>
          <p className="text-xl font-bold text-[#1F2937]">{data.tier}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {data.loan_eligible && (
              <span className="flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full border border-green-200">
                <BadgeCheck className="h-3 w-3" /> Loan Eligible
              </span>
            )}
            {data.premium_seller && (
              <span className="flex items-center gap-1 text-xs bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full border border-purple-200">
                <Store className="h-3 w-3" /> Premium Seller
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Sub-scores */}
      <div className="space-y-3">
        <ScoreBar label="Water Usage" score={data.water_score} icon={Droplets} />
        <ScoreBar label="Carbon Impact" score={data.carbon_score} icon={Leaf} />
        <ScoreBar label="Organic Practices" score={data.organic_score} icon={Sprout} />
        <ScoreBar label="Consistency" score={data.consistency_score} icon={Clock} />
      </div>
    </div>
  );
}
