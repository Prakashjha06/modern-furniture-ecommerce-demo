import { FurnitureCategory } from '../types/furniture';

/**
 * ============================================================================
 * 10-MINUTE CLIENT REBRANDING CONFIGURATION
 * ============================================================================
 * Edit ONLY this file (and products.json) to customize this storefront for any
 * prospective furniture shop owner:
 * 1. Change `shopName`, `whatsappNumber`, `email`, and `address`
 * 2. Tweak `theme` hex colors (automatically updates CSS variables nationwide)
 * 3. Adjust `coupons` or `freeDeliveryThresholdInr`
 * ============================================================================
 */
export const SHOP_CONFIG = {
  shopName: 'Vihara Living',
  legalSubtitle: 'Demo Furniture Co. · Handcrafted Solid Timber Studio',
  styleLabel: 'Modern Minimal Architectural',
  currencyCode: 'INR',
  currencySymbol: '₹',
  locale: 'en-IN',

  // Contact & Zero-Cost Order Channels (WhatsApp + Mailto)
  whatsappNumber: '919845012345', // International format without '+' for wa.me
  displayPhone: '+91 98450 12345',
  email: 'studio@viharaliving.example.com',

  // Theme Palette (60% Alabaster Canvas · 30% Warm Stone Surface · 10% Forest Espresso Accent)
  theme: {
    bg: '#FAF9F6',
    surface: '#F2EFE9',
    border: '#E5E0D8',
    ink: '#1C1B19',
    muted: '#66615B',
    accent: '#2C3E35',
    accentHover: '#1F2D26',
  },

  // Supported Store Categories
  categories: [
    'Sofas',
    'Beds',
    'Dining',
    'Chairs',
    'Wardrobes',
    'Office',
  ] as FurnitureCategory[],

  // Promotional Offer Strip & Coupon Codes
  offerBannerText:
    'Studio Inaugural Offer: Apply code DEMO10 in your cart for 10% off all solid teak pieces · Complimentary white-glove installation',
  coupons: {
    DEMO10: {
      code: 'DEMO10',
      discountPercent: 10,
      description: '10% Studio Demo Discount',
    },
  } as Record<string, { code: string; discountPercent: number; description: string }>,

  freeDeliveryThresholdInr: 25000,
  standardDeliveryFeeInr: 1200,

  // Showroom Details & Embedded Free Google Map (Indiranagar 100ft Rd, Bengaluru)
  showroom: {
    city: 'Bengaluru',
    addressLine1: '742, 100 Feet Road, HAL 2nd Stage, Indiranagar',
    addressLine2: 'Bengaluru, Karnataka 560038, India',
    hours: [
      { days: 'Tuesday – Friday', time: '10:30 AM – 8:00 PM' },
      { days: 'Saturday – Sunday', time: '10:00 AM – 8:30 PM' },
      { days: 'Monday', time: 'By Private Appointment Only' },
    ],
    // Free standard Google Maps embed URL (no API key or billing required)
    mapEmbedUrl:
      'https://maps.google.com/maps?q=100%20Feet%20Road%20Indiranagar%20Bengaluru&t=&z=15&ie=UTF8&iwloc=&output=embed',
  },

  // Fake Demo Admin Credentials (for /admin.html)
  adminAuth: {
    username: 'demo',
    password: 'demo123',
  },

  // Attributable Client Testimonials
  testimonials: [
    {
      id: 't1',
      quote:
        'Before Vihara, our living room felt cramped with bulky dark upholstery. Switching to the Nilambur 3-Seater opened up 30% more visual floor space and survived two monsoon seasons without a millimeter of frame warp.',
      author: 'Arjun & Meera Nair',
      role: 'Homeowners',
      organization: 'Sadashivanagar Residence, Bengaluru',
      productRef: 'Nilambur Teak 3-Seater Sofa',
    },
    {
      id: 't2',
      quote:
        'We specified six Chettinad Cane Lounge Chairs and a custom 8-seater dining table for a boutique villa project. Every mortise-and-tenon joint arrived flush on day 14, saving our site team two weeks of carpentry snagging.',
      author: 'Ar. Kavitha Deshmukh',
      role: 'Principal Architect',
      organization: 'StudioThreshold Architects, Pune',
      productRef: ' Sahyadri 6-Seater Dining Table',
    },
    {
      id: 't3',
      quote:
        'Ordering custom wardrobe dimensions over WhatsApp was refreshingly transparent. They shared scaled elevation drawings within four hours and assembled the entire fluted teak unit in a single afternoon.',
      author: 'Rohan Malhotra',
      role: 'Product Director',
      organization: 'Bandra West Apartment, Mumbai',
      productRef: 'Travancore Fluted 3-Door Wardrobe',
    },
  ],
};

/**
 * Applies `SHOP_CONFIG.theme` to document root CSS variables so rebranding
 * colors in `SHOP_CONFIG` updates the whole storefront immediately.
 */
export function applyShopTheme(): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.style.setProperty('--brand-bg', SHOP_CONFIG.theme.bg);
  root.style.setProperty('--brand-surface', SHOP_CONFIG.theme.surface);
  root.style.setProperty('--brand-border', SHOP_CONFIG.theme.border);
  root.style.setProperty('--brand-ink', SHOP_CONFIG.theme.ink);
  root.style.setProperty('--brand-muted', SHOP_CONFIG.theme.muted);
  root.style.setProperty('--brand-accent', SHOP_CONFIG.theme.accent);
  root.style.setProperty('--brand-accent-hover', SHOP_CONFIG.theme.accentHover);
}
