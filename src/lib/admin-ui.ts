export const STATUS_LABELS: Record<string, string> = {
  new: 'جديد',
  confirmed: 'مؤكد',
  shipped: 'مشحون',
  delivered: 'مستلم',
  cancelled: 'ملغي',
};

export const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  confirmed: 'bg-amber-100 text-amber-700',
  shipped: 'bg-violet-100 text-violet-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-slate-200 text-slate-600',
};

export const RISK_LABELS: Record<string, string> = {
  none: '—',
  warning: 'تنبيه',
  flagged: 'مشبوه',
};

export const RISK_COLORS: Record<string, string> = {
  none: 'text-slate-400',
  warning: 'text-amber-600 font-bold',
  flagged: 'text-red-600 font-bold',
};

export function fmtDZD(n: number): string {
  return `${n} دج`;
}
