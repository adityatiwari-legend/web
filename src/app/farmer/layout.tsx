import DashboardLayoutClient from '@/components/layout/DashboardLayoutClient';

export default function FarmerLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayoutClient>
      {children}
    </DashboardLayoutClient>
  );
}
