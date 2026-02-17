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
- **Yummies** (star icon) → My Products list
- **Profile** (person icon) → User profile & sign out

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
- On successful scan: auto-navigate to the Add/Edit Product screen with the detected EAN
- Request camera permission gracefully, show an error message if denied
- Include a manual fallback: text input for typing the EAN code

---

### Screen 2: Add Product

**Triggered when**: A barcode is scanned or a manual EAN is entered.

**Behavior**:
1. Check if the product (EAN) already exists in the user's collection
   - If yes: navigate to **Edit Product** screen instead (pre-filled with existing data)
   - If no: fetch from Open Food Facts API and pre-fill the form
2. Show a form with the following fields:
   - Product image (uploaded by user or fetched from Open Food Facts) – tappable image area
   - **Name** (text input, pre-filled from API)
   - **Brand** (text input, pre-filled from API)
   - **Description** (multi-line text, pre-filled from API)
   - **Your Rating** (star rating widget, 0–5 in 0.5 steps)
   - **Your Note** (multi-line text input)
3. Image upload:
   - User can tap the product image to open the camera or photo gallery
   - Upload image to **Supabase Storage** (bucket: `product-images`, path: `{userId}/{ean}`)
   - Show upload progress indicator
4. Save button: POST to Supabase → navigate back to Yummies list with success toast

**Open Food Facts API call**:
```
GET https://world.openfoodfacts.org/api/v3/product/{ean}.json
```
Extract: `product.product_name` (or `product_name_de`), `product.brands`, `product.image_url`, `product.generic_name` (or `generic_name_de`). Show a subtle "Product not found – please fill in manually" message if the API returns no result.

---

### Screen 3: Edit Product

**Same layout as Add Product**, but:
- All fields pre-filled with existing data from Supabase
- Save button triggers a `UPDATE` on the existing row
- Show a **Delete** button (red, with confirmation dialog) at the bottom
- Confirmation dialog text: "Do you really want to delete [product name]? This cannot be undone."

---

### Screen 4: My Yummies (Product List)

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
  - Tap to open Edit Product screen

**Search/Filter**:
- Fuzzy search across: name, brand, description, user_note, EAN
- Implement client-side filtering with `fuse.js`
- Update results in real time as user types

**Empty state**: If the user has no products, show an illustration + message: "No Yummies yet! Scan a product to get started." with a button navigating to the Scanner.

**FAB**: A floating action button (+) to open the scanner directly.

---

### Screen 5: Profile

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
2. **Scan product** → Camera opens → EAN detected → Open Food Facts lookup → Pre-filled form → User rates + saves → Product appears in Yummies list
3. **View Yummies** → List of all rated products → Search/filter → Tap product → Edit/delete
4. **Manual entry** → Type EAN in text field → Same flow as scan
5. **Sign out** → Profile screen → Confirm → Back to sign-in screen
6. **Offline** → Banner shown → Can browse cached products → Scanner disabled

---

*This prompt describes a complete, production-ready PWA. Please implement all screens and features as described above.*
