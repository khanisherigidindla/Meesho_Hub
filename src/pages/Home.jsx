import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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
  FiMap,
  FiAlertCircle,
  FiCheckCircle,
  FiXCircle,
  FiTarget,
  FiTrendingUp,
  FiSend,
  FiStar,
  FiAward,
  FiCalendar,
  FiFileText,
  FiPieChart,
  FiCheck,
  FiMessageSquare,
} from 'react-icons/fi';
import { useApp } from '../context/AppContext';

const Home = () => {
  const { riders, orders, inventory, returns, revenue, attendance } = useApp();
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

  // Calculate Today's Work Center
  const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString());
  const ordersToDispatch = todayOrders.filter(o => o.deliveryStatus === 'Pending').length;
  const delayedOrders = todayOrders.filter(o => o.deliveryStatus === 'Out for Delivery' && new Date(o.expectedDelivery) < new Date()).length;
  const ridersNotAssigned = riders.filter(r => r.employmentStatus === 'Active' && !orders.some(o => o.riderId === r.riderId && o.deliveryStatus === 'Out for Delivery')).length;
  const absentRiders = attendance.filter(a => a.date === new Date().toISOString().split('T')[0] && a.status === 'Absent').length;
  const lowStockProducts = inventory.filter(i => (parseInt(i.quantity) || 0) < 5).length;
  const returnsToMeesho = returns.filter(r => r.returnStatus !== 'Completed').length;
  
  // Smart Notifications
  const notifications = [
    { id: 1, type: 'warning', text: `${delayedOrders} orders are delayed`, icon: FiAlertCircle, color: 'text-amber-500' },
    { id: 2, type: 'warning', text: `${ridersNotAssigned} riders not assigned`, icon: FiXCircle, color: 'text-orange-500' },
    { id: 3, type: 'warning', text: `${lowStockProducts} products low stock`, icon: FiAlertCircle, color: 'text-red-500' },
    { id: 4, type: 'warning', text: `${returnsToMeesho} returns pending`, icon: FiRefreshCw, color: 'text-blue-500' },
    { id: 5, type: 'success', text: `${ordersToDispatch} orders ready for dispatch`, icon: FiCheckCircle, color: 'text-green-500' },
  ].filter(n => n.text.match(/\d+/)[0] !== '0');

  // Warehouse KPI Score
  const totalRevenue = revenue.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0);
  const kpiScore = Math.min(100, Math.round(
    (ordersToDispatch > 0 ? 20 : 0) +
    (riders.filter(r => r.employmentStatus === 'Active').length / Math.max(riders.length, 1) * 20) +
    (inventory.length > 0 ? 20 : 0) +
    (totalRevenue > 0 ? 20 : 0) +
    (attendance.length > 0 ? 20 : 0)
  ));

  // Order Priority data
  const orderPriorities = {
    urgent: orders.filter(o => o.priority === 'Urgent').length,
    high: orders.filter(o => o.priority === 'High').length,
    medium: orders.filter(o => o.priority === 'Medium').length,
    low: orders.filter(o => o.priority === 'Low' || !o.priority).length,
  };

  const stats = [
    { label: 'Orders to Dispatch', value: ordersToDispatch, icon: FiShoppingCart, color: 'from-blue-500 to-cyan-500', to: '/orders' },
    { label: 'Delayed Orders', value: delayedOrders, icon: FiAlertCircle, color: 'from-red-500 to-rose-600', to: '/orders' },
    { label: 'Riders Not Assigned', value: ridersNotAssigned, icon: FiTruck, color: 'from-amber-500 to-orange-600', to: '/riders' },
    { label: 'Low Stock Products', value: lowStockProducts, icon: FiPackage, color: 'from-purple-500 to-violet-600', to: '/inventory' },
  ];

  const features = [
    { to: '/riders', icon: FiUsers, label: 'Riders', description: 'Manage delivery personnel', gradient: 'from-blue-500 to-cyan-500' },
    { to: '/orders', icon: FiShoppingCart, label: 'Orders', description: 'Track and manage orders', gradient: 'from-purple-500 to-violet-500' },
    { to: '/inventory', icon: FiBox, label: 'Inventory', description: 'Warehouse stock management', gradient: 'from-green-500 to-emerald-500' },
    { to: '/shipments', icon: FiTruck, label: 'Shipments', description: 'Delivery tracking', gradient: 'from-pink-500 to-rose-500' },
    { to: '/customers', icon: FiUsers, label: 'Customers', description: 'Customer database', gradient: 'from-indigo-500 to-blue-500' },
    { to: '/returns', icon: FiRefreshCw, label: 'Returns', description: 'Handle returns', gradient: 'from-amber-500 to-orange-500' },
    { to: '/reports', icon: FiBarChart2, label: 'Reports', description: 'Analytics & insights', gradient: 'from-red-500 to-rose-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-slate-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, -100, 0], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute top-20 left-20 w-64 h-64 bg-primary-200/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -50, 0], y: [0, 100, 0], rotate: [360, 180, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-20 right-20 w-80 h-80 bg-purple-300/20 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header with Greeting */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-primary-600 to-purple-600 mb-4 sm:mb-6 shadow-2xl">
            <FiShield className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {greeting}, Admin! 👋
          </h1>
<p className="text-gray-600 dark:text-gray-400 text-sm sm:text-lg mb-2">
            Meesho_HUb - Professional Warehouse Management
          </p>
          <div className="flex items-center justify-center gap-2 text-gray-500 text-xs sm:text-sm">
            <FiClock className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>{currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} • {currentTime.toLocaleDateString('en-IN')}</span>
          </div>
        </motion.div>

        {/* Smart Notifications */}
        {notifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6 sm:mb-8"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <FiActivity className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" /> Smart Notifications
            </h2>
            <div className="flex flex-wrap gap-2">
              {notifications.map((n, i) => (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm`}
                >
                  <n.icon className={`w-3 h-3 sm:w-4 sm:h-4 ${n.color}`} />
                  <span className="text-gray-700 dark:text-gray-300">{n.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Today's Work Center */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6 sm:mb-8"
        >
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FiTarget className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" /> Today's Work Center
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="stat-card text-center"
              >
                <Link to={stat.to} className="block">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${stat.color} mx-auto mb-3 sm:mb-4 flex items-center justify-center shadow-lg`}>
                    <stat.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  <p className="text-xs sm:text-sm text-gray-500">{stat.label}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Warehouse KPI Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-6 sm:mb-8"
        >
          <div className="card bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <FiPieChart className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" /> Warehouse Health Score
            </h2>
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="none" className="text-gray-200" />
                  <motion.circle
                    cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="none"
                    className="text-primary-600"
                    strokeDasharray="251.2"
                    initial={{ strokeDashoffset: 251.2 }}
                    animate={{ strokeDashoffset: 251.2 - (kpiScore / 100) * 251.2 }}
                    transition={{ duration: 1 }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl sm:text-3xl font-bold text-primary-600">{kpiScore}%</span>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-2">Warehouse operational health</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs sm:text-sm">
                  <div className="flex items-center gap-1"><FiCheck className="w-3 h-3 text-green-500" /> Deliveries</div>
                  <div className="flex items-center gap-1"><FiCheck className="w-3 h-3 text-green-500" /> Revenue</div>
                  <div className="flex items-center gap-1"><FiCheck className="w-3 h-3 text-green-500" /> Attendance</div>
                  <div className="flex items-center gap-1"><FiCheck className="w-3 h-3 text-green-500" /> Inventory</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Order Priority */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-6 sm:mb-8"
        >
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <FiStar className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" /> Order Priority
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <PriorityCard label="Low" count={orderPriorities.low} color="from-green-500 to-emerald-500" />
            <PriorityCard label="Medium" count={orderPriorities.medium} color="from-yellow-500 to-amber-500" />
            <PriorityCard label="High" count={orderPriorities.high} color="from-orange-500 to-red-500" />
            <PriorityCard label="Urgent" count={orderPriorities.urgent} color="from-red-600 to-rose-600" />
          </div>
        </motion.div>

        {/* Animated Toy Element */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex justify-center mb-12 sm:mb-16"
        >
          <div className="relative w-48 h-48 sm:w-64 sm:h-64">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -30, 0], x: [0, i % 2 === 0 ? 20 : -20, 0], rotate: [0, 360, 0] }}
                transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.2 }}
                className={`absolute w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${
                  i % 3 === 0 ? 'from-primary-400 to-primary-600' : 
                  i % 3 === 1 ? 'from-purple-400 to-purple-600' : 
                  'from-green-400 to-green-600'
                } shadow-xl flex items-center justify-center`}
                style={{ top: `${(i * 25) % 80}%`, left: `${(i * 30) % 70}%` }}
              >
                <FiBox className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white text-center mb-6 flex items-center justify-center gap-2">
            <FiBarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" /> Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.to}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + i * 0.05 }}
                whileHover={{ scale: 1.03, y: -5 }}
                className="group"
              >
                <Link to={feature.to} className="block">
                  <div className="card-hover p-4 sm:p-6 text-center h-full">
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} mx-auto mb-3 sm:mb-4 flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-shadow`}>
                      <feature.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.label}</h3>
                    <p className="text-gray-500 text-xs sm:text-sm mb-3 sm:mb-4">{feature.description}</p>
                    <div className="flex items-center justify-center gap-2 text-primary-600 font-medium text-xs sm:text-sm">
                      Open <FiArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const PriorityCard = ({ label, count, color }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 text-center border border-gray-200 dark:border-gray-700">
    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br ${color} mx-auto mb-2 flex items-center justify-center`}>
      <span className="text-white font-bold text-xs sm:text-sm">{count}</span>
    </div>
    <p className="font-medium text-gray-900 dark:text-white text-xs sm:text-sm">{label}</p>
  </div>
);

export default Home;