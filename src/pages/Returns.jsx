import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiDownload, FiRefreshCw } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import SearchBox from '../components/SearchBox';
import Modal from '../components/Modal';
import { Badge, EmptyState } from '../components/UIComponents';
import { RETURN_REASON, RETURN_TO_MEESHO_STATUS } from '../utils/constants';
import { downloadFile, getTodayDate } from '../utils/storage';

const Returns = () => {
  const { returns, addReturn } = useApp();
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ returnId: '', orderId: '', customer: '', product: '', reason: '', quantity: '', returnToMeesho: 'Pending' });

  const filtered = useMemo(() => {
    let list = [...returns];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((r) => r.returnId?.toLowerCase().includes(q) || r.orderId?.toLowerCase().includes(q) || r.customer?.toLowerCase().includes(q));
    }
    return list;
  }, [returns, search]);

  const handleAdd = () => { addReturn(form); setModal(null); setForm({ returnId: '', orderId: '', customer: '', product: '', reason: '', quantity: '', returnToMeesho: 'Pending' }); };

  const handleExport = () => {
    const csv = `Return ID,Order ID,Customer,Product,Reason,Qty\n${returns.map(r => `${r.returnId},${r.orderId},${r.customer},${r.product},${r.reason},${r.quantity}`).join('\n')}`;
    downloadFile(csv, `returns-${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Returns</h1>
        <div className="flex flex-wrap gap-2">
          <button onClick={handleExport} className="btn-secondary flex items-center gap-2 text-sm"><FiDownload className="w-4 h-4" /> Export CSV</button>
          <button onClick={() => setModal('add')} className="btn-primary flex items-center gap-2 text-sm"><FiPlus className="w-4 h-4" /> Add Return</button>
        </div>
      </div>
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1"><SearchBox value={search} onChange={setSearch} placeholder="Search returns..." /></div>
        </div>
        {filtered.length === 0 ? <EmptyState icon={FiRefreshCw} title="No Returns Found" description="Add your first return." action={<button onClick={() => setModal('add')} className="btn-primary">Add Return</button>} /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-2">Return ID</th>
                  <th className="text-left py-3 px-2 hidden md:table-cell">Customer</th>
                  <th className="text-left py-3 px-2 hidden lg:table-cell">Product</th>
                  <th className="text-left py-3 px-2">Reason</th>
                  <th className="text-left py-3 px-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => (
                  <motion.tr key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-gray-100 dark:border-gray-700/50">
                    <td className="py-3 px-2 font-medium">{r.returnId || '-'}</td>
                    <td className="py-3 px-2 hidden md:table-cell">{r.customer || '-'}</td>
                    <td className="py-3 px-2 hidden lg:table-cell">{r.product || '-'}</td>
                    <td className="py-3 px-2">{r.reason || '-'}</td>
                    <td className="py-3 px-2"><Badge status={r.returnToMeesho || 'Pending'} /></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Modal isOpen={modal === 'add'} onClose={() => setModal(null)} title="Add Return" size="lg">
        <form onSubmit={(e) => { e.preventDefault(); handleAdd(); }} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="label">Return ID *</label><input type="text" value={form.returnId} onChange={(e) => setForm({ ...form, returnId: e.target.value })} className="input-field" required /></div>
            <div><label className="label">Order ID *</label><input type="text" value={form.orderId} onChange={(e) => setForm({ ...form, orderId: e.target.value })} className="input-field" required /></div>
            <div><label className="label">Customer *</label><input type="text" value={form.customer} onChange={(e) => setForm({ ...form, customer: e.target.value })} className="input-field" required /></div>
            <div><label className="label">Product *</label><input type="text" value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })} className="input-field" required /></div>
            <div><label className="label">Reason *</label><select value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} className="input-field" required>
              <option value="">Select Reason</option>
              {RETURN_REASON?.map((r) => <option key={r} value={r}>{r}</option>)}
            </select></div>
            <div><label className="label">Quantity *</label><input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} className="input-field" min="1" required /></div>
            <div><label className="label">Return to Meesho</label><select value={form.returnToMeesho} onChange={(e) => setForm({ ...form, returnToMeesho: e.target.value })} className="input-field">
              {RETURN_TO_MEESHO_STATUS?.map((s) => <option key={s} value={s}>{s}</option>)}
            </select></div>
          </div>
          <div className="flex justify-end gap-3 pt-4"><button type="button" onClick={() => setModal(null)} className="btn-secondary">Cancel</button><button type="submit" className="btn-primary">Add Return</button></div>
        </form>
      </Modal>
    </div>
  );
};

export default Returns;