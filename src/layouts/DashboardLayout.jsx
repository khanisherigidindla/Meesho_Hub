import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Outlet } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const DashboardLayout = () => {
  const { theme, settings } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Apply theme class to body
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    // Apply theme color
    if (settings?.themeColor) {
      document.documentElement.setAttribute('data-theme', settings.themeColor);
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
