/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from 'react';
import { applyShopTheme } from './config/shopConfig';
import { CartDrawer } from './components/CartDrawer';
import { CatalogView } from './components/CatalogView';
import { CheckoutView } from './components/CheckoutView';
import { ContactView } from './components/ContactView';
import { CustomQuoteView } from './components/CustomQuoteView';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { CustomerRoute, Navbar } from './components/Navbar';
import { ProductDetailView } from './components/ProductDetailView';
import { WishlistView } from './components/WishlistView';
import { AdminApp } from './components/AdminApp';
import { CartItem, DemoOrder, FurnitureCategory, Product } from './types/furniture';
import {
  loadAppliedCouponFromStorage,
  loadCartFromStorage,
  loadOrdersFromStorage,
  loadProductsFromStorage,
  loadWishlistFromStorage,
  saveAppliedCouponToStorage,
  saveCartToStorage,
  saveOrdersToStorage,
  saveWishlistToStorage,
} from './utils/storage';
import {
  addItemToCart,
  calculateCartTotals,
  CatalogFilterCriteria,
  CheckoutFormValues,
  createDemoOrderRecord,
  removeCartItem,
  updateCartItemQuantity,
} from './utils/storeLogic';

const DEFAULT_FILTER_CRITERIA: CatalogFilterCriteria = {
  searchQuery: '',
  category: 'All',
  priceRange: 'all',
  colorName: 'All',
  sortBy: 'featured',
};

export default function App() {
  // Support direct fallback rendering if served on /admin.html via SPA rewrite
  const isAdminPath =
    typeof window !== 'undefined' &&
    window.location.pathname.toLowerCase().endsWith('/admin.html');

  const [products, setProducts] = useState<Product[]>(() => loadProductsFromStorage());
  const [cart, setCart] = useState<CartItem[]>(() => loadCartFromStorage());
  const [wishlistIds, setWishlistIds] = useState<string[]>(() =>
    loadWishlistFromStorage()
  );
  const [appliedCoupon, setAppliedCoupon] = useState<string>(() =>
    loadAppliedCouponFromStorage()
  );

  const [activeRoute, setActiveRoute] = useState<CustomerRoute>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<DemoOrder | null>(null);
  const [filterCriteria, setFilterCriteria] = useState<CatalogFilterCriteria>(
    DEFAULT_FILTER_CRITERIA
  );

  useEffect(() => {
    applyShopTheme();
  }, []);

  // Sync catalog changes made in /admin.html across tabs or focus
  useEffect(() => {
    const syncFromStorage = () => {
      setProducts(loadProductsFromStorage());
    };
    window.addEventListener('storage', syncFromStorage);
    window.addEventListener('focus', syncFromStorage);
    return () => {
      window.removeEventListener('storage', syncFromStorage);
      window.removeEventListener('focus', syncFromStorage);
    };
  }, []);

  const cartTotals = useMemo(
    () => calculateCartTotals(cart, products, appliedCoupon),
    [cart, products, appliedCoupon]
  );

  if (isAdminPath) {
    return <AdminApp />;
  }

  const handleNavigate = (route: CustomerRoute) => {
    if (route !== 'checkout') {
      setPlacedOrder(null);
    }
    setActiveRoute(route);
  };

  const handleSelectCategory = (category: FurnitureCategory) => {
    setFilterCriteria({
      ...DEFAULT_FILTER_CRITERIA,
      category,
    });
    setPlacedOrder(null);
    setActiveRoute('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (productId: string) => {
    setSelectedProductId(productId);
    setPlacedOrder(null);
    setActiveRoute('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleWishlist = (productId: string) => {
    setWishlistIds((prev) => {
      const exists = prev.includes(productId);
      const next = exists ? prev.filter((id) => id !== productId) : [...prev, productId];
      saveWishlistToStorage(next);
      return next;
    });
  };

  const handleAddToCart = (
    product: Product,
    selectedColor: string,
    quantity = 1,
    openDrawer = true
  ) => {
    setCart((prev) => {
      const next = addItemToCart(prev, product.id, selectedColor, quantity);
      saveCartToStorage(next);
      return next;
    });
    if (openDrawer) {
      setIsCartOpen(true);
    }
  };

  const handleQuickAddToCart = (product: Product) => {
    const defaultFinish = product.colors[0]?.name || 'Standard Finish';
    handleAddToCart(product, defaultFinish, 1, true);
  };

  const handleUpdateCartQty = (
    productId: string,
    selectedColor: string,
    nextQty: number
  ) => {
    setCart((prev) => {
      const next = updateCartItemQuantity(prev, productId, selectedColor, nextQty);
      saveCartToStorage(next);
      return next;
    });
  };

  const handleRemoveCartItem = (productId: string, selectedColor: string) => {
    setCart((prev) => {
      const next = removeCartItem(prev, productId, selectedColor);
      saveCartToStorage(next);
      return next;
    });
  };

  const handleApplyCoupon = (code: string) => {
    setAppliedCoupon(code);
    saveAppliedCouponToStorage(code);
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setPlacedOrder(null);
    setActiveRoute('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceDemoOrder = (values: CheckoutFormValues) => {
    const existingOrders = loadOrdersFromStorage();
    const newOrder = createDemoOrderRecord(values, cartTotals, existingOrders.length);
    const updatedOrders = [newOrder, ...existingOrders];
    saveOrdersToStorage(updatedOrders);

    // Clear cart & coupon upon placing demo order
    setCart([]);
    saveCartToStorage([]);
    setAppliedCoupon('');
    saveAppliedCouponToStorage('');

    setPlacedOrder(newOrder);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectedProduct =
    products.find((p) => p.id === selectedProductId) || products[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#1C1B19]">
      <Navbar
        activeRoute={activeRoute}
        onNavigate={handleNavigate}
        cartCount={cartTotals.totalQuantity}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <main className="flex-1">
        {activeRoute === 'home' && (
          <HomeView
            products={products}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onSelectProduct={handleSelectProduct}
            onQuickAddToCart={handleQuickAddToCart}
            onSelectCategory={handleSelectCategory}
            onNavigate={handleNavigate}
          />
        )}

        {activeRoute === 'shop' && (
          <CatalogView
            products={products}
            criteria={filterCriteria}
            onChangeCriteria={(partial) =>
              setFilterCriteria((prev) => ({ ...prev, ...partial }))
            }
            onResetFilters={() => setFilterCriteria(DEFAULT_FILTER_CRITERIA)}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onSelectProduct={handleSelectProduct}
            onQuickAddToCart={handleQuickAddToCart}
          />
        )}

        {activeRoute === 'product' && selectedProduct && (
          <ProductDetailView
            product={selectedProduct}
            allProducts={products}
            isWishlisted={wishlistIds.includes(selectedProduct.id)}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={(prod, color, qty) => handleAddToCart(prod, color, qty, true)}
            onSelectProduct={handleSelectProduct}
            onBackToCatalog={() => handleNavigate('shop')}
          />
        )}

        {activeRoute === 'wishlist' && (
          <WishlistView
            products={products}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onSelectProduct={handleSelectProduct}
            onQuickAddToCart={handleQuickAddToCart}
            onBrowseCatalog={() => handleNavigate('shop')}
          />
        )}

        {activeRoute === 'checkout' && (
          <CheckoutView
            totals={cartTotals}
            appliedCoupon={appliedCoupon}
            onApplyCoupon={handleApplyCoupon}
            placedOrder={placedOrder}
            onPlaceDemoOrder={handlePlaceDemoOrder}
            onContinueShopping={() => handleNavigate('shop')}
          />
        )}

        {activeRoute === 'quote' && <CustomQuoteView />}

        {activeRoute === 'contact' && <ContactView />}
      </main>

      <Footer
        onNavigate={handleNavigate}
        onSelectCategory={handleSelectCategory}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        totals={cartTotals}
        products={products}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={handleApplyCoupon}
        onUpdateQuantity={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={handleProceedToCheckout}
      />
    </div>
  );
}
