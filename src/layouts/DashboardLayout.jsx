import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Outlet } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const DashboardLayout = () => {
  const { theme, settings } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Apply theme class and color to body
  useEffect(() => {
    // Apply dark mode
    document.documentElement.classList.toggle('dark', theme === 'dark');
    
    // Apply theme color - changes the primary color throughout the app
    const themeColor = settings?.themeColor || 'blue';
    document.documentElement.setAttribute('data-theme', themeColor);
    
    // Apply theme color to body background with CSS variables
    const root = document.documentElement;
    const colors = {
      blue: { primary: '#3b82f6', gradient: 'from-blue-500 to-cyan-500' },
      emerald: { primary: '#10b981', gradient: 'from-emerald-500 to-green-500' },
      purple: { primary: '#8b5cf6', gradient: 'from-purple-500 to-violet-500' },
      rose: { primary: '#f43f5e', gradient: 'from-rose-500 to-pink-500' },
      orange: { primary: '#f97316', gradient: 'from-orange-500 to-amber-500' },
      cyan: { primary: '#06b6d4', gradient: 'from-cyan-500 to-teal-500' },
      indigo: { primary: '#6366f1', gradient: 'from-indigo-500 to-blue-500' },
      green: { primary: '#22c55e', gradient: 'from-green-500 to-emerald-500' },
      violet: { primary: '#7c3aed', gradient: 'from-violet-500 to-purple-500' },
      pink: { primary: '#ec4899', gradient: 'from-pink-500 to-rose-500' },
    };
    
    const selected = colors[themeColor];
    if (selected) {
      root.style.setProperty('--theme-primary', selected.primary);
    }
  }, [theme, settings?.themeColor]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-64">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="p-4 lg:p-6 max-w-7xl mx-auto"
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
};

export default DashboardLayout;