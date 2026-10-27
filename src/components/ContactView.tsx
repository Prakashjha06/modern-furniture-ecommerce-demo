import React from 'react';
import { Clock, MapPin, MessageCircle, Phone } from 'lucide-react';
import { SHOP_CONFIG } from '../config/shopConfig';

export const ContactView: React.FC = () => {
  const whatsappChatUrl = `https://wa.me/${SHOP_CONFIG.whatsappNumber}?text=${encodeURIComponent(
    `Hello ${SHOP_CONFIG.shopName}, I would like to plan a visit to your ${SHOP_CONFIG.showroom.city} showroom.`
  )}`;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
      <div className="pb-8 border-b border-[#E5E0D8]">
        <p className="text-xs text-[#66615B]">Experience Timber & Joinery in Person</p>
        <h1 className="mt-1 font-display text-3xl sm:text-4xl font-semibold text-[#1C1B19]">
          {SHOP_CONFIG.showroom.city} Experience Studio & Contact
        </h1>
        <p className="mt-2 text-sm text-[#66615B] max-w-2xl">
          Test sofa seat depths, inspect kiln-dried Nilambur teak grain samples, and browse
          over 40 upholstery weaves with our interior specialists.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Showroom Details, Store Hours & WhatsApp Click-to-Chat */}
        <div className="lg:col-span-5 bg-white border border-[#E5E0D8] rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-8">
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#66615B]">
                <MapPin className="w-4 h-4 text-[#2C3E35]" aria-hidden="true" />
                <span>Showroom Address</span>
              </div>
              <p className="mt-2 text-base font-medium text-[#1C1B19]">
                {SHOP_CONFIG.showroom.addressLine1}
              </p>
              <p className="text-sm text-[#66615B] mt-0.5">
                {SHOP_CONFIG.showroom.addressLine2}
              </p>
            </div>

            <div className="pt-6 border-t border-[#F2EFE9]">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#66615B]">
                <Clock className="w-4 h-4 text-[#2C3E35]" aria-hidden="true" />
                <span>Store Hours</span>
              </div>
              <dl className="mt-3 space-y-2.5 text-sm">
                {SHOP_CONFIG.showroom.hours.map((row) => (
                  <div key={row.days} className="flex justify-between gap-4">
                    <dt className="text-[#66615B]">{row.days}</dt>
                    <dd className="font-mono-num text-xs sm:text-sm font-medium text-[#1C1B19]">
                      {row.time}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="pt-6 border-t border-[#F2EFE9]">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#66615B]">
                <Phone className="w-4 h-4 text-[#2C3E35]" aria-hidden="true" />
                <span>Direct Studio Desk</span>
              </div>
              <p className="mt-2 font-mono-num text-base font-medium text-[#1C1B19]">
                {SHOP_CONFIG.displayPhone}
              </p>
              <p className="text-sm text-[#66615B] mt-0.5">{SHOP_CONFIG.email}</p>
            </div>
          </div>

          <div className="pt-6 border-t border-[#E5E0D8]">
            <a
              href={whatsappChatUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 text-sm font-medium text-white bg-[#2C3E35] hover:bg-[#1F2D26] rounded-lg transition-colors"
            >
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              <span>Chat on WhatsApp Now</span>
            </a>
            <p className="mt-2.5 text-center text-xs text-[#66615B]">
              Typical studio response time: under 15 minutes during store hours
            </p>
          </div>
        </div>

        {/* Embedded Free Google Maps Iframe */}
        <div className="lg:col-span-7 min-h-[380px] bg-[#EFECE6] border border-[#E5E0D8] rounded-2xl overflow-hidden">
          <iframe
            title={`${SHOP_CONFIG.shopName} ${SHOP_CONFIG.showroom.city} Showroom Location Map`}
            src={SHOP_CONFIG.showroom.mapEmbedUrl}
            className="w-full h-full min-h-[380px] border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
};
