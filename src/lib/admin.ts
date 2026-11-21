import { createHash } from 'crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export function adminToken(): string {
  return createHash('sha256').update(process.env.ADMIN_PASSWORD ?? '').digest('hex');
}

export function isAdmin(): boolean {
  const expected = adminToken();
  if (!expected) return false;
  return cookies().get('odz_admin')?.value === expected;
}

export function requireAdmin(): void {
  if (!isAdmin()) redirect('/admin/login');
}
