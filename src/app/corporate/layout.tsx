'use client';

import CorporateSidebar from '@/components/layout/CorporateSidebar';

export default function CorporateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-950">
      <CorporateSidebar />
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}
