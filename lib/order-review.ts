import type { Order } from './types';

export function orderDesignIds(order: Order): string[] {
  return Array.from(new Set([
    ...(order.items || []).map((i) => i.designId),
    order.designId,
  ].filter((id): id is string => Boolean(id))));
}

export function orderMissingDesign(order: Order): boolean {
  return orderDesignIds(order).length === 0;
}