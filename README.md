# نسائم العود — Nasaem Al Oud POS

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/RTL-Arabic-green?style=for-the-badge" />
</p>

<p align="center">
  A luxury, fully-responsive Arabic Point-of-Sale (POS) system for <strong>Nasaem Al Oud</strong> — a premium oud, incense, and perfume retailer.
  Built with Next.js 14, TypeScript, and Tailwind CSS. Fully RTL (right-to-left) compliant.
</p>

---

## ✨ Features

### 🛒 Point of Sale — Dashboard (`/dashboard`)

- Browse products organized by **category tabs**: العود، بخور، دهون عود، مسك، أعواد كمبودية، خمريات
- **Add / remove products** from cart with live quantity controls (`+` / `−`)
- Cart displays real-time **running total** in SAR
- Select **payment method**: نقدي (Cash) or شبكة (Card/Network)
- Click **تصفير للزبون التالي** to:
  - Automatically record and save the sale to history
  - Reset the cart for the next customer

### 📋 Sales History — (`/sales`)

- All sales **automatically saved** via `localStorage` — no server required
- Grouped by **day** with date headers (Arabic month names, English numerals)
- **Daily summary** shows: total, cash split (💵), card split (💳)
- **Copy Day** button: copies the full day summary as formatted text (ready to paste in WhatsApp etc.)
- **Expand** individual sale cards to see a per-item breakdown
- **Copy** an individual sale receipt to clipboard
- **Clear All** with confirmation modal to reset history

### 🌐 Landing Page — (`/`)

- Luxury animated landing page with gold & charcoal design system
- Animated smoke SVG logo with floating and fade-up animations
- Feature cards: عود أصيل، بخور فاخر، دهون عود، مسك وخمريات
- Customer testimonials section
- Fully mobile-responsive (390px+)

### 🔐 Authentication — (`/login`)

- Login with username / password
- Auth state stored in `localStorage`
- All protected pages redirect to `/login` if unauthenticated

---

## 🖼️ Screenshots

| Landing Page | Dashboard (POS) | Sales History |
|---|---|---|
| Luxury hero + animated smoke | 2-col product grid + cart panel | Daily grouped records + copy |

---

## 🗂️ Project Structure

```
nasaemaloud/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Landing page (/)
│   │   ├── login/
│   │   │   └── page.tsx          # Login page (/login)
│   │   ├── dashboard/
│   │   │   └── page.tsx          # POS Dashboard (/dashboard)
│   │   └── sales/
│   │       └── page.tsx          # Sales history (/sales)
│   ├── lib/
│   │   ├── auth.ts               # Authentication helpers
│   │   ├── products.ts           # Product catalog & categories
│   │   └── sales.ts              # Sales persistence (localStorage)
│   └── app/
│       └── globals.css           # Tailwind + custom design tokens
├── public/
├── tailwind.config.js
└── next.config.js
```

---

## 🎨 Design System

The app uses a custom Tailwind-based luxury design system with the following tokens:

| Token | Use |
|---|---|
| `champagne-*` | Gold/champagne accent palette |
| `silk-*` | Off-white text hierarchy |
| `charcoal-*` | Deep dark backgrounds |
| `.luxury-card` | Glassmorphism card style |
| `.btn-gold` | Primary gold CTA button |
| `.btn-outline` | Secondary ghost button |
| `.shimmer-text` | Animated shimmer gold text |
| `.gold-text` | Static gold gradient text |
| `.glass` | Frosted glass navbar/header |
| `.shadow-gold` | Soft golden glow shadow |

**Font:** [Tajawal](https://fonts.google.com/specimen/Tajawal) (Arabic, Google Fonts)

**Direction:** RTL (`dir="rtl"` on `<html>`)

---

## 🔧 Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| [Next.js](https://nextjs.org/) | 14 (App Router) | React framework, routing |
| [TypeScript](https://www.typescriptlang.org/) | 5 | Type safety |
| [Tailwind CSS](https://tailwindcss.com/) | 3 | Utility-first styling |
| [Lucide React](https://lucide.dev/) | latest | Icon library |
| `localStorage` | Web API | Sales data persistence |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/donwolfonline/nasaemaloud.git
cd nasaemaloud

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at **<http://localhost:3000>**

### Default Credentials

```
Username: fatima
Password: admin123
```

> ⚠️ For production use, replace the hardcoded credentials in `src/lib/auth.ts` with a proper authentication system.

---

## 📦 Data Model

### `SaleRecord`

```typescript
interface SaleRecord {
  id: string;                    // Unique ID (timestamp + random)
  timestamp: number;             // Unix milliseconds
  dateKey: string;               // "YYYY-MM-DD" local date
  items: SaleLineItem[];
  total: number;                 // Total in SAR
  paymentMethod: "نقدي" | "شبكة"; // Cash or Card
}
```

### `SaleLineItem`

```typescript
interface SaleLineItem {
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
  category: string;
}
```

### `DaySummary`

```typescript
interface DaySummary {
  dateKey: string;      // "YYYY-MM-DD"
  label: string;        // Arabic formatted date (e.g. "الخميس، 19 فبراير 2026")
  sales: SaleRecord[];
  dayTotal: number;
  cashTotal: number;
  networkTotal: number;
}
```

---

## 🔁 Sale Flow

```
1. Cashier opens /dashboard
2. Taps product cards to add to cart
3. Adjusts quantities with + / − controls
4. Selects payment method: نقدي (💵) or شبكة (💳)
5. Clicks "تصفير للزبون التالي"
   → Sale is automatically saved to localStorage
   → Cart is cleared, payment resets to نقدي
6. View recorded sale on /sales (سجل المبيعات)
```

---

## 📱 Mobile Responsiveness

The entire app is designed **mobile-first** and tested at 390px (iPhone 14):

- **Landing**: Full-width stacked CTA buttons, scaled hero text
- **Dashboard**: 2-column product grid, icon-only header on mobile, horizontal-scrollable category tabs
- **Sales**: Day headers split into 2-row layout, single-line sale cards

---

## 🌍 Internationalization

- All UI text is in **Arabic (العربية)**
- Number formatting uses **Latin (Western) numerals** via `ar-EG-u-nu-latn` locale
- Date labels use **Arabic month names** with English digits (e.g. `الخميس، 19 فبراير 2026`)

---

## 📝 License

This project is proprietary software for **Nasaem Al Oud** internal use.

---

<p align="center">
  Crafted with ❤️ for <strong>نسائم العود</strong> — حيث يلتقي الأصالة بالرقي
</p>
