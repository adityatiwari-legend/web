import ModernSidebar from '@/components/layout/ModernSidebar';
import TopNavbar from '@/components/layout/TopNavbar';

export default function FarmerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex bg-gray-50 dark:bg-gray-950 min-h-screen text-gray-900 dark:text-gray-100 transition-colors">
      <ModernSidebar />
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <TopNavbar />
        <main className="flex-1 p-8 overflow-y-auto custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
