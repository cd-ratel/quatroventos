import type { Metadata, Viewport } from 'next';
import './globals.css';
import ConditionalLayout from '@/components/ConditionalLayout';

const iconVersion = '20260311';

export const metadata: Metadata = {
  title: {
    default: 'Quatro Ventos | Espaço para Eventos',
    template: '%s | Quatro Ventos',
  },
  description:
    'Quatro Ventos - O espaço perfeito para casamentos, festas infantis, reuniões corporativas e confraternizações. Agende sua visita.',
  keywords: [
    'salão de festas',
    'espaço para eventos',
    'casamento',
    'festa infantil',
    'reunião corporativa',
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
    title: 'Quatro Ventos | Espaço para Eventos',
    description: 'O espaço perfeito para celebrar os momentos mais especiais da sua vida.',
    url: 'https://quatroventos.redecm.com.br',
    siteName: 'Quatro Ventos',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Quatro Ventos | Espaço para Eventos',
    description: 'O espaço perfeito para celebrar os momentos mais especiais da sua vida.',
  },
};

export const viewport: Viewport = {
  themeColor: '#121618',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
