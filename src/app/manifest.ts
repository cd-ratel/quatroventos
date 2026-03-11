import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Quatro Ventos',
    short_name: 'Quatro Ventos',
    description:
      'Espaço para eventos com foco em casamentos, festas infantis, reuniões e celebrações especiais.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a1628',
    theme_color: '#0a1628',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
