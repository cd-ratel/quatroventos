import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: {
    default: 'Quatro Ventos | Espaço para Eventos',
    template: '%s | Quatro Ventos',
  },
  description:
    'Quatro Ventos — O espaço perfeito para casamentos, festas infantis, reuniões corporativas e confraternizações. Agende sua visita.',
  keywords: [
    'salão de festas',
    'espaço para eventos',
    'casamento',
    'festa infantil',
    'reunião corporativa',
    'buffet',
    'quatroventos',
  ],
  openGraph: {
    title: 'Quatro Ventos | Espaço para Eventos',
    description: 'O espaço perfeito para celebrar os momentos mais especiais da sua vida.',
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
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
