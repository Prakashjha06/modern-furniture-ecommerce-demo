export type FurnitureCategory =
  | 'Sofas'
  | 'Beds'
  | 'Dining'
  | 'Chairs'
  | 'Wardrobes'
  | 'Office';

export interface ProductColorOption {
  name: string;
  hex: string;
}

export interface ProductDimensions {
  widthCm: number;
  depthCm: number;
  heightCm: number;
  label: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: FurnitureCategory;
  price: number;
  material: string;
  dimensions: ProductDimensions;
  colors: ProductColorOption[];
  image: string;
  cropStyle?: 'default' | 'zoom-left' | 'zoom-right' | 'zoom-center' | 'warm-studio';
  featured: boolean;
  inStock: boolean;
  leadTime: string;
  description: string;
}

export interface CartItem {
  productId: string;
  selectedColor: string;
  quantity: number;
}

export type OrderStatus = 'Confirmed' | 'In Workshop' | 'Ready for Dispatch' | 'Delivered';

export interface DemoOrderItem {
  productId: string;
  productName: string;
  sku: string;
  selectedColor: string;
  unitPrice: number;
  quantity: number;
}

export interface DemoOrder {
  id: string;
  createdAt: string;
  customerName: string;
  phone: string;
  address: string;
  cityPin: string;
  notes?: string;
  items: DemoOrderItem[];
  subtotal: number;
  couponCode?: string;
  discountAmount: number;
  total: number;
  status: OrderStatus;
}

export interface CustomQuoteInput {
  customerName: string;
  phone: string;
  email: string;
  category: FurnitureCategory;
  dimensionsText: string;
  materialPreference: string;
  budgetInr: string;
  notes: string;
}

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'name-asc';
export type PriceRangeKey = 'all' | 'under-25k' | '25k-55k' | 'above-55k';
