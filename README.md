# 🛋️ Vihara Living — Modern Furniture E-commerce Demo

### A Modern, Responsive Furniture Shopping Experience

Vihara Living is a modern furniture e-commerce storefront demonstration built using **React, TypeScript, Vite, and Tailwind CSS**.

The project showcases an interactive online furniture shopping experience with product browsing, category filtering, product customization, wishlist management, shopping cart functionality, and a mini-admin dashboard.

Designed as a frontend demonstration, Vihara Living illustrates how furniture businesses can establish a modern digital storefront without requiring a complex backend infrastructure.

### 🌐 Live Demo

**[🚀 Explore the Live Website](https://regal-baklava-8413e4.netlify.app)**

**[💻 View Source Code](https://github.com/Prakashjha06/modern-furniture-ecommerce-demo)**

---

## 🛠️ Tech Stack

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)

**Core Technologies**

- **React:** Component-based user interface.
- **TypeScript:** Type-safe application development.
- **Vite:** Fast development server and optimized production builds.
- **Tailwind CSS:** Responsive styling and modern UI design.
- **Local Storage:** Browser-based persistence for demo functionality.
- **Netlify:** Static website deployment and hosting.

---

## ✨ Key Features

### 🏠 Modern Storefront

- Responsive homepage with furniture collections.
- Modern navigation and promotional sections.
- Featured products and category highlights.
- Clean, mobile-friendly interface.

### 🛍️ Product Catalog

- Furniture products organized into categories.
- Product filtering and sorting.
- Product information and pricing.
- Detailed product views.
- Multiple product images and furniture specifications.

### 🛒 Shopping Cart

- Add and remove products.
- Update item quantities.
- View cart totals.
- Apply demonstration discount codes.
- Interactive cart drawer.

### ❤️ Wishlist

- Save favorite furniture products.
- View shortlisted items.
- Manage wishlist selections.
- Browser-based wishlist persistence.

### 💳 Demo Checkout

- Interactive checkout experience.
- Order summary and price calculations.
- WhatsApp-based order inquiry workflow.
- Demonstration checkout without a live payment gateway.

### 🎨 Furniture Customization

- Furniture customization options.
- Custom furniture quotation requests.
- Customer requirement collection.
- WhatsApp and email inquiry workflows.

### 🛠️ Mini-Admin Dashboard

- Demonstration admin interface.
- Product catalog management.
- Product information updates.
- Demo order viewing.
- Browser-based data management.

**Note:** The mini-admin dashboard is intended for demonstration purposes and does not provide production-grade authentication or a centralized database.

---

## 📸 Project Screenshots

### Homepage

<img width="1917" height="1076" alt="image" src="https://github.com/user-attachments/assets/6e4a0a56-d904-46a6-bd41-e480250d2446" />


### Product Catalog

<img width="1917" height="1076" alt="image" src="https://github.com/user-attachments/assets/6d7c596e-14d5-4be0-bb77-974917a42a34" />


### Shopping Cart

<img width="1917" height="1077" alt="image" src="https://github.com/user-attachments/assets/f072c6d0-4f4f-4ba3-8d90-f6989da7e067" />


### Admin Dashboard

<img width="1917" height="1078" alt="image" src="https://github.com/user-attachments/assets/e7177519-5d70-423f-8220-76513be42119" />


---

## 🚀 Getting Started

Follow these instructions to run the project locally.

### Prerequisites

Ensure you have installed:

- Node.js
- npm
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Prakashjha06/modern-furniture-ecommerce-demo.git
```

### 2. Navigate to the Project Directory

```bash
cd modern-furniture-ecommerce-demo
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Development Server

```bash
npm run dev
```

Open the local URL displayed in your terminal.

### 5. Build for Production

```bash
npm run build
```

The production-ready files will be generated in the `dist` directory.

---

## 📁 Project Structure

```text
modern-furniture-ecommerce-demo/
│
├── public/
│   └── products.json
│
├── src/
│   ├── assets/
│   │   └── images/
│   │
│   ├── components/
│   │   ├── AdminApp.tsx
│   │   ├── CartDrawer.tsx
│   │   ├── CatalogView.tsx
│   │   ├── CheckoutView.tsx
│   │   ├── ContactView.tsx
│   │   ├── CustomQuoteView.tsx
│   │   ├── Footer.tsx
│   │   ├── HomeView.tsx
│   │   ├── Navbar.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductDetailView.tsx
│   │   └── WishlistView.tsx
│   │
│   ├── config/
│   │   └── shopConfig.ts
│   │
│   ├── data/
│   │   └── products.json
│   │
│   ├── types/
│   │   └── furniture.ts
│   │
│   ├── utils/
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── admin.html
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## ⚙️ Configuration

The storefront can be customized through:

```text
src/config/shopConfig.ts
```

This configuration supports changes to storefront branding and business information.

Furniture product information can be updated through:

```text
src/data/products.json
```

The project is structured to make adapting the demonstration for different furniture businesses easier.

---

## 🌍 Deployment

The project is deployed using **Netlify**.

### Live Website

**https://regal-baklava-8413e4.netlify.app**

### Build Configuration

| Setting | Value |
|---|---|
| Framework | Vite |
| Build Command | `npm run build` |
| Publish Directory | `dist` |
| Hosting | Netlify |

---

## 🎯 Project Purpose

The primary objective of Vihara Living is to demonstrate a modern furniture e-commerce experience.

The project focuses on:

- Building reusable React components.
- Developing responsive web interfaces.
- Implementing interactive shopping functionality.
- Managing frontend application state.
- Organizing TypeScript projects.
- Demonstrating an e-commerce workflow.
- Deploying frontend applications.

It also serves as a customizable storefront concept for furniture businesses exploring digital commerce.

---

## ⚠️ Demo Limitations

This project is a **frontend demonstration**, not a production-ready e-commerce platform.

The current demonstration does not include:

- A centralized production database.
- Real payment gateway integration.
- Production-grade admin authentication.
- Server-side order processing.
- Real-time inventory synchronization.
- Secure customer account management.

Some functionality relies on browser local storage.

A production implementation would require appropriate backend services, secure authentication, persistent storage, and payment processing.

---

## 🔮 Future Enhancements

Potential improvements include:

- Backend API integration.
- PostgreSQL or Firebase database.
- Secure user authentication.
- Razorpay or Stripe payment integration.
- Real-time inventory management.
- Customer accounts and order history.
- Advanced product search.
- Cloud-based admin dashboard.
- Automated order notifications.

---

## 👨‍💻 Developer

**Prakash Jha**

GitHub: [@Prakashjha06](https://github.com/Prakashjha06)

---

## ⭐ Support

If you find this project interesting, consider giving the repository a star!

**Built with React, TypeScript, Vite, and Tailwind CSS.**
