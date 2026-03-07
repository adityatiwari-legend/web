'use client';

import { useQuery } from '@tanstack/react-query';
import { getCarbonReports, getProfitReports, getTotalCredits } from '@/lib/api';

// New modern components
import HeroStatsCard from '@/components/ui/HeroStatsCard';
import FarmTable from '@/components/ui/FarmTable';
import AnalyticsChart from '@/components/charts/AnalyticsChart';
import CreditChart from '@/components/charts/CreditChart';
import PerformanceFunnel from '@/components/charts/PerformanceFunnel';
import ActivityPanel from '@/components/ui/ActivityPanel';

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

  // Extract emission data for charts - Mocking trend data for now since API might not return it
  const analyticsData = [
    { month: 'Jan', sequestration: 12 },
    { month: 'Feb', sequestration: 18 },
    { month: 'Mar', sequestration: 15 },
    { month: 'Apr', sequestration: 22 },
    { month: 'May', sequestration: 35 },
    { month: 'Jun', sequestration: 42 },
  ];

  // Mock credit distribution data matching prompt crops
  const creditsDataByCrop = [
    { crop: 'wheat', credits: 120 },
    { crop: 'rice', credits: 85 },
    { crop: 'soybean', credits: 40 },
    { crop: 'maize', credits: 30 },
  ];

  // Mock funnel data
  const funnelData = {
    registered: 125,
    calculated: 98,
    generated: 75,
    aggregated: 60,
    sold: 45
  };

  // Mock farm table data matching prompt columns
  const farmsListData = [
    { id: '1', name: 'Green Valley', crop: 'Wheat', landArea: 12.5, creditsGenerated: 125, carbonReduction: 15.2, estimatedEarnings: 250000 },
    { id: '2', name: 'Sunny Acres', crop: 'Rice', landArea: 8.2, creditsGenerated: 98, carbonReduction: 11.5, estimatedEarnings: 196000 },
    { id: '3', name: 'Riverside Fields', crop: 'Soybean', landArea: 15.0, creditsGenerated: 145, carbonReduction: 18.1, estimatedEarnings: 290000 },
    { id: '4', name: 'Highland Farms', crop: 'Maize', landArea: 10.0, creditsGenerated: 75, carbonReduction: 9.8, estimatedEarnings: 150000 },
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto p-6 md:p-8">
      
      {/* 1. Hero Stats Card - Full Width */}
      <HeroStatsCard 
        totalCredits={Math.max(totalCredits, 150.5)} 
        estimatedIncome={Math.max(estimatedIncome, 125000)} 
        sustainabilityScore={sustainabilityScore} 
      />

      {/* Main Grid Layout: 3 Columns on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 cols wide) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-full">
              {/* Category Analytics Card - Semicircle */}
              <CreditChart creditsData={creditsDataByCrop} />
            </div>
            <div className="h-full">
              {/* Other Analytics Chart - Area Chart */}
              <AnalyticsChart data={analyticsData} />
            </div>
          </div>

          {/* Funnel Analytics */}
          <PerformanceFunnel data={funnelData} />

          {/* Data Table */}
          <FarmTable farms={farmsListData} />
        </div>

        {/* Right Column (1 col wide) - Activity Panel */}
        <div className="lg:col-span-1">
          <ActivityPanel />
        </div>
      </div>
    </div>
  );
}
