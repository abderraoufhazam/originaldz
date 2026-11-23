'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    __ODZ_SETTINGS__?: { fb_pixel?: string; tiktok_pixel?: string; ga_id?: string };
    fbq?: any;
    ttq?: any[];
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

export default function PixelTracker() {
  useEffect(() => {
    const s = window.__ODZ_SETTINGS__ ?? {};

    if (s.ga_id && !document.getElementById('ga-sdk')) {
      const scr = document.createElement('script');
      scr.id = 'ga-sdk';
      scr.async = true;
      scr.src = `https://www.googletagmanager.com/gtag/js?id=${s.ga_id}`;
      document.head.appendChild(scr);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () {
        window.dataLayer!.push(arguments);
      };
      window.gtag('js', new Date());
      window.gtag('config', s.ga_id);
    }

    if (s.fb_pixel && !document.getElementById('fb-pixel-sdk')) {
      const queue: unknown[][] = [];
      const fbq = (...args: unknown[]) => queue.push(args);
      (fbq as any).queue = queue;
      window.fbq = fbq;
      const scr = document.createElement('script');
      scr.id = 'fb-pixel-sdk';
      scr.async = true;
      scr.src = 'https://connect.facebook.net/en_US/fbevents.js';
      document.head.appendChild(scr);
      fbq('init', s.fb_pixel);
      fbq('track', 'PageView');
    }

    if (s.tiktok_pixel) {
      window.ttq = window.ttq || [];
      window.ttq.push(['track', 'PageView']);
      if (!document.getElementById('tt-pixel-sdk')) {
        const scr = document.createElement('script');
        scr.id = 'tt-pixel-sdk';
        scr.async = true;
        scr.src = 'https://analytics.tiktok.com/i18n/pixel/events.js';
        document.head.appendChild(scr);
      }
    }

    function onOrder(e: Event) {
      const d = (e as CustomEvent).detail ?? {};
      window.fbq?.('track', 'Purchase', { value: d.total ?? 0, currency: 'DZD' });
      window.ttq?.push(['track', 'CompletePayment', { value: d.total ?? 0, currency: 'DZD' }]);
    }

    window.addEventListener('odz:order', onOrder);
    return () => window.removeEventListener('odz:order', onOrder);
  }, []);

  return null;
}
