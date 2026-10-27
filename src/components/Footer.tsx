import React from 'react';
import { SHOP_CONFIG } from '../config/shopConfig';
import { FurnitureCategory } from '../types/furniture';
import { CustomerRoute } from './Navbar';

interface FooterProps {
  onNavigate: (route: CustomerRoute) => void;
  onSelectCategory: (category: FurnitureCategory) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onSelectCategory }) => {
  const whatsappDirectUrl = `https://wa.me/${SHOP_CONFIG.whatsappNumber}?text=${encodeURIComponent(
    `Hello ${SHOP_CONFIG.shopName}, I have a question about your furniture collection.`
  )}`;

  return (
    <footer className="bg-[#1C1B19] text-[#FAF9F6] border-t border-[#2E2C29] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <p className="font-display text-xl font-semibold text-white">
              {SHOP_CONFIG.shopName}
            </p>
            <p className="mt-2 text-xs text-[#B8B2A8]">{SHOP_CONFIG.legalSubtitle}</p>
            <p className="mt-4 text-sm text-[#D6D1C7] leading-relaxed">
              {SHOP_CONFIG.showroom.addressLine1}, {SHOP_CONFIG.showroom.addressLine2}
            </p>
            <p className="mt-2 text-sm font-mono-num text-[#D6D1C7]">
              {SHOP_CONFIG.displayPhone}
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-sans text-sm font-semibold text-white">Collections</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-[#C8C2B8]">
              {SHOP_CONFIG.categories.map((cat) => (
                <li key={cat}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectCategory(cat);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Services */}
          <div>
            <h3 className="font-sans text-sm font-semibold text-white">Client Services</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-[#C8C2B8]">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('quote');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Request a Custom Quote
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Showroom & Store Hours
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('wishlist');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Saved Wishlist
                </button>
              </li>
              <li>
                <a
                  href={whatsappDirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  WhatsApp Concierge
                </a>
              </li>
            </ul>
          </div>

          {/* Owner Demo Access */}
          <div>
            <h3 className="font-sans text-sm font-semibold text-white">Shop Owner Demo</h3>
            <p className="mt-4 text-sm text-[#C8C2B8] leading-relaxed">
              Zero-cost static storefront running entirely in the browser with localStorage
              cart, wishlist, and catalog management.
            </p>
            <div className="mt-4">
              <a
                href="/admin.html"
                className="inline-flex items-center px-4 py-2 text-xs font-medium bg-white text-[#1C1B19] rounded-lg hover:bg-[#EAE5DC] transition-colors whitespace-nowrap"
              >
                Open Mini Admin (/admin.html)
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#9E988E]">
          <p>
            © {new Date().getFullYear()} {SHOP_CONFIG.shopName}. Demo storefront built for
            prospective furniture retailers.
          </p>
          <p>Coupon code DEMO10 active · All prices in INR (₹) inclusive of GST</p>
        </div>
      </div>
    </footer>
  );
};
