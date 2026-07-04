import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEye, FiEdit2, FiTrash2, FiDownload, FiUsers, FiPhone, FiMail } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import SearchBox from '../components/SearchBox';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import { Badge, EmptyState, Pagination } from '../components/UIComponents';
import { getTodayDate, downloadFile } from '../utils/storage';

const Customers = () => {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useApp();
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState({
    customerName: '', customerPhone: '', customerEmail: '', address: '', area: '', pincode: ''
  });
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let list = [...customers];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((c) =>
        c.customerName?.toLowerCase().includes(q) ||
        c.customerPhone?.toLowerCase().includes(q) ||
        c.customerEmail?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [customers, search]);

  const totalPages = Math.ceil(filtered.length / 10);
  const paginated = filtered.slice((page - 1) * 10, page * 10);

  const handleAdd = () => {
    addCustomer(form);
    setModal(null);
    setForm({ customerName: '', customerPhone: '', customerEmail: '', address: '', area: '', pincode: '' });
  };

  const handleUpdate = () => {
    updateCustomer(selected.id, form);
    setModal(null);
    setSelected(null);
  };

  const handleExport = () => {
    const csv = `Name,Phone,Email,Address,Area,Pincode\n${customers.map(c => 
      `${c.customerName},${c.customerPhone},${c.customerEmail},${c.address},${c.area},${c.pincode}`
    ).join('\n')}`;
    downloadFile(csv, `customers-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center">
              <FiUsers className="w-6 h-6 text-white" />
            </div>
            Customer Management
          </h1>
          <p className="text-gray-500 mt-1">Manage all customer records and contacts</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleExport} className="btn-secondary flex items-center gap-2">
            <FiDownload className="w-4 h-4" /> Export
          </button>
          <button onClick={() => setModal('add')} className="btn-primary flex items-center gap-2">
            <FiPlus className="w-4 h-4" /> Add Customer
          </button>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <SearchBox value={search} onChange={setSearch} placeholder="Search customers by name, phone, email..." />
      </motion.div>

      {/* Customers Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        {filtered.length === 0 ? (
          <EmptyState
            icon={FiUsers}
            title="No Customers Found"
            description="Add your first customer to get started"
            action={<button onClick={() => setModal('add')} className="btn-primary">Add Customer</button>}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="table-header">
                  <th className="text-left py-4 px-3">Customer</th>
                  <th className="text-left py-4 px-3">Contact</th>
                  <th className="text-left py-4 px-3 hidden lg:table-cell">Location</th>
                  <th className="text-center py-4 px-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((customer, i) => (
                  <motion.tr
                    key={customer.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="table-row"
                  >
                    <td className="py-4 px-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                          {customer.customerName?.charAt(0) || 'C'}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{customer.customerName || '-'}</p>
                          <p className="text-xs text-gray-500">{customer.customerId || '-'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-3">
                      <div className="space-y-1">
                        <p className="flex items-center gap-2 text-sm">
                          <FiPhone className="w-3 h-3 text-gray-400" />
                          {customer.customerPhone || '-'}
                        </p>
                        <p className="flex items-center gap-2 text-sm">
                          <FiMail className="w-3 h-3 text-gray-400" />
                          {customer.customerEmail || '-'}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-3 hidden lg:table-cell">
                      <p className="text-sm">{customer.area || '-'}, {customer.pincode || '-'}</p>
                      <p className="text-xs text-gray-500 truncate max-w-xs">{customer.address || '-'}</p>
                    </td>
                    <td className="py-4 px-3">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => { setSelected(customer); setModal('view'); }} className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600">
                          <FiEye className="w-4 h-4" />
                        </button>
                        <button onClick={() => { setSelected(customer); setForm(customer); setModal('edit'); }} className="p-2 rounded-lg bg-green-50 hover:bg-green-100 text-green-600">
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteId(customer.id)} className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600">
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </motion.div>

      {/* Add/Edit Modal */}
      <Modal isOpen={modal === 'add' || modal === 'edit'} onClose={() => setModal(null)} title={modal === 'add' ? 'Add New Customer' : 'Edit Customer'} size="lg">
        <form onSubmit={(e) => { e.preventDefault(); modal === 'add' ? handleAdd() : handleUpdate(); }} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="label">Customer Name <span className="text-red-500">*</span></label>
              <input type="text" name="customerName" value={form.customerName || ''} onChange={handleChange} className="input-field" required />
            </div>
            <div>
              <label className="label">Phone Number</label>
              <input type="tel" name="customerPhone" value={form.customerPhone || ''} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="label">Email Address</label>
              <input type="email" name="customerEmail" value={form.customerEmail || ''} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="label">Area</label>
              <input type="text" name="area" value={form.area || ''} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="label">Pincode</label>
              <input type="text" name="pincode" value={form.pincode || ''} onChange={handleChange} className="input-field" />
            </div>
            <div className="md:col-span-2">
              <label className="label">Full Address</label>
              <textarea name="address" value={form.address || ''} onChange={handleChange} className="input-field" rows="2" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={() => setModal(null)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">{modal === 'add' ? 'Add Customer' : 'Update Customer'}</button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal isOpen={modal === 'view'} onClose={() => setModal(null)} title="Customer Details" size="lg">
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl">
                {selected.customerName?.charAt(0) || 'C'}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selected.customerName}</h3>
                <p className="text-gray-500">Customer ID: {selected.customerId || '-'}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Phone</p>
                <p className="font-semibold text-gray-900 dark:text-white">{selected.customerPhone || '-'}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Email</p>
                <p className="font-semibold text-gray-900 dark:text-white">{selected.customerEmail || '-'}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 md:col-span-2">
                <p className="text-xs text-gray-500 mb-1">Address</p>
                <p className="font-semibold text-gray-900 dark:text-white">{selected.address || '-'}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => { deleteCustomer(deleteId); setDeleteId(null); }}
        title="Delete Customer"
        message="Are you sure you want to delete this customer? All related orders will be affected."
      />
    </div>
  );
};

export default Customers;