import { SHOP_CONFIG } from '../config/shopConfig';
import {
  CartItem,
  CustomQuoteInput,
  DemoOrder,
  DemoOrderItem,
  FurnitureCategory,
  PriceRangeKey,
  Product,
  SortOption,
} from '../types/furniture';

/**
 * Formats an amount in INR using Indian numbering separators (e.g., ₹68,500).
 */
export function formatInr(amount: number): string {
  const rounded = Math.round(amount);
  return `${SHOP_CONFIG.currencySymbol}${rounded.toLocaleString(SHOP_CONFIG.locale)}`;
}

export interface CatalogFilterCriteria {
  searchQuery: string;
  category: FurnitureCategory | 'All';
  priceRange: PriceRangeKey;
  colorName: string; // 'All' or exact color name
  sortBy: SortOption;
}

/**
 * Pure filter + sort pipeline for the furniture catalog.
 */
export function filterAndSortProducts(
  products: Product[],
  criteria: CatalogFilterCriteria
): Product[] {
  const query = criteria.searchQuery.trim().toLowerCase();

  const filtered = products.filter((product) => {
    if (criteria.category !== 'All' && product.category !== criteria.category) {
      return false;
    }

    if (criteria.priceRange === 'under-25k' && product.price >= 25000) {
      return false;
    }
    if (
      criteria.priceRange === '25k-55k' &&
      (product.price < 25000 || product.price > 55000)
    ) {
      return false;
    }
    if (criteria.priceRange === 'above-55k' && product.price <= 55000) {
      return false;
    }

    if (criteria.colorName !== 'All') {
      const hasColor = product.colors.some(
        (c) => c.name.toLowerCase() === criteria.colorName.toLowerCase()
      );
      if (!hasColor) return false;
    }

    if (query) {
      const haystack = [
        product.name,
        product.category,
        product.material,
        product.description,
        product.sku,
        ...product.colors.map((c) => c.name),
      ]
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(query)) return false;
    }

    return true;
  });

  const sorted = [...filtered];
  switch (criteria.sortBy) {
    case 'price-asc':
      sorted.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      sorted.sort((a, b) => b.price - a.price);
      break;
    case 'name-asc':
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'featured':
    default:
      sorted.sort((a, b) => Number(b.featured) - Number(a.featured));
      break;
  }

  return sorted;
}

/**
 * Extracts deduplicated color options across a product catalog for filter UI.
 */
export function getUniqueCatalogColors(
  products: Product[]
): Array<{ name: string; hex: string }> {
  const map = new Map<string, string>();
  for (const product of products) {
    for (const color of product.colors) {
      if (!map.has(color.name)) {
        map.set(color.name, color.hex);
      }
    }
  }
  return Array.from(map.entries()).map(([name, hex]) => ({ name, hex }));
}

/**
 * Adds or increments a product + finish variant in the cart.
 */
export function addItemToCart(
  cart: CartItem[],
  productId: string,
  selectedColor: string,
  quantityToAdd = 1
): CartItem[] {
  const qty = Math.max(1, Math.floor(quantityToAdd));
  const existingIndex = cart.findIndex(
    (item) => item.productId === productId && item.selectedColor === selectedColor
  );

  if (existingIndex === -1) {
    return [...cart, { productId, selectedColor, quantity: qty }];
  }

  return cart.map((item, idx) =>
    idx === existingIndex ? { ...item, quantity: item.quantity + qty } : item
  );
}

/**
 * Updates quantity of a cart line item; removes it if quantity <= 0.
 */
export function updateCartItemQuantity(
  cart: CartItem[],
  productId: string,
  selectedColor: string,
  nextQuantity: number
): CartItem[] {
  if (nextQuantity <= 0) {
    return removeCartItem(cart, productId, selectedColor);
  }
  return cart.map((item) =>
    item.productId === productId && item.selectedColor === selectedColor
      ? { ...item, quantity: Math.floor(nextQuantity) }
      : item
  );
}

/**
 * Removes a line item from the cart.
 */
export function removeCartItem(
  cart: CartItem[],
  productId: string,
  selectedColor: string
): CartItem[] {
  return cart.filter(
    (item) => !(item.productId === productId && item.selectedColor === selectedColor)
  );
}

export interface CartTotals {
  lineItems: DemoOrderItem[];
  totalQuantity: number;
  subtotal: number;
  appliedCoupon?: string;
  discountPercent: number;
  discountAmount: number;
  deliveryFee: number;
  total: number;
}

/**
 * Validates a coupon code (case-insensitive) against SHOP_CONFIG.coupons.
 */
export function validateCouponCode(rawCode: string): {
  valid: boolean;
  normalizedCode?: string;
  discountPercent: number;
  message: string;
} {
  const normalized = rawCode.trim().toUpperCase();
  if (!normalized) {
    return { valid: false, discountPercent: 0, message: 'Enter a coupon code first.' };
  }
  const match = SHOP_CONFIG.coupons[normalized];
  if (!match) {
    return {
      valid: false,
      discountPercent: 0,
      message: `Invalid code "${normalized}". Try demo code DEMO10 for 10% off.`,
    };
  }
  return {
    valid: true,
    normalizedCode: match.code,
    discountPercent: match.discountPercent,
    message: `${match.code} applied (${match.discountPercent}% off subtotal).`,
  };
}

/**
 * Computes itemized cart breakdown, coupon discount (e.g. DEMO10 = 10%), delivery fee, and net total.
 */
export function calculateCartTotals(
  cart: CartItem[],
  products: Product[],
  couponCode?: string
): CartTotals {
  const productMap = new Map(products.map((p) => [p.id, p]));
  const lineItems: DemoOrderItem[] = [];
  let subtotal = 0;
  let totalQuantity = 0;

  for (const item of cart) {
    const product = productMap.get(item.productId);
    if (!product || item.quantity <= 0) continue;
    lineItems.push({
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      selectedColor: item.selectedColor || product.colors[0]?.name || 'Standard',
      unitPrice: product.price,
      quantity: item.quantity,
    });
    subtotal += product.price * item.quantity;
    totalQuantity += item.quantity;
  }

  let appliedCoupon: string | undefined;
  let discountPercent = 0;

  if (couponCode) {
    const check = validateCouponCode(couponCode);
    if (check.valid && check.normalizedCode) {
      appliedCoupon = check.normalizedCode;
      discountPercent = check.discountPercent;
    }
  }

  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  const deliveryFee =
    discountedSubtotal === 0 ||
    discountedSubtotal >= SHOP_CONFIG.freeDeliveryThresholdInr
      ? 0
      : SHOP_CONFIG.standardDeliveryFeeInr;

  const total = discountedSubtotal + deliveryFee;

  return {
    lineItems,
    totalQuantity,
    subtotal,
    appliedCoupon,
    discountPercent,
    discountAmount,
    deliveryFee,
    total,
  };
}

/**
 * Builds the prefilled WhatsApp `wa.me` message and URL for ordering the cart directly.
 */
export function buildWhatsAppCartOrderUrl(
  totals: CartTotals,
  customerDetails?: { name?: string; phone?: string; address?: string }
): { url: string; plainMessage: string } {
  const lines: string[] = [
    `Hello ${SHOP_CONFIG.shopName}, I would like to place an order:`,
    '',
  ];

  totals.lineItems.forEach((item, index) => {
    lines.push(
      `${index + 1}. ${item.productName} (${item.selectedColor}) × ${item.quantity} — ${formatInr(
        item.unitPrice * item.quantity
      )}`
    );
  });

  lines.push('');
  lines.push(`Subtotal: ${formatInr(totals.subtotal)}`);
  if (totals.appliedCoupon && totals.discountAmount > 0) {
    lines.push(
      `Coupon (${totals.appliedCoupon} - ${totals.discountPercent}%): -${formatInr(
        totals.discountAmount
      )}`
    );
  }
  lines.push(
    `Delivery: ${totals.deliveryFee === 0 ? 'Complimentary' : formatInr(totals.deliveryFee)}`
  );
  lines.push(`Total Payable: ${formatInr(totals.total)}`);

  if (customerDetails?.name || customerDetails?.address) {
    lines.push('');
    lines.push('Delivery Details:');
    if (customerDetails.name) lines.push(`Name: ${customerDetails.name}`);
    if (customerDetails.phone) lines.push(`Phone: ${customerDetails.phone}`);
    if (customerDetails.address) lines.push(`Address: ${customerDetails.address}`);
  }

  const plainMessage = lines.join('\n');
  const url = `https://wa.me/${SHOP_CONFIG.whatsappNumber}?text=${encodeURIComponent(
    plainMessage
  )}`;
  return { url, plainMessage };
}

/**
 * Builds WhatsApp and mailto URLs for custom furniture quote requests.
 */
export function buildCustomQuoteLinks(input: CustomQuoteInput): {
  whatsappUrl: string;
  mailtoUrl: string;
  summaryText: string;
} {
  const lines = [
    `Custom Furniture Quote Request — ${SHOP_CONFIG.shopName}`,
    `Customer: ${input.customerName.trim()}`,
    `Phone: ${input.phone.trim()}`,
    `Email: ${input.email.trim() || 'Not provided'}`,
    `Category: ${input.category}`,
    `Dimensions: ${input.dimensionsText.trim()}`,
    `Preferred Material / Finish: ${input.materialPreference.trim()}`,
    `Estimated Budget (INR): ${input.budgetInr.trim() || 'Flexible'}`,
    `Project Notes: ${input.notes.trim() || 'None'}`,
  ];

  const summaryText = lines.join('\n');
  const whatsappUrl = `https://wa.me/${SHOP_CONFIG.whatsappNumber}?text=${encodeURIComponent(
    summaryText
  )}`;
  const subject = `Custom ${input.category} Quote — ${input.customerName.trim()}`;
  const mailtoUrl = `mailto:${SHOP_CONFIG.email}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(summaryText)}`;

  return { whatsappUrl, mailtoUrl, summaryText };
}

export interface CheckoutFormValues {
  customerName: string;
  phone: string;
  address: string;
  cityPin: string;
  notes: string;
}

/**
 * Validates customer checkout form inputs strictly (no silent fallback values).
 */
export function validateCheckoutForm(
  values: CheckoutFormValues
): Record<string, string> {
  const errors: Record<string, string> = {};
  if (values.customerName.trim().length < 2) {
    errors.customerName = 'Please enter your full name.';
  }
  const digitsOnly = values.phone.replace(/\D/g, '');
  if (digitsOnly.length < 10) {
    errors.phone = 'Please enter a valid 10-digit mobile number.';
  }
  if (values.address.trim().length < 8) {
    errors.address = 'Please enter your complete street address and flat/house number.';
  }
  if (values.cityPin.trim().length < 4) {
    errors.cityPin = 'Please enter your city and 6-digit PIN code.';
  }
  return errors;
}

/**
 * Verifies fake demo admin credentials (demo / demo123).
 */
export function verifyAdminCredentials(username: string, password: string): boolean {
  return (
    username.trim() === SHOP_CONFIG.adminAuth.username &&
    password === SHOP_CONFIG.adminAuth.password
  );
}

/**
 * Creates a new DemoOrder record with deterministic readable ID.
 */
export function createDemoOrderRecord(
  values: CheckoutFormValues,
  totals: CartTotals,
  existingOrdersCount: number
): DemoOrder {
  const orderNumber = 1040 + existingOrdersCount + 1;
  return {
    id: `VH-${orderNumber}`,
    createdAt: new Date().toISOString(),
    customerName: values.customerName.trim(),
    phone: values.phone.trim(),
    address: values.address.trim(),
    cityPin: values.cityPin.trim(),
    notes: values.notes.trim() || undefined,
    items: totals.lineItems,
    subtotal: totals.subtotal,
    couponCode: totals.appliedCoupon,
    discountAmount: totals.discountAmount,
    total: totals.total,
    status: 'Confirmed',
  };
}
