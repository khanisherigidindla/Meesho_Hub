import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSave, FiDownload, FiUpload, FiTrash2, FiMoon, FiSun, FiSettings } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import ConfirmModal from '../components/ConfirmModal';
import { exportAllData, downloadFile, readFileAsText } from '../utils/storage';
import { STORAGE_KEYS, THEME_COLORS } from '../utils/constants';

const Settings = () => {
  const { settings, setSettings, restoreData, riders, attendance, shipments, theme, toggleTheme } = useApp();
  const [form, setForm] = useState({ ...settings });
  const [saved, setSaved] = useState(false);
  const [showClear, setShowClear] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleBackup = () => {
    const data = exportAllData();
    downloadFile(JSON.stringify(data, null, 2), `wrms-backup-${new Date().toISOString().split('T')[0]}.json`, 'application/json');
  };

  const handleRestore = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const text = await readFileAsText(file);
      const data = JSON.parse(text);
      restoreData(data);
      if (data[STORAGE_KEYS.SETTINGS]) setForm(data[STORAGE_KEYS.SETTINGS]);
      alert('Data restored successfully!');
    } catch {
      alert('Invalid backup file');
    }
    e.target.value = '';
  };

  const handleClearAll = () => {
    Object.values(STORAGE_KEYS).forEach((key) => {
      if (key !== STORAGE_KEYS.AUTH) localStorage.removeItem(key);
    });
    window.location.reload();
  };

  const handleThemeColorChange = (color) => {
    setForm((prev) => ({ ...prev, themeColor: color }));
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-600 to-slate-700 flex items-center justify-center">
          <FiSettings className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
      </motion.div>

      {/* Theme Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
<h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FiSettings className="w-5 h-5 text-primary-600" />
            Theme Settings
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="label mb-3">Color Theme</label>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
              {THEME_COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => handleThemeColorChange(color.value)}
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br from-${color.value}-500 to-${color.value}-600 
                    ${form.themeColor === color.value ? 'ring-2 ring-offset-2 ring-gray-900 dark:ring-white' : ''}
                    hover:scale-110 transition-transform`}
                  title={color.name}
                />
              ))}
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
            <button
              onClick={toggleTheme}
              className="btn-secondary flex items-center gap-2"
            >
              {theme === 'light' ? <FiMoon className="w-4 h-4" /> : <FiSun className="w-4 h-4" />}
              Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
            </button>
          </div>
        </div>
      </motion.div>

      {/* Warehouse Information */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        onSubmit={handleSave}
        className="card space-y-4"
      >
        <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <FiSave className="w-5 h-5 text-primary-600" />
          Warehouse Information
        </h2>
        <div>
          <label className="label">Warehouse Name</label>
          <input type="text" name="warehouseName" value={form.warehouseName || ''} onChange={handleChange} className="input-field" />
        </div>
        <div>
          <label className="label">Admin Name</label>
          <input type="text" name="adminName" value={form.adminName || ''} onChange={handleChange} className="input-field" />
        </div>
        <div>
          <label className="label">Warehouse Address</label>
          <textarea name="warehouseAddress" value={form.warehouseAddress || ''} onChange={handleChange} rows={3} className="input-field resize-none" />
        </div>
        <button type="submit" className="btn-primary flex items-center gap-2">
          <FiSave className="w-4 h-4" />
          {saved ? 'Saved!' : 'Save Settings'}
        </button>
      </motion.form>

      {/* Backup & Restore */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card space-y-4"
      >
        <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <FiDownload className="w-5 h-5 text-primary-600" />
          Backup & Restore
        </h2>
        <p className="text-sm text-gray-500">
          Export all data as JSON backup. Restore from a previous backup file.
        </p>
        <div className="flex flex-wrap gap-3">
          <button onClick={handleBackup} className="btn-secondary flex items-center gap-2">
            <FiDownload className="w-4 h-4" /> Backup JSON
          </button>
          <label className="btn-secondary flex items-center gap-2 cursor-pointer">
            <FiUpload className="w-4 h-4" /> Restore JSON
            <input type="file" accept=".json" onChange={handleRestore} className="hidden" />
          </label>
        </div>
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500">
          <p>Riders: {riders.length} | Attendance: {attendance.length} | Shipments: {shipments.length}</p>
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card border-red-200 dark:border-red-800"
      >
        <h2 className="font-semibold text-red-600 mb-2 flex items-center gap-2">
          <FiTrash2 className="w-5 h-5" />
          Danger Zone
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Clear all riders, attendance, and shipment data. This cannot be undone.
        </p>
        <button onClick={() => setShowClear(true)} className="btn-danger flex items-center gap-2">
          <FiTrash2 className="w-4 h-4" /> Clear All Data
        </button>
      </motion.div>

      <ConfirmModal
        isOpen={showClear}
        onClose={() => setShowClear(false)}
        onConfirm={handleClearAll}
        title="Clear All Data"
        message="This will permanently delete all riders, attendance, and shipment records. Your login session will remain active."
        confirmText="Clear All"
      />
    </div>
  );
};

export default Settings;