import type { Metadata, Viewport } from 'next';
import { Poppins } from 'next/font/google';
import { cssVariables } from '@rwm/tokens';
import '@rwm/tokens/base.css';
import './globals.css';
import { CompareTray } from '@/components/CompareTray';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { Providers } from '@/components/Providers';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: { default: 'RideWithMe', template: '%s · RideWithMe' },
  description: 'Buy, rent, lease and bid on inspected vehicles.',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0A' },
    { media: '(prefers-color-scheme: light)', color: '#FAFAFA' },
  ],
  colorScheme: 'dark light',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={poppins.variable} suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{ __html: cssVariables() }} />
        <script
          dangerouslySetInnerHTML={{
            __html: "try{var t=localStorage.getItem('rwm:theme');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t)}catch(e){}",
          }}
        />
      </head>
      <body>
        <Providers>
          <a href="#main" className="skip-link">
            Skip to content
          </a>
          <Navbar />
          <main id="main">{children}</main>
          <Footer />
          <CompareTray />
        </Providers>
      </body>
    </html>
  );
}
