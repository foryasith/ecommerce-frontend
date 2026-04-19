# ShopEase — Ecommerce Frontend

A modern ecommerce storefront built with **React + Vite + Tailwind CSS**.
## Live Demo
Deployed on Vercel: https://ecommerce-frontend-mu-neon.vercel.app/

## Tech Stack
- React 19
- Vite
- Tailwind CSS
- React Router DOM

## Pages
- `/` — Home page
- `/login` — Customer login
- `/signup` — Customer registration
- `/products` — Product catalog with search and pagination
- `/cart` — Shopping cart
- `/addresses` — Shipping address management
- `/checkout` — Order checkout
- `/orders` — Order history
- `/orders/:id` — Order detail
- `/account` — User profile

## Getting Started

```bash
npm install
npm run dev
```

The local dev server runs on `http://localhost:3000`.

## Environment Variables
Create a `.env.local` file:

```bash
# Leave empty for local dev. The Vite proxy will forward /api/* to CustomerService.
VITE_CUSTOMER_API_BASE_URL=

# Optional local override if CustomerService is not on localhost:5002
VITE_CUSTOMER_API_PROXY_TARGET=http://localhost:5002
```

## Local Integration
- ERP frontend can stay on `http://localhost:5173`
- ecommerce frontend runs on `http://localhost:3000`
- local API requests use the Vite proxy and forward `/api/*` to `CustomerService`
- `CustomerService` should still be running on `http://localhost:5002`

For production or any non-proxied environment, set `VITE_CUSTOMER_API_BASE_URL` to the public `CustomerService` URL.
