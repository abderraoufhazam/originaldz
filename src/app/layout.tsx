import './globals.css';
import type { Metadata } from 'next';
import { getLocale } from '@/lib/locale';
import { LOCALE_DIRS } from '@/lib/types';
import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
import WelcomePopup from '@/components/welcome-popup';
import PixelTracker from '@/components/pixel-tracker';
import SettingsScript from '@/components/settings-script';
import SecretAccess from '@/components/secret-access';
import AnimatedBackground from '@/components/animated-background';
import MaintenanceGate from '@/components/maintenance-gate';
import { getSettings } from '@/lib/settings';
import { isAdmin } from '@/lib/admin';

export const metadata: Metadata = {
  title: { default: 'originaldz', template: '%s | originaldz' },
  description: 'originaldz — متجر الدفع عند الاستلام في الجزائر',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = getLocale();
  const dir = LOCALE_DIRS[locale];

  let maintenance = false;
  try {
    const s = await getSettings();
    maintenance = s.maintenance_mode;
  } catch {
    /* ignore */
  }
  const admin = isAdmin();

  return (
    <html lang={locale} dir={dir}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&family=Tajawal:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-screen flex-col">
        <AnimatedBackground />
        <SettingsScript />
        <PixelTracker />
        <SecretAccess />
        <MaintenanceGate maintenance={maintenance} admin={admin}>
          <SiteHeader locale={locale} />
          <main className="flex-1">{children}</main>
          <SiteFooter locale={locale} />
          <WelcomePopup locale={locale} />
        </MaintenanceGate>
      </body>
    </html>
  );
}
