# PrintVerse Technologies — Full Project Overview

## 1. Brand Identity

**Company:** PrintVerse Technologies — a 3D printing startup, powered by IIFR Lab, supported by IEMRF, IEM Kolkata.

**Tagline:** "Where Every Idea Takes Shape."
**Sub-tagline:** "Your Imagination • Our Technology • Infinite Possibilities"

**Mentors:** Mr. Diptiman Dasgupta, Dr. Prabir Kumar Das, Dr. Chandan Adhikari, Dr. Ranabir Banik

**Pricing model:** Flat ₹4/gram for all 3D printed products, 50g minimum (products under 50g billed as if 50g). Example: 50g product = ₹200. This is the core differentiator — "One Company, One Price," positioned as simple, fair, transparent (no per-category pricing confusion).

**Product Collections (from the original poster):**
- Heritage Collection — DivineVerse™ Ganesha, WonderCraft™ Taj Mahal (+ coming soon: Buddha, Krishna, Durga, Temples)
- Gift Collection — GlowFrame™ Photo Frame, NameVerse™ Name Tag, StickerForge™ Sticker (+ coming soon: KeyVerse, MiniMe, FacePrint)
- Home Collection — AquaGrow™ Smart Pot (+ coming soon: EcoPlanter, WallVerse, LampVerse, HomeScape)
- Kids Collection — PlayVerse™ Toys (+ coming soon: PuzzleVerse, PrintPets)
- Office Collection — DeskCraft™ Pen Stand (+ coming soon: TrophyForge, Premium Desk Organizers)
- Engineering Collection (all coming soon) — ProtoVerse (prototypes), ArchitectX (models), EduPrint (educational), RoboVerse (robotics parts), MedPrint (medical models), Drone Components, AI & Robotics Components

**Brand colors (locked into Tailwind config as reusable tokens):**
- Primary — Deep navy blue `#0B1F4D`
- Accent — Red `#C41E2C`
- Gold — Amber/gold `#D4A017`
- Background — White/off-white
- Design language: bold confident headings, card-based layouts, rounded-xl corners, subtle shadows, ribbon-style badges for pricing callouts

---

## 2. Tech Stack — What's Running and Why

| Layer | Tool | Cost | Notes |
|---|---|---|---|
| Frontend framework | Next.js (TypeScript) + Tailwind CSS | Free | React-based, server-rendering capable |
| Database + Auth + File storage | Supabase | Free tier (500MB DB, 1GB storage, 50K auth users/month) | One backend for orders, products, admin login, STL/image uploads |
| Email (planned, not yet built) | Resend | Free tier (100/day, 3,000/month) | Will send quote confirmations, status updates |
| Payment (planned, not yet built) | Razorpay | No subscription — ~2% transaction fee only | Generates payment links tied to tracking ID |
| Hosting (planned, not yet done) | Vercel | Free tier | Where the live site will actually be deployed |
| Dev/coding assistant | Claude Code, pointed at local Ollama + Qwen3-Coder (running on your DGX Spark) | Free (local compute, no API cost) | Chosen specifically because you don't have a Claude subscription — trades some code-quality reliability for zero cost |

**Why local Qwen3-Coder instead of cloud Claude:** no subscription cost. Trade-off: needs more review/testing per feature than a frontier model would, especially on security-sensitive logic (RLS policies, payment code, validation) — this has already caught real bugs during the build (an admin-only storage policy that accidentally allowed public read access, a brittle STL filename regex, a broken phone-input rendering).

---

## 3. Database Schema (Supabase / Postgres)

### `orders` table
The core of the entire quote-to-order-to-payment workflow. One row = one customer request/order.

| Column | Type | Purpose |
|---|---|---|
| id | uuid | Primary key |
| tracking_id | text, unique | Human-readable ID like `TRK-8F3K2`, generated on submission |
| customer_name | text | |
| email | text | Used for quote confirmation + phone+email verified lookup |
| phone | text | International format (after the phone-picker fix) |
| stl_file_url | text, nullable | Link to uploaded STL in storage, if provided |
| message | text, nullable | Customer's description of what they want |
| status | text (checked against a fixed list) | Requested → Contacted → Quoted → Payment Pending → Paid → Printing → Shipped → Completed (or Cancelled) |
| quoted_price | numeric, nullable | Set by admin after reviewing the request |
| payment_link | text, nullable | Razorpay link, generated once quoted |
| paid_at | timestamptz, nullable | Set automatically via payment webhook |
| created_at / updated_at | timestamptz | updated_at auto-updates via a Postgres trigger on every row change |

### `products` table
Your public catalog — currently empty (you chose to defer adding real product photos/data).

| Column | Type | Purpose |
|---|---|---|
| id | uuid | Primary key |
| name, slug | text | Display name + URL-safe identifier |
| description | text, nullable | |
| price | numeric | |
| category | text (checked: Heritage/Gift/Home/Kids/Office/Engineering) | Matches your collection structure |
| image_url | text, nullable | Points to Supabase storage |
| is_available | boolean | |
| is_coming_soon | boolean | Drives the "Coming Soon" badge automatically once wired to real data |
| display_order | integer | Controls sort order within a category |

### Storage buckets
- `stl-uploads` — public insert (anyone can upload when requesting a quote), admin-only read/list (after a bug fix — the first version accidentally let anyone read/list all uploaded files)
- `product-images` — public read (so photos show on the site), admin-only write/delete

### Row Level Security (RLS)
Enforced at the database level, not just in app code — meaning even if a bug in the frontend tried to do something it shouldn't, Supabase itself blocks it. Public users can insert orders and read products; only authenticated (admin) sessions can modify products, view all order details freely, or manage storage beyond uploading.

---

## 4. Pages Built So Far

### Homepage (`app/page.tsx`)
- **Navbar:** Sticky, always-solid white background with navy text (fixed after an initial bug where it was invisible over the hero — root cause was a scroll-dependent transparent background)
- **Hero section:** Navy gradient background, large bold tagline "Where Every Idea Takes Shape," two CTA buttons (Request a Quote — red/filled; Track Your Order — outlined)
- **Pricing banner:** "One Company • One Price" ribbon badge, large "₹4 per gram" callout, "50g Product = ₹200" example card
- **Product Collections grid:** 6 cards (one per category), responsive 1/2/3 column layout, "Coming Soon" tags on unreleased categories
- **Featured Products grid:** 8-item responsive grid — **currently placeholder emoji icons**, not real photos, since you're adding real product images later
- **Why Choose PrintVerse:** 5 feature badges (100% Customized, Premium Quality, Multiple Colors & Materials, Fast Turnaround, Affordable Pricing)
- **Footer:** Tagline, quick links, mentor names, "Powered by IIFR Lab, IEM Kolkata," social placeholders
- **Design polish pass applied:** hover states on cards (lift/scale), consistent rounded-xl radius, consistent section spacing, gradient hero background, larger typography hierarchy

### Request a Quote page (`app/request-quote/page.tsx`)
The entry point to your entire order pipeline.
- Fields: Full Name, Email, Phone Number (international picker with flags/country codes — fixed after an initial broken/unstyled dropdown), optional STL file upload, optional Message
- Validation: client-side + server-side (never trusts client-only checks) — valid email format, valid international phone number (via the phone library's built-in validator), name format, STL file extension check that can't be bypassed by drag-and-drop
- On submit: generates a `TRK-XXXXX` tracking ID, uploads STL to storage if provided, inserts the row into `orders` with status `Requested`
- Success screen shows the tracking ID directly on-screen with a "Copy" button (since email confirmation isn't built yet — **this is currently the only place the customer sees their tracking ID**, worth being aware of)

### Track Order page (`app/track-order/page.tsx`)
Public, no login required, two lookup modes:
- **By Tracking ID:** direct lookup, shows a visual status timeline (current stage highlighted, future stages greyed out, Cancelled shown distinctly if applicable)
- **By Phone + Email (your idea):** requires *both* to match the same order — a deliberate security compromise instead of OTP. Returns a minimal list (tracking ID, status, date only — no price/message) that the customer clicks into for full details. This prevents someone who only knows a phone number from pulling up a stranger's order.

---

## 5. What's Not Built Yet (Remaining Roadmap)

1. **Admin login** — Supabase Auth, single admin account (you'll create it manually in Supabase's dashboard, no public signup flow). Prompt was written; not yet confirmed working.
2. **Admin dashboard** — table view of all orders, filterable by status, your daily working view.
3. **Admin order detail page** — view customer info + STL file, set quoted price, generate Razorpay payment link, manually advance status through the pipeline.
4. **Admin product management** — add/edit/delete products with image upload, toggle availability/coming-soon (this is where you'll add real product photos when ready, without touching Supabase's UI directly).
5. **Homepage → real data wiring** — once products exist, replace the placeholder emoji grid with actual database-driven photos and prices.
6. **Email sending (Resend)** — quote confirmation, status update notifications. Deliberately deferred so far.
7. **Payment integration (Razorpay)** — generating payment links from the admin panel, and a webhook that automatically marks an order `Paid` when payment completes (no manual confirmation needed on your end).
8. **WhatsApp click-to-chat** — a simple `wa.me/` link, no API cost.
9. **Deployment** — push to GitHub, connect to Vercel, set environment variables there, go live. Optionally add a custom domain later.

---

## 6. Key Lessons From the Build So Far (worth remembering)

- **Local qwen3-coder needs literal, narrow, single-purpose prompts.** Big multi-section requests ("build the whole homepage") tend to collapse into generic placeholder output. Small, explicit, one-feature-at-a-time prompts work far more reliably.
- **Always verify, don't trust the model's self-report.** Twice now it claimed something was "done" when it wasn't (SQL never executed; a security policy that looked right but wasn't). Check the actual file/database state after every change.
- **Long Claude Code sessions slow down badly on DGX Spark** due to the 273GB/s memory bandwidth limit — every prompt resends the whole conversation history. Start fresh sessions for new features rather than continuing one giant session indefinitely; point it back at existing files on disk to restore context cheaply.
- **Security-sensitive logic (RLS policies, validation, payment flow) is the highest-risk area for subtle bugs** with a local model — worth extra manual scrutiny there specifically, more than on pure styling/layout work.

---

## 7. Suggested Immediate Next Step

Confirm the phone-picker fix actually works end-to-end (test with a non-Indian country selected, not just default +91), then move to **Admin login** — everything else (dashboard, order management, payments) depends on having a working, secure admin session first.
