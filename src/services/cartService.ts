import type { MenuItem } from "../types";

const CART_KEY = "@BoiaAqui:cart";

export function getCartItems() {
  const raw = localStorage.getItem(CART_KEY);
  if (!raw) return [] as Array<{ item: MenuItem; quantidade: number }>;
  try {
    return JSON.parse(raw) as Array<{ item: MenuItem; quantidade: number }>;
  } catch {
    return [];
  }
}

export function saveCartItems(items: Array<{ item: MenuItem; quantidade: number }>) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function clearCartItems() {
  localStorage.removeItem(CART_KEY);
}
