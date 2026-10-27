import React from 'react';
import { HeartOff } from 'lucide-react';
import { Product } from '../types/furniture';
import { ProductCard } from './ProductCard';

interface WishlistViewProps {
  products: Product[];
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
  onSelectProduct: (productId: string) => void;
  onQuickAddToCart: (product: Product) => void;
  onBrowseCatalog: () => void;
}

export const WishlistView: React.FC<WishlistViewProps> = ({
  products,
  wishlistIds,
  onToggleWishlist,
  onSelectProduct,
  onQuickAddToCart,
  onBrowseCatalog,
}) => {
  const savedProducts = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
      <div className="pb-8 border-b border-[#E5E0D8]">
        <p className="text-xs text-[#66615B]">Saved Shortlist</p>
        <h1 className="mt-1 font-display text-3xl sm:text-4xl font-semibold text-[#1C1B19]">
          Your Furniture Wishlist ({savedProducts.length})
        </h1>
        <p className="mt-2 text-sm text-[#66615B]">
          Shortlisted pieces are stored locally in your browser so you can compare dimensions
          and finishes anytime.
        </p>
      </div>

      {savedProducts.length === 0 ? (
        <div className="mt-10 bg-white border border-[#E5E0D8] rounded-2xl p-12 text-center">
          <HeartOff
            className="w-8 h-8 text-[#66615B] mx-auto mb-3"
            aria-hidden="true"
          />
          <h2 className="font-display text-2xl font-semibold text-[#1C1B19]">
            No saved pieces yet
          </h2>
          <p className="mt-2 text-sm text-[#66615B] max-w-md mx-auto">
            Tap the heart icon on any sofa, bed, dining table, or wardrobe to save it to your
            personal room board.
          </p>
          <button
            type="button"
            onClick={onBrowseCatalog}
            className="mt-6 px-6 py-3 text-sm font-medium text-white bg-[#2C3E35] hover:bg-[#1F2D26] rounded-lg transition-colors cursor-pointer"
          >
            Explore Catalog
          </button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {savedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isWishlisted={true}
              onToggleWishlist={onToggleWishlist}
              onSelectProduct={onSelectProduct}
              onQuickAddToCart={onQuickAddToCart}
            />
          ))}
        </div>
      )}
    </section>
  );
};
