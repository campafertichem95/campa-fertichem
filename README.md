# Campa Fertichem — Website

A production-ready React + Supabase website for Campa Fertichem, a fertilizer manufacturer and supplier based in Taloja, Navi Mumbai, Maharashtra, India.

## Tech Stack

- **Frontend:** React 18 + Vite + TypeScript
- **Styling:** Tailwind CSS v4
- **UI:** shadcn/ui components (Radix UI primitives)
- **Animations:** Motion for React (`motion` package)
- **Icons:** Lucide React
- **Backend/DB:** Supabase (PostgreSQL + Auth + Storage)
- **Routing:** React Router v6
- **Forms:** React Hook Form + Zod
- **Deployment:** Vercel or Netlify

---

## Local Setup

### 1. Clone and install

```bash
cd campa-fertichem
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` and fill in your Supabase project values:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Get these from: **Supabase Dashboard → Project Settings → API**

### 3. Run the database migration

1. Open your Supabase project → **SQL Editor**
2. Paste the contents of `supabase/migration.sql`
3. Click **Run**

This creates all tables, indexes, RLS policies, and seed data.

### 4. Create the Supabase Storage bucket

1. Go to **Supabase Dashboard → Storage**
2. Click **New bucket**
3. Name it `images`, set it to **Public**
4. Add these storage policies (via Dashboard → Storage → Policies):
   - **Public read:** `SELECT` for all users on bucket `images`
   - **Admin upload:** `INSERT` for authenticated users on bucket `images`
   - **Admin delete:** `DELETE` for authenticated users on bucket `images`

### 5. Create the first admin user

Admin users are provisioned through Supabase Auth only — there is no public registration page.

1. Go to **Supabase Dashboard → Authentication → Users**
2. Click **Add user → Create new user**
3. Enter the admin email and a strong password
4. Click **Create user**

That user can now log in at `/admin/login`.

> To add more admins, repeat the same process. Never expose a public sign-up route.

### 6. Start the development server

```bash
npm run dev
```

Visit `http://localhost:5173`

---

## Project Structure

```
src/
├── components/
│   ├── layout/         # Header, Footer, PublicLayout, AdminLayout, ProtectedRoute
│   └── ui/             # shadcn/ui components (Button, Card, Input, etc.)
├── hooks/
│   ├── useAuth.tsx     # Supabase Auth context
│   └── useSiteSettings.ts
├── lib/
│   ├── supabase.ts     # Supabase client
│   └── utils.ts        # cn(), slugify(), formatDate()
├── pages/
│   ├── HomePage.tsx
│   ├── AboutPage.tsx
│   ├── ProductsPage.tsx
│   ├── ProductDetailPage.tsx
│   ├── BlogPage.tsx
│   ├── BlogPostPage.tsx
│   ├── ContactPage.tsx
│   ├── NotFoundPage.tsx
│   └── admin/
│       ├── AdminLoginPage.tsx
│       ├── AdminDashboard.tsx
│       ├── AdminProductsPage.tsx
│       ├── AdminProductFormPage.tsx
│       ├── AdminCategoriesPage.tsx
│       ├── AdminCategoryFormPage.tsx
│       ├── AdminBlogPage.tsx
│       ├── AdminBlogFormPage.tsx
│       ├── AdminEnquiriesPage.tsx
│       └── AdminSettingsPage.tsx
├── types/
│   └── database.ts     # TypeScript types for all Supabase tables
├── App.tsx             # Route definitions
└── main.tsx
supabase/
└── migration.sql       # Full DB schema + RLS + seed data
```

---

## Admin Panel

Access the admin panel at `/admin/login`.

| Module | Path |
|---|---|
| Dashboard | `/admin` |
| Products | `/admin/products` |
| Add/Edit Product | `/admin/products/new` or `/admin/products/:id` |
| Categories | `/admin/categories` |
| Add/Edit Category | `/admin/categories/new` or `/admin/categories/:id` |
| Blog Posts | `/admin/blog` |
| Add/Edit Post | `/admin/blog/new` or `/admin/blog/:id` |
| Enquiries | `/admin/enquiries` |
| Site Settings | `/admin/settings` |

---

## Deployment

### Vercel (recommended)

1. Push the project to GitHub
2. Import the repo in [vercel.com](https://vercel.com)
3. Set environment variables: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
4. Deploy — `vercel.json` handles SPA routing automatically

### Netlify

1. Push to GitHub, connect in [netlify.com](https://netlify.com)
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Set environment variables in Site Settings
5. `public/_redirects` handles SPA routing automatically

---

## SEO Considerations

This is a client-rendered React SPA. Search engine crawlers may not fully index dynamic content. For production SEO:

- **Option 1 (recommended):** Use [Vite SSG](https://github.com/antfu/vite-ssg) or migrate to Next.js for server-side rendering
- **Option 2:** Use Vercel's Edge Functions or a prerendering service (e.g., Prerender.io)
- **Option 3:** For a catalogue site with limited pages, submit a sitemap and rely on Google's JavaScript rendering (adequate for most use cases)

Static meta tags are set in `index.html`. Per-page dynamic meta tags can be added using [react-helmet-async](https://github.com/staylor/react-helmet-async).

---

## Security

- RLS is enabled on all tables — the anon key cannot access private data
- Enquiries can be inserted publicly but never read publicly
- Admin access requires Supabase Auth session (JWT-verified server-side)
- The `service_role` key is never used in frontend code
- Admin users are provisioned only via Supabase Dashboard (no public registration)
- Draft products (`is_published = false`) are hidden from public queries via RLS

---

## Free Tier Limits (Supabase)

| Resource | Free Tier Limit |
|---|---|
| Database | 500 MB |
| Storage | 1 GB |
| Auth users | Unlimited |
| API requests | 500K/month |
| Bandwidth | 5 GB/month |

Vercel and Netlify free tiers are sufficient for this project at typical traffic levels.

**Potential costs:** Supabase Pro ($25/month) if you exceed free tier storage or bandwidth. Vercel Pro ($20/month) if you need advanced features or exceed hobby limits.

---

## Basic Tests

Run with: `npm test` (after adding Vitest — see below)

To add testing:
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

Key test scenarios to implement:
1. **Auth guard:** Unauthenticated user visiting `/admin` is redirected to `/admin/login`
2. **Category filtering:** Selecting a category slug updates the URL and filters products by `category_id`
3. **Product publishing:** A product with `is_published = false` does not appear in public product queries
4. **Enquiry submission:** A valid form submission inserts a row into `enquiries` with `status = 'new'`
