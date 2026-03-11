import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';
import { auth } from '@/lib/auth';
import {
  ADMIN_URL,
  PUBLIC_URL,
  getRequestHost,
  isAdminHost,
  isAllowedHost,
  isInternalHost,
} from '@/lib/site-host';

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const requestHeaders = await headers();
  const host = getRequestHost(requestHeaders);

  if (host && (!isAllowedHost(host) || (!isInternalHost(host) && !isAdminHost(host)))) {
    notFound();
  }

  const session = await auth();

  if (!session) {
    redirect(`${ADMIN_URL}/admin/login`);
  }

  return <AdminShell publicUrl={PUBLIC_URL}>{children}</AdminShell>;
}
