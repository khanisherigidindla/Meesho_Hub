import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMenu, FiSun, FiMoon } from 'react-icons/fi';
import { useApp } from '../context/AppContext';

const Navbar = ({ onMenuClick }) => {
  const { settings, theme, toggleTheme } = useApp();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 lg:px-6 py-3"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <FiMenu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white truncate max-w-[200px] sm:max-w-none">
              {settings.warehouseName}
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
              Warehouse Admin — {settings.adminName}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all hover:scale-105"
            title={theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          >
            {theme === 'light' ? (
              <FiMoon className="w-5 h-5 text-gray-600" />
            ) : (
              <FiSun className="w-5 h-5 text-yellow-400" />
            )}
          </button>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary-50 dark:bg-primary-900/30">
            <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-semibold">
              {settings.adminName?.charAt(0) || 'A'}
            </div>
            <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
              {settings.adminName}
            </span>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
