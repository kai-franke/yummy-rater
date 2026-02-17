# Lovable Prompt: Yummy Rater – Mobile PWA

## Overview

Build a **Progressive Web App (PWA)** called **"Yummy Rater"** – a personal food & beverage rating app. Users scan product barcodes (EAN/UPC), look up product details automatically, rate them with stars, add personal notes, and manage their own product collection. The app must be optimized for Android devices and fully installable as a home screen PWA.

Choose the most suitable modern tech stack (e.g. React + Vite + Supabase or similar) that supports offline capability, camera access, and fast mobile performance. Supabase is preferred for the backend (authentication, database, storage).

---

## Design & Theme

Use **Material Design 3** components with the following custom theme based on the existing web app:

- **Primary color**: Brown (`#4e342e` or similar warm brown)
- **Secondary color**: Yellow/Amber (`#fdd835` or similar)
- **Background**: Light grey (`#f5f5f5`)
- **Typography**: Clean sans-serif (Roboto)
- **Logo**: "Yummy Rater" wordmark with a star icon
- **Icons**: Material Icons (outlined style)
- **Style**: Mobile-first, card-based layout, bottom navigation bar

The overall look & feel should match the existing Yummy Rater web app but be adapted to native Android PWA conventions (bottom nav, FAB buttons, Material You aesthetics).

---

## Authentication

Use **Supabase Auth** with the following OAuth providers:

- **Google** OAuth2
- **GitHub** OAuth2

Requirements:
- Show a clean sign-in screen with "Sign in with Google" and "Sign in with GitHub" buttons on first open
- Store user session persistently (auto sign-in on app reopen)
- Sign-out option in a profile/settings screen accessible from the bottom navigation
- Display the user's profile picture and name after sign-in

---

## Database Schema (Supabase / PostgreSQL)

### Table: `users`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid | Primary key (matches Supabase Auth UID) |
| `email` | text | From OAuth profile |
| `first_name` | text | |
| `last_name` | text | |
| `profile_image` | text | URL |
| `created_at` | timestamp | Auto-generated |
| `updated_at` | timestamp | Auto-generated |

### Table: `products`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid | Primary key |
| `user_id` | uuid | FK → users.id (Row Level Security) |
| `ean` | text | EAN/UPC barcode number |
| `name` | text | Product name |
| `brand` | text | Brand/manufacturer |
| `description` | text | Generic description |
| `image_url` | text | Supabase Storage URL or external URL |
| `user_rating` | numeric(2,1) | 0.0 to 5.0, steps of 0.5 |
| `user_note` | text | Personal note from the user |
| `created_at` | timestamp | Auto-generated |
| `updated_at` | timestamp | Auto-generated |

**Row Level Security**: Each user can only read, insert, update, and delete their own rows in `products`.

**Unique constraint**: `(user_id, ean)` – one product entry per user per EAN.

---

## App Structure & Screens

### Bottom Navigation Bar (always visible when signed in)
- **Home** (house icon) → Scanner / Dashboard screen
- **Yummies** (star icon) → My Products list (Screen 5)
- **Profile** (person icon) → User profile & sign out (Screen 6)

### Screen Overview
| # | Screen | Triggered by |
|---|---|---|
| 1 | Home / Scanner | App start, bottom nav |
| 2 | Product Card View | EAN found in My Yummies |
| 3 | Add Product Form | EAN not found → user taps "Add to Yummies" |
| 4 | Edit Product Form | Tapping "Edit" on Product Card View |
| 5 | My Yummies List | Bottom nav "Yummies" |
| 6 | Profile | Bottom nav "Profile" |

---

### Screen 1: Home / Scanner

**Purpose**: Main entry point. Allows users to scan a barcode or manually enter an EAN.

**Layout**:
- App header with logo ("Yummy Rater") and a subtle background
- Large centered section with the camera viewfinder for scanning
- Below the viewfinder: a text field for manual EAN entry + a "Search" button
- A floating action button (FAB) to toggle the scanner on/off
- If the user hasn't scanned anything yet, show a friendly empty state with instructions

**Scanner functionality**:
- Use the device camera to scan EAN-8 and EAN-13 barcodes in real time
- Use a JavaScript barcode scanning library (e.g. `@zxing/library`, `quagga2`, or `html5-qrcode`)
- Show visual scan focus markers / overlay on the camera feed
- Request camera permission gracefully, show an error message if denied
- Include a manual fallback: text input for typing the EAN code

**After scan or manual EAN entry – lookup logic (IMPORTANT)**:

```
EAN detected/entered
        │
        ▼
Is EAN in user's "My Yummies"?
        │
   YES ─┤─ NO
        │       │
        ▼       ▼
  Show Product  Show "Not in your Yummies" screen
  Card View     with "Add to Yummies" button
  (Screen 2)           │
                       ▼ (user taps "Add to Yummies")
               Query Open Food Facts API
                       │
              Found ───┤─── Not found
                │              │
                ▼              ▼
         Pre-filled       Empty form
           form            (Screen 3)
               └──────┬───────┘
                       ▼
              User edits + rates + saves
                       │
                       ▼
               Product saved to Supabase
               → Navigate to Product Card View
```

---

### Screen 2: Product Card View (Existing Product)

**Triggered when**: EAN is found in the user's "My Yummies".

**Purpose**: Display the saved product with all details the user previously entered.

**Layout**:
- Product image (full width, rounded corners, or placeholder if no image)
- Product name (large, bold)
- Brand (secondary text)
- Description (collapsible if long)
- **User Rating**: visual star display (amber stars, 0–5 in 0.5 steps), read-only
- **User Note**: displayed as a styled quote/note block (read-only)
- **Edit button** (top right or bottom): navigates to Edit Product screen (Screen 4)
- Back button: returns to Scanner screen

---

### Screen 3: Add Product Form

**Triggered when**: EAN is NOT in user's Yummies AND user confirms "Add to Yummies".

**Step 1 – "Not in your Yummies" screen**:
- Show the scanned EAN number
- Message: "This product is not in your Yummies yet."
- Large **"Add to Yummies"** button (primary color)
- Secondary **"Scan again"** button to return to scanner

**Step 2 – After tapping "Add to Yummies"**:
- Show a loading spinner while querying Open Food Facts API:
  ```
  GET https://world.openfoodfacts.org/api/v3/product/{ean}.json
  ```
  Extract: `product.product_name` (or `product_name_de`), `product.brands`, `product.image_url`, `product.generic_name` (or `generic_name_de`)
- If API returns data: show pre-filled form with a subtle banner "Product data loaded – please review"
- If API returns no data: show empty form with a subtle banner "Product not found – please fill in manually"

**Form fields** (all editable by the user):
- Product image – tappable image area (opens camera or photo gallery)
- **Name** (text input)
- **Brand** (text input)
- **Description** (multi-line text input)
- **Your Rating** (interactive star widget, 0–5 in 0.5 steps, required)
- **Your Note** (multi-line text input, optional)

**Image upload**:
- Upload image to **Supabase Storage** (bucket: `product-images`, path: `{userId}/{ean}`)
- Show upload progress indicator

**Save button**: INSERT into Supabase `products` table → navigate to Product Card View (Screen 2) with success toast

---

### Screen 4: Edit Product

**Triggered when**: User taps "Edit" on the Product Card View (Screen 2).

**Same form layout as Add Product (Screen 3)**, but:
- All fields pre-filled with existing data from Supabase
- Save button triggers an `UPDATE` on the existing row → navigate back to Product Card View
- Show a **Delete** button (red, at the bottom) with a confirmation dialog:
  "Do you really want to delete [product name]? This cannot be undone."
  → On confirm: DELETE from Supabase → navigate to My Yummies list with success toast

---

### Screen 5: My Yummies (Product List)

**Purpose**: Display all products the user has rated.

**Layout**:
- Search bar at the top (sticky)
- Scrollable list of product cards, sorted by `updated_at` descending (newest first)
- Each card shows:
  - Product image (thumbnail, 60×60 dp, rounded corners) or a placeholder image if none
  - Product name (bold)
  - Brand (secondary text, smaller)
  - Star rating (visual stars in amber/yellow)
  - User note preview (truncated to 1 line if long)
  - **Tap card → navigate to Product Card View (Screen 2)**

**Search/Filter**:
- Fuzzy search across: name, brand, description, user_note, EAN
- Implement client-side filtering with `fuse.js`
- Update results in real time as user types

**Empty state**: If the user has no products, show an illustration + message: "No Yummies yet! Scan a product to get started." with a button navigating to the Scanner.

**FAB**: A floating action button (camera icon) to open the scanner directly.

---

### Screen 6: Profile

**Layout**:
- User avatar (circle, from OAuth profile image)
- User name and email
- "Sign Out" button (with confirmation)
- App version info at the bottom

---

## Offline Support (PWA)

- Register a **Service Worker** to cache:
  - App shell (all JS, CSS, HTML)
  - Product list data (last fetched)
  - Product images (recently viewed)
- When offline:
  - Show a banner: "You are offline. Showing cached data."
  - Allow browsing existing (cached) products
  - Disable the scanner and add/edit actions with an "Offline – not available" message
- Use **Workbox** or the framework's built-in PWA support for cache strategies

---

## PWA Manifest

```json
{
  "name": "Yummy Rater",
  "short_name": "Yummy Rater",
  "description": "Rate your food and beverages",
  "start_url": "/",
  "display": "standalone",
  "orientation": "portrait",
  "theme_color": "#4e342e",
  "background_color": "#f5f5f5",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

---

## External Integrations

| Service | Purpose | Notes |
|---|---|---|
| **Supabase Auth** | GitHub + Google OAuth | Session persistence |
| **Supabase Database** | PostgreSQL (users, products) | Row-Level Security |
| **Supabase Storage** | Product image uploads | Bucket: `product-images` |
| **Open Food Facts API** | Product lookup by EAN | Free, no API key needed |
| **ZXing / Quagga2 / html5-qrcode** | Barcode scanning | Camera-based |
| **Fuse.js** | Fuzzy search on product list | Client-side |

---

## Non-Functional Requirements

- **Mobile-first**: Optimized for 360–430dp viewport widths
- **Touch-friendly**: All interactive elements ≥ 48dp tap targets
- **Performance**: Lighthouse PWA score ≥ 90
- **Installability**: App must pass Chrome's PWA installability criteria (manifest, service worker, HTTPS)
- **Responsiveness**: Also usable on tablets
- **Accessibility**: Sufficient color contrast, ARIA labels on icon buttons
- **Error handling**: All API calls show user-friendly error messages (toast/snackbar)
- **Loading states**: Skeleton loaders or spinners during data fetches

---

## Summary of Key User Flows

1. **First open** → Sign-in screen → OAuth → Home/Scanner

2. **Scan known product** → EAN detected → EAN found in My Yummies → **Product Card View** (shows saved rating + note) → optional: tap Edit

3. **Scan new product** → EAN detected → EAN NOT in My Yummies → "Not in your Yummies" screen → User taps "Add to Yummies" → Open Food Facts API lookup → Pre-filled or empty form → User edits, rates, adds note → Save → Product Card View

4. **Manual entry** → User types EAN → same flow as scan (steps 2 or 3 depending on whether product exists)

5. **Browse Yummies** → My Yummies list → Search/filter → Tap product card → Product Card View → optional: tap Edit → Edit form → Save or Delete

6. **Sign out** → Profile screen → Confirm → Back to sign-in screen

7. **Offline** → Banner shown → Can browse cached products → Scanner and add/edit disabled

---

*This prompt describes a complete, production-ready PWA. Please implement all screens and features as described above.*
