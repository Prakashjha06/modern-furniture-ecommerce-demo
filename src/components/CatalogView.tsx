import React from 'react';
import { RotateCcw, Search, X } from 'lucide-react';
import { SHOP_CONFIG } from '../config/shopConfig';
import {
  FurnitureCategory,
  PriceRangeKey,
  Product,
  SortOption,
} from '../types/furniture';
import {
  CatalogFilterCriteria,
  filterAndSortProducts,
  getUniqueCatalogColors,
} from '../utils/storeLogic';
import { ProductCard } from './ProductCard';

interface CatalogViewProps {
  products: Product[];
  criteria: CatalogFilterCriteria;
  onChangeCriteria: (next: Partial<CatalogFilterCriteria>) => void;
  onResetFilters: () => void;
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
  onSelectProduct: (productId: string) => void;
  onQuickAddToCart: (product: Product) => void;
}

const PRICE_RANGES: Array<{ key: PriceRangeKey; label: string }> = [
  { key: 'all', label: 'All Prices' },
  { key: 'under-25k', label: 'Under ₹25,000' },
  { key: '25k-55k', label: '₹25,000 – ₹55,000' },
  { key: 'above-55k', label: 'Above ₹55,000' },
];

export const CatalogView: React.FC<CatalogViewProps> = ({
  products,
  criteria,
  onChangeCriteria,
  onResetFilters,
  wishlistIds,
  onToggleWishlist,
  onSelectProduct,
  onQuickAddToCart,
}) => {
  const filteredProducts = filterAndSortProducts(products, criteria);
  const availableColors = getUniqueCatalogColors(products);

  const hasActiveFilters =
    criteria.searchQuery.trim() !== '' ||
    criteria.category !== 'All' ||
    criteria.priceRange !== 'all' ||
    criteria.colorName !== 'All';

  const categoriesWithAll: Array<FurnitureCategory | 'All'> = [
    'All',
    ...SHOP_CONFIG.categories,
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
      {/* Header & Search / Sort Row */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[#E5E0D8]">
        <div>
          <p className="text-xs text-[#66615B]">Complete Collection</p>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl font-semibold text-[#1C1B19]">
            {criteria.category === 'All'
              ? 'All Handcrafted Furniture'
              : `${criteria.category} Collection`}
          </h1>
          <p className="mt-2 text-sm text-[#66615B]">
            Showing <span className="font-mono-num font-medium text-[#1C1B19]">{filteredProducts.length}</span> of{' '}
            <span className="font-mono-num">{products.length}</span> designs
          </p>
        </div>

        {/* Live Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-4">
          <div className="w-full sm:w-72">
            <label
              htmlFor="catalog-search"
              className="block text-xs font-medium text-[#66615B] mb-1.5"
            >
              Search furniture
            </label>
            <div className="relative">
              <Search
                className="w-4 h-4 text-[#66615B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="catalog-search"
                type="search"
                value={criteria.searchQuery}
                onChange={(e) => onChangeCriteria({ searchQuery: e.target.value })}
                placeholder="Teak sofa, cane chair, desk..."
                className="w-full pl-10 pr-9 py-2.5 text-sm bg-white border border-[#E5E0D8] rounded-lg text-[#1C1B19] placeholder:text-[#9A948C] focus:outline-none focus:border-[#2C3E35]"
              />
              {criteria.searchQuery && (
                <button
                  type="button"
                  onClick={() => onChangeCriteria({ searchQuery: '' })}
                  aria-label="Clear search query"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#66615B] hover:text-[#1C1B19] cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="w-full sm:w-48">
            <label
              htmlFor="catalog-sort"
              className="block text-xs font-medium text-[#66615B] mb-1.5"
            >
              Sort by
            </label>
            <select
              id="catalog-sort"
              value={criteria.sortBy}
              onChange={(e) => onChangeCriteria({ sortBy: e.target.value as SortOption })}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E5E0D8] rounded-lg text-[#1C1B19] focus:outline-none focus:border-[#2C3E35] cursor-pointer"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Interactive Filter Toolbar (Category + Price Range + Finish Color) */}
      <div className="py-6 border-b border-[#E5E0D8] space-y-5">
        {/* Category Segmented Buttons */}
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by category">
          <span className="text-xs font-medium text-[#66615B] mr-2">Category:</span>
          {categoriesWithAll.map((cat) => {
            const active = criteria.category === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onChangeCriteria({ category: cat })}
                aria-pressed={active}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-[#2C3E35] text-white'
                    : 'bg-[#F2EFE9] text-[#1C1B19] hover:bg-[#E5E0D8]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Price Range & Color Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by price range">
            <span className="text-xs font-medium text-[#66615B] mr-2">Price:</span>
            {PRICE_RANGES.map((range) => {
              const active = criteria.priceRange === range.key;
              return (
                <button
                  key={range.key}
                  type="button"
                  onClick={() => onChangeCriteria({ priceRange: range.key })}
                  aria-pressed={active}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-[#1C1B19] text-white'
                      : 'bg-white border border-[#E5E0D8] text-[#66615B] hover:text-[#1C1B19]'
                  }`}
                >
                  {range.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by finish color">
            <span className="text-xs font-medium text-[#66615B] mr-1">Finish:</span>
            <button
              type="button"
              onClick={() => onChangeCriteria({ colorName: 'All' })}
              aria-pressed={criteria.colorName === 'All'}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                criteria.colorName === 'All'
                  ? 'bg-[#1C1B19] text-white'
                  : 'bg-white border border-[#E5E0D8] text-[#66615B] hover:text-[#1C1B19]'
              }`}
            >
              All Finishes
            </button>
            {availableColors.slice(0, 6).map((color) => {
              const active = criteria.colorName === color.name;
              return (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => onChangeCriteria({ colorName: color.name })}
                  aria-pressed={active}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-[#1C1B19] text-white border-[#1C1B19]'
                      : 'bg-white border-[#E5E0D8] text-[#1C1B19] hover:bg-[#F2EFE9]'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-black/25 shrink-0"
                    style={{ backgroundColor: color.hex }}
                    aria-hidden="true"
                  />
                  <span>{color.name}</span>
                </button>
              );
            })}

            {hasActiveFilters && (
              <button
                type="button"
                onClick={onResetFilters}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#B43E32] hover:underline underline-offset-4 whitespace-nowrap shrink-0 cursor-pointer ml-1"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Grid or Empty State */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center bg-white border border-[#E5E0D8] rounded-xl mt-8 px-4">
          <h2 className="font-display text-2xl font-semibold text-[#1C1B19]">
            No pieces match your selected filters
          </h2>
          <p className="mt-2 text-sm text-[#66615B] max-w-md mx-auto">
            Try clearing your search term or expanding your price and finish filters to
            explore our full solid-wood catalog.
          </p>
          <button
            type="button"
            onClick={onResetFilters}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#2C3E35] hover:bg-[#1F2D26] rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            <span>Reset All Filters</span>
          </button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
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
      )}
    </section>
  );
};
