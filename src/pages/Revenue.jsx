import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiDownload, FiPrinter, FiDollarSign, FiTrendingUp } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import SearchBox from '../components/SearchBox';
import Modal from '../components/Modal';
import { StatCard, EmptyState } from '../components/UIComponents';
import { PAYMENT_TYPE } from '../utils/constants';
import { downloadFile, getTodayDate } from '../utils/storage';

const Revenue = () => {
  const { revenue, addRevenue, updateRevenue, deleteRevenue } = useApp();
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({
    date: getTodayDate(),
    paymentType: 'Cash',
    amount: '',
    deliveredOrders: '',
    cashCollected: '',
    onlinePayments: '',
    expenses: ''
  });

  // Current time display
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const stats = useMemo(() => {
    // Calculate ALL-TIME totals (not just today)
    const totalIncome = revenue.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0);
    const cashTotal = revenue.filter((r) => r.paymentType === 'Cash').reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0);
    const upiTotal = revenue.filter((r) => ['PhonePe', 'Google Pay', 'Paytm', 'UPI'].includes(r.paymentType)).reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0);
    const cardTotal = revenue.filter((r) => r.paymentType === 'Card').reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0);
    const codTotal = revenue.filter((r) => r.paymentType === 'COD').reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0);
    const bankTotal = revenue.filter((r) => r.paymentType === 'Bank Transfer').reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0);
    const pendingCodTotal = revenue.filter((r) => r.paymentType === 'Pending COD').reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0);
    const expenseTotal = revenue.reduce((sum, r) => sum + (parseFloat(r.expenses) || 0), 0);
    const netProfit = totalIncome - expenseTotal;
    return { 
      totalIncome, 
      cashTotal, 
      upiTotal, 
      cardTotal, 
      codTotal, 
      bankTotal,
      pendingCodTotal,
      expenseTotal, 
      netProfit 
    };
  }, [revenue]);

  const handleAdd = () => {
    if (!form.amount || parseFloat(form.amount) <= 0) return;
    addRevenue(form);
    setModal(null);
    setForm({ date: getTodayDate(), paymentType: 'Cash', amount: '', deliveredOrders: '', cashCollected: '', onlinePayments: '', expenses: '' });
  };

  const handleExport = () => {
    const csv = `Date,Payment Type,Amount,Delivered Orders,Cash Collected,Online Payments,Expenses\n${revenue.map(r =>
      `${r.date},${r.paymentType},${r.amount},${r.deliveredOrders || ''},${r.cashCollected || ''},${r.onlinePayments || ''},${r.expenses || ''}`
    ).join('\n')}`;
    downloadFile(csv, `revenue-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Revenue - Meesho Warehouse</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background: #3b82f6; color: white; }
          </style>
        </head>
        <body>
          <h1>Revenue Report - Meesho Warehouse</h1>
          <p>Generated on: ${new Date().toLocaleString()}</p>
          <p>Total Revenue: ₹${stats.totalIncome} | Expenses: ₹${stats.expenseTotal} | Net Profit: ₹${stats.netProfit}</p>
          <table>
            <thead>
              <tr>
                <th>Date</th><th>Type</th><th>Amount</th><th>Expenses</th>
              </tr>
            </thead>
            <tbody>
              ${revenue.map(r => `<tr>
                <td>${r.date}</td>
                <td>${r.paymentType}</td>
                <td>₹${r.amount || 0}</td>
                <td>₹${r.expenses || 0}</td>
              </tr>`).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
              <FiDollarSign className="w-6 h-6 text-white" />
            </div>
            Revenue
          </h1>
          <p className="text-gray-500 mt-1">{currentTime.toLocaleTimeString('en-IN')} • {currentTime.toLocaleDateString('en-IN')}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={handlePrint} className="btn-secondary flex items-center gap-2 text-sm">
            <FiPrinter className="w-4 h-4" /> Print
          </button>
          <button onClick={handleExport} className="btn-secondary flex items-center gap-2 text-sm">
            <FiDownload className="w-4 h-4" /> Export
          </button>
          <button onClick={() => setModal('add')} className="btn-primary flex items-center gap-2">
            <FiPlus className="w-4 h-4" /> Add Entry
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <StatCard icon={FiDollarSign} title="Total Revenue" value={`₹${stats.totalIncome.toLocaleString()}`} color="green" />
        <StatCard icon={FiDollarSign} title="Cash Revenue" value={`₹${stats.cashTotal.toLocaleString()}`} color="blue" />
        <StatCard icon={FiDollarSign} title="UPI Revenue" value={`₹${stats.upiTotal.toLocaleString()}`} color="purple" />
        <StatCard icon={FiDollarSign} title="COD Revenue" value={`₹${stats.codTotal.toLocaleString()}`} color="indigo" />
        <StatCard icon={FiDollarSign} title="Online Revenue" value={`₹${stats.cardTotal.toLocaleString()}`} color="cyan" />
        <StatCard icon={FiDollarSign} title="Bank Transfer" value={`₹${stats.bankTotal.toLocaleString()}`} color="teal" />
        <StatCard icon={FiTrendingUp} title="Net Profit" value={`₹${stats.netProfit.toLocaleString()}`} color={stats.netProfit >= 0 ? 'green' : 'red'} />
        <StatCard icon={FiDollarSign} title="Expenses" value={`₹${stats.expenseTotal.toLocaleString()}`} color="red" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Revenue Entries ({revenue.length} entries)</h2>
        {revenue.length === 0 ? (
          <EmptyState icon={FiDollarSign} title="No Entries" description="Add your first revenue entry to see data here." action={<button onClick={() => setModal('add')} className="btn-primary">Add Entry</button>} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="table-header">
                  <th className="text-left py-3 px-2">Date</th>
                  <th className="text-left py-3 px-2">Type</th>
                  <th className="text-left py-3 px-2">Amount</th>
                  <th className="text-left py-3 px-2 hidden md:table-cell">Expenses</th>
                </tr>
              </thead>
              <tbody>
                {revenue.map((r, i) => (
                  <motion.tr key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="table-row">
                    <td className="py-3 px-2">{r.date || '-'}</td>
                    <td className="py-3 px-2">{r.paymentType || '-'}</td>
                    <td className="py-3 px-2 font-medium">₹{(parseFloat(r.amount) || 0).toLocaleString()}</td>
                    <td className="py-3 px-2 hidden md:table-cell">₹{(parseFloat(r.expenses) || 0).toLocaleString()}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      <Modal isOpen={modal === 'add'} onClose={() => setModal(null)} title="Add Revenue Entry" size="lg">
        <form onSubmit={(e) => { e.preventDefault(); handleAdd(); }} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="label">Date *</label>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="input-field" required />
            </div>
            <div>
              <label className="label">Payment Type *</label>
              <select value={form.paymentType} onChange={(e) => setForm({ ...form, paymentType: e.target.value })} className="input-field" required>
                {PAYMENT_TYPE?.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Amount *</label>
              <input type="number" step="0.01" min="0" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="input-field" required placeholder="Enter amount" />
            </div>
            <div>
              <label className="label">Delivered Orders</label>
              <input type="number" min="0" value={form.deliveredOrders} onChange={(e) => setForm({ ...form, deliveredOrders: e.target.value })} className="input-field" placeholder="Number of orders" />
            </div>
            <div>
              <label className="label">Cash Collected</label>
              <input type="number" step="0.01" min="0" value={form.cashCollected} onChange={(e) => setForm({ ...form, cashCollected: e.target.value })} className="input-field" placeholder="Cash amount" />
            </div>
            <div>
              <label className="label">Online Payments</label>
              <input type="number" step="0.01" min="0" value={form.onlinePayments} onChange={(e) => setForm({ ...form, onlinePayments: e.target.value })} className="input-field" placeholder="Online amount" />
            </div>
            <div>
              <label className="label">Expenses</label>
              <input type="number" step="0.01" min="0" value={form.expenses} onChange={(e) => setForm({ ...form, expenses: e.target.value })} className="input-field" placeholder="Expense amount" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={() => setModal(null)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Add Entry</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Revenue;