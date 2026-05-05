# eCommerce React App

A responsive eCommerce frontend built with React + Vite, connected to the [eCommerceBackend](https://github.com/jossj/eCommerceBackend) Spring Boot REST API.

## Tech Stack

| Tool | Purpose |
|---|---|
| React 18 + Vite | UI framework and dev server |
| Zustand | Cart and auth state (persisted to `localStorage`) |
| React Query | Server data fetching and caching (products, cart) |
| React Router v6 | Client-side routing and protected routes |
| Tailwind CSS | Responsive utility-first styling |
| Axios | HTTP client with base URL configuration |

## Features

- **Product listing** — responsive CSS Grid, lazy-loaded images with `<picture>`/`srcset`
- **Cart** — slide-in drawer on desktop, full-page on mobile; persists across refreshes
- **Guest cart** — shop without an account; cart merges to your backend cart on login
- **Auth** — sign in / register; checkout is protected
- **Multi-step checkout** — Cart review → Shipping address → Payment method → Confirmation
- **Payment** — integrates with the backend payment controller (CREDIT_CARD, DEBIT_CARD, PAYPAL, BANK_TRANSFER, CASH_ON_DELIVERY)
- **Mobile-first** — full-screen nav drawer, 44px touch targets, single-column checkout form

## Getting Started

### Prerequisites

- Node.js 18+
- The [eCommerceBackend](https://github.com/jossj/eCommerceBackend) running on `http://localhost:8080`

### Install and run

```bash
npm install
npm run dev
```

The dev server starts at `http://localhost:5173` and proxies all `/api` requests to `http://localhost:8080`.

### Build for production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── api/            Axios instance + one file per backend resource
│   ├── axios.js    Base URL config (/api → localhost:8080)
│   ├── auth.js     GET /users/email/:email, POST /users
│   ├── cart.js     Cart and cart item endpoints
│   ├── orders.js   Order creation (from-cart endpoint)
│   ├── payments.js POST /payments
│   └── products.js GET /products
├── stores/         Zustand state
│   ├── authStore.js     User + isAuthenticated (persisted)
│   ├── cartStore.js     Cart items + drawer state (persisted)
│   └── checkoutStore.js Multi-step checkout state
├── hooks/
│   ├── useAuth.js  Login, register, logout, cart merge on login
│   └── useCart.js  Unified cart hook — backend when logged in, local when guest
├── components/
│   ├── NavBar.jsx        Sticky header with cart badge
│   ├── MobileNav.jsx     Full-screen mobile nav drawer
│   ├── ProductCard.jsx   Product tile with Add to Cart
│   ├── CartDrawer.jsx    Slide-in cart (desktop) / full-screen (mobile)
│   ├── CartItem.jsx      Item row with quantity controls
│   ├── CheckoutSteps.jsx Step indicator
│   ├── ProtectedRoute.jsx Redirects unauthenticated users to /login
│   └── LoadingSpinner.jsx Spinner for loading states
└── pages/
    ├── ProductsPage.jsx  Product grid + cart drawer
    ├── CartPage.jsx      Full cart with order summary
    ├── LoginPage.jsx     Sign in / register (single page)
    └── CheckoutPage.jsx  Multi-step checkout flow
```

## Pages and Routes

| Route | Access | Description |
|---|---|---|
| `/` | Public | Product listing |
| `/cart` | Public | Cart contents and checkout CTA |
| `/login` | Public | Sign in or create account |
| `/checkout` | Authenticated | Multi-step checkout |

## Backend API

All requests are proxied through Vite to the backend. Base path: `/api`.

| Endpoint | Method | Description |
|---|---|---|
| `/products` | GET | All products |
| `/users` | POST | Register new user |
| `/users/email/:email` | GET | Look up user by email (used for login) |
| `/cart/user/:userId` | GET | Get or create cart |
| `/cart/user/:userId/items` | POST | Add item `{ productId, quantity }` |
| `/cart/user/:userId/items/:itemId` | PUT `?quantity=n` | Update quantity |
| `/cart/user/:userId/items/:itemId` | DELETE | Remove item |
| `/cart/user/:userId/clear` | DELETE | Empty the cart |
| `/orders/from-cart/:userId` | POST `?shippingAddress=...` | Create order from cart |
| `/payments` | POST | Process payment |

## Demo Accounts

These users are seeded by the backend on first run:

| Email | Password | Role |
|---|---|---|
| bob@example.com | password123 | Customer |
| carol@example.com | password123 | Customer |
| alice@example.com | admin1234 | Admin |

## Environment

To point the app at a different backend URL, create a `.env.local` file:

```
VITE_API_BASE_URL=http://your-backend-host/api
```

And update `vite.config.js` proxy target accordingly.
