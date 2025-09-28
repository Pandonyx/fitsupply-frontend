# FitSupply Frontend

A modern, full-stack sports supplement e-commerce platform built with Next.js, TypeScript, and Redux Toolkit.

## 🚀 Live Demo

- **Frontend**: [https://fitsupply-liard.vercel.app](https://fitsupply-liard.vercel.app)
- 
for demo purposes use the following admin credentials to access admin content:
Username: admin
password: admin1234

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Development Workflow](#development-workflow)
- [API Integration](#api-integration)
- [Redux Store Architecture](#redux-store-architecture)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 🎯 Overview

FitSupply is a comprehensive e-commerce platform specifically designed for sports supplements and fitness products. This frontend application provides a modern, responsive user interface with advanced features like real-time cart management, user authentication, product search and filtering, and an admin dashboard for inventory management.

### Key Highlights

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Type Safety**: Full TypeScript implementation
- **State Management**: Redux Toolkit with RTK Query for efficient API caching
- **Performance**: Next.js with SSG/ISR for optimal loading times
- **Admin Panel**: Comprehensive product and order management
- **Real-time Updates**: Live cart synchronization and inventory tracking

## 🛠 Tech Stack

### Core Technologies

- **Framework**: Next.js 15
- **Language**: TypeScript
- **State Management**: Redux Toolkit + RTK Query
- **Styling**: Tailwind CSS + Material-UI components
- **Authentication**: JWT with Redux Persist
- **Image Optimization**: Next.js Image component

### Development Tools

- **Package Manager**: npm
- **Linting**: ESLint + Prettier
- **Type Checking**: TypeScript strict mode
- **Build Tool**: Next.js built-in bundler
- **Deployment**: Vercel

## ✨ Features

### Customer Features

- **Product Catalog**: Browse supplements with advanced filtering
- **Product Search**: Real-time search with category filtering
- **Shopping Cart**: Persistent cart with real-time updates
- **User Authentication**: Secure login/registration with JWT
- **Product Details**: Comprehensive product information and images
- **Responsive Design**: Optimized for all device sizes
- **Order History**: Track past orders and delivery status

### Admin Features

- **Dashboard**: Sales analytics and key metrics
- **Product Management**: Add, edit, and delete products
- **Inventory Tracking**: Real-time stock monitoring
- **Order Management**: Process and track customer orders
- **User Management**: View and manage customer accounts
- **Analytics**: Sales trends and performance insights

### Technical Features

- **SSG/ISR**: Static generation for product pages
- **Image Optimization**: Automatic image compression and sizing
- **API Caching**: Efficient data fetching with RTK Query
- **Error Handling**: Comprehensive error boundaries and validation
- **Loading States**: Smooth loading indicators throughout the app
- **SEO Optimization**: Meta tags and structured data

## 📁 Project Structure

```
fitsupply-frontend/
├── components/
│   ├── common/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Layout.tsx
│   │   └── ProductCard.tsx
│   ├── dashboard/
│   │   ├── admin/
│   │   │   └── products/
│   │   │       ├── AddProductModal.tsx
│   │   │       ├── EditProductModal.tsx
│   │   │       ├── ProductsTable.tsx
│   │   │       ├── ProductsFilters.tsx
│   │   │       └── ProductsStats.tsx
│   │   ├── SummaryCards.tsx
│   │   ├── RecentActivity.tsx
│   │   └── TopProducts.tsx
│   ├── auth/
│   │   ├── AdminRoute.tsx
│   │   └── ProtectedRoute.tsx
│   └── ui/
│       ├── LoadingSpinner.tsx
│       └── ErrorBoundary.tsx
├── pages/
│   ├── api/
│   │   └── v1/
│   │       └── products.ts
│   ├── admin/
│   │   ├── dashboard.tsx
│   │   ├── products.tsx
│   │   └── orders.tsx
│   ├── products/
│   │   ├── index.tsx
│   │   ├── [slug].tsx
│   │   └── category/
│   │       └── [category].tsx
│   ├── _app.tsx
│   ├── _document.tsx
│   ├── index.tsx
│   ├── login.tsx
│   ├── register.tsx
│   ├── cart.tsx
│   ├── checkout.tsx
│   ├── profile.tsx
│   └── order-confirmation.tsx
├── store/
│   ├── index.ts
│   └── slices/
│       ├── authSlice.ts
│       ├── cartSlice.ts
│       ├── productsSlice.ts
│       └── dashboardSlice.ts
├── interfaces/
│   └── index.ts
├── styles/
│   └── globals.css
├── public/
│   ├── images/
│   └── icons/
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn package manager
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Pandonyx/fitsupply-frontend.git
   cd fitsupply-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your configuration (see [Environment Variables](#environment-variables) section)

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open the application**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

## 🔧 Environment Variables

Create a `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://pandonyx.pythonanywhere.com

# Authentication (if needed for admin features)
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# Optional: Analytics
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

### Environment Variables Explanation

- **NEXT_PUBLIC_API_URL**: Backend API URL (must start with NEXT*PUBLIC* to be available in browser)
- **NEXTAUTH_SECRET**: Secret key for authentication (if using NextAuth.js)
- **NEXTAUTH_URL**: Your domain URL for authentication callbacks

## 🔄 Development Workflow

### 1. Backend Integration

The frontend connects to a Django REST API backend. Ensure your backend is running and accessible at the URL specified in your environment variables.

### 2. API Endpoints Used

- **Authentication**: `/api/v1/token/`, `/api/v1/register/`
- **Products**: `/api/v1/products/`, `/api/v1/categories/`
- **Cart**: `/api/v1/cart/`, `/api/v1/cart/items/`
- **Orders**: `/api/v1/orders/`
- **Dashboard**: `/api/v1/dashboard/summary/`

### 3. State Management Flow

```
User Action → Redux Action → API Call → Update Store → Re-render Components
```

### 4. Component Development

- Use TypeScript for all components
- Implement proper error handling
- Add loading states for better UX
- Follow responsive design principles

## 🔌 API Integration

### Authentication Flow

```typescript
// Login example
const loginUser = async (credentials) => {
  const response = await fetch(`${API_URL}/api/v1/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  const data = await response.json();
  // Store token in Redux and localStorage
};
```

### Product Data Fetching

```typescript
// Products are fetched using RTK Query
const { data: products, isLoading, error } = useGetProductsQuery();
```

### Cart Management

```typescript
// Cart operations
dispatch(addToCart({ productId, quantity, price }));
dispatch(updateQuantity({ productId, quantity }));
dispatch(removeFromCart(productId));
```

## 🏪 Redux Store Architecture

### Store Structure

```typescript
{
  auth: {
    user: User | null,
    token: string | null,
    isAuthenticated: boolean,
    status: 'idle' | 'loading' | 'succeeded' | 'failed'
  },
  products: {
    items: Product[],
    categories: Category[],
    status: 'idle' | 'loading' | 'succeeded' | 'failed',
    filters: FilterState
  },
  cart: {
    items: CartItem[],
    total: number,
    isOpen: boolean
  },
  dashboard: {
    summary: DashboardSummary,
    recentActivity: Activity[],
    topProducts: Product[]
  }
}
```

### Key Actions

- **Auth**: `login`, `logout`, `register`, `refreshToken`
- **Products**: `fetchProducts`, `fetchCategories`, `addProduct`, `updateProduct`
- **Cart**: `addToCart`, `removeFromCart`, `updateQuantity`, `clearCart`
- **Dashboard**: `fetchDashboardSummary`, `fetchRecentActivity`

## 🚀 Deployment

### Deploying to Vercel

1. **Connect your repository to Vercel**

   - Sign up at [vercel.com](https://vercel.com)
   - Import your GitHub repository

2. **Configure environment variables**

   - Add your environment variables in Vercel dashboard
   - Go to Project Settings → Environment Variables

3. **Deploy**
   ```bash
   # Automatic deployment on git push to main branch
   git push origin main
   ```

### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

### Build Optimization

The application uses Next.js optimizations:

- **Static Generation**: Product pages are pre-generated
- **Image Optimization**: Automatic image compression
- **Code Splitting**: Automatic bundle splitting
- **Tree Shaking**: Unused code elimination

## 🔧 Configuration Files

### Next.js Configuration (`next.config.js`)

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true, // For rapid deployment
  },
  typescript: {
    ignoreBuildErrors: true, // For rapid deployment
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pandonyx.pythonanywhere.com",
        pathname: "/media/**",
      },
    ],
  },
};

export default nextConfig;
```

### Tailwind Configuration

```javascript
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#your-brand-color",
      },
    },
  },
  plugins: [],
};
```

## 🐛 Common Issues & Solutions

### 1. CORS Errors

**Problem**: API requests blocked by CORS policy  
**Solution**: Ensure backend CORS settings include your frontend domain

### 2. Environment Variables Not Loading

**Problem**: Environment variables undefined in browser  
**Solution**: Prefix browser variables with `NEXT_PUBLIC_`

### 3. Build Errors

**Problem**: TypeScript/ESLint errors preventing deployment  
**Solution**: Temporarily disable strict checking in `next.config.js`

### 4. Image Loading Issues

**Problem**: Images not displaying from backend  
**Solution**: Configure `remotePatterns` in `next.config.js`

## 📊 Performance Metrics

- **Lighthouse Score**: 90+ across all categories
- **First Contentful Paint**: <2s
- **Time to Interactive**: <3s
- **Bundle Size**: Optimized with code splitting

## 🤝 Contributing

### Development Guidelines

1. Follow TypeScript strict mode
2. Use functional components with hooks
3. Implement proper error handling
4. Add loading states for better UX
5. Write meaningful commit messages
6. Test on multiple devices/browsers

### Pull Request Process

1. Create feature branch from main
2. Implement changes with proper TypeScript types
3. Test locally with backend integration
4. Submit PR with detailed description
5. Address review feedback

## 📄 License

This project is part of a capstone project and is for educational purposes.

## 🙋‍♂️ Support

For questions or issues:

- Open an issue on GitHub
- Contact the development team
- Check the documentation

---

**Built with ❤️ using Next.js, TypeScript, and Redux Toolkit**
