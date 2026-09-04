import type { Metadata } from 'next';
import { Source_Sans_3, Merriweather } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export const dynamic = 'force-dynamic';

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-source-sans',
});

const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-merriweather',
});

export const metadata: Metadata = {
  title: 'Career & Professional Development Center | CPDC Portal',
  description: 'Official academic and career development platform empowering students, faculty and leadership.',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sourceSans.variable} ${merriweather.variable}`}>
      <body className="font-sans antialiased text-charcoal min-h-screen bg-fixed bg-cover bg-center">
        <ErrorBoundary>
          <Providers>{children}</Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
