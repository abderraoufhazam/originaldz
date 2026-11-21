import { NextResponse, type NextRequest } from 'next/server';

const LOCALES = ['ar', 'en', 'fr'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Language switch: ?lang=xx sets the cookie and reloads without the param.
  const setLang = req.nextUrl.searchParams.get('lang');
  if (setLang && LOCALES.includes(setLang)) {
    const url = req.nextUrl.clone();
    url.searchParams.delete('lang');
    const res = NextResponse.redirect(url);
    res.cookies.set('locale', setLang, { path: '/', maxAge: 60 * 60 * 24 * 365 });
    return res;
  }

  // Set a default locale from the browser when none is set yet.
  if (!req.cookies.has('locale')) {
    const accept = req.headers.get('accept-language') || '';
    const first = accept.split(',')[0]?.toLowerCase() ?? '';
    let locale = 'ar';
    if (first.startsWith('fr')) locale = 'fr';
    else if (first.startsWith('en')) locale = 'en';
    const res = NextResponse.next();
    res.cookies.set('locale', locale, { path: '/', maxAge: 60 * 60 * 24 * 365 });
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api|.*\\..*).*)'],
};
