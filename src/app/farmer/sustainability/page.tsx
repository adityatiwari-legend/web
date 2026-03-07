'use client';

import { useQuery } from '@tanstack/react-query';
import { getCarbonReports, getProfitReports, getFarms } from '@/lib/api';
import { FiCheckCircle, FiAlertTriangle, FiTrendingUp, FiDroplet, FiSun, FiWind } from 'react-icons/fi';
import GreenScoreCard from '@/components/ui/GreenScoreCard';
import { useKrishiMitraData } from '@/lib/useKrishiMitraData';

interface SustainabilityMetric {
  label: string;
  score: number;
  maxScore: number;
  icon: React.ReactNode;
  tips: string[];
}

function ScoreRing({ score, maxScore, size = 120 }: { score: number; maxScore: number; size?: number }) {
  const pct = Math.min((score / maxScore) * 100, 100);
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;
  const color = pct >= 75 ? '#16a34a' : pct >= 50 ? '#ca8a04' : '#dc2626'; // green-600, yellow-600, red-600

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e5e7eb" strokeWidth={8} />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={color} strokeWidth={8} strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-gray-900">{Math.round(pct)}%</span>
      </div>
    </div>
  );
}

function MetricCard({ metric }: { metric: SustainabilityMetric }) {
  const pct = (metric.score / metric.maxScore) * 100;
  const barColor = pct >= 75 ? 'bg-green-600' : pct >= 50 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
      <div className="flex items-center gap-3 mb-3">
        <div className="text-green-600 text-xl">{metric.icon}</div>
        <h4 className="text-gray-900 font-bold">{metric.label}</h4>
        <span className="ml-auto text-sm text-gray-500 font-medium">{metric.score}/{metric.maxScore}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2.5 mb-4">
        <div className={`${barColor} h-2.5 rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
      <ul className="space-y-2">
        {metric.tips.map((tip, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
            {pct >= 75 ? (
              <FiCheckCircle className="text-green-600 mt-0.5 shrink-0" />
            ) : (
              <FiAlertTriangle className="text-yellow-500 mt-0.5 shrink-0" />
            )}
            {tip}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function SustainabilityPage() {
  const { latestData, connected } = useKrishiMitraData();

  const { data: farms } = useQuery({
    queryKey: ['farms'],
    queryFn: () => getFarms().then((r) => r.data.data),
  });

  const { data: carbonReports } = useQuery({
    queryKey: ['carbonReports'],
    queryFn: () => getCarbonReports().then((r) => r.data.data),
  });

  const { data: profitReports } = useQuery({
    queryKey: ['profitReports'],
    queryFn: () => getProfitReports().then((r) => r.data.data),
  });

  // Calculate sustainability metrics from real data
  const totalFarms = farms?.length || 0;
  const totalCarbonReports = carbonReports?.length || 0;
  const avgNetCarbon = carbonReports?.length
    ? carbonReports.reduce((sum: number, r: any) => sum + (r.netCarbonSequestration || 0), 0) / carbonReports.length
    : 0;
  const organicFarms = farms?.filter((f: any) => f.isOrganic)?.length || 0;
  const organicPct = totalFarms > 0 ? (organicFarms / totalFarms) * 100 : 0;
  const avgProfit = profitReports?.length
    ? profitReports.reduce((sum: number, r: any) => sum + (r.profit || 0), 0) / profitReports.length
    : 0;

  // Compute scores
  const carbonScore = Math.min(Math.round((avgNetCarbon / 5) * 25), 25);
  const organicScore = Math.min(Math.round((organicPct / 100) * 25), 25);
  const diversityScore = Math.min(totalFarms * 5, 25);
  const profitScore = avgProfit > 0 ? Math.min(Math.round((avgProfit / 50000) * 25), 25) : 0;
  const totalScore = carbonScore + organicScore + diversityScore + profitScore;

  const metrics: SustainabilityMetric[] = [
    {
      label: 'Carbon Sequestration',
      score: carbonScore,
      maxScore: 25,
      icon: <FiWind />,
      tips: avgNetCarbon > 3
        ? ['Great carbon absorption! Keep using carbon-friendly practices.']
        : ['Increase tree cover and reduce tillage', 'Switch to low-emission irrigation', 'Apply organic mulching to boost soil carbon'],
    },
    {
      label: 'Organic Practices',
      score: organicScore,
      maxScore: 25,
      icon: <FiSun />,
      tips: organicPct >= 75
        ? ['Excellent! Most of your farms use organic methods.']
        : ['Transition to organic fertilizers for 10% yield bonus', 'Reduce chemical pesticide usage', 'Consider bio-fertilizers for soil health'],
    },
    {
      label: 'Farm Diversity',
      score: diversityScore,
      maxScore: 25,
      icon: <FiDroplet />,
      tips: totalFarms >= 3
        ? ['Good farm portfolio diversity.']
        : ['Add more farms to diversify risk', 'Try different crop types across farms', 'Consider mixed cropping for resilience'],
    },
    {
      label: 'Economic Viability',
      score: profitScore,
      maxScore: 25,
      icon: <FiTrendingUp />,
      tips: avgProfit > 30000
        ? ['Strong profit margins — sustainable financially.']
        : ['Optimize input costs (seed, fertilizer)', 'Check mandi prices before harvest', 'Consider value-added processing'],
    },
  ];

  const overallGrade =
    totalScore >= 80 ? { label: 'A+', color: 'text-green-600', desc: 'Exceptional sustainability performance!' } :
    totalScore >= 60 ? { label: 'A', color: 'text-green-600', desc: 'Strong sustainability practices.' } :
    totalScore >= 40 ? { label: 'B', color: 'text-yellow-600', desc: 'Good progress, room for improvement.' } :
    totalScore >= 20 ? { label: 'C', color: 'text-orange-600', desc: 'Needs attention on sustainability.' } :
    { label: 'D', color: 'text-red-600', desc: 'Start your sustainability journey today!' };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Sustainability Score</h1>
        <p className="text-gray-600 mt-1">Track your environmental and economic sustainability</p>
      </div>

      {/* ML-Powered Green Score */}
      <div className="mb-8">
        <GreenScoreCard greenscore={latestData?.greenscore ?? null} connected={connected} />
      </div>

      {/* Overall Score */}
      <div className="bg-white rounded-2xl p-8 mb-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <ScoreRing score={totalScore} maxScore={100} size={160} />
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`text-5xl font-bold ${overallGrade.color}`}>{overallGrade.label}</span>
              <span className="text-gray-500 text-lg font-medium">Overall Grade</span>
            </div>
            <p className="text-gray-600 text-lg">{overallGrade.desc}</p>
            <div className="flex gap-6 mt-4 text-sm text-gray-500">
              <span>Farms: <span className="text-gray-900 font-semibold">{totalFarms}</span></span>
              <span>Carbon Reports: <span className="text-gray-900 font-semibold">{totalCarbonReports}</span></span>
              <span>Avg Net Carbon: <span className="text-gray-900 font-semibold">{avgNetCarbon.toFixed(2)} tCO₂e</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {metrics.map((m) => (
          <MetricCard key={m.label} metric={m} />
        ))}
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recommended Actions</h3>
        <div className="space-y-3">
          {totalFarms === 0 && (
            <div className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-100 rounded-xl">
              <FiAlertTriangle className="text-yellow-500 mt-0.5" />
              <div>
                <p className="text-gray-900 text-sm font-semibold">Create your first farm profile</p>
                <p className="text-gray-600 text-xs mt-1">Go to Farm Profile to add your land details and start tracking sustainability.</p>
              </div>
            </div>
          )}
          {totalCarbonReports === 0 && (
            <div className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-100 rounded-xl">
              <FiAlertTriangle className="text-yellow-500 mt-0.5" />
              <div>
                <p className="text-gray-900 text-sm font-semibold">Run your first carbon calculation</p>
                <p className="text-gray-600 text-xs mt-1">Visit Carbon Report to calculate your farm&apos;s carbon footprint and earn credits.</p>
              </div>
            </div>
          )}
          {organicPct < 50 && totalFarms > 0 && (
            <div className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-100 rounded-xl">
              <FiTrendingUp className="text-green-600 mt-0.5" />
              <div>
                <p className="text-gray-900 text-sm font-semibold">Transition to organic farming</p>
                <p className="text-gray-600 text-xs mt-1">Organic farms earn a 10% yield bonus and higher sustainability scores.</p>
              </div>
            </div>
          )}
          {totalFarms > 0 && totalCarbonReports > 0 && organicPct >= 50 && (
            <div className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-100 rounded-xl">
              <FiCheckCircle className="text-green-600 mt-0.5" />
              <div>
                <p className="text-gray-900 text-sm font-semibold">You&apos;re doing great!</p>
                <p className="text-gray-600 text-xs mt-1">Keep up your sustainable practices and monitor your score regularly.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
