import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FiUsers,
  FiUserCheck,
  FiUserX,
  FiUserPlus,
  FiPackage,
  FiPlus,
  FiShoppingCart,
  FiRefreshCw,
  FiDollarSign,
  FiTrendingUp,
  FiActivity,
} from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import { StatCard, Badge } from '../components/UIComponents';
import { formatDate, getTodayDate } from '../utils/storage';

const Dashboard = () => {
  const { getStats, settings, riders, orders, revenue, inventory } = useApp();
  const stats = getStats();

  // Revenue by payment type
  const revenueByPayment = revenue.reduce((acc, r) => {
    acc[r.paymentType] = (acc[r.paymentType] || 0) + (parseFloat(r.amount) || 0);
    return acc;
  }, {});

  // Orders by status
  const ordersByStatus = orders.reduce((acc, o) => {
    acc[o.deliveryStatus] = (acc[o.deliveryStatus] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <FiActivity className="w-6 h-6 text-white" />
            </div>
            Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Welcome back, {settings?.adminName || 'Admin'} • {formatDate(new Date().toISOString())}
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/riders" state={{ openAdd: true }} className="btn-secondary flex items-center gap-2">
            <FiUserPlus className="w-4 h-4" />
            Add Rider
          </Link>
          <Link to="/orders" state={{ openAdd: true }} className="btn-primary flex items-center gap-2">
            <FiPlus className="w-4 h-4" />
            New Order
          </Link>
        </div>
      </motion.div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={FiUsers} 
          title="Total Riders" 
          value={stats.totalRiders} 
          color="blue" 
          delay={0} 
          change={stats.newRiders > 0 ? `+${stats.newRiders} new` : undefined}
        />
        <StatCard 
          icon={FiUserCheck} 
          title="Active Riders" 
          value={stats.activeRiders} 
          color="green" 
          delay={0.05} 
        />
        <StatCard 
          icon={FiShoppingCart} 
          title="Today's Orders" 
          value={stats.todayOrders} 
          color="purple" 
          delay={0.1} 
        />
        <StatCard 
          icon={FiPackage} 
          title="Total Stock" 
          value={stats.totalStock} 
          color="indigo" 
          delay={0.15} 
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={FiUserCheck} 
          title="Present Today" 
          value={stats.todayPresent} 
          color="green" 
          delay={0.2} 
        />
        <StatCard 
          icon={FiUserX} 
          title="Absent Today" 
          value={stats.todayAbsent} 
          color="red" 
          delay={0.25} 
        />
        <StatCard 
          icon={FiDollarSign} 
          title="Today's Revenue" 
          value={`₹${stats.todayRevenue}`} 
          color="emerald" 
          delay={0.3} 
        />
        <StatCard 
          icon={FiPackage} 
          title="Low Stock Alerts" 
          value={stats.lowStockAlerts} 
          color={stats.lowStockAlerts > 0 ? "orange" : "gray"} 
          delay={0.35} 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders Status Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FiShoppingCart className="w-5 h-5 text-primary-600" />
            Orders by Status
          </h2>
          <div className="space-y-3">
            {['Pending', 'Out for Delivery', 'Delivered', 'Cancelled'].map((status) => {
              const count = ordersByStatus[status] || 0;
              const total = orders.length || 1;
              const percentage = ((count / total) * 100).toFixed(1);
              const colors = {
                'Pending': 'from-amber-500 to-orange-500',
                'Out for Delivery': 'from-blue-500 to-cyan-500',
                'Delivered': 'from-green-500 to-emerald-500',
                'Cancelled': 'from-red-500 to-rose-500',
              };
              return (
                <div key={status} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{status}</span>
                      <span className="text-sm text-gray-500">{count}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className={`h-2 rounded-full bg-gradient-to-r ${colors[status]}`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FiDollarSign className="w-5 h-5 text-emerald-600" />
            Revenue by Payment Type
          </h2>
          <div className="space-y-3">
            {['Cash', 'Card', 'UPI'].map((type) => {
              const amount = revenueByPayment[type] || 0;
              const total = Object.values(revenueByPayment).reduce((a, b) => a + b, 0) || 1;
              const percentage = ((amount / total) * 100).toFixed(1);
              const colors = {
                'Cash': 'from-green-500 to-emerald-500',
                'Card': 'from-purple-500 to-violet-500',
                'UPI': 'from-blue-500 to-cyan-500',
              };
              return (
                <div key={type} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{type}</span>
                      <span className="text-sm text-gray-500">₹{amount}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className={`h-2 rounded-full bg-gradient-to-r ${colors[type]}`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Latest Rider Card */}
      {stats.latestRider && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card-hover"
        >
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FiUserPlus className="w-5 h-5 text-primary-600" />
            Latest Added Rider
          </h2>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
              {stats.latestRider.fullName?.charAt(0) || 'R'}
            </div>
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-500">Name</p>
                <p className="font-semibold text-gray-900 dark:text-white">{stats.latestRider.fullName || 'Unnamed'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Rider ID</p>
                <p className="font-semibold text-gray-900 dark:text-white">{stats.latestRider.riderId || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Phone</p>
                <p className="font-semibold text-gray-900 dark:text-white">{stats.latestRider.phone || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <Badge status={stats.latestRider.employmentStatus || 'Inactive'} />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="stat-card text-center">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 mx-auto mb-3 flex items-center justify-center">
            <FiShoppingCart className="w-5 h-5 text-white" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{orders.length}</p>
          <p className="text-sm text-gray-500">Total Orders</p>
        </div>
        <div className="stat-card text-center">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 mx-auto mb-3 flex items-center justify-center">
            <FiRefreshCw className="w-5 h-5 text-white" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{revenue.length}</p>
          <p className="text-sm text-gray-500">Revenue Entries</p>
        </div>
        <div className="stat-card text-center">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 mx-auto mb-3 flex items-center justify-center">
            <FiDollarSign className="w-5 h-5 text-white" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{stats.cashCollected || 0}</p>
          <p className="text-sm text-gray-500">Cash Collected Today</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;