import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiHome,
  FiUsers,
  FiTruck,
  FiPackage,
  FiShoppingBag,
  FiList,
  FiRefreshCw,
  FiDollarSign,
  FiSettings,
  FiLogOut,
  FiBarChart2,
  FiGrid,
  FiX,
  FiMail,
  FiCalendar,
  FiBox,
  FiClipboard,
  FiAlertOctagon,
  FiEdit,
} from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import { useState } from 'react';
import Calculator from './Calculator';

const Sidebar = ({ isOpen, onClose }) => {
  const { logout } = useApp();
  const [collapsed, setCollapsed] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);

  const menuItems = [
    { to: '/', icon: FiCalendar, label: "Today's Work", color: 'from-primary-600 to-purple-600', badge: true },
    { to: '/dashboard', icon: FiHome, label: 'Dashboard', color: 'from-blue-500 to-cyan-500' },
    { to: '/riders', icon: FiUsers, label: 'Riders', color: 'from-primary-600 to-primary-700' },
    { to: '/attendance', icon: FiList, label: 'Attendance', color: 'from-success-500 to-success-600' },
    { to: '/shipments', icon: FiTruck, label: 'Shipments', color: 'from-purple-600 to-purple-700' },
    { to: '/orders', icon: FiShoppingBag, label: 'Orders', color: 'from-pink-600 to-danger-600' },
    { to: '/customers', icon: FiUsers, label: 'Customers', color: 'from-indigo-600 to-blue-600' },
    { to: '/inventory', icon: FiPackage, label: 'Inventory', color: 'from-cyan-600 to-teal-600' },
    { to: '/products', icon: FiBox, label: 'Products', color: 'from-violet-600 to-purple-600' },
    { to: '/returns', icon: FiRefreshCw, label: 'Returns', color: 'from-amber-500 to-orange-600' },
    { to: '/damaged', icon: FiAlertOctagon, label: 'Damaged', color: 'from-red-600 to-danger-600' },
    { to: '/revenue', icon: FiDollarSign, label: 'Revenue', color: 'from-emerald-600 to-green-600' },
    { to: '/expenses', icon: FiClipboard, label: 'Expenses', color: 'from-orange-600 to-amber-600' },
    { to: '/reports', icon: FiBarChart2, label: 'Reports', color: 'from-danger-500 to-danger-600' },
    { to: '/notepad', icon: FiEdit, label: 'Notepad', color: 'from-gray-600 to-slate-600' },
    { to: '/calendar', icon: FiCalendar, label: 'Calendar', color: 'from-sky-600 to-blue-600' },
    { to: '/settings', icon: FiSettings, label: 'Settings', color: 'from-gray-600 to-gray-700' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}
      
      <motion.aside
        initial={isOpen ? { x: -280 } : { x: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -280 }}
        transition={{ type: 'spring', damping: 25 }}
        className={`fixed left-0 top-0 h-screen z-50 transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        } ${isOpen ? 'block' : 'hidden lg:block'}`}
      >
        <div className="h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-purple-600 flex items-center justify-center shadow-lg shadow-primary-600/25">
                    <FiGrid className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="font-bold text-gray-900 dark:text-white text-lg">Meesho Hub</h1>
                  </div>
                </motion.div>
              )}
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ml-auto"
              >
                <FiX className={`w-5 h-5 text-gray-600 dark:text-gray-400 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {menuItems.map((item, index) => (
              <NavLink key={item.to} to={item.to}>
                {({ isActive }) => (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, x: 2 }}
                    className={`flex items-center gap-3 px-4 py-3 mx-1 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                      isActive
                        ? `bg-gradient-to-r ${item.color} text-white shadow-lg shadow-primary-600/20`
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                      isActive 
                        ? 'bg-white/20' 
                        : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-white/10'
                    }`}>
                      <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-600 dark:text-gray-400 group-hover:text-primary-600'}`} />
                    </div>
                    {!collapsed && (
                      <span className={`font-medium transition-colors ${isActive ? 'text-white' : 'group-hover:text-gray-900 dark:group-hover:text-white'}`}>
                        {item.label}
                      </span>
                    )}
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute right-2 w-2 h-2 bg-white rounded-full"
                      />
                    )}
                  </motion.div>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-3 border-t border-gray-100 dark:border-gray-700 space-y-2">
            <button
              onClick={() => setShowCalculator(true)}
              className="flex items-center gap-3 w-full px-4 py-3 mx-1 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <FiGrid className="w-5 h-5" />
              </div>
              {!collapsed && <span className="font-medium">Calculator</span>}
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-3 w-full px-4 py-3 mx-1 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-danger-50 dark:hover:bg-danger-900/20 hover:text-danger-600 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <FiLogOut className="w-5 h-5" />
              </div>
              {!collapsed && <span className="font-medium">Logout</span>}
            </button>
          </div>
        </div>
        
        <Calculator isOpen={showCalculator} onClose={() => setShowCalculator(false)} />
      </motion.aside>
    </>
  );
};

export default Sidebar;