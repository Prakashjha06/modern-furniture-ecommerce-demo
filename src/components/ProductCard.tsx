import React from 'react';
import { Heart, Plus } from 'lucide-react';
import { Product } from '../types/furniture';
import { formatInr } from '../utils/storeLogic';
import { ProductMedia } from './ProductMedia';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onSelectProduct: (productId: string) => void;
  onQuickAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onSelectProduct,
  onQuickAddToCart,
}) => {
  return (
    <article className="group flex flex-col bg-white border border-[#E5E0D8] rounded-xl overflow-hidden transition-transform duration-150 ease-out hover:-translate-y-0.5">
      {/* 4:3 Uniform Studio Image Container */}
      <div className="relative aspect-[4/3] w-full bg-[#EFECE6]">
        <button
          type="button"
          onClick={() => onSelectProduct(product.id)}
          aria-label={`View details for ${product.name}`}
          className="block w-full h-full text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#2C3E35]"
        >
          <ProductMedia
            product={product}
            className="w-full h-full group-hover:scale-[1.02] transition-transform duration-200 ease-out"
          />
        </button>

        {/* Accessible Wishlist Toggle */}
        <button
          type="button"
          onClick={() => onToggleWishlist(product.id)}
          aria-label={
            isWishlisted
              ? `Remove ${product.name} from wishlist`
              : `Save ${product.name} to wishlist`
          }
          aria-pressed={isWishlisted}
          className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-xs border border-[#E5E0D8] flex items-center justify-center text-[#1C1B19] hover:bg-white transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2C3E35]"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted ? 'fill-[#B43E32] stroke-[#B43E32]' : 'stroke-[#1C1B19]'
            }`}
          />
        </button>
      </div>

      {/* Contiguous Card Content — Zero Pill Badges */}
      <div className="flex flex-col flex-1 p-5 justify-between gap-4">
        <div>
          {/* Clean Unboxed Metadata */}
          <div className="flex items-center gap-2 text-xs text-[#66615B]">
            <span>{product.category}</span>
            <span aria-hidden="true">·</span>
            <span>{product.dimensions.label}</span>
          </div>

          <h3 className="mt-1.5 font-sans text-base font-semibold text-[#1C1B19] leading-snug">
            <button
              type="button"
              onClick={() => onSelectProduct(product.id)}
              className="text-left hover:underline underline-offset-4 cursor-pointer"
            >
              {product.name}
            </button>
          </h3>

          <p className="mt-1 text-xs text-[#66615B] line-clamp-1">{product.material}</p>
        </div>

        {/* Aligned Price Baseline + Color Finishes + Quick Add */}
        <div className="pt-3 border-t border-[#F2EFE9] flex items-center justify-between gap-3">
          <div>
            <p className="font-mono-num text-[15px] font-medium text-[#1C1B19]">
              {formatInr(product.price)}
            </p>
            <div className="mt-1 flex items-center gap-1.5" aria-label="Available finishes">
              {product.colors.map((c) => (
                <span
                  key={c.name}
                  title={c.name}
                  className="w-3 h-3 rounded-full border border-black/20"
                  style={{ backgroundColor: c.hex }}
                />
              ))}
              <span className="text-[11px] text-[#66615B] ml-0.5">
                {product.colors.length} {product.colors.length === 1 ? 'finish' : 'finishes'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onQuickAddToCart(product)}
            aria-label={`Add ${product.name} to cart`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#1C1B19] bg-[#F2EFE9] hover:bg-[#2C3E35] hover:text-white rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </article>
  );
};
