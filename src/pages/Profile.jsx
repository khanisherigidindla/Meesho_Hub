import { motion } from 'framer-motion';
import { FiUser, FiMail, FiMapPin, FiPackage } from 'react-icons/fi';
import { useApp } from '../context/AppContext';

const Profile = () => {
  const { settings, auth, getStats } = useApp();
  const stats = getStats();

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 rounded-2xl bg-primary-600 flex items-center justify-center text-white text-3xl font-bold">
            {settings.adminName?.charAt(0) || 'A'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{settings.adminName}</h2>
            <p className="text-gray-500">Warehouse Administrator</p>
            <p className="text-sm text-primary-600 mt-1">{auth?.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <InfoRow icon={FiUser} label="Admin Name" value={settings.adminName} />
          <InfoRow icon={FiMail} label="Email" value={auth?.email} />
          <InfoRow icon={FiPackage} label="Warehouse" value={settings.warehouseName} />
          <InfoRow icon={FiMapPin} label="Address" value={settings.warehouseAddress || 'Not set'} />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Stats</h3>
        <div className="grid grid-cols-2 gap-4">
          <Stat label="Total Riders" value={stats.totalRiders} />
          <Stat label="Active Riders" value={stats.activeRiders} />
          <Stat label="Today's Present" value={stats.todayPresent} />
          <Stat label="Total Shipments" value={stats.totalShipments} />
        </div>
      </motion.div>
    </div>
  );
};

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
    <Icon className="w-5 h-5 text-primary-600 mt-0.5" />
    <div>
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p className="font-medium text-gray-900 dark:text-white">{value}</p>
    </div>
  </div>
);

const Stat = ({ label, value }) => (
  <div className="text-center p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20">
    <p className="text-2xl font-bold text-primary-700 dark:text-primary-300">{value}</p>
    <p className="text-xs text-gray-500 mt-1">{label}</p>
  </div>
);

export default Profile;
