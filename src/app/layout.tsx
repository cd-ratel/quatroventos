import type { Metadata } from 'next';
import './globals.css';
import ConditionalLayout from '@/components/ConditionalLayout';

export const metadata: Metadata = {
  title: {
    default: 'Quatro Ventos | Espaco para Eventos',
    template: '%s | Quatro Ventos',
  },
  description:
    'Quatro Ventos - O espaco perfeito para casamentos, festas infantis, reunioes corporativas e confraternizacoes. Agende sua visita.',
  keywords: [
    'salao de festas',
    'espaco para eventos',
    'casamento',
    'festa infantil',
    'reuniao corporativa',
    'buffet',
    'quatroventos',
  ],
  openGraph: {
    title: 'Quatro Ventos | Espaco para Eventos',
    description: 'O espaco perfeito para celebrar os momentos mais especiais da sua vida.',
    url: 'https://quatroventos.redecm.com.br',
    siteName: 'Quatro Ventos',
    locale: 'pt_BR',
    type: 'website',
  },
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
