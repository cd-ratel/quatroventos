'use client';

import { usePathname } from 'next/navigation';
import { SiteSettingsProvider } from '@/components/SiteSettingsProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <SiteSettingsProvider>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </SiteSettingsProvider>
  );
}
