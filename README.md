# Meesho Warehouse Management System

A modern, mobile-responsive web application for managing warehouse operations. Built with React + Vite + Tailwind CSS.

## 🚀 Features

### Core Modules
- 📊 **Dashboard** - Real-time stats, notifications, and quick actions
- 📦 **Orders** - Complete order management with all fields (Transaction ID, Tracking, Customer, Address, Payment Status, etc.)
- 📦 **Products** - Product catalog with SKU, pricing, weight, size, color
- 📥 **Inventory** - Stock management with rack/shelf/bin locations, low stock alerts
- 👥 **Customers** - Customer database with phone, address, order tracking
- 🚴 **Riders** - Delivery personnel management with bank details, PAN, Aadhar
- 📅 **Attendance** - Daily attendance tracking with in/out times
- 🔄 **Returns** - Return processing and tracking
- 💥 **Damaged Products** - View and manage damaged inventory
- 💰 **Revenue** - Revenue tracking (Cash, UPI, Online, COD) with profit calculation
- 💸 **Expenses** - Expense management and tracking
- 📝 **Notepad** - LocalStorage-based notes with save/export/print
- 📆 **Calendar** - Monthly calendar with event management
- 📈 **Reports** - Generate various reports

### Export/Import Features
- 📤 **Excel/CSV Export** - All modules support CSV export
- 📥 **CSV Import** - Import data from CSV files
- 🖨️ **Print/PDF** - Print-friendly views for all modules

### UI/UX Features
- 📱 **Mobile-First Design** - Optimized for Android phones, tablets, and desktop
- 🌙 **Dark/Light Mode** - Toggle themes with persistent storage
- ⏱️ **Live Time Display** - Shows current time on all pages
- 🎨 **Professional SaaS Design** - Inspired by Linear, Notion, Stripe
- 🪄 **Smooth Animations** - Framer Motion transitions

## 🛠️ Tech Stack

- **React 18** - Frontend framework
- **Vite** - Fast build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Router** - Routing

## 🚀 Getting Started

```bash
# Install dependencies
pnpm install

# Development server (http://localhost:5173)
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## 🌐 Deployment

### Vercel
Push to GitHub and import to Vercel. The `vercel.json` is pre-configured.

### Netlify
Push to GitHub and import to Netlify. The `netlify.toml` is pre-configured.

## 🔐 Default Login
- Email: `admin@gmail.com`
- Password: `admin123`

## 💾 Data Storage
- All data stored in browser LocalStorage
- No backend/database required
- Data persists until manually cleared

## Project Structure
```
src/
├── components/       # UI components (Modal, Search, Badge, etc.)
├── context/          # AppContext for global state
├── layouts/          # Dashboard layout
├── pages/            # Route pages (Orders, Inventory, Riders, etc.)
├── styles/           # Tailwind CSS styles
└── utils/            # Helper functions and constants
```

## MIT License