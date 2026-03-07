import CorporateLayoutClient from '@/components/layout/CorporateLayoutClient';

export default function CorporateLayout({ children }: { children: React.ReactNode }) {
  return (
    <CorporateLayoutClient>
      {children}
    </CorporateLayoutClient>
  );
}
