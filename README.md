#  Tech-Store: High-Performance E-Commerce platform

[![Next.js](https://img.shields.io/badge/Next.js-16.2.0-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-blue?logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-47A248?logo=mongodb)](https://www.mongodb.com/)
[![Zustand](https://img.shields.io/badge/Zustand-5.0.14-433E38)](https://zustand.docs.pmnd.rs/)

**Tech-Store** is an ultra-professional, high-fidelity e-commerce platform designed for the modern corporate elite. It blends architectural precision with a minimalist aesthetic to provide a seamless, high-performance shopping experience for premium tech gadgets.

---

## Key Features & Functionalities

### 🎨 Premium UI/UX & Design Philosophy
- **Corporate Elite Aesthetic**: Architecturally precise, minimalist interfaces that convey trust and professional excellence.
- **Hierarchical Navigation**: Sophisticated, hover-based category systems for effortless exploration of complex catalogs.
- **Performance-First Layout**: Optimally dense product grids with primary accents designed for high-conversion corporate environments.
- **Fluid Animations**: Ultra-smooth transitions and interactive elements powered by **Framer Motion** and **Lenis Scroll**.
- **Dynamic Loading States**: Polished, skeleton-based loading components to ensure a seamless transition between pages.
- **Custom 404 Experience**: Dedicated, animated error page maintaining brand integrity even during edge cases.

### 🛍️ Core Shopping Experience
- **Parsed Product Specifications**: Intelligent data extraction and formatting for technical specification tables on product pages.
- **Hierarchical Category Systems**: Multi-layered category management for structured product organization.
- **Advanced Price Filtering**: Precision price range sliders and filtering logic for targeted product discovery.
- **Verified Review System**: Robust rating and review mechanism with user identity verification.
- **Persistent State Management**: Lightweight **Zustand** stores persist both cart and wishlist to `localStorage`, enabling a seamless "save for later" and checkout flow that survives page reloads (with SSR-safe hydration for the Next.js App Router).

### ⚙️ Global Site Customization
- **Dynamic Hero Section**: Administrators can update the badge, headline, description, and hero image directly from the dashboard.
- **Centralized Settings Catalog**: Manage site name, contact details, site logo, and global descriptions via the administrative suite.
- **Responsive Branding**: Real-time updates to brand colors and metadata reflected across the entire application.

### 💳 Integrated Payment Ecosystem
- **Stripe Integration**: Secure and seamless credit/debit card processing.
- **Manual Payment System (MFS)**: Support for local gateways (bKash, Nagad, Rocket) with a **Strict Transaction ID Verification** workflow.
- **Dynamic Payment UI**: Context-aware payment screens that adapt based on the selected gateway.

### 🛡️ Smart Access & Advanced Security
- **Role-Based Access Control (RBAC)**: Fine-grained permissions for **Super Admin**, **Admin**, and **Manager** roles.
- **Secure Authentication**: Protected routes and multi-layered user sessions powered by **NextAuth.js**.
- **Google Site Verification**: Fully integrated for search console ownership and indexing.
- **Database Maintenance Routine**: Automated tools for cleaning up technical ID garbage and restoring relational integrity.

### 📈 SEO & Performance Optimization
- **Dynamic Sitemaps**: Automated `sitemap.xml` generation for optimal search engine crawling.
- **Robots.txt Management**: Standardized crawler instructions for better indexing control.
- **JSON-LD Structured Data**: High-fidelity schema markup for Products and Organizations to enhance Rich Snippets.
- **Next.js 16 Optimization**: Utilizing React Server Components and SSR for lightning-fast interactions and SEO dominance.

### 🛠️ Maintenance & Data Integrity
- **Legacy Category Cleanup**: Automated identification and removal of orphaned or "technical ID-based" categories to maintain a clean storefront catalog.
- **Relational Data Healing**: Intelligent migration scripts to link legacy product labels to official database references, ensuring normalized data integrity.
- **Human-Centric Documentation**: Refactored codebase to replace assistant-style placeholders with professional, human-readable documentation.


---

## Future Roadmap

We are constantly evolving the platform. Here are the features currently in development:

- [x] **Payment Gateway Integration**: Seamless checkout with Stripe and local MFS (bKash/Nagad/Rocket).
- [x] **SEO Optimization**: Complete sitemap, robots.txt, and JSON-LD integration.
- [x] **Dynamic Hero Management**: Full administrator control over homepage visuals.
- [ ] **AI-Powered Recommendations**: Personalized product suggestions based on user browsing history and preferences.
- [ ] **Real-time Order Tracking**: Interactive dashboard for users to track their order status in real-time.
- [ ] **Multi-language Support**: Deep localization supporting both **English** and **Bengali (BN)**.
- [ ] **Advanced Analytics Dashboard**: Enhanced sales visualization and business intelligence for administrators.
- [ ] **Progressive Web App (PWA)**: Enabling offline access and home screen installation for mobile users.

---

## 💻 Tech Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | Next.js 16.2.0 (App Router) |
| **Language** | TypeScript |
| **Frontend** | React 19.2.4, Tailwind CSS 4.0 |
| **State Management** | Zustand 5.0.14 (persist middleware) |
| **Database** | MongoDB with Mongoose 9.3.1 |
| **Payments** | Stripe 22.0.0, Manual Payment (MFS) |
| **Animations** | Framer Motion, Lenis Scroll |
| **SEO** | Next-Sitemap, JSON-LD |
| **Validation** | Zod, React Hook Form |
| **Authentication** | NextAuth.js |

---

## 🌐 API Endpoints

### **Authentication**
- `POST /api/auth/register` - Create a new user account.
- `POST /api/auth/login` - Authenticate users with credentials (handled via NextAuth).

### **User Profile**
- `PUT /api/user/profile` - Update user profile information (name, image, password). (Requires authentication).

### **Products**
- `GET /api/products` - Fetch a paginated list of products. Supports `category`, `search`, `page`, and `limit` query parameters.
- `POST /api/products` - Create a new product. (Restricted to **Admin/Manager**).
- `GET /api/products/{id}` - Retrieve detailed information for a specific product.
- `PATCH /api/products/{id}` - Update existing product details. (Restricted to **Admin/Manager**).
- `DELETE /api/products/{id}` - Permanently remove a product. (Restricted to **Super Admin/Admin**).

### **Reviews**
- `POST /api/products/{id}/reviews` - Submit a customer review (rating and comment) for a specific product. (Requires authentication).

### **Orders**
- `GET /api/orders` - List all orders (Admin/Manager) or specific orders for the authenticated user.
- `POST /api/orders` - Create a new order (Supports guest and authenticated checkouts).
- `GET /api/orders/{id}` - Fetch detailed information for a specific order.
- `PATCH /api/orders/{id}` - Update order status or transaction details. (Admin restricted for status changes).

### **Categories & Settings**
- `GET /api/categories` - Fetch a unique list of all product categories.
- `GET /api/settings` - Retrieve global application settings (e.g., Contact info, MFS numbers, Hero configurations).

### **Maintenance & Setup**
- `GET /api/seed` - Initialize the database with primary dummy products (Development only).
- `GET /api/seed-categories` - Restore database integrity, clean up technical ID categories, and sync product labels.

### **Payment Gateways**
- `POST /api/payment/create-intent` - Generate a Stripe Payment Intent for secure card transactions.
- `POST /api/webhook/stripe` - Handle asynchronous payment events from Stripe.

---

##  Getting Started

### Prerequisites

- **Node.js** (Latest LTS version)
- **A package manager** — [pnpm](https://pnpm.io/) (recommended) or npm
- **MongoDB** — via [Docker](https://www.docker.com/) (easiest), a local install, or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

### Installation

1. **Install dependencies:**
   ```bash
   pnpm install     # or: npm install
   ```

2. **Start MongoDB:**

   **Option A — Docker (recommended, no signup, works offline):**
   ```bash
   docker run -d --name tech-store-mongo --restart unless-stopped \
     -p 27017:27017 -v tech-store-mongo-data:/data/db mongo:7
   ```

   Your connection string is `mongodb://localhost:27017/tech-store`.
   Later, start/stop it with `docker start tech-store-mongo` / `docker stop tech-store-mongo`.

   **Option B — MongoDB Atlas (cloud):**
   Create a free M0 cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas), then
   **Connect → Drivers** and copy the `mongodb+srv://...` connection string.

3. **Environment Setup:**
   Create a `.env` file in the root directory. Only the **Database & Auth** block is
   required to boot the app — the Stripe and ImgBB keys are optional and only needed
   when you work on payments or image uploads.
   ```env
   # Database & Auth (REQUIRED)
   MONGODB_URI=mongodb://localhost:27017/tech-store
   NEXTAUTH_SECRET=your_secret_key
   NEXTAUTH_URL=http://localhost:3000

   # Payment Gateway (Stripe) — optional, leave blank until needed
   STRIPE_SECRET_KEY=
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
   STRIPE_WEBHOOK_SECRET=

   # Image Hosting (ImgBB) — optional, leave blank until needed
   NEXT_PUBLIC_IMGBB_API_KEY=
   ```

   Generate a secure `NEXTAUTH_SECRET` with:
   ```bash
   openssl rand -base64 32
   ```

4. **Run the development server:**
   ```bash
   pnpm dev     # or: npm run dev
   ```

5. **Visit the app:**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

6. **(Optional) Seed sample data:**
   With the server running, load demo products and categories by visiting:
   - [http://localhost:3000/api/seed](http://localhost:3000/api/seed) — dummy products
   - [http://localhost:3000/api/seed-categories](http://localhost:3000/api/seed-categories) — categories

> **Tip:** The app should be reachable at `http://localhost:3000`. You can confirm the
> database connection is healthy by opening `http://localhost:3000/api/products` —
> it returns `200` once MongoDB is reachable.

