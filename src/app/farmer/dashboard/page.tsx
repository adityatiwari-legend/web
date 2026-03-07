'use client';

import { useQuery } from '@tanstack/react-query';
import { getCarbonReports, getProfitReports, getTotalCredits } from '@/lib/api';
import { useKrishiMitraData } from '@/lib/useKrishiMitraData';

// New modern components
import HeroStatsCard from '@/components/ui/HeroStatsCard';
import FarmTable from '@/components/ui/FarmTable';
import AnalyticsChart from '@/components/charts/AnalyticsChart';
import EnvironmentalImpactChart from '@/components/charts/EnvironmentalImpactChart';
import CarbonTokenizationCard from '@/components/ui/CarbonTokenizationCard';
import RecentTradesCard from '@/components/ui/RecentTradesCard';

// ML-powered cards
import LiveSensorCard from '@/components/ui/LiveSensorCard';
import IrrigationCard from '@/components/ui/IrrigationCard';
import CarbonCreditsMLCard from '@/components/ui/CarbonCreditsMLCard';
import GreenScoreCard from '@/components/ui/GreenScoreCard';

export default function FarmerDashboard() {
  // ML data from KrishiMitra backend (polls every 5s)
  const { latestData, connected, lastUpdate } = useKrishiMitraData();

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
    <div className="space-y-6 pb-20">
      
      {/* 1. Hero Metrics */}
      <HeroStatsCard
        totalCredits={Math.max(totalCredits, 150.5)}
        estimatedIncome={Math.max(estimatedIncome, 125000)}
        sustainabilityScore={sustainabilityScore}
      />

      {/* 1.5 ML-Powered Real-Time Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LiveSensorCard
          sensors={latestData?.sensors ?? null}
          connected={connected}
          lastUpdate={lastUpdate}
        />
        <IrrigationCard
          irrigation={latestData?.irrigation ?? null}
          connected={connected}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CarbonCreditsMLCard
          carbon={latestData?.carbon ?? null}
          connected={connected}
        />
        <GreenScoreCard
          greenscore={latestData?.greenscore ?? null}
          connected={connected}
        />
      </div>

      {/* 2. Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[400px]">
          <AnalyticsChart data={analyticsData} />
        </div>
        <div className="lg:col-span-1 h-[400px]">
          <EnvironmentalImpactChart />
        </div>
      </div>

      {/* 3. Tokenization & Market Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-full">
          <CarbonTokenizationCard 
            minted={1250} 
            pending={340} 
            transactions={[
              { id: '2024-001', status: 'success', hash: '0x123...abc' },
              { id: '2024-002', status: 'pending', hash: '0x456...def' },
              { id: '2024-003', status: 'success', hash: '0x789...ghi' },
            ]} 
          />
        </div>
        <div className="h-full">
          <RecentTradesCard />
        </div>
      </div>

      {/* 4. Farmer Portfolio Table */}
      <FarmTable farms={farmsListData} />
    </div>
  );
}
