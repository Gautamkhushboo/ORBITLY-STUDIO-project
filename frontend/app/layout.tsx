import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Orbitly Studio — Digital Product Studio',
  description:
    'Orbitly Studio designs thoughtful digital products, brands, and experiences for ambitious teams.',
  keywords: [
    'Digital Product Studio',
    'UX Design',
    'UI Design',
    'Product Strategy',
    'Design Systems',
    'Web Experiences',
    'TypeScript',
  ],
  authors: [{ name: 'Orbitly Studio' }],
  creator: 'Orbitly Studio',
  openGraph: {
    title: 'Orbitly Studio — Digital Product Studio',
    description:
      'Orbitly Studio designs thoughtful digital products, brands, and experiences for ambitious teams.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Orbitly Studio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Orbitly Studio — Digital Product Studio',
    description:
      'Orbitly Studio designs thoughtful digital products, brands, and experiences for ambitious teams.',
  },
};

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-black text-white antialiased">
        {children}
      </body>
    </html>
  );
}
