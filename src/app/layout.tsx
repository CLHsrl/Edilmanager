import "./globals.css";
import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import PWARegistry from '@/components/PWARegistry';
import { Toaster } from 'sonner';
import { Providers } from '@/components/Providers';
import { AuthProvider } from '@/lib/auth-mock';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', weight: ['300', '400', '500', '600', '700', '800', '900'] });

export const metadata: Metadata = {
  title: "EDILMANAGER24 by RifacciamoCasa",
  description: "Sistema di gestione cantieri e finanza professionale",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "EDILMANAGER24",
  },
};

export const viewport = {
  themeColor: "#003F61",
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
      <body className={`${inter.variable} font-sans bg-slate-50 text-slate-900 antialiased min-h-screen print:bg-white print:text-black`}>
        <Providers>
          <AuthProvider>
            <PWARegistry />
            {children}
            <Toaster position="top-right" richColors closeButton />
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
