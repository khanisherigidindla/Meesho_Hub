# Warehouse Rider Management System

A modern, mobile-responsive web application for managing warehouse riders, attendance, and shipments. Built with React, Vite, and Tailwind CSS.

## Features

- 📱 **Mobile-First Design** - Fully responsive UI optimized for mobile devices
- 🚴 **Rider Management** - Add, edit, view, and manage rider information
- 📅 **Attendance Tracking** - Track daily rider attendance with status indicators
- 📦 **Shipment Management** - Assign and track parcel deliveries
- 🌙 **Dark Mode** - Built-in dark theme support
- 📊 **Dashboard Stats** - Quick overview of key metrics
- 💾 **Local Storage** - Data persistence with backup/restore functionality
- 📤 **CSV Export** - Export data to CSV files
- 🔐 **Protected Routes** - Authentication-based access control

## Tech Stack

- **React 18** - Frontend framework
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Router** - Client-side routing

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or pnpm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Deployment

This project is configured for Vercel deployment. The `vercel.json` file includes:

- SPA routing with fallback to `index.html`
- Automatic build command detection
- Optimized output directory

## Project Structure

```
src/
├── components/       # Reusable UI components
├── context/         # React context for state management
├── layouts/         # Layout components
├── pages/           # Route pages
├── styles/          # Global styles
└── utils/           # Utility functions
```

## Default Login

- Email: `admin@gmail.com`
- Password: `admin123`

## License

MIT