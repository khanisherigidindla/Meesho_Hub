import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FiUsers,
  FiUserCheck,
  FiUserX,
  FiUserPlus,
  FiPackage,
  FiPlus,
} from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import Avatar, { StatCard, Badge } from '../components/UIComponents';
import { formatDate } from '../utils/storage';

const Dashboard = () => {
  const { getStats, settings } = useApp();
  const stats = getStats();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Welcome back, {settings.adminName}
          </p>
        </div>
        <Link to="/riders" state={{ openAdd: true }} className="btn-primary flex items-center gap-2 w-fit">
          <FiPlus className="w-4 h-4" />
          Quick Add Rider
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <StatCard icon={FiUsers} title="Total Riders" value={stats.totalRiders} color="blue" delay={0} />
        <StatCard icon={FiUserCheck} title="Active Riders" value={stats.activeRiders} color="green" delay={0.05} />
        <StatCard icon={FiUserX} title="Inactive Riders" value={stats.inactiveRiders} color="gray" delay={0.1} />
        <StatCard icon={FiUserCheck} title="Today's Present" value={stats.todayPresent} color="green" delay={0.15} />
        <StatCard icon={FiUserX} title="Today's Absent" value={stats.todayAbsent} color="red" delay={0.2} />
        <StatCard icon={FiUserPlus} title="New Riders (Month)" value={stats.newRiders} color="purple" delay={0.25} />
        <StatCard icon={FiPackage} title="Total Shipments" value={stats.totalShipments} color="blue" delay={0.3} />
        <StatCard icon={FiPackage} title="Delivered Today" value={stats.deliveredToday} color="green" delay={0.35} />
      </div>

      {stats.latestRider && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Latest Added Rider
          </h2>
          <div className="flex items-center gap-4">
            <Avatar src={stats.latestRider.photo} name={stats.latestRider.fullName} size="lg" />
            <div className="flex-1">
              <p className="font-semibold text-gray-900 dark:text-white">
                {stats.latestRider.fullName || 'Unnamed'}
              </p>
              <p className="text-sm text-gray-500">{stats.latestRider.riderId || 'No ID'}</p>
              <p className="text-sm text-gray-500">{stats.latestRider.phone || '-'}</p>
            </div>
            <div className="text-right">
              <Badge status={stats.latestRider.employmentStatus || 'Inactive'} />
              <p className="text-xs text-gray-400 mt-2">
                Joined: {formatDate(stats.latestRider.dateOfJoining)}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;
