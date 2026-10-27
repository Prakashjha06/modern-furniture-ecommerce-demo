import initialProductsJson from '../data/products.json';
import { CartItem, DemoOrder, Product } from '../types/furniture';

const STORAGE_KEYS = {
  PRODUCTS: 'vihara_demo_products_v1',
  CART: 'vihara_demo_cart_v1',
  WISHLIST: 'vihara_demo_wishlist_v1',
  ORDERS: 'vihara_demo_orders_v1',
  COUPON: 'vihara_demo_coupon_v1',
  ADMIN_SESSION: 'vihara_demo_admin_session_v1',
};

const SEEDED_DEMO_ORDERS: DemoOrder[] = [
  {
    id: 'VH-1041',
    createdAt: '2026-10-22T11:30:00.000Z',
    customerName: 'Siddharth Rao',
    phone: '+91 98451 67890',
    address: '402 Palm Grove, Defence Colony, Indiranagar',
    cityPin: 'Bengaluru - 560038',
    notes: 'Service lift available till 6 PM.',
    items: [
      {
        productId: 'prod-sofa-01',
        productName: 'Nilambur Teak 3-Seater Sofa',
        sku: 'VH-SF-101',
        selectedColor: 'Oatmeal Linen',
        unitPrice: 68500,
        quantity: 1,
      },
      {
        productId: 'prod-chair-01',
        productName: 'Chettinad Vienna Cane Lounge Chair',
        sku: 'VH-CH-401',
        selectedColor: 'Sage Meadow',
        unitPrice: 22500,
        quantity: 1,
      },
    ],
    subtotal: 91000,
    couponCode: 'DEMO10',
    discountAmount: 9100,
    total: 81900,
    status: 'In Workshop',
  },
  {
    id: 'VH-1042',
    createdAt: '2026-10-23T15:15:00.000Z',
    customerName: 'Ananya Krishnan',
    phone: '+91 98204 11223',
    address: '14 Sea Breeze Villa, Pali Hill, Bandra West',
    cityPin: 'Mumbai - 400050',
    items: [
      {
        productId: 'prod-office-01',
        productName: 'Kaveri Executive Walnut Writing Desk',
        sku: 'VH-OF-601',
        selectedColor: 'Rich Walnut',
        unitPrice: 44500,
        quantity: 1,
      },
    ],
    subtotal: 44500,
    discountAmount: 0,
    total: 44500,
    status: 'Confirmed',
  },
];

function safeReadJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeWriteJson<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota errors in restricted browsing modes
  }
}

export function getInitialProducts(): Product[] {
  return initialProductsJson as Product[];
}

export function loadProductsFromStorage(): Product[] {
  const stored = safeReadJson<Product[] | null>(STORAGE_KEYS.PRODUCTS, null);
  if (!stored || !Array.isArray(stored) || stored.length === 0) {
    const defaults = getInitialProducts();
    safeWriteJson(STORAGE_KEYS.PRODUCTS, defaults);
    return defaults;
  }
  return stored;
}

export function saveProductsToStorage(products: Product[]): void {
  safeWriteJson(STORAGE_KEYS.PRODUCTS, products);
}

export function loadCartFromStorage(): CartItem[] {
  return safeReadJson<CartItem[]>(STORAGE_KEYS.CART, []);
}

export function saveCartToStorage(cart: CartItem[]): void {
  safeWriteJson(STORAGE_KEYS.CART, cart);
}

export function loadWishlistFromStorage(): string[] {
  return safeReadJson<string[]>(STORAGE_KEYS.WISHLIST, []);
}

export function saveWishlistToStorage(productIds: string[]): void {
  safeWriteJson(STORAGE_KEYS.WISHLIST, productIds);
}

export function loadAppliedCouponFromStorage(): string {
  return safeReadJson<string>(STORAGE_KEYS.COUPON, '');
}

export function saveAppliedCouponToStorage(code: string): void {
  safeWriteJson(STORAGE_KEYS.COUPON, code);
}

export function loadOrdersFromStorage(): DemoOrder[] {
  const stored = safeReadJson<DemoOrder[] | null>(STORAGE_KEYS.ORDERS, null);
  if (!stored || !Array.isArray(stored)) {
    safeWriteJson(STORAGE_KEYS.ORDERS, SEEDED_DEMO_ORDERS);
    return SEEDED_DEMO_ORDERS;
  }
  return stored;
}

export function saveOrdersToStorage(orders: DemoOrder[]): void {
  safeWriteJson(STORAGE_KEYS.ORDERS, orders);
}

export function loadAdminSession(): boolean {
  return safeReadJson<boolean>(STORAGE_KEYS.ADMIN_SESSION, false);
}

export function saveAdminSession(isAuthenticated: boolean): void {
  safeWriteJson(STORAGE_KEYS.ADMIN_SESSION, isAuthenticated);
}

export function resetAllDemoStorage(): {
  products: Product[];
  orders: DemoOrder[];
} {
  const defaults = getInitialProducts();
  safeWriteJson(STORAGE_KEYS.PRODUCTS, defaults);
  safeWriteJson(STORAGE_KEYS.CART, []);
  safeWriteJson(STORAGE_KEYS.WISHLIST, []);
  safeWriteJson(STORAGE_KEYS.COUPON, '');
  safeWriteJson(STORAGE_KEYS.ORDERS, SEEDED_DEMO_ORDERS);
  return { products: defaults, orders: SEEDED_DEMO_ORDERS };
}
