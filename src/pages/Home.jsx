import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FiBox, 
  FiUsers, 
  FiShoppingCart, 
  FiRefreshCw, 
  FiDollarSign,
  FiTruck,
  FiPackage,
  FiArrowRight,
  FiActivity,
  FiBarChart2,
  FiShield,
  FiZap,
  FiClock,
  FiMap
} from 'react-icons/fi';
import { useApp } from '../context/AppContext';

const Home = () => {
  const { riders, orders, inventory, returns, revenue } = useApp();
  const [greeting, setGreeting] = useState('Good Morning');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    { label: 'Total Riders', value: riders.length, icon: FiUsers, color: 'from-blue-500 to-cyan-500', change: '+12%' },
    { label: 'Total Orders', value: orders.length, icon: FiShoppingCart, color: 'from-purple-500 to-violet-500', change: '+8%' },
    { label: 'Inventory Items', value: inventory.length, icon: FiBox, color: 'from-green-500 to-emerald-500', change: '+5%' },
    { label: 'Revenue', value: `₹${revenue.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0)}`, icon: FiDollarSign, color: 'from-amber-500 to-orange-500', change: '+15%' },
  ];

  const features = [
    { to: '/riders', icon: FiUsers, label: 'Riders', description: 'Manage delivery personnel', gradient: 'from-blue-500 to-cyan-500' },
    { to: '/orders', icon: FiShoppingCart, label: 'Orders', description: 'Track and manage orders', gradient: 'from-purple-500 to-violet-500' },
    { to: '/inventory', icon: FiBox, label: 'Inventory', description: 'Warehouse stock management', gradient: 'from-green-500 to-emerald-500' },
    { to: '/shipments', icon: FiTruck, label: 'Shipments', description: 'Delivery tracking', gradient: 'from-pink-500 to-rose-500' },
    { to: '/customers', icon: FiUsers, label: 'Customers', description: 'Customer database', gradient: 'from-indigo-500 to-blue-500' },
    { to: '/returns', icon: FiRefreshCw, label: 'Returns', description: 'Handle returns', gradient: 'from-amber-500 to-orange-500' },
    { to: '/revenue', icon: FiDollarSign, label: 'Revenue', description: 'Financial tracking', gradient: 'from-emerald-500 to-green-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-slate-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            x: [0, 100, 0], 
            y: [0, -100, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute top-20 left-20 w-64 h-64 bg-primary-200/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            x: [0, -50, 0], 
            y: [0, 100, 0],
            rotate: [360, 180, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-20 right-20 w-80 h-80 bg-purple-300/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-200/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6 lg:p-8">
        {/* Header Section with Greeting */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-600 to-purple-600 mb-6 shadow-2xl">
            <FiShield className="w-10 h-10 text-white" />
          </div>
          
          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3"
          >
            {greeting}, Admin! 👋
          </motion.h1>
          
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">
            Welcome to WRMS Pro - Your warehouse command center
          </p>
          
          <div className="flex items-center justify-center gap-2 text-gray-500">
            <FiClock className="w-4 h-4" />
            <span>{currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} • {currentTime.toLocaleDateString('en-IN')}</span>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="stat-card text-center"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} mx-auto mb-4 flex items-center justify-center shadow-lg`}>
                <stat.icon className="w-7 h-7 text-white" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <div className="mt-2 flex items-center justify-center gap-1 text-xs text-green-600">
                <FiZap className="w-3 h-3" />
                <span>{stat.change} this week</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Animated Toy Element - Floating Boxes */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center mb-16"
        >
          <div className="relative w-64 h-64">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -30, 0],
                  x: [0, i % 2 === 0 ? 20 : -20, 0],
                  rotate: [0, 360, 0],
                }}
                transition={{
                  duration: 3 + i,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className={`absolute w-16 h-16 rounded-2xl bg-gradient-to-br ${
                  i % 3 === 0 ? 'from-primary-400 to-primary-600' : 
                  i % 3 === 1 ? 'from-purple-400 to-purple-600' : 
                  'from-green-400 to-green-600'
                } shadow-xl flex items-center justify-center`}
                style={{
                  top: `${(i * 25) % 80}%`,
                  left: `${(i * 30) % 70}%`,
                }}
              >
                <FiBox className="w-8 h-8 text-white" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8 flex items-center justify-center gap-2">
            <FiBarChart2 className="w-6 h-6 text-primary-600" />
            Quick Actions
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.to}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.05 }}
                whileHover={{ scale: 1.03, y: -5 }}
                className="group"
              >
                <Link to={feature.to} className="block">
                  <div className="card-hover p-6 text-center h-full">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} mx-auto mb-4 flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-shadow`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.label}</h3>
                    <p className="text-gray-500 text-sm mb-4">{feature.description}</p>
                    <div className="flex items-center justify-center gap-2 text-primary-600 font-medium">
                      Open <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Live Activity Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm text-gray-600 dark:text-gray-400">All systems operational</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;