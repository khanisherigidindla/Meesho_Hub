import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEye, FiEdit2, FiTrash2, FiDownload, FiUpload, FiPrinter, FiFileText, FiUsers, FiX, FiCheckSquare } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import SearchBox from '../components/SearchBox';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import { Badge, EmptyState, Pagination } from '../components/UIComponents';
import { downloadFile, formatDate } from '../utils/storage';
import { exportToExcel, importFromExcel } from '../utils/excelUtils';

const Customers = () => {
  const { customers, addCustomer, updateCustomer, deleteCustomer, orders } = useApp();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [bulkSelect, setBulkSelect] = useState([]);
  const [form, setForm] = useState({
    customerName: '',
    phone: '',
    alternatePhone: '',
    address: '',
    landmark: '',
    orderedProduct: '',
    orderId: '',
    deliveryDate: '',
    notes: '',
    remarks: ''
  });

  const filtered = useMemo(() => {
    let list = [...customers];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((c) =>
        c.customerName?.toLowerCase().includes(q) ||
        c.phone?.includes(q) ||
        c.address?.toLowerCase().includes(q) ||
        c.orderId?.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }, [customers, search]);

  const totalPages = Math.ceil(filtered.length / 10);
  const paginated = filtered.slice((page - 1) * 10, page * 10);

  const handleAdd = () => {
    addCustomer(form);
    setModal(null);
    setForm({ customerName: '', phone: '', alternatePhone: '', address: '', landmark: '', orderedProduct: '', orderId: '', deliveryDate: '', notes: '', remarks: '' });
  };

  const handleUpdate = () => {
    updateCustomer(selected.id, form);
    setModal(null);
    setSelected(null);
  };

  const handleDelete = () => {
    deleteCustomer(deleteId);
    setDeleteId(null);
  };

  const handleExport = () => {
    const csv = `Customer ID,Name,Phone,Alternate Phone,Address,Landmark,Ordered Product,Order ID,Delivery Date,Notes,Remarks\n${customers.map(c =>
      `${c.customerId || generateId()},${c.customerName},${c.phone},${c.alternatePhone || ''},${c.address},${c.landmark || ''},${c.orderedProduct || ''},${c.orderId || ''},${c.deliveryDate || ''},${c.notes || ''},${c.remarks || ''}`
    ).join('\n')}`;
    downloadFile(csv, `customers-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleExportExcel = () => {
    exportToExcel(customers.map(c => ({ ...c })), 'customers', new Date().toISOString().split('T')[0]);
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const imported = await importFromExcel(file);
      imported.forEach(addCustomer);
      alert(`Imported ${imported.length} customers successfully`);
    } catch (err) {
      alert('Failed to import: ' + err.message);
    }
    e.target.value = '';
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Customers Data - Meesho Warehouse</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
            th { background: #3b82f6; color: white; }
            h1 { color: #3b82f6; }
          </style>
        </head>
        <body>
          <h1>Customers - Meesho Warehouse</h1>
          <p>Generated on: ${new Date().toLocaleString()}</p>
          <table>
            <thead>
              <tr>
                <th>Name</th><th>Phone</th><th>Address</th><th>Product</th><th>Order ID</th>
              </tr>
            </thead>
            <tbody>
              ${customers.map(c => `<tr>
                <td>${c.customerName || '-'}</td>
                <td>${c.phone || '-'}</td>
                <td>${c.address || '-'}</td>
                <td>${c.orderedProduct || '-'}</td>
                <td>${c.orderId || '-'}</td>
              </tr>`).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleSelectAll = () => {
    if (bulkSelect.length === filtered.length) {
      setBulkSelect([]);
    } else {
      setBulkSelect(filtered.map(c => c.id));
    }
  };

  const handleBulkDelete = () => {
    bulkSelect.forEach(id => deleteCustomer(id));
    setBulkSelect([]);
  };

  const handleBulkExport = () => {
    const selectedCustomers = customers.filter(c => bulkSelect.includes(c.id));
    const csv = `Customer ID,Name,Phone,Alternate Phone,Address,Landmark,Ordered Product,Order ID,Delivery Date,Notes,Remarks\n${selectedCustomers.map(c =>
      `${c.customerId || ''},${c.customerName},${c.phone},${c.alternatePhone || ''},${c.address},${c.landmark || ''},${c.orderedProduct || ''},${c.orderId || ''},${c.deliveryDate || ''},${c.notes || ''},${c.remarks || ''}`
    ).join('\n')}`;
    downloadFile(csv, `customers-bulk-export-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const generateId = () => `${Date.now().toString(36).slice(-6)}`;

  // Current time display
  const [currentTime, setCurrentTime] = useState(new Date());
  useState(() => {
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center">
              <FiUsers className="w-6 h-6 text-white" />
            </div>
            Customers
          </h1>
          <p className="text-gray-500 mt-1">{currentTime.toLocaleTimeString('en-IN')} • {currentTime.toLocaleDateString('en-IN')}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={handlePrint} className="btn-secondary flex items-center gap-2 text-sm">
            <FiPrinter className="w-4 h-4" /> Print
          </button>
          <button onClick={handleExport} className="btn-secondary flex items-center gap-2 text-sm">
            <FiDownload className="w-4 h-4" /> Export CSV
          </button>
          <button onClick={handleExportExcel} className="btn-secondary flex items-center gap-2 text-sm">
            <FiFileText className="w-4 h-4" /> Export Excel
          </button>
          <label className="btn-secondary flex items-center gap-2 text-sm cursor-pointer">
            <FiUpload className="w-4 h-4" /> Import Excel
            <input type="file" accept=".xlsx,.xls" onChange={handleImport} className="hidden" />
          </label>
          <button onClick={() => setModal('add')} className="btn-primary flex items-center gap-2">
            <FiPlus className="w-4 h-4" /> Add Customer
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
            <SearchBox value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search customers..." />
          </div>
          {bulkSelect.length > 0 && (
            <div className="flex gap-2">
              <button onClick={handleBulkExport} className="btn-secondary flex items-center gap-1 text-sm">
                <FiDownload className="w-4 h-4" /> Export ({bulkSelect.length})
              </button>
              <button onClick={handleBulkDelete} className="btn-danger flex items-center gap-1 text-sm">
                <FiTrash2 className="w-4 h-4" /> Delete ({bulkSelect.length})
              </button>
              <button onClick={() => setBulkSelect([])} className="btn-secondary text-sm">
                <FiX className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={FiUsers}
            title="No Customers Found"
            description="Add your first customer"
            action={<button onClick={() => setModal('add')} className="btn-primary">Add Customer</button>}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="table-header">
                    <th className="text-left py-3 px-2 hidden sm:table-cell">
                      <button onClick={handleSelectAll} className="p-1 rounded">
                        <FiCheckSquare className={`w-4 h-4 ${bulkSelect.length === filtered.length ? 'text-primary-600' : 'text-gray-400'}`} />
                      </button>
                    </th>
                    <th className="text-left py-3 px-2">Name</th>
                    <th className="text-left py-3 px-2 hidden md:table-cell">Phone</th>
                    <th className="text-left py-3 px-2 hidden lg:table-cell">Address</th>
                    <th className="text-left py-3 px-2 hidden lg:table-cell">Product</th>
                    <th className="text-left py-3 px-2">Order ID</th>
                    <th className="text-center py-3 px-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((customer, i) => (
                    <motion.tr
                      key={customer.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="table-row"
                    >
                      <td className="py-3 px-2 hidden sm:table-cell">
                        <input
                          type="checkbox"
                          checked={bulkSelect.includes(customer.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setBulkSelect([...bulkSelect, customer.id]);
                            } else {
                              setBulkSelect(bulkSelect.filter(id => id !== customer.id));
                            }
                          }}
                          className="w-4 h-4 text-primary-600 rounded"
                        />
                      </td>
                      <td className="py-3 px-2 font-medium">{customer.customerName || '-'}</td>
                      <td className="py-3 px-2 hidden md:table-cell">{customer.phone || '-'}</td>
                      <td className="py-3 px-2 hidden lg:table-cell truncate max-w-xs">{customer.address || '-'}</td>
                      <td className="py-3 px-2 hidden lg:table-cell">{customer.orderedProduct || '-'}</td>
                      <td className="py-3 px-2">{customer.orderId || '-'}</td>
                      <td className="py-3 px-2">
                        <div className="flex items-center justify-center gap-1">
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
            </div>
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </motion.div>

      <Modal isOpen={modal === 'add' || modal === 'edit'} onClose={() => setModal(null)} title={modal === 'add' ? 'Add New Customer' : 'Edit Customer'} size="lg">
        <form onSubmit={(e) => { e.preventDefault(); modal === 'add' ? handleAdd() : handleUpdate(); }} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="label">Customer Name</label>
              <input type="text" name="customerName" value={form.customerName || ''} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="label">Phone <span className="text-red-500">*</span></label>
              <input type="tel" name="phone" value={form.phone || ''} onChange={handleChange} className="input-field" required />
            </div>
            <div>
              <label className="label">Alternate Phone</label>
              <input type="tel" name="alternatePhone" value={form.alternatePhone || ''} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="label">Address</label>
              <input type="text" name="address" value={form.address || ''} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="label">Landmark</label>
              <input type="text" name="landmark" value={form.landmark || ''} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="label">Ordered Product</label>
              <input type="text" name="orderedProduct" value={form.orderedProduct || ''} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="label">Order ID</label>
              <input type="text" name="orderId" value={form.orderId || ''} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="label">Delivery Date</label>
              <input type="date" name="deliveryDate" value={form.deliveryDate || ''} onChange={handleChange} className="input-field" />
            </div>
            <div className="md:col-span-2">
              <label className="label">Notes</label>
              <textarea name="notes" value={form.notes || ''} onChange={handleChange} className="input-field h-20 resize-none" placeholder="Add notes..."></textarea>
            </div>
            <div className="md:col-span-2">
              <label className="label">Remarks</label>
              <textarea name="remarks" value={form.remarks || ''} onChange={handleChange} className="input-field h-20 resize-none" placeholder="Add remarks..."></textarea>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={() => setModal(null)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">{modal === 'add' ? 'Add Customer' : 'Update Customer'}</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={modal === 'view'} onClose={() => { setModal(null); setSelected(null); }} title="Customer Details" size="lg">
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Customer Name</p>
                <p className="font-semibold text-gray-900 dark:text-white">{selected.customerName || '-'}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Phone</p>
                <p className="font-semibold text-gray-900 dark:text-white">{selected.phone || '-'}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Alternate Phone</p>
                <p className="font-semibold text-gray-900 dark:text-white">{selected.alternatePhone || '-'}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Landmark</p>
                <p className="font-semibold text-gray-900 dark:text-white">{selected.landmark || '-'}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 md:col-span-2">
                <p className="text-xs text-gray-500 mb-1">Address</p>
                <p className="font-semibold text-gray-900 dark:text-white">{selected.address || '-'}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 md:col-span-2">
                <p className="text-xs text-gray-500 mb-1">Notes</p>
                <p className="font-semibold text-gray-900 dark:text-white whitespace-pre-wrap">{selected.notes || '-'}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 md:col-span-2">
                <p className="text-xs text-gray-500 mb-1">Remarks</p>
                <p className="font-semibold text-gray-900 dark:text-white whitespace-pre-wrap">{selected.remarks || '-'}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Customer"
        message="Are you sure you want to delete this customer?"
      />
    </div>
  );
};

export default Customers;