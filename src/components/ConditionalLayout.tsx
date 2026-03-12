'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SiteSettingsProvider } from '@/components/SiteSettingsProvider';
import type { SiteSettings } from '@/lib/site-settings';

export default function ConditionalLayout({
  children,
  initialSettings,
}: {
  children: React.ReactNode;
  initialSettings: SiteSettings;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <SiteSettingsProvider initialSettings={initialSettings}>
      <Navbar />
      <main className="publicMain">{children}</main>
      <Footer />
    </SiteSettingsProvider>
  );
}
