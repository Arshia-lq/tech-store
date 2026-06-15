# Adding Products & Categories

This guide explains, end to end, how the **catalog** works in Tech Store — how products
and categories are modeled, who is allowed to manage them, and the exact step‑by‑step
flow for adding them through the dashboard (or directly via the API).

> ✅ Everything here already exists in the codebase. The only thing you may need to
> set up once is an **admin account** (see [Section 1](#1-prerequisites--access-control)),
> because brand‑new sign‑ups are plain `user`s and cannot manage the catalog.

---

## 1. Prerequisites & access control

### The data relationship

A **Product** holds a **reference** to a **Category** (`category: ObjectId → Category`).
So the golden rule is:

> 🥚 **Create the category first, then the product.** The "Add Product" form's category
> dropdown is populated from existing categories — if there are none, you can't publish a
> product.

```
Category (parent: null)          ← top‑level, e.g. "Computers"
   └── Category (parent: ↑)      ← sub‑category, e.g. "Laptops"
            └── Product          ← product.category points here (ObjectId ref)
```

### Roles

New registrations default to `role: "user"` ([`models/User.ts`](../models/User.ts)).
Catalog management is gated by role in both the middleware and every API route:

| Action | Allowed roles | Enforced in |
|--------|--------------|-------------|
| Create / edit **category** | `admin`, `super-admin` | [`app/api/categories/route.ts`](../app/api/categories/route.ts) |
| Delete **category** | `admin`, `super-admin` | [`app/api/categories/route.ts`](../app/api/categories/route.ts) |
| Create / edit **product** | `manager`, `admin`, `super-admin` | [`app/api/products/route.ts`](../app/api/products/route.ts), [`app/api/products/[id]/route.ts`](../app/api/products/[id]/route.ts) |
| Delete **product** | `admin`, `super-admin` | [`app/api/products/[id]/route.ts`](../app/api/products/[id]/route.ts) |
| Change a user's role | `super-admin` only | [`app/api/admin/users/[id]/route.ts`](../app/api/admin/users/[id]/route.ts) |

The dashboard routes themselves are also protected in [`middleware.ts`](../middleware.ts);
a `user` who navigates to `/dashboard/products` is redirected back to `/dashboard`.

### Bootstrapping the first admin (one‑time)

Only a `super-admin` can promote others through the UI — so the very first admin must be
set directly in MongoDB. The local DB is the Docker `tech-store` database.

1. Register a normal account at **`/register`** and verify it.
2. Promote it with `mongosh`:

```bash
# replace <mongo-container> with your container name (docker ps)
docker exec -it <mongo-container> mongosh tech-store --eval \
  'db.users.updateOne({ email: "you@example.com" }, { $set: { role: "super-admin" } })'
```

3. Sign out and back in so the new role is baked into your session token.

After this, you can promote any other user from **`/dashboard/users`** without touching
the database again.

---

## 2. The big picture

```
   ┌──────────────────────────┐         ┌──────────────────────────┐
   │  /dashboard/categories    │         │  /dashboard/products/add  │
   │  (create / edit / delete) │         │  (create) ──────────────┐ │
   └────────────┬──────────────┘         └────────────┬────────────┘ │
                │ POST/PUT/DELETE                      │ POST          │
                ▼                                      ▼               │
   ┌──────────────────────────┐         ┌──────────────────────────┐  │
   │   /api/categories         │         │   /api/products           │  │
   │   (role‑checked)          │         │   (role‑checked)          │  │
   └────────────┬──────────────┘         └────────────┬────────────┘  │
                ▼                                      ▼               │
        ┌───────────────┐                     ┌───────────────┐        │
        │  Category      │◀───── ref ──────────│  Product      │        │
        │  collection    │   category: ObjId   │  collection   │        │
        └───────────────┘                     └───────────────┘        │
                                                                        │
   Images ── uploaded to ImgBB (NEXT_PUBLIC_IMGBB_API_KEY) ─────────────┘
            and stored as URLs on product.images[] / product.image
```

Key files:

| File | Responsibility |
|------|----------------|
| [`models/Category.ts`](../models/Category.ts) | Category schema (`name`, `slug`, `icon`, `parent`). |
| [`models/Product.ts`](../models/Product.ts) | Product schema (`name`, `price`, `category` ref, `images[]`, …). |
| [`app/dashboard/categories/page.tsx`](../app/dashboard/categories/page.tsx) | Category management UI (add/edit/delete + icon picker). |
| [`app/dashboard/products/page.tsx`](../app/dashboard/products/page.tsx) | Product inventory list + "Add Product" button. |
| [`app/dashboard/products/add/page.tsx`](../app/dashboard/products/add/page.tsx) | Add‑product form + ImgBB image upload. |
| [`app/dashboard/products/edit/[id]/page.tsx`](../app/dashboard/products/edit/[id]/page.tsx) | Edit an existing product. |
| [`app/api/categories/route.ts`](../app/api/categories/route.ts) | Category CRUD API (GET with product counts, POST, PUT, DELETE). |
| [`app/api/products/route.ts`](../app/api/products/route.ts) | Product list (GET, with filters/pagination) + create (POST). |
| [`app/api/products/[id]/route.ts`](../app/api/products/[id]/route.ts) | Single‑product GET / PATCH / DELETE. |
| [`app/api/seed/route.ts`](../app/api/seed/route.ts) | Inserts dummy products (dev only). |
| [`app/api/seed-categories/route.ts`](../app/api/seed-categories/route.ts) | Repairs legacy string categories → real Category refs. |

---

## 3. Adding a category (do this first)

### Schema — [`models/Category.ts`](../models/Category.ts)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `name` | String | ✅ | Display name, e.g. `"Laptops"`. |
| `slug` | String | ✅ (auto) | Auto‑generated from `name` on the server; must be unique. |
| `icon` | String | — | A **Lucide icon name** (e.g. `"Laptop"`) **or** an ImgBB image URL. Defaults to `"LayoutGrid"`. |
| `parent` | ObjectId → Category | — | `null` for a top‑level category; set it to nest a sub‑category. |

### Steps (UI)

1. Go to **`/dashboard/categories`**.
2. Fill in the **Name**.
3. Pick an **icon** — choose one from the built‑in Lucide set (`Smartphone`, `Laptop`,
   `Monitor`, `Cpu`, `Headphones`, …) or upload a custom image (it's sent to ImgBB and the
   returned URL is stored as the `icon`).
4. *(Optional)* Choose a **parent** to make this a sub‑category.
5. Submit. The page calls `POST /api/categories`, the server derives the `slug`, rejects
   duplicates, and the new category appears immediately (with a live product count).

> The same form is reused for **editing** (it switches to `PUT`) and there's a delete
> action with guards — see [Section 6](#6-editing--deleting).

---

## 4. Adding a product

### Schema — [`models/Product.ts`](../models/Product.ts)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `name` | String | ✅ | |
| `description` | String | ✅ | |
| `price` | Number | ✅ | Current selling price. |
| `regularPrice` | Number | — | Original / "was" price — used to show a discount. |
| `category` | ObjectId → Category | ✅ | Selected from the dropdown (must exist first). |
| `images` | String[] | — | Up to **5** ImgBB URLs. |
| `image` | String | — | Legacy single‑image field; auto‑set to `images[0]`. |
| `brand` | String | — | |
| `modelName` | String | — | |
| `warranty` | String | — | |
| `specifications` | String | — | Free‑text spec sheet. |
| `stock` | Number | — | Defaults to `10`. |
| `reviews`, `avgRating`, `numReviews` | — | Managed automatically by the reviews API; **leave empty** at creation. |

### Steps (UI)

1. Go to **`/dashboard/products`** and click **"Add Product"** (top‑right), or go straight
   to **`/dashboard/products/add`**.
2. Fill in name, description, price, (optional) regular price, brand, model, warranty,
   specifications, and stock.
3. Select a **category** from the dropdown (loaded from `/api/categories`).
4. **Upload at least one image** (required). Images are uploaded to **ImgBB** using
   `NEXT_PUBLIC_IMGBB_API_KEY` and stored as URLs — max **5** per product. The first image
   becomes the primary `image`.
5. Click **Publish Product**. The form posts to `POST /api/products`; numeric fields are
   coerced to numbers and you're redirected to the inventory list on success.

> ⚠️ **At least one image is mandatory** — the form blocks submission with
> *"Please upload at least one image"* otherwise.

---

## 5. Image hosting (ImgBB)

Both the product form and the category icon uploader send files to ImgBB:

- Env var: **`NEXT_PUBLIC_IMGBB_API_KEY`** (already populated in [`.env.example`](../.env.example)).
- The client `POST`s the file to `https://api.imgbb.com/1/upload?key=…` and stores the
  returned `data.url`.
- If the key is missing or still the placeholder, uploads fail with an explicit toast.

Because it's a **public** (`NEXT_PUBLIC_`) key, it's exposed to the browser by design —
that's how client‑side uploads work. Don't put secret keys behind this prefix.

---

## 6. Editing & deleting

### Products
- **Edit:** inventory list → product → edit → `/dashboard/products/edit/[id]`
  (`PATCH /api/products/[id]`, allowed for `manager` / `admin` / `super-admin`).
- **Delete:** product actions menu (`DELETE /api/products/[id]`, `admin` / `super-admin`
  only). A confirmation dialog (SweetAlert) appears first.

### Categories
- **Edit:** the category form switches to update mode and sends `PUT /api/categories`.
- **Delete:** `DELETE /api/categories?id=…`, with two guards — a category **cannot** be
  deleted if:
  1. any **product** still references it, or
  2. it is the **parent** of other categories.

  Re‑assign or remove those first.

---

## 7. API quick reference

```http
# Categories
GET    /api/categories                 # public; returns categories + productCount
GET    /api/categories?parentsOnly=true# only top‑level categories
POST   /api/categories                 # admin/super-admin   { name, icon?, parent? }
PUT    /api/categories                 # admin/super-admin   { id, name?, icon?, parent? }
DELETE /api/categories?id=<id>         # admin/super-admin

# Products
GET    /api/products                   # public; supports ?category= &search= &sort=
                                       #   &page= &limit= &minPrice= &maxPrice=
POST   /api/products                   # manager/admin/super-admin  { ...product }
GET    /api/products/<id>              # public; populates category
PATCH  /api/products/<id>              # manager/admin/super-admin
DELETE /api/products/<id>             # admin/super-admin
```

Example — create a category then a product with `curl` (you must send your auth cookie):

```bash
# 1) create category
curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -b "next-auth.session-token=<your-cookie>" \
  -d '{ "name": "Laptops", "icon": "Laptop" }'
# → { "_id": "665f...", "name": "Laptops", "slug": "laptops", ... }

# 2) create product using that category _id
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -b "next-auth.session-token=<your-cookie>" \
  -d '{
        "name": "MacBook Pro 14",
        "description": "M3 Pro, 18GB RAM",
        "price": 1999,
        "regularPrice": 2199,
        "category": "665f...",
        "images": ["https://i.ibb.co/xxxx/macbook.jpg"],
        "image": "https://i.ibb.co/xxxx/macbook.jpg",
        "stock": 12
      }'
```

> In practice you rarely call these by hand — the dashboard does it for you. The API
> reference is here for scripting, testing, and debugging.

---

## 8. Seeding & legacy‑data repair (dev only)

Two admin‑only helper endpoints exist for bootstrapping a dev environment:

| Endpoint | What it does |
|----------|--------------|
| `GET /api/seed` | Inserts a set of dummy products ([`app/api/seed/route.ts`](../app/api/seed/route.ts)). |
| `GET /api/seed-categories` | Scans products that still use **string** category names, creates real `Category` documents for them, and relinks each product's `category` to the proper `ObjectId` ([`app/api/seed-categories/route.ts`](../app/api/seed-categories/route.ts)). |

> ⚠️ The dummy products in `/api/seed` use **string** category names (e.g. `"Smartphones"`),
> which don't match the schema's `ObjectId` reference. Run `/api/seed-categories`
> afterwards to migrate them, **or** prefer the intended flow: create categories →
> add products through the dashboard. The seed routes are mainly for repairing legacy data.

---

## 9. Troubleshooting

| Symptom | Cause / fix |
|---------|-------------|
| Redirected to `/dashboard` when opening Products/Categories | Your account isn't `manager`/`admin`/`super-admin`. Promote it (Section 1). |
| `401 Unauthorized` from `/api/categories` POST | Categories require `admin`/`super-admin` (not `manager`). |
| Category dropdown is empty on the Add Product page | No categories exist yet — create one first. |
| *"ImageBB API key is missing"* toast | Set `NEXT_PUBLIC_IMGBB_API_KEY` in `.env` (and restart `pnpm dev`). |
| *"Category with this name already exists"* | Slugs are unique; pick a different name. |
| Can't delete a category | It still has products or sub‑categories — reassign/remove them first. |
| New role not taking effect | Sign out and back in; the role is stored in the session token at login. |
| Products show no image on the storefront | Older docs may only have the legacy `image` field — the products API backfills `images[]` from it on read. |
