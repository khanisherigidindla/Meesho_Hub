import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiDownload, FiUsers } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import SearchBox from '../components/SearchBox';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import { EmptyState } from '../components/UIComponents';
import { downloadFile, getTodayDate } from '../utils/storage';

const Customers = () => {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useApp();
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState({ customerId: '', customerName: '', phone: '', alternatePhone: '', address: '', area: '', pincode: '' });

  const filtered = useMemo(() => {
    let list = [...customers];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((c) => c.customerName?.toLowerCase().includes(q) || c.phone?.includes(q) || c.customerId?.toLowerCase().includes(q));
    }
    return list;
  }, [customers, search]);

  const handleAdd = () => { addCustomer(form); setModal(null); setForm({ customerId: '', customerName: '', phone: '', alternatePhone: '', address: '', area: '', pincode: '' }); };
  const handleEdit = () => { updateCustomer(selected.id, form); setModal(null); setSelected(null); };
  const handleDelete = () => { deleteCustomer(deleteId); setDeleteId(null); };

  const handleExport = () => {
    const csv = `Customer ID,Name,Phone,Address,Area,Pincode\n${customers.map(c => `${c.customerId},${c.customerName},${c.phone},${c.address},${c.area},${c.pincode}`).join('\n')}`;
    downloadFile(csv, `customers-${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Customers</h1>
        <div className="flex flex-wrap gap-2">
          <button onClick={handleExport} className="btn-secondary flex items-center gap-2 text-sm"><FiDownload className="w-4 h-4" /> Export CSV</button>
          <button onClick={() => setModal('add')} className="btn-primary flex items-center gap-2 text-sm"><FiPlus className="w-4 h-4" /> Add Customer</button>
        </div>
      </div>
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1"><SearchBox value={search} onChange={setSearch} placeholder="Search customers..." /></div>
        </div>
        {filtered.length === 0 ? <EmptyState icon={FiUsers} title="No Customers Found" description="Add your first customer." action={<button onClick={() => setModal('add')} className="btn-primary">Add Customer</button>} /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-2">Customer ID</th>
                  <th className="text-left py-3 px-2">Name</th>
                  <th className="text-left py-3 px-2 hidden md:table-cell">Phone</th>
                  <th className="text-left py-3 px-2 hidden lg:table-cell">Area</th>
                  <th className="text-right py-3 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => (
                  <motion.tr key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-gray-100 dark:border-gray-700/50">
                    <td className="py-3 px-2 font-medium">{c.customerId || '-'}</td>
                    <td className="py-3 px-2">{c.customerName || '-'}</td>
                    <td className="py-3 px-2 hidden md:table-cell">{c.phone || '-'}</td>
                    <td className="py-3 px-2 hidden lg:table-cell">{c.area || '-'}</td>
                    <td className="py-3 px-2">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => { setSelected(c); setForm({ ...c }); setModal('edit'); }} className="p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20" title="Edit"><FiEdit2 className="w-4 h-4" /></button>
                        <button onClick={() => setDeleteId(c.id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20" title="Delete"><FiTrash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Modal isOpen={modal === 'add'} onClose={() => setModal(null)} title="Add Customer" size="lg">
        <form onSubmit={(e) => { e.preventDefault(); handleAdd(); }} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="label">Customer ID</label><input type="text" value={form.customerId} onChange={(e) => setForm({ ...form, customerId: e.target.value })} className="input-field" /></div>
            <div><label className="label">Customer Name *</label><input type="text" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} className="input-field" required /></div>
            <div><label className="label">Phone *</label><input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" required /></div>
            <div><label className="label">Alternate Phone</label><input type="tel" value={form.alternatePhone} onChange={(e) => setForm({ ...form, alternatePhone: e.target.value })} className="input-field" /></div>
            <div><label className="label">Area</label><input type="text" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} className="input-field" /></div>
            <div><label className="label">Pincode</label><input type="text" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} className="input-field" /></div>
          </div>
          <div><label className="label">Address</label><textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} rows={2} className="input-field resize-none" /></div>
          <div className="flex justify-end gap-3 pt-4"><button type="button" onClick={() => setModal(null)} className="btn-secondary">Cancel</button><button type="submit" className="btn-primary">Add Customer</button></div>
        </form>
      </Modal>
      <Modal isOpen={modal === 'edit'} onClose={() => { setModal(null); setSelected(null); }} title="Edit Customer" size="lg">
        <form onSubmit={(e) => { e.preventDefault(); handleEdit(); }} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="label">Customer ID</label><input type="text" value={form.customerId} onChange={(e) => setForm({ ...form, customerId: e.target.value })} className="input-field" /></div>
            <div><label className="label">Customer Name *</label><input type="text" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} className="input-field" required /></div>
            <div><label className="label">Phone *</label><input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" required /></div>
            <div><label className="label">Alternate Phone</label><input type="tel" value={form.alternatePhone} onChange={(e) => setForm({ ...form, alternatePhone: e.target.value })} className="input-field" /></div>
            <div><label className="label">Area</label><input type="text" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} className="input-field" /></div>
            <div><label className="label">Pincode</label><input type="text" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} className="input-field" /></div>
          </div>
          <div><label className="label">Address</label><textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} rows={2} className="input-field resize-none" /></div>
          <div className="flex justify-end gap-3 pt-4"><button type="button" onClick={() => { setModal(null); setSelected(null); }} className="btn-secondary">Cancel</button><button type="submit" className="btn-primary">Update Customer</button></div>
        </form>
      </Modal>
      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Customer" message="Are you sure?" />
    </div>
  );
};

export default Customers;