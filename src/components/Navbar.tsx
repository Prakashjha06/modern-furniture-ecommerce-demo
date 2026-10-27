import React, { useState } from 'react';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { SHOP_CONFIG } from '../config/shopConfig';

export type CustomerRoute =
  | 'home'
  | 'shop'
  | 'product'
  | 'wishlist'
  | 'checkout'
  | 'quote'
  | 'contact';

interface NavbarProps {
  activeRoute: CustomerRoute;
  onNavigate: (route: CustomerRoute) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeRoute,
  onNavigate,
  cartCount,
  wishlistCount,
  onOpenCart,
}) => {
  const [showOfferStrip, setShowOfferStrip] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (route: CustomerRoute) => {
    onNavigate(route);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Non-sticky slim promotional strip (<= 40px) */}
      {showOfferStrip && (
        <div className="bg-[#1C1B19] text-[#FAF9F6] text-xs px-4 py-2">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <p className="truncate">{SHOP_CONFIG.offerBannerText}</p>
            <button
              type="button"
              onClick={() => setShowOfferStrip(false)}
              aria-label="Dismiss promotional banner"
              className="text-[#FAF9F6]/75 hover:text-white transition-colors shrink-0 p-0.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-30 bg-[#FAF9F6]/95 backdrop-blur-sm border-b border-[#E5E0D8]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 lg:px-8 h-16">
          {/* Zone 1: Single-line Brand Wordmark */}
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className="font-display text-xl font-semibold tracking-tight text-[#1C1B19] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2C3E35]"
          >
            {SHOP_CONFIG.shopName}
          </button>

          {/* Zone 2: 5 concise single-line text navigation links */}
          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-[#66615B]"
          >
            <button
              type="button"
              onClick={() => handleNavClick('shop')}
              className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors cursor-pointer ${
                activeRoute === 'shop' || activeRoute === 'product'
                  ? 'text-[#1C1B19] border-[#2C3E35]'
                  : 'border-transparent hover:text-[#1C1B19] hover:border-[#1C1B19]/30'
              }`}
            >
              Catalog
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('quote')}
              className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors cursor-pointer ${
                activeRoute === 'quote'
                  ? 'text-[#1C1B19] border-[#2C3E35]'
                  : 'border-transparent hover:text-[#1C1B19] hover:border-[#1C1B19]/30'
              }`}
            >
              Custom Quote
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('wishlist')}
              className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors cursor-pointer ${
                activeRoute === 'wishlist'
                  ? 'text-[#1C1B19] border-[#2C3E35]'
                  : 'border-transparent hover:text-[#1C1B19] hover:border-[#1C1B19]/30'
              }`}
            >
              Wishlist{wishlistCount > 0 ? ` (${wishlistCount})` : ''}
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('contact')}
              className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors cursor-pointer ${
                activeRoute === 'contact'
                  ? 'text-[#1C1B19] border-[#2C3E35]'
                  : 'border-transparent hover:text-[#1C1B19] hover:border-[#1C1B19]/30'
              }`}
            >
              Showroom
            </button>
            <a
              href="/admin.html"
              className="whitespace-nowrap shrink-0 py-1 border-b-2 border-transparent hover:text-[#1C1B19] hover:border-[#1C1B19]/30 transition-colors"
            >
              Admin Demo
            </a>
          </nav>

          {/* Zone 3: 1 Primary Action (Cart Drawer Trigger) + Mobile Menu Button */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onOpenCart}
              aria-label={`Open shopping cart with ${cartCount} items`}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-medium text-white bg-[#2C3E35] hover:bg-[#1F2D26] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2C3E35]"
            >
              <ShoppingBag className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Cart</span>
              <span className="font-mono-num">({cartCount})</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-[#E5E0D8] text-[#1C1B19] hover:bg-[#F2EFE9] transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <nav
            aria-label="Mobile navigation"
            className="md:hidden border-t border-[#E5E0D8] bg-[#FAF9F6] px-4 py-4 flex flex-col gap-2 text-sm font-medium"
          >
            <button
              type="button"
              onClick={() => handleNavClick('home')}
              className="text-left py-2.5 px-3 rounded-lg hover:bg-[#F2EFE9] text-[#1C1B19]"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('shop')}
              className="text-left py-2.5 px-3 rounded-lg hover:bg-[#F2EFE9] text-[#1C1B19]"
            >
              Catalog
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('quote')}
              className="text-left py-2.5 px-3 rounded-lg hover:bg-[#F2EFE9] text-[#1C1B19]"
            >
              Custom Quote
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('wishlist')}
              className="text-left py-2.5 px-3 rounded-lg hover:bg-[#F2EFE9] text-[#1C1B19]"
            >
              Wishlist ({wishlistCount})
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('contact')}
              className="text-left py-2.5 px-3 rounded-lg hover:bg-[#F2EFE9] text-[#1C1B19]"
            >
              Showroom & Contact
            </button>
            <a
              href="/admin.html"
              className="py-2.5 px-3 rounded-lg hover:bg-[#F2EFE9] text-[#2C3E35] font-semibold"
            >
              Admin Demo (/admin.html)
            </a>
          </nav>
        )}
      </header>
    </>
  );
};
