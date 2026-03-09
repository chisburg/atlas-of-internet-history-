import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import AtlasShell from '@/components/AtlasShell';
import TransitionLayer from '@/components/TransitionLayer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Atlas of the Internet',
  description: 'A discovery engine for internet culture. Move through internet history one rabbit hole at a time.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AtlasShell>
          <TransitionLayer>
            {children}
          </TransitionLayer>
        </AtlasShell>
      </body>
    </html>
  );
}
