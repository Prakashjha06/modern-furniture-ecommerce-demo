import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, ExternalLink, MessageCircle } from 'lucide-react';
import { SHOP_CONFIG } from '../config/shopConfig';
import { DemoOrder } from '../types/furniture';
import {
  buildWhatsAppCartOrderUrl,
  CartTotals,
  CheckoutFormValues,
  formatInr,
  validateCheckoutForm,
  validateCouponCode,
} from '../utils/storeLogic';

interface CheckoutViewProps {
  totals: CartTotals;
  appliedCoupon: string;
  onApplyCoupon: (code: string) => void;
  placedOrder: DemoOrder | null;
  onPlaceDemoOrder: (values: CheckoutFormValues) => void;
  onContinueShopping: () => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  totals,
  appliedCoupon,
  onApplyCoupon,
  placedOrder,
  onPlaceDemoOrder,
  onContinueShopping,
}) => {
  const [formValues, setFormValues] = useState<CheckoutFormValues>({
    customerName: '',
    phone: '',
    address: '',
    cityPin: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [couponInput, setCouponInput] = useState(appliedCoupon || '');
  const [couponMsg, setCouponMsg] = useState<string>('');

  // Post-Checkout "Demo Order Placed" Confirmation Screen
  if (placedOrder) {
    const orderTotalsForWa: CartTotals = {
      lineItems: placedOrder.items,
      totalQuantity: placedOrder.items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: placedOrder.subtotal,
      appliedCoupon: placedOrder.couponCode,
      discountPercent: placedOrder.couponCode ? 10 : 0,
      discountAmount: placedOrder.discountAmount,
      deliveryFee:
        placedOrder.total - (placedOrder.subtotal - placedOrder.discountAmount),
      total: placedOrder.total,
    };
    const waConfirmation = buildWhatsAppCartOrderUrl(orderTotalsForWa, {
      name: placedOrder.customerName,
      phone: placedOrder.phone,
      address: `${placedOrder.address}, ${placedOrder.cityPin}`,
    });

    return (
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14">
        <div className="bg-white border border-[#E5E0D8] rounded-2xl p-6 sm:p-10">
          <div className="flex items-center gap-3 text-[#2C3E35]">
            <CheckCircle2 className="w-7 h-7 shrink-0" aria-hidden="true" />
            <span className="text-xs font-semibold">
              Demo Order Saved in Browser Storage
            </span>
          </div>

          <h1 className="mt-3 font-display text-3xl sm:text-4xl font-semibold text-[#1C1B19]">
            Demo Order Placed — #{placedOrder.id}
          </h1>
          <p className="mt-2 text-sm text-[#66615B] leading-relaxed">
            Thank you, <span className="font-medium text-[#1C1B19]">{placedOrder.customerName}</span>.
            This demonstration order has been recorded locally with zero payment gateway fees.
            Shop owners can inspect it immediately in the Mini Admin panel or receive it on
            WhatsApp.
          </p>

          {/* Delivery & Order Summary Card */}
          <div className="mt-8 pt-6 border-t border-[#E5E0D8] grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div>
              <h2 className="text-xs font-semibold text-[#66615B]">Delivery Address</h2>
              <p className="mt-1.5 font-medium text-[#1C1B19]">{placedOrder.customerName}</p>
              <p className="text-[#66615B] mt-0.5">{placedOrder.address}</p>
              <p className="text-[#66615B]">{placedOrder.cityPin}</p>
              <p className="font-mono-num text-xs text-[#66615B] mt-1">
                Phone: {placedOrder.phone}
              </p>
            </div>
            <div>
              <h2 className="text-xs font-semibold text-[#66615B]">Payment & Dispatch</h2>
              <p className="mt-1.5 font-medium text-[#1C1B19]">
                Pay on Delivery / Studio Bank Transfer
              </p>
              <p className="text-[#66615B] mt-0.5">Status: {placedOrder.status}</p>
              <p className="text-xs text-[#2C3E35] mt-1">
                Includes complimentary white-glove carpenter assembly
              </p>
            </div>
          </div>

          {/* Itemized Receipt */}
          <div className="mt-8 pt-6 border-t border-[#E5E0D8]">
            <h2 className="text-xs font-semibold text-[#66615B] mb-4">Order Receipt</h2>
            <div className="divide-y divide-[#F2EFE9]">
              {placedOrder.items.map((item) => (
                <div
                  key={`${item.productId}-${item.selectedColor}`}
                  className="py-3 flex items-center justify-between gap-4 text-sm"
                >
                  <div>
                    <p className="font-medium text-[#1C1B19]">
                      {item.productName}{' '}
                      <span className="font-mono-num text-xs text-[#66615B]">
                        × {item.quantity}
                      </span>
                    </p>
                    <p className="text-xs text-[#66615B]">
                      Finish: {item.selectedColor} · SKU {item.sku}
                    </p>
                  </div>
                  <p className="font-mono-num font-medium text-[#1C1B19]">
                    {formatInr(item.unitPrice * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-[#E5E0D8] space-y-1.5 text-sm">
              <div className="flex justify-between text-[#66615B]">
                <span>Subtotal</span>
                <span className="font-mono-num">{formatInr(placedOrder.subtotal)}</span>
              </div>
              {placedOrder.couponCode && placedOrder.discountAmount > 0 && (
                <div className="flex justify-between text-[#2C3E35]">
                  <span>Coupon ({placedOrder.couponCode})</span>
                  <span className="font-mono-num">
                    -{formatInr(placedOrder.discountAmount)}
                  </span>
                </div>
              )}
              <div className="flex justify-between font-semibold text-base text-[#1C1B19] pt-2 border-t border-[#F2EFE9]">
                <span>Total Amount</span>
                <span className="font-mono-num">{formatInr(placedOrder.total)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 pt-6 border-t border-[#E5E0D8] flex flex-wrap items-center gap-3">
            <a
              href={waConfirmation.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-white bg-[#2C3E35] hover:bg-[#1F2D26] rounded-lg transition-colors whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              <span>Send Order on WhatsApp</span>
            </a>

            <a
              href="/admin.html"
              className="inline-flex items-center gap-1.5 px-5 py-3 text-sm font-medium text-[#1C1B19] border border-[#E5E0D8] bg-[#FAF9F6] hover:bg-[#F2EFE9] rounded-lg transition-colors whitespace-nowrap"
            >
              <span>View Order in Admin Demo</span>
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>

            <button
              type="button"
              onClick={onContinueShopping}
              className="px-5 py-3 text-sm font-medium text-[#66615B] hover:text-[#1C1B19] transition-colors cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Empty Cart Guard
  if (totals.lineItems.length === 0) {
    return (
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 text-center">
        <div className="bg-white border border-[#E5E0D8] rounded-2xl p-10">
          <h1 className="font-display text-2xl font-semibold text-[#1C1B19]">
            Your cart is currently empty
          </h1>
          <p className="mt-2 text-sm text-[#66615B]">
            Add furniture pieces from our catalog before proceeding to checkout.
          </p>
          <button
            type="button"
            onClick={onContinueShopping}
            className="mt-6 px-6 py-3 text-sm font-medium text-white bg-[#2C3E35] hover:bg-[#1F2D26] rounded-lg transition-colors cursor-pointer"
          >
            Browse Furniture Catalog
          </button>
        </div>
      </section>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateCheckoutForm(formValues);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    onPlaceDemoOrder(formValues);
  };

  const handleApplyCouponClick = () => {
    const res = validateCouponCode(couponInput);
    if (!res.valid || !res.normalizedCode) {
      setCouponMsg(res.message);
      return;
    }
    onApplyCoupon(res.normalizedCode);
    setCouponMsg(res.message);
  };

  const whatsappDirect = buildWhatsAppCartOrderUrl(totals, {
    name: formValues.customerName,
    phone: formValues.phone,
    address: formValues.address
      ? `${formValues.address}, ${formValues.cityPin}`
      : undefined,
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
      <button
        type="button"
        onClick={onContinueShopping}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#66615B] hover:text-[#1C1B19] mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
        <span>Return to Catalog</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Customer Delivery Form */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="lg:col-span-7 bg-white border border-[#E5E0D8] rounded-2xl p-6 sm:p-8 space-y-6"
        >
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#1C1B19]">
              Delivery & Order Details
            </h1>
            <p className="mt-1 text-sm text-[#66615B]">
              Zero-cost demo checkout — places a realistic order saved to your browser’s
              localStorage. Free delivery above{' '}
              <span className="font-mono-num">
                {formatInr(SHOP_CONFIG.freeDeliveryThresholdInr)}
              </span>
              .
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="checkout-name"
                className="block text-xs font-medium text-[#1C1B19] mb-1.5"
              >
                Full Name *
              </label>
              <input
                id="checkout-name"
                type="text"
                required
                value={formValues.customerName}
                onChange={(e) =>
                  setFormValues((prev) => ({ ...prev, customerName: e.target.value }))
                }
                placeholder="e.g. Vikramaditya Joshi"
                className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#E5E0D8] rounded-lg text-[#1C1B19] focus:outline-none focus:border-[#2C3E35]"
              />
              {errors.customerName && (
                <p className="mt-1 text-xs text-[#B43E32]">{errors.customerName}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="checkout-phone"
                className="block text-xs font-medium text-[#1C1B19] mb-1.5"
              >
                Mobile Number (WhatsApp) *
              </label>
              <input
                id="checkout-phone"
                type="tel"
                required
                value={formValues.phone}
                onChange={(e) =>
                  setFormValues((prev) => ({ ...prev, phone: e.target.value }))
                }
                placeholder="e.g. +91 98450 12345"
                className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#E5E0D8] rounded-lg text-[#1C1B19] focus:outline-none focus:border-[#2C3E35]"
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-[#B43E32]">{errors.phone}</p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="checkout-address"
              className="block text-xs font-medium text-[#1C1B19] mb-1.5"
            >
              Complete Street Address & Apartment / House No. *
            </label>
            <textarea
              id="checkout-address"
              rows={3}
              required
              value={formValues.address}
              onChange={(e) =>
                setFormValues((prev) => ({ ...prev, address: e.target.value }))
              }
              placeholder="House/Flat No., Building Name, Street, Landmark"
              className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#E5E0D8] rounded-lg text-[#1C1B19] focus:outline-none focus:border-[#2C3E35]"
            />
            {errors.address && (
              <p className="mt-1 text-xs text-[#B43E32]">{errors.address}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="checkout-citypin"
                className="block text-xs font-medium text-[#1C1B19] mb-1.5"
              >
                City & PIN Code *
              </label>
              <input
                id="checkout-citypin"
                type="text"
                required
                value={formValues.cityPin}
                onChange={(e) =>
                  setFormValues((prev) => ({ ...prev, cityPin: e.target.value }))
                }
                placeholder="e.g. Bengaluru - 560038"
                className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#E5E0D8] rounded-lg text-[#1C1B19] focus:outline-none focus:border-[#2C3E35]"
              />
              {errors.cityPin && (
                <p className="mt-1 text-xs text-[#B43E32]">{errors.cityPin}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="checkout-notes"
                className="block text-xs font-medium text-[#1C1B19] mb-1.5"
              >
                Floor / Lift Notes (Optional)
              </label>
              <input
                id="checkout-notes"
                type="text"
                value={formValues.notes}
                onChange={(e) =>
                  setFormValues((prev) => ({ ...prev, notes: e.target.value }))
                }
                placeholder="e.g. Service lift available"
                className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#E5E0D8] rounded-lg text-[#1C1B19] focus:outline-none focus:border-[#2C3E35]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#E5E0D8] flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              className="flex-1 py-3.5 px-6 text-sm font-medium text-white bg-[#2C3E35] hover:bg-[#1F2D26] rounded-lg transition-colors cursor-pointer"
            >
              Place Demo Order · {formatInr(totals.total)}
            </button>

            <a
              href={whatsappDirect.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 py-3.5 px-5 text-sm font-medium text-[#1C1B19] bg-[#F2EFE9] hover:bg-[#E5E0D8] rounded-lg transition-colors whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4 text-[#2C3E35]" aria-hidden="true" />
              <span>Order on WhatsApp</span>
            </a>
          </div>
        </form>

        {/* Right Sticky Order Summary */}
        <aside className="lg:col-span-5 bg-white border border-[#E5E0D8] rounded-2xl p-6 sm:p-8 lg:sticky lg:top-24 space-y-5">
          <h2 className="font-display text-xl font-semibold text-[#1C1B19]">
            Order Summary ({totals.totalQuantity})
          </h2>

          <div className="divide-y divide-[#F2EFE9]">
            {totals.lineItems.map((item) => (
              <div
                key={`${item.productId}-${item.selectedColor}`}
                className="py-3 flex justify-between gap-3 text-sm"
              >
                <div>
                  <p className="font-medium text-[#1C1B19]">
                    {item.productName}{' '}
                    <span className="font-mono-num text-xs text-[#66615B]">
                      × {item.quantity}
                    </span>
                  </p>
                  <p className="text-xs text-[#66615B]">Finish: {item.selectedColor}</p>
                </div>
                <p className="font-mono-num font-medium text-[#1C1B19]">
                  {formatInr(item.unitPrice * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          {/* Coupon Code Box */}
          <div className="pt-4 border-t border-[#E5E0D8] space-y-2">
            <label
              htmlFor="checkout-coupon"
              className="block text-xs font-medium text-[#66615B]"
            >
              Coupon Code (Use <span className="font-mono-num text-[#1C1B19]">DEMO10</span> for
              10% off)
            </label>
            <div className="flex gap-2">
              <input
                id="checkout-coupon"
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder="DEMO10"
                className="flex-1 px-3 py-2 text-xs font-mono-num uppercase bg-[#FAF9F6] border border-[#E5E0D8] rounded-lg"
              />
              {totals.appliedCoupon ? (
                <button
                  type="button"
                  onClick={() => {
                    onApplyCoupon('');
                    setCouponInput('');
                    setCouponMsg('');
                  }}
                  className="px-3.5 py-2 text-xs font-medium text-[#B43E32] border border-[#E5E0D8] rounded-lg cursor-pointer"
                >
                  Remove
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleApplyCouponClick}
                  className="px-4 py-2 text-xs font-medium bg-[#F2EFE9] hover:bg-[#E5E0D8] text-[#1C1B19] rounded-lg cursor-pointer"
                >
                  Apply
                </button>
              )}
            </div>
            {couponMsg && <p className="text-xs text-[#2C3E35]">{couponMsg}</p>}
          </div>

          {/* Totals */}
          <div className="pt-4 border-t border-[#E5E0D8] space-y-2 text-sm">
            <div className="flex justify-between text-[#66615B]">
              <span>Subtotal</span>
              <span className="font-mono-num text-[#1C1B19]">
                {formatInr(totals.subtotal)}
              </span>
            </div>
            {totals.appliedCoupon && totals.discountAmount > 0 && (
              <div className="flex justify-between text-[#2C3E35] font-medium">
                <span>Discount ({totals.appliedCoupon})</span>
                <span className="font-mono-num">-{formatInr(totals.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-[#66615B]">
              <span>White-Glove Delivery</span>
              <span className="font-mono-num text-[#1C1B19]">
                {totals.deliveryFee === 0 ? 'FREE' : formatInr(totals.deliveryFee)}
              </span>
            </div>
            <div className="flex justify-between text-base font-semibold text-[#1C1B19] pt-3 border-t border-[#E5E0D8]">
              <span>Total Payable</span>
              <span className="font-mono-num text-lg">{formatInr(totals.total)}</span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};
