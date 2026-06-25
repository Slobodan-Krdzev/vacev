import type { Metadata } from 'next';
import { Bebas_Neue, Inter } from 'next/font/google';
import { AuthProvider } from '@/lib/auth-context';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const bebasNeue = Bebas_Neue({
  variable: '--font-bebas',
  weight: '400',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Vacev — Photography & Videography',
  description: 'Portfolio of Vacev — photographer and videographer.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${bebasNeue.variable} h-full overflow-x-hidden antialiased`}>
      <body className="flex min-h-full w-full flex-col overflow-x-hidden bg-background text-foreground">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
