import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { getRequestHost, isAdminHost, isKnownHost } from '@/lib/site-host';

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const requestHeaders = await headers();
  const host = getRequestHost(requestHeaders);

  if (host && isKnownHost(host) && !isAdminHost(host)) {
    notFound();
  }

  return <>{children}</>;
}
