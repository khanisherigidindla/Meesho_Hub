import { motion } from 'framer-motion';
import { FiBarChart2, FiTrendingUp, FiShoppingBag, FiRefreshCw, FiDollarSign, FiUsers } from 'react-icons/fi';
import { useApp } from '../context/AppContext';

const Reports = () => {
  const { riders, orders, revenue, attendance, shipments, inventory } = useApp();

  // Calculate statistics
  const stats = {
    totalRiders: riders.length,
    activeRiders: riders.filter(r => r.employmentStatus === 'Active').length,
    totalOrders: orders.length,
    deliveredOrders: orders.filter(o => o.deliveryStatus === 'Delivered').length,
    totalRevenue: revenue.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0),
    totalShipments: shipments.length,
    totalInventory: inventory.reduce((sum, i) => sum + (parseInt(i.quantity) || 0), 0),
  };

  // Chart data
  const orderStatusData = ['Pending', 'Out for Delivery', 'Delivered', 'Cancelled'].map(status => ({
    status,
    count: orders.filter(o => o.deliveryStatus === status).length,
    color: {
      'Pending': 'from-amber-500 to-orange-500',
      'Out for Delivery': 'from-blue-500 to-cyan-500',
      'Delivered': 'from-green-500 to-emerald-500',
      'Cancelled': 'from-red-500 to-rose-500',
    }[status]
  }));

  const revenueByPayment = ['Cash', 'Card', 'UPI'].map(type => ({
    type,
    amount: revenue.filter(r => r.paymentType === type).reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0),
    color: {
      'Cash': 'from-green-500 to-emerald-500',
      'Card': 'from-purple-500 to-violet-500',
      'UPI': 'from-blue-500 to-cyan-500',
    }[type]
  }));

  const inventoryByCategory = {};
  inventory.forEach(item => {
    const category = item.category || 'Other';
    inventoryByCategory[category] = (inventoryByCategory[category] || 0) + (parseInt(item.quantity) || 0);
  });

  const barChartColors = ['from-blue-500 to-cyan-500', 'from-purple-500 to-violet-500', 'from-emerald-500 to-green-500', 'from-orange-500 to-amber-500', 'from-pink-500 to-rose-500'];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center">
          <FiBarChart2 className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="stat-card text-center">
          <FiUsers className="w-8 h-8 mx-auto mb-2 text-blue-600" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalRiders}</p>
          <p className="text-sm text-gray-500">Total Riders</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="stat-card text-center">
          <FiShoppingBag className="w-8 h-8 mx-auto mb-2 text-purple-600" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalOrders}</p>
          <p className="text-sm text-gray-500">Total Orders</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="stat-card text-center">
          <FiDollarSign className="w-8 h-8 mx-auto mb-2 text-emerald-600" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{stats.totalRevenue.toLocaleString()}</p>
          <p className="text-sm text-gray-500">Total Revenue</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="stat-card text-center">
          <FiRefreshCw className="w-8 h-8 mx-auto mb-2 text-amber-600" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalShipments}</p>
          <p className="text-sm text-gray-500">Total Shipments</p>
        </motion.div>
      </div>

      {/* Orders by Status Bar Chart */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="card">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <FiShoppingBag className="w-5 h-5 text-primary-600" />
          Orders by Status
        </h2>
        <div className="space-y-4">
          {orderStatusData.map((item, idx) => {
            const percentage = stats.totalOrders ? ((item.count / stats.totalOrders) * 100).toFixed(1) : 0;
            return (
              <div key={item.status} className="flex items-center gap-3">
                <div className="w-24 text-sm font-medium text-gray-700 dark:text-gray-300">{item.status}</div>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-6 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, delay: 0.4 + idx * 0.1 }}
                    className={`h-full rounded-full bg-gradient-to-r ${item.color} flex items-center justify-end pr-2`}
                  >
                    <span className="text-xs text-white font-semibold">{item.count}</span>
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Revenue by Payment Type */}
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="card">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <FiDollarSign className="w-5 h-5 text-emerald-600" />
          Revenue by Payment Type
        </h2>
        <div className="space-y-4">
          {revenueByPayment.map((item, idx) => {
            const total = revenueByPayment.reduce((sum, r) => sum + r.amount, 0) || 1;
            const percentage = ((item.amount / total) * 100).toFixed(1);
            return (
              <div key={item.type} className="flex items-center gap-3">
                <div className="w-24 text-sm font-medium text-gray-700 dark:text-gray-300">{item.type}</div>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-6 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, delay: 0.4 + idx * 0.1 }}
                    className={`h-full rounded-full bg-gradient-to-r ${item.color} flex items-center justify-end pr-2`}
                  >
                    <span className="text-xs text-white font-semibold">₹{item.amount.toLocaleString()}</span>
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Monthly Revenue Trend */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <FiTrendingUp className="w-5 h-5 text-blue-600" />
          Monthly Revenue Trend
        </h2>
        <div className="h-64 flex items-end gap-2 pt-4">
          {[...Array(6)].map((_, i) => {
            const height = 20 + Math.random() * 180;
            const month = new Date(2025, i, 1).toLocaleString('en', { month: 'short' });
            return (
              <div key={i} className="flex-1 flex flex-col items-center">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${height}px` }}
                  transition={{ duration: 0.8, delay: 0.5 + i * 0.05 }}
                  className={`w-full bg-gradient-to-t from-primary-600 to-purple-500 rounded-t-lg`}
                />
                <span className="text-xs text-gray-500 mt-2">{month}</span>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default Reports;