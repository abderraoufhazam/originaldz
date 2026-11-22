'use client';

import { useEffect, useRef } from 'react';

const CODE = 'ordiz';

/** Hidden keyboard shortcut: typing "ordiz" anywhere (computer only) opens the admin login. */
export default function SecretAccess() {
  const buffer = useRef('');

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      // Do not hijack typing inside inputs, textareas or content-editable areas.
      if (
        target &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
      ) {
        return;
      }
      const k = e.key;
      if (k && k.length === 1) {
        buffer.current = (buffer.current + k.toLowerCase()).slice(-CODE.length);
        if (buffer.current === CODE) {
          buffer.current = '';
          window.location.href = '/admin/login';
        }
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return null;
}
