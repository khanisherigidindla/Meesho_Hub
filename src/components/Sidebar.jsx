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
} from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import { useState } from 'react';

const Sidebar = ({ isOpen, onClose }) => {
  const { logout } = useApp();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { to: '/dashboard', icon: FiHome, label: 'Dashboard', color: 'from-blue-500 to-cyan-500' },
    { to: '/riders', icon: FiUsers, label: 'Riders', color: 'from-green-500 to-emerald-500' },
    { to: '/attendance', icon: FiList, label: 'Attendance', color: 'from-orange-500 to-amber-500' },
    { to: '/shipments', icon: FiTruck, label: 'Shipments', color: 'from-purple-500 to-violet-500' },
    { to: '/orders', icon: FiShoppingBag, label: 'Orders', color: 'from-pink-500 to-rose-500' },
    { to: '/customers', icon: FiUsers, label: 'Customers', color: 'from-indigo-500 to-blue-500' },
    { to: '/inventory', icon: FiPackage, label: 'Inventory', color: 'from-cyan-500 to-teal-500' },
    { to: '/returns', icon: FiRefreshCw, label: 'Returns', color: 'from-amber-500 to-orange-500' },
    { to: '/revenue', icon: FiDollarSign, label: 'Revenue', color: 'from-emerald-500 to-green-500' },
    { to: '/reports', icon: FiBarChart2, label: 'Reports', color: 'from-red-500 to-rose-500' },
    { to: '/settings', icon: FiSettings, label: 'Settings', color: 'from-gray-500 to-slate-500' },
  ];

  return (
    <motion.aside
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      className={`fixed left-0 top-0 h-screen z-50 transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}
    >
      <div className="h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700/50 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-700/50">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-purple-600 flex items-center justify-center">
                  <FiGrid className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-gray-900 dark:text-white">WRMS Pro</h1>
                  <p className="text-xs text-gray-500">v2.0</p>
                </div>
              </motion.div>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <FiX className={`w-5 h-5 text-gray-600 dark:text-gray-400 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink key={item.to} to={item.to} {...{ activeClassName: 'active' }}>
              {({ isActive }) => (
                <motion.div
                  whileHover={{ x: 4 }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r ' + item.color + ' text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isActive ? 'bg-white/20' : 'bg-gray-100 group-hover:bg-white/10 dark:group-hover:bg-white/10'
                  }`}>
                    <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-600 dark:text-gray-400 group-hover:text-primary-600'}`} />
                  </div>
                  {!collapsed && (
                    <span className={`font-medium ${isActive ? 'text-white' : 'group-hover:text-gray-900 dark:group-hover:text-white'}`}>
                      {item.label}
                    </span>
                  )}
                </motion.div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-gray-100 dark:border-gray-700/50">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-all duration-200"
          >
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
              <FiLogOut className="w-5 h-5" />
            </div>
            {!collapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;