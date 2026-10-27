import test from 'node:test';
import assert from 'node:assert/strict';
import initialProductsJson from '../data/products.json';
import { Product } from '../types/furniture';
import {
  addItemToCart,
  buildCustomQuoteLinks,
  buildWhatsAppCartOrderUrl,
  calculateCartTotals,
  createDemoOrderRecord,
  filterAndSortProducts,
  formatInr,
  updateCartItemQuantity,
  validateCheckoutForm,
  validateCouponCode,
  verifyAdminCredentials,
} from './storeLogic';

const sampleProducts = initialProductsJson as Product[];

test('products.json contains exactly 12 realistic items across all 6 categories', () => {
  assert.equal(sampleProducts.length, 12);
  const categories = new Set(sampleProducts.map((p) => p.category));
  assert.deepEqual(
    Array.from(categories).sort(),
    ['Beds', 'Chairs', 'Dining', 'Office', 'Sofas', 'Wardrobes']
  );
});

test('formatInr formats Indian Rupees with en-IN grouping', () => {
  assert.equal(formatInr(68500), '₹68,500');
  assert.equal(formatInr(125000), '₹1,25,000');
});

test('filterAndSortProducts filters by category, price range, color, search query, and sorts', () => {
  const sofas = filterAndSortProducts(sampleProducts, {
    searchQuery: '',
    category: 'Sofas',
    priceRange: 'all',
    colorName: 'All',
    sortBy: 'price-asc',
  });
  assert.equal(sofas.length, 2);
  assert.equal(sofas[0].price <= sofas[1].price, true);

  const under25k = filterAndSortProducts(sampleProducts, {
    searchQuery: '',
    category: 'All',
    priceRange: 'under-25k',
    colorName: 'All',
    sortBy: 'price-desc',
  });
  assert.equal(under25k.every((p) => p.price < 25000), true);
  assert.equal(under25k.length >= 2, true);

  const searchCane = filterAndSortProducts(sampleProducts, {
    searchQuery: 'vienna cane',
    category: 'All',
    priceRange: 'all',
    colorName: 'Sage Meadow',
    sortBy: 'featured',
  });
  assert.equal(searchCane.length, 1);
  assert.equal(searchCane[0].id, 'prod-chair-01');
});

test('cart operations and DEMO10 coupon calculate 10% discount accurately', () => {
  let cart = addItemToCart([], 'prod-sofa-01', 'Oatmeal Linen', 1);
  cart = addItemToCart(cart, 'prod-chair-01', 'Sage Meadow', 2);
  assert.equal(cart.length, 2);

  cart = updateCartItemQuantity(cart, 'prod-chair-01', 'Sage Meadow', 1);

  const checkInvalid = validateCouponCode('WRONG50');
  assert.equal(checkInvalid.valid, false);

  const checkDemo = validateCouponCode('demo10');
  assert.equal(checkDemo.valid, true);
  assert.equal(checkDemo.discountPercent, 10);

  const totals = calculateCartTotals(cart, sampleProducts, 'DEMO10');
  // 68,500 + 22,500 = 91,000; 10% off = 9,100; total = 81,900 (free delivery >= 25,000)
  assert.equal(totals.subtotal, 91000);
  assert.equal(totals.discountAmount, 9100);
  assert.equal(totals.deliveryFee, 0);
  assert.equal(totals.total, 81900);

  const wa = buildWhatsAppCartOrderUrl(totals, {
    name: 'Priya Sharma',
    phone: '9876543210',
    address: 'Indiranagar, Bengaluru',
  });
  assert.equal(wa.url.startsWith('https://wa.me/'), true);
  assert.equal(wa.plainMessage.includes('Nilambur Teak 3-Seater Sofa'), true);
  assert.equal(wa.plainMessage.includes('DEMO10'), true);
});

test('validateCheckoutForm rejects empty/invalid inputs and accepts valid details', () => {
  const badErrors = validateCheckoutForm({
    customerName: 'A',
    phone: '12345',
    address: 'Short',
    cityPin: 'BLR',
    notes: '',
  });
  assert.equal(Object.keys(badErrors).length, 4);

  const okErrors = validateCheckoutForm({
    customerName: 'Rohan Kulkarni',
    phone: '+91 98450 98765',
    address: 'Flat 302, Cedar Heights, 12th Main Indiranagar',
    cityPin: 'Bengaluru 560038',
    notes: '',
  });
  assert.equal(Object.keys(okErrors).length, 0);
});

test('verifyAdminCredentials and buildCustomQuoteLinks work properly', () => {
  assert.equal(verifyAdminCredentials('demo', 'demo123'), true);
  assert.equal(verifyAdminCredentials('demo', 'wrong'), false);

  const quote = buildCustomQuoteLinks({
    customerName: 'Neha Verma',
    phone: '9811122233',
    email: 'neha@example.com',
    category: 'Wardrobes',
    dimensionsText: '240 x 60 x 220 cm',
    materialPreference: 'Fluted Teak with cane inserts',
    budgetInr: '₹95,000',
    notes: 'Sliding doors preferred',
  });
  assert.equal(quote.whatsappUrl.startsWith('https://wa.me/'), true);
  assert.equal(quote.mailtoUrl.startsWith('mailto:'), true);

  const totals = calculateCartTotals(
    addItemToCart([], 'prod-sofa-01', 'Oatmeal Linen', 1),
    sampleProducts,
    'DEMO10'
  );
  const newOrder = createDemoOrderRecord(
    {
      customerName: 'Rohan Kulkarni',
      phone: '+91 98450 98765',
      address: 'Flat 302 Cedar Heights',
      cityPin: 'Bengaluru 560038',
      notes: '',
    },
    totals,
    2
  );
  assert.equal(newOrder.id, 'VH-1043');
});
