import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Gestionale Edile Enterprise',
    short_name: 'GestEdile',
    description: 'Sistema professionale per la gestione di cantieri, logistica e finanza.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1d4ed8',
    icons: [
      {
        src: '/icons/logo-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/logo-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
