import { Bricolage_Grotesque, JetBrains_Mono, Newsreader, Noto_Sans_Bengali, Noto_Serif_Bengali } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';
import { ThemeProvider } from 'next-themes';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Motion } from '@/components/Motion';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site';
import './globals.css';

const bricolage = Bricolage_Grotesque({ subsets: ['latin', 'latin-ext'], variable: '--font-bricolage', display: 'swap' });
const newsreader = Newsreader({ subsets: ['latin', 'latin-ext'], style: ['normal', 'italic'], variable: '--font-newsreader', display: 'swap' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains', display: 'swap' });
// Bengali fallbacks: only downloaded when Bangla glyphs actually appear (unicode-range), so no preload.
const bnSerif = Noto_Serif_Bengali({ subsets: ['bengali'], variable: '--font-bn-serif', display: 'swap', preload: false });
const bnSans = Noto_Sans_Bengali({ subsets: ['bengali'], variable: '--font-bn-sans', display: 'swap', preload: false });

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME}: failed Bangladeshi startups as case studies`, template: `%s · ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: { canonical: '/' },
  openGraph: { type: 'website', siteName: SITE_NAME, locale: 'en_US', url: '/' },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f6f3ee' },
    { media: '(prefers-color-scheme: dark)', color: '#121311' },
  ],
};

const fontVars = [bricolage, newsreader, jetbrains, bnSerif, bnSans].map((f) => f.variable).join(' ');

export default function RootLayout({ children }) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  return (
    <html lang="en" className={fontVars} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
          <a
            href="#main"
            className="sr-only z-50 rounded bg-ink px-4 py-3 text-paper focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
          >
            Skip to content
          </a>
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <Motion />
        </ThemeProvider>
      </body>
      {process.env.NODE_ENV === 'production' && gaId && <GoogleAnalytics gaId={gaId} />}
    </html>
  );
}
