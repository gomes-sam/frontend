import type { MenuItem, PedidoRequest, Restaurante } from "../types";

const CART_KEY = "@boiaaqui:cart";
const LEGACY_CART_KEY = "@BoiaAqui:cart";
const CHECKOUT_KEY = "@boiaaqui:checkout";

export function getCartItems() {
  const raw = localStorage.getItem(CART_KEY) ?? localStorage.getItem(LEGACY_CART_KEY);
  if (!raw) return [] as Array<{ item: MenuItem; quantidade: number }>;
  try {
    return JSON.parse(raw) as Array<{ item: MenuItem; quantidade: number }>;
  } catch {
    return [];
  }
}

export function saveCartItems(items: Array<{ item: MenuItem; quantidade: number }>) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  localStorage.removeItem(LEGACY_CART_KEY);
}

export function clearCartItems() {
  localStorage.removeItem(CART_KEY);
  localStorage.removeItem(LEGACY_CART_KEY);
}

export interface CheckoutDraft {
  usuarioId: number;
  restaurante: Restaurante | null;
  itens: Array<{ item: MenuItem; quantidade: number }>;
  pedido: PedidoRequest;
}

export function saveCheckoutDraft(draft: CheckoutDraft) {
  localStorage.setItem(CHECKOUT_KEY, JSON.stringify(draft));
}

export function getCheckoutDraft(usuarioId?: number): CheckoutDraft | null {
  const raw = localStorage.getItem(CHECKOUT_KEY);
  if (!raw) return null;
  try {
    const draft = JSON.parse(raw) as CheckoutDraft;
    if (!draft.usuarioId || (usuarioId && draft.usuarioId !== usuarioId)) {
      localStorage.removeItem(CHECKOUT_KEY);
      return null;
    }
    return draft;
  } catch {
    localStorage.removeItem(CHECKOUT_KEY);
    return null;
  }
}

export function clearCheckoutDraft() {
  localStorage.removeItem(CHECKOUT_KEY);
}
