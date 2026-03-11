import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import {
  getRequestHost,
  isAdminHost,
  isAllowedHost,
  isInternalHost,
} from '@/lib/site-host';

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const requestHeaders = await headers();
  const host = getRequestHost(requestHeaders);

  if (host && (!isAllowedHost(host) || (!isInternalHost(host) && !isAdminHost(host)))) {
    notFound();
  }

  return <>{children}</>;
}
