import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/components/auth-provider';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Bloggen - AI-Powered Blog Generator',
  description: 'Generate high-quality blog posts instantly with AI. Create engaging content with customizable tone, keywords, and topics.',
  keywords: ['AI blog generator', 'content creation', 'blog writing', 'artificial intelligence', 'content marketing'],
  authors: [{ name: 'Bloggen Team' }],
  creator: 'Bloggen',
  openGraph: {
    title: 'Bloggen - AI-Powered Blog Generator',
    description: 'Generate high-quality blog posts instantly with AI',
    url: 'https://bloggen.com',
    siteName: 'Bloggen',
    images: [
      {
        url: 'https://images.pexels.com/photos/267507/pexels-photo-267507.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Bloggen AI Blog Generator',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bloggen - AI-Powered Blog Generator',
    description: 'Generate high-quality blog posts instantly with AI',
    creator: '@bloggen',
    images: ['https://images.pexels.com/photos/267507/pexels-photo-267507.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <div className="min-h-screen bg-background flex flex-col">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}