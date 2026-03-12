import type { Metadata, Viewport } from 'next';
import './globals.css';
import ConditionalLayout from '@/components/ConditionalLayout';
import { getServerSiteSettings } from '@/lib/server-site-settings';

const iconVersion = '20260311';

export const metadata: Metadata = {
  title: {
    default: 'Quatro Ventos | Espa\u00E7o para Eventos',
    template: '%s | Quatro Ventos',
  },
  description:
    'Quatro Ventos - O espa\u00E7o perfeito para casamentos, festas infantis, reuni\u00F5es corporativas e confraterniza\u00E7\u00F5es. Agende sua visita.',
  keywords: [
    'sal\u00E3o de festas',
    'espa\u00E7o para eventos',
    'casamento',
    'festa infantil',
    'reuni\u00E3o corporativa',
    'buffet',
    'quatroventos',
  ],
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: `/favicon.ico?v=${iconVersion}` },
      { url: `/favicon.svg?v=${iconVersion}`, type: 'image/svg+xml' },
    ],
    apple: [{ url: `/apple-touch-icon.png?v=${iconVersion}`, sizes: '180x180' }],
    shortcut: `/favicon.ico?v=${iconVersion}`,
  },
  openGraph: {
    title: 'Quatro Ventos | Espa\u00E7o para Eventos',
    description: 'O espa\u00E7o perfeito para celebrar os momentos mais especiais da sua vida.',
    url: 'https://quatroventos.redecm.com.br',
    siteName: 'Quatro Ventos',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Quatro Ventos | Espa\u00E7o para Eventos',
    description: 'O espa\u00E7o perfeito para celebrar os momentos mais especiais da sua vida.',
  },
};

export const viewport: Viewport = {
  themeColor: '#121618',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialSettings = await getServerSiteSettings();

  return (
    <html lang="pt-BR">
      <body>
        <ConditionalLayout initialSettings={initialSettings}>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
