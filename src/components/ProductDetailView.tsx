import React, { useEffect, useState } from 'react';
import { ArrowLeft, Check, Heart, MessageCircle, Minus, Plus, ShoppingBag } from 'lucide-react';
import { SHOP_CONFIG } from '../config/shopConfig';
import { Product } from '../types/furniture';
import { formatInr } from '../utils/storeLogic';
import { ProductCard } from './ProductCard';
import { ProductMedia } from './ProductMedia';

interface ProductDetailViewProps {
  product: Product;
  allProducts: Product[];
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: Product, selectedColor: string, quantity: number) => void;
  onSelectProduct: (productId: string) => void;
  onBackToCatalog: () => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  allProducts,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onSelectProduct,
  onBackToCatalog,
}) => {
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors[0]?.name || 'Standard Finish'
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [galleryMode, setGalleryMode] = useState<'photo' | 'blueprint' | 'material'>('photo');
  const [addedFeedback, setAddedFeedback] = useState(false);

  useEffect(() => {
    setSelectedColor(product.colors[0]?.name || 'Standard Finish');
    setQuantity(1);
    setGalleryMode('photo');
    setAddedFeedback(false);
  }, [product.id, product.colors]);

  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id)
    .sort((a, b) => Number(b.category === product.category) - Number(a.category === product.category))
    .slice(0, 3);

  const handlePrimaryAdd = () => {
    onAddToCart(product, selectedColor, quantity);
    setAddedFeedback(true);
    window.setTimeout(() => setAddedFeedback(false), 1800);
  };

  const whatsappProductInquiryUrl = `https://wa.me/${SHOP_CONFIG.whatsappNumber}?text=${encodeURIComponent(
    `Hello ${SHOP_CONFIG.shopName}, I am interested in "${product.name}" (SKU: ${
      product.sku
    }, Finish: ${selectedColor}, Price: ${formatInr(
      product.price
    )}). Could you share delivery availability?`
  )}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#66615B] mb-6">
        <button
          type="button"
          onClick={onBackToCatalog}
          className="inline-flex items-center gap-1.5 text-[#1C1B19] font-medium hover:underline underline-offset-4 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Back to Catalog</span>
        </button>
        <span aria-hidden="true">/</span>
        <span>{product.category}</span>
        <span aria-hidden="true">/</span>
        <span className="truncate text-[#1C1B19]">{product.name}</span>
      </nav>

      {/* Contiguous Purchase Module (Sticky Gallery Left + Sticky Purchase Module Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        {/* Left Gallery Column */}
        <div className="lg:col-span-7 lg:sticky lg:top-24 space-y-4">
          <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden border border-[#E5E0D8] bg-[#EFECE6]">
            <ProductMedia
              product={product}
              mode={galleryMode}
              selectedColorName={selectedColor}
              className="w-full h-full"
            />
          </div>

          {/* 3-View Interactive Gallery Switcher */}
          <div
            className="grid grid-cols-3 gap-3"
            role="tablist"
            aria-label="Product gallery views"
          >
            <button
              type="button"
              role="tab"
              aria-selected={galleryMode === 'photo'}
              onClick={() => setGalleryMode('photo')}
              className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                galleryMode === 'photo'
                  ? 'border-[#2C3E35] bg-white'
                  : 'border-[#E5E0D8] bg-[#F2EFE9]/60 hover:bg-white'
              }`}
            >
              <p className="text-xs font-semibold text-[#1C1B19]">01. Studio View</p>
              <p className="text-[11px] text-[#66615B] mt-0.5 truncate">
                Full-frame product angle
              </p>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={galleryMode === 'blueprint'}
              onClick={() => setGalleryMode('blueprint')}
              className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                galleryMode === 'blueprint'
                  ? 'border-[#2C3E35] bg-white'
                  : 'border-[#E5E0D8] bg-[#F2EFE9]/60 hover:bg-white'
              }`}
            >
              <p className="text-xs font-semibold text-[#1C1B19]">02. Dimensions</p>
              <p className="text-[11px] text-[#66615B] font-mono-num mt-0.5 truncate">
                {product.dimensions.label}
              </p>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={galleryMode === 'material'}
              onClick={() => setGalleryMode('material')}
              className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                galleryMode === 'material'
                  ? 'border-[#2C3E35] bg-white'
                  : 'border-[#E5E0D8] bg-[#F2EFE9]/60 hover:bg-white'
              }`}
            >
              <p className="text-xs font-semibold text-[#1C1B19]">03. Finish & Care</p>
              <p className="text-[11px] text-[#66615B] mt-0.5 truncate">{selectedColor}</p>
            </button>
          </div>
        </div>

        {/* Right Purchase Column */}
        <div className="lg:col-span-5 bg-white border border-[#E5E0D8] rounded-2xl p-6 sm:p-8">
          {/* Unboxed Metadata */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#66615B]">
            <span>{product.category}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-num">SKU {product.sku}</span>
            <span aria-hidden="true">·</span>
            <span>{product.leadTime}</span>
          </div>

          <h1 className="mt-2 font-display text-2xl sm:text-3xl font-semibold text-[#1C1B19] leading-tight">
            {product.name}
          </h1>

          <div className="mt-4 flex items-baseline gap-3">
            <p className="font-mono-num text-2xl font-semibold text-[#1C1B19]">
              {formatInr(product.price)}
            </p>
            <span className="text-xs text-[#66615B]">Inclusive of all taxes (GST)</span>
          </div>

          <p className="mt-5 text-sm text-[#66615B] leading-relaxed">{product.description}</p>

          {/* Finish / Color Options */}
          <div className="mt-6 pt-6 border-t border-[#E5E0D8]">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-[#1C1B19]">Select Finish / Upholstery</span>
              <span className="text-[#66615B]">{selectedColor}</span>
            </div>

            <div
              className="mt-3 flex flex-wrap gap-2.5"
              role="radiogroup"
              aria-label="Select finish option"
            >
              {product.colors.map((color) => {
                const isSelected = selectedColor === color.name;
                return (
                  <button
                    key={color.name}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setSelectedColor(color.name)}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      isSelected
                        ? 'border-[#2C3E35] bg-[#2C3E35]/8 text-[#1C1B19]'
                        : 'border-[#E5E0D8] bg-white text-[#66615B] hover:text-[#1C1B19]'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/25 shrink-0"
                      style={{ backgroundColor: color.hex }}
                      aria-hidden="true"
                    />
                    <span>{color.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity & Primary Actions */}
          <div className="mt-6 pt-6 border-t border-[#E5E0D8] space-y-3">
            <div className="flex items-center gap-3">
              {/* Quantity Stepper */}
              <div
                className="inline-flex items-center border border-[#E5E0D8] rounded-lg bg-[#FAF9F6]"
                aria-label="Quantity selector"
              >
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="w-10 h-11 flex items-center justify-center text-[#1C1B19] hover:bg-[#E5E0D8]/50 rounded-l-lg cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center font-mono-num text-sm font-medium text-[#1C1B19]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                  className="w-10 h-11 flex items-center justify-center text-[#1C1B19] hover:bg-[#E5E0D8]/50 rounded-r-lg cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Primary Add to Cart Button */}
              <button
                type="button"
                onClick={handlePrimaryAdd}
                className="flex-1 inline-flex items-center justify-center gap-2 h-11 px-6 text-sm font-medium text-white bg-[#2C3E35] hover:bg-[#1F2D26] rounded-lg transition-colors whitespace-nowrap cursor-pointer"
              >
                {addedFeedback ? (
                  <>
                    <Check className="w-4 h-4" aria-hidden="true" />
                    <span>Added to Cart</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" aria-hidden="true" />
                    <span>Add to Cart · {formatInr(product.price * quantity)}</span>
                  </>
                )}
              </button>
            </div>

            {/* Wishlist + Direct WhatsApp Inquiry */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onToggleWishlist(product.id)}
                aria-pressed={isWishlisted}
                className="inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-medium text-[#1C1B19] border border-[#E5E0D8] rounded-lg hover:bg-[#F2EFE9] transition-colors whitespace-nowrap cursor-pointer"
              >
                <Heart
                  className={`w-4 h-4 ${
                    isWishlisted ? 'fill-[#B43E32] stroke-[#B43E32]' : 'stroke-[#1C1B19]'
                  }`}
                  aria-hidden="true"
                />
                <span>{isWishlisted ? 'Saved in Wishlist' : 'Save to Wishlist'}</span>
              </button>

              <a
                href={whatsappProductInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-medium text-[#2C3E35] border border-[#2C3E35]/30 bg-[#2C3E35]/5 rounded-lg hover:bg-[#2C3E35]/10 transition-colors whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                <span>Ask on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Specification Table */}
          <dl className="mt-6 pt-6 border-t border-[#E5E0D8] space-y-3 text-xs">
            <div className="flex justify-between gap-4">
              <dt className="text-[#66615B]">Dimensions (W × D × H)</dt>
              <dd className="font-mono-num text-[#1C1B19] font-medium text-right">
                {product.dimensions.label}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[#66615B]">Primary Material</dt>
              <dd className="text-[#1C1B19] font-medium text-right">{product.material}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[#66615B]">Assembly</dt>
              <dd className="text-[#1C1B19] font-medium text-right">
                Complimentary carpenter installation
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[#66615B]">Demo Offer</dt>
              <dd className="text-[#2C3E35] font-medium text-right">
                10% off with code DEMO10
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="mt-20 pt-12 border-t border-[#E5E0D8]">
          <h2 className="font-display text-2xl font-semibold text-[#1C1B19] mb-8">
            Complementary Pieces
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedProducts.map((rel) => (
              <ProductCard
                key={rel.id}
                product={rel}
                isWishlisted={false}
                onToggleWishlist={onToggleWishlist}
                onSelectProduct={onSelectProduct}
                onQuickAddToCart={(item) =>
                  onAddToCart(item, item.colors[0]?.name || 'Standard', 1)
                }
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
