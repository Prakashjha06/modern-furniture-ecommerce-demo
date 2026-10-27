# Vihara Living — Zero-Cost Furniture Storefront & Mini-Admin Demo

A zero-cost, 100% static furniture e-commerce showcase built with React, Vite, TypeScript, and Tailwind CSS. Designed specifically to demonstrate modern digital commerce to prospective furniture shop owners with **₹0 hosting, ₹0 database, and ₹0 payment gateway setup costs**.

---

## 1. Folder Structure

```text
/
├── index.html                    # Customer storefront entry point
├── admin.html                    # Standalone Mini-Admin Demo entry (/admin.html)
├── public/
│   └── products.json             # 12 sample furniture items (static JSON copy)
├── src/
│   ├── main.tsx                  # Customer app mount
│   ├── adminMain.tsx             # Admin app mount
│   ├── App.tsx                   # Storefront state & route controller
│   ├── index.css                 # Brand CSS variables, typography & reduced motion
│   ├── config/
│   │   └── shopConfig.ts         # 10-MINUTE REBRANDING CONFIG (name, colors, INR, WhatsApp)
│   ├── data/
│   │   └── products.json         # 12 furniture items across 6 categories
│   ├── types/
│   │   └── furniture.ts          # TypeScript interfaces
│   ├── utils/
│   │   ├── assetMap.ts           # Studio image asset resolver
│   │   ├── storage.ts            # Browser localStorage persistence layer
│   │   ├── storeLogic.ts         # Pure filter, sort, cart, DEMO10 & WhatsApp builders
│   │   └── storeLogic.test.ts    # Unit test suite (node:test)
│   └── components/
│       ├── Navbar.tsx            # 3-zone top bar + dismissible offer strip
│       ├── HomeView.tsx          # Hero banner, 6 category tiles, featured grid, testimonials
│       ├── CatalogView.tsx       # Live search, category/price/finish filters, sorting
│       ├── ProductCard.tsx       # Uniform 4:3 product card + wishlist toggle
│       ├── ProductDetailView.tsx # 3-view gallery (photo, SVG blueprint, finish) + related items
│       ├── ProductMedia.tsx      # Resilient media + scaled architectural dimension SVG
│       ├── CartDrawer.tsx        # Slide-over cart, DEMO10 coupon (10% off), WhatsApp order
│       ├── CheckoutView.tsx      # Delivery form + "Demo Order Placed" receipt screen
│       ├── WishlistView.tsx      # Saved shortlist grid
│       ├── CustomQuoteView.tsx   # Bespoke furniture quote builder (WhatsApp / mailto)
│       ├── ContactView.tsx       # Free Google Maps iframe, store hours, WhatsApp chat
│       ├── Footer.tsx            # Store links & Admin Demo shortcut
│       └── AdminApp.tsx          # Mini-Admin (demo / demo123) CRUD + Demo Orders viewer
├── package.json
└── vite.config.ts                # Multi-page static build (index.html + admin.html)
```

---

## 2. Rebrand for Any Client in 10 Minutes

1. Open `src/config/shopConfig.ts`.
2. Edit `shopName`, `whatsappNumber`, `displayPhone`, `email`, and `showroom` address/hours.
3. Adjust hex codes inside `SHOP_CONFIG.theme` (`bg`, `surface`, `accent`) — CSS variables update the entire UI automatically.
4. Edit `src/data/products.json` (or add/edit products live inside `/admin.html`).

---

## 3. Free Deployment Guide (₹0/month)

### Option A: Deploy Free on Netlify (Recommended — 2 Minutes)
1. Run `npm install && npm run build` locally — this generates a static `dist/` folder containing both `index.html` and `admin.html`.
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop) (free account, no credit card).
3. Drag and drop the `dist/` folder directly onto the browser window — your live HTTPS demo URL is ready in 15 seconds.
   *(Or connect your GitHub repo with Build Command: `npm run build` and Publish Directory: `dist`).*

### Option B: Deploy Free on GitHub Pages
1. Push this folder to a free GitHub repository.
2. In `vite.config.ts`, set `base: './'` if hosting under `https://<username>.github.io/<repo-name>/`.
3. Run `npm run build` and push the `dist/` folder to the `gh-pages` branch (`npx gh-pages -d dist`), or enable **Settings → Pages → GitHub Actions (Static HTML / Vite)**.

---

## 4. 5-Line Demo Script for Shop Owners

1. *"Here is how your showroom looks online on any phone—customers can browse all 6 categories, filter by INR budget, and inspect exact centimeter dimensions."*
2. *"Watch what happens when a buyer picks a finish, adds a sofa to their cart, and applies your festive code `DEMO10`—it calculates the 10% discount instantly."*
3. *"They don't even need a paid payment gateway to start: one tap on 'Order on WhatsApp' sends their full itemized cart and total straight to your store WhatsApp."*
4. *"For made-to-measure wardrobes or custom dining sizes, this 'Request a Quote' form sends you structured dimensions and budget inquiries ready to price."*
5. *"And in `/admin.html` (login `demo` / `demo123`), you can add new designs, update prices, and track customer orders—when you're ready to launch, we upgrade this to your permanent cloud database and UPI checkout."*

---

## 5. What the Full Paid Version Adds

- **Cloud Database & Multi-Device Sync** (PostgreSQL / Firestore so catalog edits & orders sync across all customer phones, not just one browser's `localStorage`).
- **Instant Online Payments** (Razorpay / Cashfree / Stripe integration for UPI, Credit/Debit Cards, NetBanking, and No-Cost EMI).
- **Secure Role-Based Admin Authentication** (Real encrypted staff logins, audit logs, and image file uploads to cloud CDN storage).
- **Live Inventory & Variant Stock Control** (Automatic stock deduction, low-stock alerts, pincode delivery serviceability & shipping rate calculation).
- **Automated GST Invoicing & WhatsApp Business API** (PDF GST tax receipts, automated order confirmation & dispatch tracking messages, and custom `.in` / `.com` domain SEO setup).
