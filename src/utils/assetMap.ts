import heroLivingRoom from '../assets/images/hero_living_room_1792829925542.jpg';
import productSofaTeak from '../assets/images/product_sofa_teak_1792829925977.jpg';
import productBedOak from '../assets/images/product_bed_oak_1792829927202.jpg';
import productDiningSet from '../assets/images/product_dining_set_1792829928262.jpg';
import productLoungeChair from '../assets/images/product_lounge_chair_1792829930046.jpg';
import productWardrobeFluted from '../assets/images/product_wardrobe_fluted_1792829930516.jpg';
import productOfficeDesk from '../assets/images/product_office_desk_1792829930911.jpg';
import { FurnitureCategory } from '../types/furniture';

export const HERO_IMAGE_URL = heroLivingRoom;

const BUNDLED_ASSET_MAP: Record<string, string> = {
  '/src/assets/images/hero_living_room_1792829925542.jpg': heroLivingRoom,
  '/src/assets/images/product_sofa_teak_1792829925977.jpg': productSofaTeak,
  '/src/assets/images/product_bed_oak_1792829927202.jpg': productBedOak,
  '/src/assets/images/product_dining_set_1792829928262.jpg': productDiningSet,
  '/src/assets/images/product_lounge_chair_1792829930046.jpg': productLoungeChair,
  '/src/assets/images/product_wardrobe_fluted_1792829930516.jpg': productWardrobeFluted,
  '/src/assets/images/product_office_desk_1792829930911.jpg': productOfficeDesk,
};

export const CATEGORY_DEFAULT_IMAGES: Record<FurnitureCategory, string> = {
  Sofas: '/src/assets/images/product_sofa_teak_1792829925977.jpg',
  Beds: '/src/assets/images/product_bed_oak_1792829927202.jpg',
  Dining: '/src/assets/images/product_dining_set_1792829928262.jpg',
  Chairs: '/src/assets/images/product_lounge_chair_1792829930046.jpg',
  Wardrobes: '/src/assets/images/product_wardrobe_fluted_1792829930516.jpg',
  Office: '/src/assets/images/product_office_desk_1792829930911.jpg',
};

/**
 * Resolves bundled asset paths to Vite-hashed URLs in production builds,
 * while passing through custom external or data URLs entered in Admin Demo.
 */
export function resolveProductImage(rawUrl: string, fallbackCategory?: FurnitureCategory): string {
  if (!rawUrl || !rawUrl.trim()) {
    const fallbackKey = fallbackCategory ? CATEGORY_DEFAULT_IMAGES[fallbackCategory] : undefined;
    return fallbackKey ? BUNDLED_ASSET_MAP[fallbackKey] : productSofaTeak;
  }
  const trimmed = rawUrl.trim();
  if (BUNDLED_ASSET_MAP[trimmed]) {
    return BUNDLED_ASSET_MAP[trimmed];
  }
  return trimmed;
}
