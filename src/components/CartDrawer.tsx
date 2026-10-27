import React, { useEffect, useState } from 'react';
import { MessageCircle, Minus, Plus, Trash2, X } from 'lucide-react';
import { Product } from '../types/furniture';
import {
  buildWhatsAppCartOrderUrl,
  CartTotals,
  formatInr,
  validateCouponCode,
} from '../utils/storeLogic';
import { ProductMedia } from './ProductMedia';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  totals: CartTotals;
  products: Product[];
  appliedCoupon: string;
  onApplyCoupon: (code: string) => void;
  onUpdateQuantity: (productId: string, selectedColor: string, nextQty: number) => void;
  onRemoveItem: (productId: string, selectedColor: string) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  totals,
  products,
  appliedCoupon,
  onApplyCoupon,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  const [couponInput, setCouponInput] = useState(appliedCoupon || '');
  const [couponFeedback, setCouponFeedback] = useState<{
    isError: boolean;
    text: string;
  } | null>(null);
  const [showWaPreview, setShowWaPreview] = useState(false);

  useEffect(() => {
    setCouponInput(appliedCoupon || '');
  }, [appliedCoupon]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const productMap = new Map(products.map((p) => [p.id, p]));
  const whatsappOrder = buildWhatsAppCartOrderUrl(totals);

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateCouponCode(couponInput);
    if (!result.valid || !result.normalizedCode) {
      setCouponFeedback({ isError: true, text: result.message });
      return;
    }
    onApplyCoupon(result.normalizedCode);
    setCouponFeedback({ isError: false, text: result.message });
  };

  const handleClearCoupon = () => {
    onApplyCoupon('');
    setCouponInput('');
    setCouponFeedback(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/45 backdrop-blur-[1px]"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Cart"
    >
      {/* Clickable Backdrop */}
      <div className="flex-1" onClick={onClose} aria-hidden="true" />

      {/* Slide-over Panel */}
      <div className="w-full max-w-md bg-[#FAF9F6] h-full flex flex-col border-l border-[#E5E0D8] shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E5E0D8] flex items-center justify-between bg-white">
          <div>
            <h2 className="font-display text-lg font-semibold text-[#1C1B19]">
              Your Shopping Cart
            </h2>
            <p className="text-xs text-[#66615B]">
              {totals.totalQuantity} {totals.totalQuantity === 1 ? 'item' : 'items'} saved in
              browser
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close shopping cart"
            className="w-9 h-9 rounded-lg border border-[#E5E0D8] flex items-center justify-center text-[#1C1B19] hover:bg-[#F2EFE9] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cart Items Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {totals.lineItems.length === 0 ? (
            <div className="py-16 text-center">
              <p className="font-display text-xl font-semibold text-[#1C1B19]">
                Your cart is empty
              </p>
              <p className="mt-2 text-sm text-[#66615B]">
                Add handcrafted sofas, beds, or dining sets to test the demo checkout and
                WhatsApp order summary.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-6 px-5 py-2.5 text-sm font-medium text-white bg-[#2C3E35] hover:bg-[#1F2D26] rounded-lg transition-colors cursor-pointer"
              >
                Continue Browsing
              </button>
            </div>
          ) : (
            totals.lineItems.map((item) => {
              const product = productMap.get(item.productId);
              return (
                <div
                  key={`${item.productId}-${item.selectedColor}`}
                  className="flex gap-4 p-3.5 bg-white border border-[#E5E0D8] rounded-xl"
                >
                  {product && (
                    <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 border border-[#E5E0D8]">
                      <ProductMedia product={product} className="w-full h-full" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold text-[#1C1B19] leading-snug">
                        {item.productName}
                      </h3>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.productId, item.selectedColor)}
                        aria-label={`Remove ${item.productName} (${item.selectedColor}) from cart`}
                        className="text-[#66615B] hover:text-[#B43E32] p-1 shrink-0 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs text-[#66615B] mt-0.5">Finish: {item.selectedColor}</p>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="inline-flex items-center border border-[#E5E0D8] rounded-lg bg-[#FAF9F6]">
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateQuantity(
                              item.productId,
                              item.selectedColor,
                              item.quantity - 1
                            )
                          }
                          aria-label={`Decrease quantity of ${item.productName}`}
                          className="w-7 h-7 flex items-center justify-center text-[#1C1B19] hover:bg-[#E5E0D8]/60 rounded-l-lg cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center font-mono-num text-xs font-medium">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateQuantity(
                              item.productId,
                              item.selectedColor,
                              item.quantity + 1
                            )
                          }
                          aria-label={`Increase quantity of ${item.productName}`}
                          className="w-7 h-7 flex items-center justify-center text-[#1C1B19] hover:bg-[#E5E0D8]/60 rounded-r-lg cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <p className="font-mono-num text-sm font-semibold text-[#1C1B19]">
                        {formatInr(item.unitPrice * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Coupon & Totals Footer */}
        {totals.lineItems.length > 0 && (
          <div className="border-t border-[#E5E0D8] bg-white px-6 py-5 space-y-4">
            {/* Coupon Form */}
            <form onSubmit={handleCouponSubmit} className="space-y-1.5">
              <label
                htmlFor="cart-coupon-input"
                className="block text-xs font-medium text-[#66615B]"
              >
                Promo / Coupon Code (Try <span className="font-mono-num text-[#1C1B19]">DEMO10</span>)
              </label>
              <div className="flex gap-2">
                <input
                  id="cart-coupon-input"
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Enter code e.g. DEMO10"
                  className="flex-1 px-3 py-2 text-xs font-mono-num uppercase bg-[#FAF9F6] border border-[#E5E0D8] rounded-lg text-[#1C1B19] focus:outline-none focus:border-[#2C3E35]"
                />
                {totals.appliedCoupon ? (
                  <button
                    type="button"
                    onClick={handleClearCoupon}
                    className="px-3.5 py-2 text-xs font-medium text-[#B43E32] border border-[#E5E0D8] rounded-lg hover:bg-[#F2EFE9] whitespace-nowrap cursor-pointer"
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-medium text-[#1C1B19] bg-[#F2EFE9] hover:bg-[#E5E0D8] rounded-lg whitespace-nowrap cursor-pointer"
                  >
                    Apply
                  </button>
                )}
              </div>
              {couponFeedback && (
                <p
                  className={`text-xs ${
                    couponFeedback.isError ? 'text-[#B43E32]' : 'text-[#2C3E35]'
                  }`}
                >
                  {couponFeedback.text}
                </p>
              )}
            </form>

            {/* Price Breakdown */}
            <div className="space-y-1.5 pt-2 border-t border-[#F2EFE9] text-xs">
              <div className="flex justify-between text-[#66615B]">
                <span>Subtotal</span>
                <span className="font-mono-num text-[#1C1B19]">
                  {formatInr(totals.subtotal)}
                </span>
              </div>
              {totals.appliedCoupon && totals.discountAmount > 0 && (
                <div className="flex justify-between text-[#2C3E35] font-medium">
                  <span>
                    Coupon ({totals.appliedCoupon} · {totals.discountPercent}% off)
                  </span>
                  <span className="font-mono-num">-{formatInr(totals.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#66615B]">
                <span>Delivery & Installation</span>
                <span className="font-mono-num text-[#1C1B19]">
                  {totals.deliveryFee === 0 ? 'FREE' : formatInr(totals.deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-[#1C1B19] pt-2 border-t border-[#E5E0D8]">
                <span>Total Payable</span>
                <span className="font-mono-num text-base">{formatInr(totals.total)}</span>
              </div>
            </div>

            {/* Primary Checkout & Zero-Cost WhatsApp Order Alternative */}
            <div className="space-y-2.5 pt-1">
              <button
                type="button"
                onClick={onProceedToCheckout}
                className="w-full py-3 px-4 text-sm font-medium text-white bg-[#2C3E35] hover:bg-[#1F2D26] rounded-lg transition-colors cursor-pointer"
              >
                Proceed to Checkout
              </button>

              <a
                href={whatsappOrder.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-medium text-[#1C1B19] bg-[#F2EFE9] hover:bg-[#E5E0D8] rounded-lg transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#2C3E35]" aria-hidden="true" />
                <span>Order on WhatsApp (Prefilled Cart)</span>
              </a>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setShowWaPreview((prev) => !prev)}
                  className="text-[11px] text-[#66615B] hover:text-[#1C1B19] underline underline-offset-2 cursor-pointer"
                >
                  {showWaPreview ? 'Hide WhatsApp summary preview' : 'Preview WhatsApp message'}
                </button>
              </div>

              {showWaPreview && (
                <pre className="p-3 rounded-lg bg-[#FAF9F6] border border-[#E5E0D8] text-[11px] font-mono-num text-[#1C1B19] whitespace-pre-wrap max-h-36 overflow-y-auto">
                  {whatsappOrder.plainMessage}
                </pre>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
