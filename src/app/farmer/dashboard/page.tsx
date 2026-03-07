'use client';

import { useQuery } from '@tanstack/react-query';
import { getCarbonReports, getProfitReports, getTotalCredits } from '@/lib/api';

// New modern components
import HeroStatsCard from '@/components/ui/HeroStatsCard';
import ImpactCard from '@/components/ui/ImpactCard';
import FarmTable from '@/components/ui/FarmTable';
import AnalyticsChart from '@/components/charts/AnalyticsChart';
import CreditChart from '@/components/charts/CreditChart';
import PerformanceFunnel from '@/components/charts/PerformanceFunnel';

export default function FarmerDashboard() {
  const { data: creditsData } = useQuery({
    queryKey: ['totalCredits'],
    queryFn: () => getTotalCredits().then((r) => r.data.data),
  });

  const { data: carbonReports } = useQuery({
    queryKey: ['carbonReports'],
    queryFn: () => getCarbonReports().then((r) => r.data.data),
  });

  const { data: profitReports } = useQuery({
    queryKey: ['profitReports'],
    queryFn: () => getProfitReports().then((r) => r.data.data),
  });

  const latestCarbon = carbonReports?.[0];
  const latestProfit = profitReports?.[0];

  const totalCredits = creditsData?.totalCredits || 0;
  const estimatedIncome = latestProfit?.profit || 0;
  
  // Calculate sustainability score
  const sustainabilityScore = latestCarbon
    ? Math.min(100, Math.max(0, Math.round(50 + (latestCarbon.netCarbon / latestCarbon.carbonAbsorbed) * 50)))
    : 85;

  // Extract emission data for pie chart
  const emissionData = latestCarbon ? {
    fertilizer: latestCarbon.emissionsDetail.fertilizer,
    diesel: latestCarbon.emissionsDetail.diesel,
    electricity: latestCarbon.emissionsDetail.electricity
  } : {
    fertilizer: 45,
    diesel: 30,
    electricity: 25
  };

  // Mock credit distribution data
  const creditsDataByCrop = [
    { crop: 'wheat', credits: 120 },
    { crop: 'rice', credits: 85 },
    { crop: 'soybean', credits: 40 },
  ];

  // Mock funnel data
  const funnelData = {
    registered: 12,
    calculated: 10,
    generated: 8,
    aggregated: 5,
    sold: 3
  };

  // Mock farm table data, map from reports if needed in future
  const farmsListData = [
    { id: '1', name: 'Green Valley', crop: 'wheat', creditsGenerated: 12.5, carbonReduction: 4.2, estimatedRevenue: 25000 },
    { id: '2', name: 'Sunny Acres', crop: 'rice', creditsGenerated: 18.2, carbonReduction: 5.8, estimatedRevenue: 36400 },
    { id: '3', name: 'Riverside Fields', crop: 'soybean', creditsGenerated: 9.8, carbonReduction: 3.1, estimatedRevenue: 19600 },
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      
      {/* 1. Hero Stats Card */}
      <HeroStatsCard 
        totalCredits={Math.max(totalCredits, 150.5)} 
        estimatedIncome={Math.max(estimatedIncome, 125000)} 
        sustainabilityScore={sustainabilityScore} 
      />

      {/* 2. Primary Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1 border-gray-100 dark:border-gray-800">
          <AnalyticsChart data={emissionData} />
        </div>
        <div className="xl:col-span-1 border-gray-100 dark:border-gray-800">
          <CreditChart creditsData={creditsDataByCrop} />
        </div>
        <div className="xl:col-span-1 border-gray-100 dark:border-gray-800">
          <ImpactCard 
            totalCredits={Math.max(totalCredits, 150.5)} 
            regionsCount={3} 
            averageScore={sustainabilityScore} 
          />
        </div>
      </div>

      {/* 3. Secondary Analytics: Table & Funnel */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <FarmTable farms={farmsListData} />
        </div>
        <div className="xl:col-span-1">
          <PerformanceFunnel data={funnelData} />
        </div>
      </div>
      
    </div>
  );
}
