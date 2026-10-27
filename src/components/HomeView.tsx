import React from 'react';
import { ArrowRight } from 'lucide-react';
import { SHOP_CONFIG } from '../config/shopConfig';
import { FurnitureCategory, Product } from '../types/furniture';
import { HERO_IMAGE_URL } from '../utils/assetMap';
import { CustomerRoute } from './Navbar';
import { ProductCard } from './ProductCard';

interface HomeViewProps {
  products: Product[];
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
  onSelectProduct: (productId: string) => void;
  onQuickAddToCart: (product: Product) => void;
  onSelectCategory: (category: FurnitureCategory) => void;
  onNavigate: (route: CustomerRoute) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  products,
  wishlistIds,
  onToggleWishlist,
  onSelectProduct,
  onQuickAddToCart,
  onSelectCategory,
  onNavigate,
}) => {
  const featuredProducts = products.filter((p) => p.featured).slice(0, 6);
  const displayFeatured =
    featuredProducts.length > 0 ? featuredProducts : products.slice(0, 6);

  const categoryCounts = SHOP_CONFIG.categories.map((cat) => ({
    category: cat,
    count: products.filter((p) => p.category === cat).length,
  }));

  return (
    <div className="space-y-20">
      {/* Section 1: Hero Split Showcase + 6-Category Tile Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Editorial Column */}
          <div className="lg:col-span-5 flex flex-col justify-center py-4 lg:py-8">
            <p className="text-xs font-medium text-[#66615B]">
              {SHOP_CONFIG.legalSubtitle}
            </p>
            <h1
              className="mt-3 font-display text-4xl sm:text-5xl font-semibold text-[#1C1B19] tracking-tight leading-[1.12]"
              style={{ textWrap: 'balance' } as React.CSSProperties}
            >
              Solid Nilambur Teak Crafted for Quiet Indian Homes
            </h1>
            <p className="mt-5 text-base text-[#66615B] leading-relaxed max-w-xl">
              Seasoned hardwood joinery, breathable handloomed linens, and made-to-order
              wardrobes delivered direct from our Bengaluru workshop with zero middlemen.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => onNavigate('shop')}
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-medium text-white bg-[#2C3E35] hover:bg-[#1F2D26] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Explore Collection</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('quote')}
                className="inline-flex items-center px-5 py-3.5 text-sm font-medium text-[#1C1B19] border border-[#E5E0D8] bg-white hover:bg-[#F2EFE9] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Request Custom Dimensions
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-[#E5E0D8] flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#66615B]">
              <span>10-Year Structural Warranty</span>
              <span aria-hidden="true">·</span>
              <span>Free Delivery Above ₹25,000</span>
              <span aria-hidden="true">·</span>
              <span>Direct WhatsApp Ordering</span>
            </div>
          </div>

          {/* Right 16:9 Architectural Showcase */}
          <div className="lg:col-span-7">
            <div className="relative h-full min-h-[300px] sm:min-h-[400px] rounded-2xl overflow-hidden border border-[#E5E0D8] bg-[#EFECE6]">
              <img
                src={HERO_IMAGE_URL}
                alt="Sunlit living room furnished with Vihara Living solid teak three-seater sofa, sculptural coffee table, and Vienna cane armchair"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent p-6 text-white">
                <p className="text-xs text-white/80">
                  Featured Room · Indiranagar Residence
                </p>
                <p className="text-sm sm:text-base font-medium mt-0.5">
                  Nilambur Teak 3-Seater & Chettinad Cane Lounge Chair
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width 6-Category Tile Strip */}
        <div className="mt-10 pt-8 border-t border-[#E5E0D8]">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="font-display text-lg font-semibold text-[#1C1B19]">
              Browse by Room & Category
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('shop')}
              className="text-xs font-medium text-[#2C3E35] hover:underline underline-offset-4 cursor-pointer"
            >
              View all {products.length} pieces
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {categoryCounts.map(({ category, count }) => (
              <button
                key={category}
                type="button"
                onClick={() => onSelectCategory(category)}
                className="group text-left p-4 rounded-xl bg-white border border-[#E5E0D8] hover:border-[#2C3E35] transition-colors cursor-pointer"
              >
                <p className="font-sans text-sm font-semibold text-[#1C1B19] group-hover:text-[#2C3E35] transition-colors">
                  {category}
                </p>
                <p className="mt-1 text-xs text-[#66615B] font-mono-num">
                  {count} {count === 1 ? 'design' : 'designs'}
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2: Featured Furniture Collection */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs text-[#66615B]">Signature Series</p>
            <h2 className="mt-1 font-display text-2xl sm:text-3xl font-semibold text-[#1C1B19]">
              Featured Workshop Pieces
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('shop')}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#2C3E35] hover:underline underline-offset-4 whitespace-nowrap cursor-pointer"
          >
            <span>Browse Full Catalog</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayFeatured.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isWishlisted={wishlistIds.includes(product.id)}
              onToggleWishlist={onToggleWishlist}
              onSelectProduct={onSelectProduct}
              onQuickAddToCart={onQuickAddToCart}
            />
          ))}
        </div>
      </section>

      {/* Section 3: Craftsmanship Standards & Attributable Client Testimonials */}
      <section className="bg-[#F2EFE9] border-y border-[#E5E0D8] py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Quantitative Proof Header */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end pb-12 border-b border-[#DED9CF]">
            <div className="lg:col-span-6">
              <p className="text-xs text-[#66615B]">Verified Timber & Client Outcomes</p>
              <h2
                className="mt-1.5 font-display text-2xl sm:text-3xl font-semibold text-[#1C1B19]"
                style={{ textWrap: 'balance' } as React.CSSProperties}
              >
                Engineered for Monsoon Resilience and Generational Use
              </h2>
            </div>

            <div className="lg:col-span-6 grid grid-cols-3 gap-4 sm:gap-6">
              <div>
                <p className="font-mono-num text-2xl sm:text-3xl font-semibold text-[#1C1B19]">
                  ≤ 12%
                </p>
                <p className="mt-1 text-xs text-[#66615B]">
                  Kiln-dried timber moisture content
                </p>
              </div>
              <div>
                <p className="font-mono-num text-2xl sm:text-3xl font-semibold text-[#1C1B19]">
                  14 Days
                </p>
                <p className="mt-1 text-xs text-[#66615B]">
                  Average studio dispatch across India
                </p>
              </div>
              <div>
                <p className="font-mono-num text-2xl sm:text-3xl font-semibold text-[#1C1B19]">
                  10 Years
                </p>
                <p className="mt-1 text-xs text-[#66615B]">
                  Structural joinery & termite warranty
                </p>
              </div>
            </div>
          </div>

          {/* 3 Attributable Testimonials */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {SHOP_CONFIG.testimonials.map((item) => (
              <blockquote
                key={item.id}
                className="flex flex-col justify-between bg-white border border-[#E5E0D8] rounded-xl p-6"
              >
                <p className="text-sm text-[#1C1B19] leading-relaxed">“{item.quote}”</p>
                <footer className="mt-6 pt-4 border-t border-[#F2EFE9]">
                  <p className="text-sm font-semibold text-[#1C1B19]">{item.author}</p>
                  <p className="text-xs text-[#66615B] mt-0.5">
                    {item.role} · {item.organization}
                  </p>
                  <p className="text-xs text-[#2C3E35] mt-1">Piece: {item.productRef}</p>
                </footer>
              </blockquote>
            ))}
          </div>

          {/* Bespoke Furniture Callout */}
          <div className="mt-12 pt-10 border-t border-[#DED9CF] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-xl font-semibold text-[#1C1B19]">
                Need an exact wall-to-wall wardrobe or 10-seater dining table?
              </h3>
              <p className="mt-1 text-sm text-[#66615B]">
                Share your floor plan measurements and receive a custom timber quote via
                WhatsApp or email.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('quote')}
              className="px-5 py-3 text-sm font-medium text-white bg-[#2C3E35] hover:bg-[#1F2D26] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Request a Custom Quote
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
