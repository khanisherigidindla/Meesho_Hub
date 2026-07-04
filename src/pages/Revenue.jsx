import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiDownload, FiDollarSign, FiTrendingUp } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import SearchBox from '../components/SearchBox';
import Modal from '../components/Modal';
import { StatCard, EmptyState } from '../components/UIComponents';
import { PAYMENT_TYPE } from '../utils/constants';
import { downloadFile, getTodayDate } from '../utils/storage';

const Revenue = () => {
  const { revenue, addRevenue } = useApp();
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({
    date: getTodayDate(), paymentType: 'Cash', amount: '', deliveredOrders: '', cashCollected: '', onlinePayments: '', expenses: ''
  });

  const stats = useMemo(() => {
    const today = getTodayDate();
    const todayRevenue = revenue.filter((r) => r.date === today);
    const totalIncome = todayRevenue.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0);
    const cashTotal = todayRevenue.filter((r) => r.paymentType === 'Cash').reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0);
    const onlineTotal = todayRevenue.filter((r) => ['UPI', 'Card'].includes(r.paymentType)).reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0);
    const expenseTotal = todayRevenue.reduce((sum, r) => sum + (parseFloat(r.expenses) || 0), 0);
    return { totalIncome, cashTotal, onlineTotal, expenseTotal, netProfit: totalIncome - expenseTotal };
  }, [revenue]);

  const handleAdd = () => { addRevenue(form); setModal(null); setForm({ date: getTodayDate(), paymentType: 'Cash', amount: '', deliveredOrders: '', cashCollected: '', onlinePayments: '', expenses: '' }); };

  const handleExport = () => {
    const csv = `Date,Payment Type,Amount,Delivered Orders,Expenses\n${revenue.map(r => `${r.date},${r.paymentType},${r.amount},${r.deliveredOrders},${r.expenses}`).join('\n')}`;
    downloadFile(csv, `revenue-${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Revenue</h1>
        <div className="flex flex-wrap gap-2">
          <button onClick={handleExport} className="btn-secondary flex items-center gap-2 text-sm"><FiDownload className="w-4 h-4" /> Export CSV</button>
          <button onClick={() => setModal('add')} className="btn-primary flex items-center gap-2 text-sm"><FiPlus className="w-4 h-4" /> Add Entry</button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon={FiDollarSign} title="Today's Income" value={`₹${stats.totalIncome}`} color="green" />
        <StatCard icon={FiDollarSign} title="Cash" value={`₹${stats.cashTotal}`} color="blue" />
        <StatCard icon={FiDollarSign} title="Online" value={`₹${stats.onlineTotal}`} color="purple" />
        <StatCard icon={FiTrendingUp} title="Net Profit" value={`₹${stats.netProfit}`} color="green" />
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Revenue Entries</h2>
        {revenue.length === 0 ? <EmptyState icon={FiDollarSign} title="No Entries" description="Add your first revenue entry." action={<button onClick={() => setModal('add')} className="btn-primary">Add Entry</button>} /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-2">Date</th>
                  <th className="text-left py-3 px-2">Type</th>
                  <th className="text-left py-3 px-2">Amount</th>
                  <th className="text-left py-3 px-2 hidden md:table-cell">Expenses</th>
                </tr>
              </thead>
              <tbody>
                {revenue.map((r, i) => (
                  <motion.tr key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-gray-100 dark:border-gray-700/50">
                    <td className="py-3 px-2">{r.date || '-'}</td>
                    <td className="py-3 px-2">{r.paymentType || '-'}</td>
                    <td className="py-3 px-2 font-medium">₹{r.amount || 0}</td>
                    <td className="py-3 px-2 hidden md:table-cell">₹{r.expenses || 0}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={modal === 'add'} onClose={() => setModal(null)} title="Add Revenue Entry" size="lg">
        <form onSubmit={(e) => { e.preventDefault(); handleAdd(); }} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="label">Date *</label><input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="input-field" required /></div>
            <div><label className="label">Payment Type *</label><select value={form.paymentType} onChange={(e) => setForm({ ...form, paymentType: e.target.value })} className="input-field" required>
              {PAYMENT_TYPE?.map((t) => <option key={t} value={t}>{t}</option>)}
            </select></div>
            <div><label className="label">Amount *</label><input type="number" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="input-field" required /></div>
            <div><label className="label">Delivered Orders</label><input type="number" value={form.deliveredOrders} onChange={(e) => setForm({ ...form, deliveredOrders: e.target.value })} className="input-field" min="0" /></div>
            <div><label className="label">Cash Collected</label><input type="number" step="0.01" value={form.cashCollected} onChange={(e) => setForm({ ...form, cashCollected: e.target.value })} className="input-field" /></div>
            <div><label className="label">Online Payments</label><input type="number" step="0.01" value={form.onlinePayments} onChange={(e) => setForm({ ...form, onlinePayments: e.target.value })} className="input-field" /></div>
            <div><label className="label">Expenses</label><input type="number" step="0.01" value={form.expenses} onChange={(e) => setForm({ ...form, expenses: e.target.value })} className="input-field" /></div>
          </div>
          <div className="flex justify-end gap-3 pt-4"><button type="button" onClick={() => setModal(null)} className="btn-secondary">Cancel</button><button type="submit" className="btn-primary">Add Entry</button></div>
        </form>
      </Modal>
    </div>
  );
};

export default Revenue;