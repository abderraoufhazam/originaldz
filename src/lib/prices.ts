import raw from '@data/delivery-prices.json';

export interface DeliveryPriceRow {
  code: number;
  name: string;
  desk: number | null;
  home: number | null;
  desks: number;
}

export const DELIVERY_PRICES = raw as DeliveryPriceRow[];

/** World Express delivery fee for a wilaya + delivery type (static dataset). */
export function deliveryFee(wilayaCode: number, type: 'office' | 'home'): number {
  const row = DELIVERY_PRICES.find((p) => p.code === wilayaCode);
  if (!row) return 0;
  const v = type === 'office' ? row.desk : row.home;
  return v ?? 0;
}
