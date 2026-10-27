import React, { useState } from 'react';
import { CheckCircle2, Mail, MessageCircle } from 'lucide-react';
import { SHOP_CONFIG } from '../config/shopConfig';
import { CustomQuoteInput, FurnitureCategory } from '../types/furniture';
import { buildCustomQuoteLinks } from '../utils/storeLogic';

export const CustomQuoteView: React.FC = () => {
  const [form, setForm] = useState<CustomQuoteInput>({
    customerName: '',
    phone: '',
    email: '',
    category: 'Wardrobes',
    dimensionsText: '',
    materialPreference: 'Solid Nilambur Teak — Natural Matte Finish',
    budgetInr: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generatedQuote, setGeneratedQuote] = useState<{
    whatsappUrl: string;
    mailtoUrl: string;
    summaryText: string;
  } | null>(null);

  const validate = (): boolean => {
    const nextErrors: Record<string, string> = {};
    if (form.customerName.trim().length < 2) {
      nextErrors.customerName = 'Please enter your name.';
    }
    if (form.phone.replace(/\D/g, '').length < 10) {
      nextErrors.phone = 'Please enter a valid 10-digit mobile number.';
    }
    if (form.dimensionsText.trim().length < 3) {
      nextErrors.dimensionsText = 'Please share approximate dimensions (e.g. 240 × 60 × 210 cm).';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handlePrepareQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setGeneratedQuote(buildCustomQuoteLinks(form));
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Editorial Explanation */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <p className="text-xs text-[#66615B]">Made-to-Measure Carpentry</p>
            <h1
              className="mt-1.5 font-display text-3xl sm:text-4xl font-semibold text-[#1C1B19]"
              style={{ textWrap: 'balance' } as React.CSSProperties}
            >
              Request a Custom Furniture Quote
            </h1>
            <p className="mt-3 text-sm text-[#66615B] leading-relaxed">
              Every Indian home has unique alcoves, ceiling beams, and Vastu layouts. Share
              your custom measurements and our master carpenters will reply with a timber
              estimate and 2D elevation drawing.
            </p>
          </div>

          <div className="bg-[#F2EFE9] border border-[#E5E0D8] rounded-2xl p-6 space-y-4">
            <h2 className="font-display text-lg font-semibold text-[#1C1B19]">
              How Bespoke Commissioning Works
            </h2>
            <ol className="space-y-3 text-sm text-[#66615B]">
              <li>
                <span className="font-semibold text-[#1C1B19]">01. Share Dimensions:</span>{' '}
                Submit your rough wall measurements, finish preference, and target budget.
              </li>
              <li>
                <span className="font-semibold text-[#1C1B19]">02. Instant Dispatch via WhatsApp or Email:</span>{' '}
                Zero backend required — your structured brief opens directly in WhatsApp or
                your email client.
              </li>
              <li>
                <span className="font-semibold text-[#1C1B19]">03. Swatch & CAD Sign-off:</span>{' '}
                Receive timber sample blocks by courier before workshop cutting begins.
              </li>
            </ol>
          </div>
        </div>

        {/* Right Custom Quote Form */}
        <div className="lg:col-span-7 bg-white border border-[#E5E0D8] rounded-2xl p-6 sm:p-8">
          <form onSubmit={handlePrepareQuote} noValidate className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="quote-name"
                  className="block text-xs font-medium text-[#1C1B19] mb-1.5"
                >
                  Your Name *
                </label>
                <input
                  id="quote-name"
                  type="text"
                  value={form.customerName}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, customerName: e.target.value }))
                  }
                  placeholder="e.g. Aditi Kulkarni"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#E5E0D8] rounded-lg"
                />
                {errors.customerName && (
                  <p className="mt-1 text-xs text-[#B43E32]">{errors.customerName}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="quote-phone"
                  className="block text-xs font-medium text-[#1C1B19] mb-1.5"
                >
                  WhatsApp / Phone Number *
                </label>
                <input
                  id="quote-phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="+91 98450 12345"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#E5E0D8] rounded-lg"
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-[#B43E32]">{errors.phone}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="quote-email"
                  className="block text-xs font-medium text-[#1C1B19] mb-1.5"
                >
                  Email Address (Optional)
                </label>
                <input
                  id="quote-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="aditi@example.com"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#E5E0D8] rounded-lg"
                />
              </div>

              <div>
                <label
                  htmlFor="quote-category"
                  className="block text-xs font-medium text-[#1C1B19] mb-1.5"
                >
                  Furniture Category
                </label>
                <select
                  id="quote-category"
                  value={form.category}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      category: e.target.value as FurnitureCategory,
                    }))
                  }
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#E5E0D8] rounded-lg"
                >
                  {SHOP_CONFIG.categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="quote-dimensions"
                  className="block text-xs font-medium text-[#1C1B19] mb-1.5"
                >
                  Required Dimensions (W × D × H) *
                </label>
                <input
                  id="quote-dimensions"
                  type="text"
                  value={form.dimensionsText}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, dimensionsText: e.target.value }))
                  }
                  placeholder="e.g. 8 ft wide × 2 ft deep × 7 ft tall"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#E5E0D8] rounded-lg"
                />
                {errors.dimensionsText && (
                  <p className="mt-1 text-xs text-[#B43E32]">{errors.dimensionsText}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="quote-budget"
                  className="block text-xs font-medium text-[#1C1B19] mb-1.5"
                >
                  Estimated Budget (INR)
                </label>
                <input
                  id="quote-budget"
                  type="text"
                  value={form.budgetInr}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, budgetInr: e.target.value }))
                  }
                  placeholder="e.g. ₹65,000 – ₹85,000"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#E5E0D8] rounded-lg"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="quote-material"
                className="block text-xs font-medium text-[#1C1B19] mb-1.5"
              >
                Preferred Wood / Upholstery
              </label>
              <input
                id="quote-material"
                type="text"
                value={form.materialPreference}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, materialPreference: e.target.value }))
                }
                className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#E5E0D8] rounded-lg"
              />
            </div>

            <div>
              <label
                htmlFor="quote-notes"
                className="block text-xs font-medium text-[#1C1B19] mb-1.5"
              >
                Additional Configuration Notes
              </label>
              <textarea
                id="quote-notes"
                rows={3}
                value={form.notes}
                onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
                placeholder="Internal drawers, sliding vs hinged doors, cane inserts, matching bedside tables..."
                className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#E5E0D8] rounded-lg"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 text-sm font-medium text-white bg-[#2C3E35] hover:bg-[#1F2D26] rounded-lg transition-colors cursor-pointer"
            >
              Generate Custom Quote Inquiry
            </button>
          </form>

          {/* Ready-to-Send WhatsApp & Email Dispatch Panel */}
          {generatedQuote && (
            <div className="mt-6 pt-6 border-t border-[#E5E0D8] space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#2C3E35]">
                <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                <span>Custom Quote Brief Ready — Choose Your Free Channel:</span>
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href={generatedQuote.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-white bg-[#2C3E35] hover:bg-[#1F2D26] rounded-lg transition-colors"
                >
                  <MessageCircle className="w-4 h-4" aria-hidden="true" />
                  <span>Send Quote Request on WhatsApp</span>
                </a>

                <a
                  href={generatedQuote.mailtoUrl}
                  className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-[#1C1B19] bg-[#F2EFE9] hover:bg-[#E5E0D8] rounded-lg transition-colors"
                >
                  <Mail className="w-4 h-4" aria-hidden="true" />
                  <span>Send via Email App</span>
                </a>
              </div>

              <pre className="p-4 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8] text-xs font-mono-num text-[#1C1B19] whitespace-pre-wrap">
                {generatedQuote.summaryText}
              </pre>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
