import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEye, FiEdit2, FiTrash2, FiDownload, FiUpload, FiPrinter, FiFileText, FiClipboard, FiX, FiCheckSquare } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import SearchBox from '../components/SearchBox';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import { Badge, EmptyState, Pagination } from '../components/UIComponents';
import { downloadFile, formatDate, getTodayDate } from '../utils/storage';
import { exportToExcel, importFromExcel } from '../utils/excelUtils';

const Expenses = () => {
  const { revenue, addRevenue } = useApp();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [bulkSelect, setBulkSelect] = useState([]);
  const [form, setForm] = useState({
    expenseId: '',
    expenseType: '',
    amount: '',
    date: getTodayDate(),
    description: ''
  });

  const expenses = useMemo(() => revenue.filter(r => r.expenseType || r.description), [revenue]);

  const filtered = useMemo(() => {
    let list = [...expenses];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((e) =>
        (e.expenseType || '').toLowerCase().includes(q) ||
        (e.description || '').toLowerCase().includes(q) ||
        String(e.amount || '').includes(q)
      );
    }
    return list.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  }, [expenses, search]);

  const totalPages = Math.ceil(filtered.length / 10);
  const paginated = filtered.slice((page - 1) * 10, page * 10);

  const handleAdd = () => {
    addRevenue({ ...form, paymentType: form.expenseType });
    setModal(null);
    setForm({ expenseId: '', expenseType: '', amount: '', date: getTodayDate(), description: '' });
  };

  const handleUpdate = () => {
    // Update logic would go here
    setModal(null);
    setSelected(null);
  };

  const handleDelete = () => {
    // Delete logic would go here
    setDeleteId(null);
  };

  const handleExport = () => {
    const csv = `Expense ID,Type,Amount,Date,Description\n${expenses.map(e =>
      `${e.expenseId || ''},${e.expenseType || ''},${e.amount},${e.date},${e.description || ''}`
    ).join('\n')}`;
    downloadFile(csv, `expenses-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Expenses - Meesho Warehouse</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background: #3b82f6; color: white; }
          </style>
        </head>
        <body>
          <h1>Expenses - Meesho Warehouse</h1>
          <p>Generated on: ${new Date().toLocaleString()}</p>
          <table>
            <thead>
              <tr>
                <th>Type</th><th>Amount</th><th>Date</th><th>Description</th>
              </tr>
            </thead>
            <tbody>
              ${expenses.map(e => `<tr>
                <td>${e.expenseType || '-'}</td>
                <td>₹${e.amount || 0}</td>
                <td>${formatDate(e.date)}</td>
                <td>${e.description || '-'}</td>
              </tr>`).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Current time display
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
              <FiClipboard className="w-6 h-6 text-white" />
            </div>
            Expenses
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
            <FiPlus className="w-4 h-4" /> Add Expense
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-1">
            <SearchBox value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search expenses..." />
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={FiClipboard}
            title="No Expenses Found"
            description="Add your first expense record"
            action={<button onClick={() => setModal('add')} className="btn-primary">Add Expense</button>}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="table-header">
                    <th className="text-left py-3 px-2">Type</th>
                    <th className="text-left py-3 px-2">Amount</th>
                    <th className="text-left py-3 px-2 hidden md:table-cell">Date</th>
                    <th className="text-left py-3 px-2 hidden lg:table-cell">Description</th>
                    <th className="text-center py-3 px-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((expense, i) => (
                    <motion.tr
                      key={expense.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="table-row"
                    >
                      <td className="py-3 px-2 font-medium">{expense.expenseType || expense.paymentType || '-'}</td>
                      <td className="py-3 px-2">₹{expense.amount || 0}</td>
                      <td className="py-3 px-2 hidden md:table-cell">{formatDate(expense.date)}</td>
                      <td className="py-3 px-2 hidden lg:table-cell truncate">{expense.description || '-'}</td>
                      <td className="py-3 px-2">
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={() => { setSelected(expense); setModal('view'); }} className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600">
                            <FiEye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </motion.div>

      <Modal isOpen={modal === 'add'} onClose={() => setModal(null)} title="Add New Expense" size="lg">
        <form onSubmit={(e) => { e.preventDefault(); handleAdd(); }} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="label">Expense Type</label>
              <select name="expenseType" value={form.expenseType || ''} onChange={handleChange} className="input-field">
                <option value="">Select Type</option>
                <option value="Fuel">Fuel</option>
                <option value="Packaging">Packaging</option>
                <option value="Rent">Rent</option>
                <option value="Salary">Salary</option>
                <option value="Utilities">Utilities</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Miscellaneous">Miscellaneous</option>
              </select>
            </div>
            <div>
              <label className="label">Amount (₹)</label>
              <input type="number" step="0.01" name="amount" value={form.amount || ''} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="label">Date</label>
              <input type="date" name="date" value={form.date || ''} onChange={handleChange} className="input-field" />
            </div>
            <div className="md:col-span-2">
              <label className="label">Description</label>
              <textarea name="description" value={form.description || ''} onChange={handleChange} className="input-field h-20 resize-none" placeholder="Add description..."></textarea>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={() => setModal(null)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Add Expense</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={modal === 'view'} onClose={() => { setModal(null); setSelected(null); }} title="Expense Details" size="lg">
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Type</p>
                <p className="font-semibold text-gray-900 dark:text-white">{selected.expenseType || selected.paymentType || '-'}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Amount</p>
                <p className="font-semibold text-gray-900 dark:text-white">₹{selected.amount || 0}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Date</p>
                <p className="font-semibold text-gray-900 dark:text-white">{formatDate(selected.date)}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Description</p>
                <p className="font-semibold text-gray-900 dark:text-white">{selected.description || '-'}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Expenses;