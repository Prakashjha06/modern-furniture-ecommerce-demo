import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Edit3,
  LogOut,
  Package,
  Plus,
  RotateCcw,
  ShoppingBag,
  Trash2,
  X,
} from 'lucide-react';
import { applyShopTheme, SHOP_CONFIG } from '../config/shopConfig';
import {
  DemoOrder,
  FurnitureCategory,
  OrderStatus,
  Product,
} from '../types/furniture';
import { CATEGORY_DEFAULT_IMAGES } from '../utils/assetMap';
import {
  loadAdminSession,
  loadOrdersFromStorage,
  loadProductsFromStorage,
  resetAllDemoStorage,
  saveAdminSession,
  saveOrdersToStorage,
  saveProductsToStorage,
} from '../utils/storage';
import { formatInr, verifyAdminCredentials } from '../utils/storeLogic';
import { ProductMedia } from './ProductMedia';

interface ProductFormState {
  id?: string;
  sku: string;
  name: string;
  category: FurnitureCategory;
  price: string;
  material: string;
  widthCm: string;
  depthCm: string;
  heightCm: string;
  colorsText: string; // e.g. "Natural Teak:#9B6B43, Ivory Linen:#EAE5DC"
  image: string;
  featured: boolean;
  leadTime: string;
  description: string;
}

const EMPTY_PRODUCT_FORM: ProductFormState = {
  sku: 'VH-NEW-701',
  name: '',
  category: 'Sofas',
  price: '42000',
  material: 'Solid Nilambur Teak & Woven Linen',
  widthCm: '180',
  depthCm: '85',
  heightCm: '78',
  colorsText: 'Natural Teak:#9B6B43, Oatmeal Linen:#DDD6C7',
  image: CATEGORY_DEFAULT_IMAGES.Sofas,
  featured: false,
  leadTime: 'Ships in 7–10 days',
  description: '',
};

function parseColorsText(raw: string): Array<{ name: string; hex: string }> {
  const parts = raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length === 0) {
    return [{ name: 'Natural Teak', hex: '#9B6B43' }];
  }
  return parts.map((entry) => {
    const [namePart, hexPart] = entry.split(':').map((s) => s.trim());
    return {
      name: namePart || 'Natural Finish',
      hex: hexPart && hexPart.startsWith('#') ? hexPart : '#9B6B43',
    };
  });
}

function serializeColors(colors: Array<{ name: string; hex: string }>): string {
  return colors.map((c) => `${c.name}:${c.hex}`).join(', ');
}

export const AdminApp: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() =>
    loadAdminSession()
  );
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [products, setProducts] = useState<Product[]>(() => loadProductsFromStorage());
  const [orders, setOrders] = useState<DemoOrder[]>(() => loadOrdersFromStorage());

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductFormState>(EMPTY_PRODUCT_FORM);
  const [formError, setFormError] = useState('');

  const [confirmReset, setConfirmReset] = useState(false);
  const [statusNotice, setStatusNotice] = useState('');

  useEffect(() => {
    applyShopTheme();
  }, []);

  const showNotice = (msg: string) => {
    setStatusNotice(msg);
    window.setTimeout(() => setStatusNotice(''), 3000);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyAdminCredentials(username, password)) {
      setIsAuthenticated(true);
      saveAdminSession(true);
      setLoginError('');
      setProducts(loadProductsFromStorage());
      setOrders(loadOrdersFromStorage());
    } else {
      setLoginError('Invalid credentials. Use demo / demo123 for this shop demo.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    saveAdminSession(false);
    setUsername('');
    setPassword('');
  };

  const openAddProductModal = () => {
    setEditingProductId(null);
    setForm({
      ...EMPTY_PRODUCT_FORM,
      sku: `VH-CU-${100 + products.length + 1}`,
      image: CATEGORY_DEFAULT_IMAGES.Sofas,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditProductModal = (product: Product) => {
    setEditingProductId(product.id);
    setForm({
      id: product.id,
      sku: product.sku,
      name: product.name,
      category: product.category,
      price: String(product.price),
      material: product.material,
      widthCm: String(product.dimensions.widthCm),
      depthCm: String(product.dimensions.depthCm),
      heightCm: String(product.dimensions.heightCm),
      colorsText: serializeColors(product.colors),
      image: product.image,
      featured: product.featured,
      leadTime: product.leadTime,
      description: product.description,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleDeleteProduct = (product: Product) => {
    const next = products.filter((p) => p.id !== product.id);
    setProducts(next);
    saveProductsToStorage(next);
    showNotice(`Deleted "${product.name}" from browser catalog.`);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const numericPrice = Number(form.price);
    const w = Number(form.widthCm) || 120;
    const d = Number(form.depthCm) || 60;
    const h = Number(form.heightCm) || 75;

    if (!form.name.trim()) {
      setFormError('Product name is required.');
      return;
    }
    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      setFormError('Enter a valid price in INR greater than 0.');
      return;
    }
    if (!form.material.trim()) {
      setFormError('Material description is required.');
      return;
    }

    const builtProduct: Product = {
      id: editingProductId || `prod-custom-${Date.now()}`,
      sku: form.sku.trim() || `VH-${Date.now().toString().slice(-4)}`,
      name: form.name.trim(),
      category: form.category,
      price: Math.round(numericPrice),
      material: form.material.trim(),
      dimensions: {
        widthCm: w,
        depthCm: d,
        heightCm: h,
        label: `${w} × ${d} × ${h} cm`,
      },
      colors: parseColorsText(form.colorsText),
      image: form.image.trim() || CATEGORY_DEFAULT_IMAGES[form.category],
      cropStyle: 'default',
      featured: form.featured,
      inStock: true,
      leadTime: form.leadTime.trim() || 'Ships in 7–10 days',
      description:
        form.description.trim() ||
        `Handcrafted ${form.category.toLowerCase()} piece built from ${form.material.trim()}.`,
    };

    const nextProducts = editingProductId
      ? products.map((p) => (p.id === editingProductId ? builtProduct : p))
      : [builtProduct, ...products];

    setProducts(nextProducts);
    saveProductsToStorage(nextProducts);
    setIsModalOpen(false);
    showNotice(
      editingProductId
        ? `Updated "${builtProduct.name}".`
        : `Added "${builtProduct.name}" to storefront catalog.`
    );
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    const nextOrders = orders.map((o) => (o.id === orderId ? { ...o, status } : o));
    setOrders(nextOrders);
    saveOrdersToStorage(nextOrders);
    showNotice(`Updated order #${orderId} to ${status}.`);
  };

  const handleResetDemoData = () => {
    const restored = resetAllDemoStorage();
    setProducts(restored.products);
    setOrders(restored.orders);
    setConfirmReset(false);
    showNotice('Reset catalog (12 items) and demo orders to factory defaults.');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#1C1B19]">
      {/* Required Demo Mode Persistent Banner */}
      <div className="bg-[#1C1B19] text-[#FAF9F6] px-4 py-2.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <p className="font-medium">Demo mode: data resets in this browser only</p>
          <div className="flex items-center gap-4">
            {confirmReset ? (
              <div className="flex items-center gap-2">
                <span className="text-[#EAE5DC]">Restore initial 12 products?</span>
                <button
                  type="button"
                  onClick={handleResetDemoData}
                  className="px-2.5 py-1 rounded bg-[#B43E32] text-white font-medium cursor-pointer"
                >
                  Confirm Reset
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="px-2 py-1 text-[#EAE5DC] hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="inline-flex items-center gap-1 text-[#EAE5DC] hover:text-white underline underline-offset-2 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" aria-hidden="true" />
                <span>Reset Demo Data</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Admin Top Header */}
      <header className="bg-white border-b border-[#E5E0D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#66615B] hover:text-[#1C1B19] transition-colors whitespace-nowrap"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Storefront</span>
            </a>
            <span className="text-[#E5E0D8]" aria-hidden="true">
              |
            </span>
            <span className="font-display text-lg font-semibold text-[#1C1B19] whitespace-nowrap">
              {SHOP_CONFIG.shopName} · Owner Admin
            </span>
          </div>

          {isAuthenticated && (
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#1C1B19] border border-[#E5E0D8] rounded-lg hover:bg-[#F2EFE9] cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {!isAuthenticated ? (
          /* Fake Login Gate (demo / demo123) */
          <div className="max-w-md mx-auto bg-white border border-[#E5E0D8] rounded-2xl p-8">
            <p className="text-xs text-[#66615B]">Mini Admin Demo</p>
            <h1 className="mt-1 font-display text-2xl font-semibold text-[#1C1B19]">
              Shop Owner Sign In
            </h1>
            <p className="mt-2 text-sm text-[#66615B]">
              Manage catalog items and inspect customer demo orders stored locally in this
              browser.
            </p>

            <div className="mt-4 p-3.5 rounded-xl bg-[#F2EFE9] border border-[#E5E0D8] flex items-center justify-between gap-2 text-xs">
              <div>
                <p className="font-medium text-[#1C1B19]">Demo Credentials</p>
                <p className="font-mono-num text-[#66615B] mt-0.5">
                  Username: <strong className="text-[#1C1B19]">demo</strong> · Password:{' '}
                  <strong className="text-[#1C1B19]">demo123</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setUsername('demo');
                  setPassword('demo123');
                  setLoginError('');
                }}
                className="px-3 py-1.5 text-xs font-medium bg-white border border-[#E5E0D8] rounded-lg hover:bg-[#FAF9F6] whitespace-nowrap cursor-pointer"
              >
                Autofill
              </button>
            </div>

            <form onSubmit={handleLoginSubmit} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="admin-username"
                  className="block text-xs font-medium text-[#1C1B19] mb-1.5"
                >
                  Username
                </label>
                <input
                  id="admin-username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="demo"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#E5E0D8] rounded-lg focus:outline-none focus:border-[#2C3E35]"
                />
              </div>

              <div>
                <label
                  htmlFor="admin-password"
                  className="block text-xs font-medium text-[#1C1B19] mb-1.5"
                >
                  Password
                </label>
                <input
                  id="admin-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="demo123"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#E5E0D8] rounded-lg focus:outline-none focus:border-[#2C3E35]"
                />
              </div>

              {loginError && <p className="text-xs text-[#B43E32]">{loginError}</p>}

              <button
                type="submit"
                className="w-full py-3 px-5 text-sm font-medium text-white bg-[#2C3E35] hover:bg-[#1F2D26] rounded-lg transition-colors cursor-pointer"
              >
                Sign In to Demo Admin
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="space-y-8">
            {statusNotice && (
              <div
                role="status"
                className="px-4 py-3 rounded-xl bg-[#2C3E35] text-white text-xs font-medium"
              >
                {statusNotice}
              </div>
            )}

            {/* Tabs & Primary Add CTA */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E0D8]">
              <div
                className="inline-flex items-center gap-1 p-1 bg-[#F2EFE9] rounded-xl w-fit"
                role="tablist"
                aria-label="Admin sections"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'products'}
                  onClick={() => setActiveTab('products')}
                  className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'products'
                      ? 'bg-white text-[#1C1B19] shadow-xs'
                      : 'text-[#66615B] hover:text-[#1C1B19]'
                  }`}
                >
                  <Package className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Products ({products.length})</span>
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'orders'}
                  onClick={() => {
                    setOrders(loadOrdersFromStorage());
                    setActiveTab('orders');
                  }}
                  className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'orders'
                      ? 'bg-white text-[#1C1B19] shadow-xs'
                      : 'text-[#66615B] hover:text-[#1C1B19]'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Demo Orders ({orders.length})</span>
                </button>
              </div>

              {activeTab === 'products' && (
                <button
                  type="button"
                  onClick={openAddProductModal}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-medium text-white bg-[#2C3E35] hover:bg-[#1F2D26] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Plus className="w-4 h-4" aria-hidden="true" />
                  <span>Add New Product</span>
                </button>
              )}
            </div>

            {activeTab === 'products' ? (
              /* Products CRUD Table */
              <div className="bg-white border border-[#E5E0D8] rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#E5E0D8] bg-[#FAF9F6] text-xs font-semibold text-[#66615B]">
                        <th className="py-3.5 px-4">Product</th>
                        <th className="py-3.5 px-4">Category</th>
                        <th className="py-3.5 px-4">Dimensions</th>
                        <th className="py-3.5 px-4 text-right">Price (INR)</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F2EFE9] text-sm">
                      {products.map((product) => (
                        <tr key={product.id} className="hover:bg-[#FAF9F6]/60">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3.5">
                              <div className="w-14 h-11 rounded-lg overflow-hidden border border-[#E5E0D8] shrink-0">
                                <ProductMedia product={product} className="w-full h-full" />
                              </div>
                              <div>
                                <p className="font-medium text-[#1C1B19]">{product.name}</p>
                                <p className="text-xs text-[#66615B]">
                                  <span className="font-mono-num">{product.sku}</span>
                                  {product.featured ? ' · Featured on Home' : ''}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-xs text-[#66615B]">
                            {product.category}
                          </td>
                          <td className="py-3.5 px-4 font-mono-num text-xs text-[#66615B]">
                            {product.dimensions.label}
                          </td>
                          <td className="py-3.5 px-4 font-mono-num font-medium text-[#1C1B19] text-right">
                            {formatInr(product.price)}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="inline-flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => openEditProductModal(product)}
                                aria-label={`Edit ${product.name}`}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-[#1C1B19] border border-[#E5E0D8] rounded-lg hover:bg-[#F2EFE9] cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
                                <span>Edit</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteProduct(product)}
                                aria-label={`Delete ${product.name}`}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-[#B43E32] border border-[#E5E0D8] rounded-lg hover:bg-[#B43E32]/10 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                                <span>Delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* Demo Orders List */
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <div className="bg-white border border-[#E5E0D8] rounded-2xl p-12 text-center">
                    <p className="font-display text-xl font-semibold text-[#1C1B19]">
                      No demo orders recorded
                    </p>
                    <p className="mt-1 text-sm text-[#66615B]">
                      Place a test order from the customer checkout to see it appear here.
                    </p>
                  </div>
                ) : (
                  orders.map((order) => (
                    <article
                      key={order.id}
                      className="bg-white border border-[#E5E0D8] rounded-2xl p-6 space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F2EFE9]">
                        <div>
                          <div className="flex items-center gap-2 text-xs text-[#66615B]">
                            <span className="font-mono-num font-semibold text-[#1C1B19]">
                              #{order.id}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span>
                              {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                            {order.couponCode && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span className="text-[#2C3E35] font-medium">
                                  Coupon: {order.couponCode}
                                </span>
                              </>
                            )}
                          </div>
                          <h3 className="mt-1 text-base font-semibold text-[#1C1B19]">
                            {order.customerName} ·{' '}
                            <span className="font-mono-num text-sm font-normal text-[#66615B]">
                              {order.phone}
                            </span>
                          </h3>
                          <p className="text-xs text-[#66615B] mt-0.5">
                            {order.address}, {order.cityPin}
                          </p>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-xs text-[#66615B]">Order Total</p>
                            <p className="font-mono-num text-base font-semibold text-[#1C1B19]">
                              {formatInr(order.total)}
                            </p>
                          </div>

                          <div>
                            <label
                              htmlFor={`status-${order.id}`}
                              className="sr-only"
                            >
                              Update status for order {order.id}
                            </label>
                            <select
                              id={`status-${order.id}`}
                              value={order.status}
                              onChange={(e) =>
                                handleUpdateOrderStatus(
                                  order.id,
                                  e.target.value as OrderStatus
                                )
                              }
                              className="px-3 py-2 text-xs font-medium bg-[#FAF9F6] border border-[#E5E0D8] rounded-lg text-[#1C1B19] cursor-pointer"
                            >
                              <option value="Confirmed">Confirmed</option>
                              <option value="In Workshop">In Workshop</option>
                              <option value="Ready for Dispatch">Ready for Dispatch</option>
                              <option value="Delivered">Delivered</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        {order.items.map((item, idx) => (
                          <div
                            key={`${order.id}-${idx}`}
                            className="flex justify-between text-[#66615B]"
                          >
                            <span>
                              {item.productName} ({item.selectedColor}) × {item.quantity}
                            </span>
                            <span className="font-mono-num text-[#1C1B19]">
                              {formatInr(item.unitPrice * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </article>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label={editingProductId ? 'Edit Product' : 'Add New Product'}
        >
          <div className="bg-white border border-[#E5E0D8] rounded-2xl w-full max-w-xl p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E0D8]">
              <h2 className="font-display text-xl font-semibold text-[#1C1B19]">
                {editingProductId ? 'Edit Furniture Item' : 'Add New Furniture Item'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close product form"
                className="w-8 h-8 rounded-lg border border-[#E5E0D8] flex items-center justify-center hover:bg-[#F2EFE9] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="prod-name"
                    className="block text-xs font-medium text-[#1C1B19] mb-1"
                  >
                    Product Name *
                  </label>
                  <input
                    id="prod-name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. Hampi Solid Teak Daybed"
                    className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#E5E0D8] rounded-lg"
                  />
                </div>

                <div>
                  <label
                    htmlFor="prod-sku"
                    className="block text-xs font-medium text-[#1C1B19] mb-1"
                  >
                    SKU
                  </label>
                  <input
                    id="prod-sku"
                    type="text"
                    value={form.sku}
                    onChange={(e) => setForm((p) => ({ ...p, sku: e.target.value }))}
                    className="w-full px-3 py-2 text-sm font-mono-num bg-[#FAF9F6] border border-[#E5E0D8] rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="prod-category"
                    className="block text-xs font-medium text-[#1C1B19] mb-1"
                  >
                    Category
                  </label>
                  <select
                    id="prod-category"
                    value={form.category}
                    onChange={(e) => {
                      const nextCat = e.target.value as FurnitureCategory;
                      setForm((p) => ({
                        ...p,
                        category: nextCat,
                        image: editingProductId
                          ? p.image
                          : CATEGORY_DEFAULT_IMAGES[nextCat],
                      }));
                    }}
                    className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#E5E0D8] rounded-lg"
                  >
                    {SHOP_CONFIG.categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="prod-price"
                    className="block text-xs font-medium text-[#1C1B19] mb-1"
                  >
                    Price in INR (₹) *
                  </label>
                  <input
                    id="prod-price"
                    type="number"
                    min="100"
                    required
                    value={form.price}
                    onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                    className="w-full px-3 py-2 text-sm font-mono-num bg-[#FAF9F6] border border-[#E5E0D8] rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="prod-material"
                  className="block text-xs font-medium text-[#1C1B19] mb-1"
                >
                  Material & Construction *
                </label>
                <input
                  id="prod-material"
                  type="text"
                  required
                  value={form.material}
                  onChange={(e) => setForm((p) => ({ ...p, material: e.target.value }))}
                  className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#E5E0D8] rounded-lg"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label
                    htmlFor="prod-w"
                    className="block text-xs font-medium text-[#1C1B19] mb-1"
                  >
                    Width (cm)
                  </label>
                  <input
                    id="prod-w"
                    type="number"
                    value={form.widthCm}
                    onChange={(e) => setForm((p) => ({ ...p, widthCm: e.target.value }))}
                    className="w-full px-3 py-2 text-sm font-mono-num bg-[#FAF9F6] border border-[#E5E0D8] rounded-lg"
                  />
                </div>
                <div>
                  <label
                    htmlFor="prod-d"
                    className="block text-xs font-medium text-[#1C1B19] mb-1"
                  >
                    Depth (cm)
                  </label>
                  <input
                    id="prod-d"
                    type="number"
                    value={form.depthCm}
                    onChange={(e) => setForm((p) => ({ ...p, depthCm: e.target.value }))}
                    className="w-full px-3 py-2 text-sm font-mono-num bg-[#FAF9F6] border border-[#E5E0D8] rounded-lg"
                  />
                </div>
                <div>
                  <label
                    htmlFor="prod-h"
                    className="block text-xs font-medium text-[#1C1B19] mb-1"
                  >
                    Height (cm)
                  </label>
                  <input
                    id="prod-h"
                    type="number"
                    value={form.heightCm}
                    onChange={(e) => setForm((p) => ({ ...p, heightCm: e.target.value }))}
                    className="w-full px-3 py-2 text-sm font-mono-num bg-[#FAF9F6] border border-[#E5E0D8] rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="prod-colors"
                  className="block text-xs font-medium text-[#1C1B19] mb-1"
                >
                  Color Options (Format: Name:#HEX, comma-separated)
                </label>
                <input
                  id="prod-colors"
                  type="text"
                  value={form.colorsText}
                  onChange={(e) => setForm((p) => ({ ...p, colorsText: e.target.value }))}
                  className="w-full px-3 py-2 text-xs font-mono-num bg-[#FAF9F6] border border-[#E5E0D8] rounded-lg"
                />
              </div>

              <div>
                <label
                  htmlFor="prod-image"
                  className="block text-xs font-medium text-[#1C1B19] mb-1"
                >
                  Image Path or External URL
                </label>
                <input
                  id="prod-image"
                  type="text"
                  value={form.image}
                  onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))}
                  className="w-full px-3 py-2 text-xs font-mono-num bg-[#FAF9F6] border border-[#E5E0D8] rounded-lg"
                />
              </div>

              <div>
                <label
                  htmlFor="prod-desc"
                  className="block text-xs font-medium text-[#1C1B19] mb-1"
                >
                  Description
                </label>
                <textarea
                  id="prod-desc"
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#E5E0D8] rounded-lg"
                />
              </div>

              <label className="inline-flex items-center gap-2 text-xs font-medium text-[#1C1B19] cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))}
                  className="rounded border-[#E5E0D8]"
                />
                <span>Feature this product on the Homepage</span>
              </label>

              {formError && <p className="text-xs text-[#B43E32]">{formError}</p>}

              <div className="pt-4 border-t border-[#E5E0D8] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-medium text-[#66615B] hover:text-[#1C1B19] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs sm:text-sm font-medium text-white bg-[#2C3E35] hover:bg-[#1F2D26] rounded-lg cursor-pointer"
                >
                  {editingProductId ? 'Save Changes' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
