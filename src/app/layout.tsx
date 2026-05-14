import "./globals.css";
import type { Metadata } from "next";
import { Outfit } from 'next/font/google';
import GlobalCommandPalette from '@/components/GlobalCommandPalette';
import PWARegistry from '@/components/PWARegistry';
import { Toaster } from 'sonner';
import { Providers } from '@/components/Providers';
import { AuthProvider } from '@/lib/auth-mock';

const font = Outfit({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700', '800', '900'] });

export const metadata: Metadata = {
  title: "Edil Manager Enterprise",
  description: "Sistema di gestione cantieri professionale v16",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Edil Manager",
  },
};

export const viewport = {
  themeColor: "#1d4ed8",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className={`${font.className} bg-slate-50 text-slate-900 text-[15px] antialiased min-h-screen print:bg-white print:text-black shadow-inner overflow-x-hidden`}>
        <Providers>
          <AuthProvider>
            <PWARegistry />
            {children}
            <Toaster position="top-right" richColors closeButton />
            <GlobalCommandPalette />
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
