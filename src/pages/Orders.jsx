import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEye, FiEdit2, FiTrash2, FiDownload, FiUpload, FiPrinter, FiFileText, FiShoppingCart, FiFilter, FiSearch, FiPackage, FiX, FiCheckSquare } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import SearchBox from '../components/SearchBox';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import { Badge, EmptyState, Pagination } from '../components/UIComponents';
import { ORDER_STATUS, PAYMENT_STATUS, PAYMENT_MODE, SORT_OPTIONS } from '../utils/constants';
import { downloadFile, formatDate } from '../utils/storage';
import { exportToExcel } from '../utils/excelUtils';

const Orders = () => {
  const { orders, addOrder, updateOrder, deleteOrder, riders, customers } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [bulkSelect, setBulkSelect] = useState([]);
  const [form, setForm] = useState({
    orderId: '',
    transactionId: '',
    trackingNumber: '',
    customerName: '',
    phoneNumber: '',
    address: '',
    productName: '',
    productId: '',
    category: '',
    quantity: '',
    weight: '',
    price: '',
    deliveryDate: new Date().toISOString().split('T')[0],
    assignedRider: '',
    paymentMethod: 'Cash',
    paymentStatus: 'Pending',
    deliveryStatus: 'Pending',
    notes: '',
    remarks: ''
  });

  // Current time display
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const filtered = useMemo(() => {
    let list = [...orders];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((o) =>
        o.orderId?.toLowerCase().includes(q) ||
        o.trackingNumber?.toLowerCase().includes(q) ||
        o.customerName?.toLowerCase().includes(q) ||
        o.transactionId?.toLowerCase().includes(q) ||
        o.productName?.toLowerCase().includes(q)
      );
    }
    if (statusFilter) {
      list = list.filter((o) => o.deliveryStatus === statusFilter);
    }
    list.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc': return new Date(b.deliveryDate) - new Date(a.deliveryDate);
        case 'date-asc': return new Date(a.deliveryDate) - new Date(b.deliveryDate);
        case 'amount-desc': return (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0);
        case 'amount-asc': return (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0);
        default: return 0;
      }
    });
    return list;
  }, [orders, search, statusFilter, sortBy]);

  const totalPages = Math.ceil(filtered.length / 10);
  const paginated = filtered.slice((page - 1) * 10, page * 10);

  const handleAdd = () => {
    addOrder(form);
    setModal(null);
    setForm({
      orderId: '', transactionId: '', trackingNumber: '', customerName: '', phoneNumber: '', address: '',
      productName: '', productId: '', category: '', quantity: '', weight: '', price: '',
      deliveryDate: new Date().toISOString().split('T')[0], assignedRider: '',
      paymentMethod: 'Cash', paymentStatus: 'Pending', deliveryStatus: 'Pending', notes: '', remarks: ''
    });
  };

  const handleUpdate = () => {
    updateOrder(selected.id, form);
    setModal(null);
    setSelected(null);
  };

  const handleDelete = () => {
    deleteOrder(deleteId);
    setDeleteId(null);
  };

  const handleExport = () => {
    const csv = `Order ID,Transaction ID,Tracking,Customer,Phone,Address,Product,Product ID,Category,Qty,Weight,Price,Delivery Date,Rider,Payment Method,Payment Status,Delivery Status,Notes,Remarks\n${orders.map(o =>
      `${o.orderId},${o.transactionId || ''},${o.trackingNumber},${o.customerName},${o.phoneNumber || ''},${o.address || ''},${o.productName},${o.productId || ''},${o.category || ''},${o.quantity},${o.weight || ''},${o.price},${o.deliveryDate},${o.assignedRider || ''},${o.paymentMethod || 'Cash'},${o.paymentStatus || ''},${o.deliveryStatus},${o.notes || ''},${o.remarks || ''}`
    ).join('\n')}`;
    downloadFile(csv, `orders-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Orders - Meesho Warehouse</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
            th { background: #3b82f6; color: white; }
          </style>
        </head>
        <body>
          <h1>Orders - Meesho Warehouse</h1>
          <p>Generated on: ${new Date().toLocaleString()}</p>
          <table>
            <thead>
              <tr>
                <th>Order ID</th><th>Customer</th><th>Product</th><th>Qty</th><th>Amount</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${orders.map(o => `<tr>
                <td>${o.orderId || '-'}</td>
                <td>${o.customerName || '-'}</td>
                <td>${o.productName || '-'}</td>
                <td>${o.quantity || '-'}</td>
                <td>₹${o.price || 0}</td>
                <td>${o.deliveryStatus || '-'}</td>
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
      setBulkSelect(filtered.map(o => o.id));
    }
  };

  const handleBulkDelete = () => {
    bulkSelect.forEach(id => deleteOrder(id));
    setBulkSelect([]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const getRiderName = (riderId) => riders.find((r) => r.id === riderId)?.fullName || 'Unassigned';

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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
              <FiShoppingCart className="w-6 h-6 text-white" />
            </div>
            Orders Management
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
          <button onClick={() => setModal('add')} className="btn-primary flex items-center gap-2">
            <FiPlus className="w-4 h-4" /> New Order
          </button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBox value={search} onChange={setSearch} placeholder="Search orders, tracking, customer..." />
          </div>
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field w-40"
            >
              <option value="">All Status</option>
              {ORDER_STATUS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field w-40"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Orders Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        {filtered.length === 0 ? (
          <EmptyState
            icon={FiShoppingCart}
            title="No Orders Found"
            description="Create your first order to get started"
            action={<button onClick={() => setModal('add')} className="btn-primary">Create Order</button>}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="table-header">
                  <th className="text-left py-4 px-3 hidden sm:table-cell">
                    <button onClick={handleSelectAll} className="p-1 rounded">
                      <FiCheckSquare className={`w-4 h-4 ${bulkSelect.length === filtered.length ? 'text-primary-600' : 'text-gray-400'}`} />
                    </button>
                  </th>
                  <th className="text-left py-4 px-3">Order ID</th>
                  <th className="text-left py-4 px-3 hidden md:table-cell">Tracking</th>
                  <th className="text-left py-4 px-3">Customer</th>
                  <th className="text-left py-4 px-3 hidden lg:table-cell">Product</th>
                  <th className="text-left py-4 px-3">Qty</th>
                  <th className="text-left py-4 px-3 hidden md:table-cell">Amount</th>
                  <th className="text-left py-4 px-3">Status</th>
                  <th className="text-center py-4 px-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((order, i) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="table-row"
                  >
                    <td className="py-4 px-3 hidden sm:table-cell">
                      <input
                        type="checkbox"
                        checked={bulkSelect.includes(order.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setBulkSelect([...bulkSelect, order.id]);
                          } else {
                            setBulkSelect(bulkSelect.filter(id => id !== order.id));
                          }
                        }}
                        className="w-4 h-4 text-primary-600 rounded"
                      />
                    </td>
                    <td className="py-4 px-3 font-semibold">{order.orderId || '-'}</td>
                    <td className="py-4 px-3 hidden md:table-cell text-gray-500">{order.trackingNumber || '-'}</td>
                    <td className="py-4 px-3">{order.customerName || '-'}</td>
                    <td className="py-4 px-3 hidden lg:table-cell">{order.productName || '-'}</td>
                    <td className="py-4 px-3">{order.quantity || '-'}</td>
                    <td className="py-4 px-3 hidden md:table-cell font-medium">₹{order.price || 0}</td>
                    <td className="py-4 px-3"><Badge status={order.deliveryStatus || 'Pending'} /></td>
                    <td className="py-4 px-3">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => { setSelected(order); setModal('view'); }} className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600">
                          <FiEye className="w-4 h-4" />
                        </button>
                        <button onClick={() => { setSelected(order); setForm(order); setModal('edit'); }} className="p-2 rounded-lg bg-green-50 hover:bg-green-100 text-green-600">
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteId(order.id)} className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600">
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
      <Modal isOpen={modal === 'add' || modal === 'edit'} onClose={() => setModal(null)} title={modal === 'add' ? 'Create New Order' : 'Edit Order'} size="lg">
        <form onSubmit={(e) => { e.preventDefault(); modal === 'add' ? handleAdd() : handleUpdate(); }} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="label">Order ID</label>
              <input type="text" name="orderId" value={form.orderId || ''} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="label">Transaction ID</label>
              <input type="text" name="transactionId" value={form.transactionId || ''} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="label">Tracking Number</label>
              <input type="text" name="trackingNumber" value={form.trackingNumber || ''} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="label">Customer Name</label>
              <input type="text" name="customerName" value={form.customerName || ''} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="label">Phone Number</label>
              <input type="tel" name="phoneNumber" value={form.phoneNumber || ''} onChange={handleChange} className="input-field" />
            </div>
            <div className="md:col-span-2">
              <label className="label">Address</label>
              <textarea name="address" value={form.address || ''} onChange={handleChange} className="input-field resize-none" rows="2"></textarea>
            </div>
            <div>
              <label className="label">Product Name</label>
              <input type="text" name="productName" value={form.productName || ''} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="label">Product ID</label>
              <input type="text" name="productId" value={form.productId || ''} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="label">Category</label>
              <input type="text" name="category" value={form.category || ''} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="label">Quantity</label>
              <input type="number" name="quantity" value={form.quantity || ''} onChange={handleChange} className="input-field" min="1" />
            </div>
            <div>
              <label className="label">Weight</label>
              <input type="text" name="weight" value={form.weight || ''} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="label">Price (₹)</label>
              <input type="number" step="0.01" name="price" value={form.price || ''} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="label">Delivery Date</label>
              <input type="date" name="deliveryDate" value={form.deliveryDate || ''} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="label">Assigned Rider</label>
              <select name="assignedRider" value={form.assignedRider || ''} onChange={handleChange} className="input-field">
                <option value="">Select Rider...</option>
                {riders.map((r) => <option key={r.id} value={r.id}>{r.fullName || r.riderId}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Payment Method</label>
              <select name="paymentMethod" value={form.paymentMethod || ''} onChange={handleChange} className="input-field">
                {PAYMENT_MODE.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Payment Status</label>
              <select name="paymentStatus" value={form.paymentStatus || ''} onChange={handleChange} className="input-field">
                {PAYMENT_STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Delivery Status</label>
              <select name="deliveryStatus" value={form.deliveryStatus || ''} onChange={handleChange} className="input-field">
                {ORDER_STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="label">Notes</label>
              <textarea name="notes" value={form.notes || ''} onChange={handleChange} className="input-field resize-none" rows="2"></textarea>
            </div>
            <div className="md:col-span-2">
              <label className="label">Remarks</label>
              <textarea name="remarks" value={form.remarks || ''} onChange={handleChange} className="input-field resize-none" rows="2"></textarea>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={() => setModal(null)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">{modal === 'add' ? 'Create Order' : 'Update Order'}</button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal isOpen={modal === 'view'} onClose={() => setModal(null)} title="Order Details" size="lg">
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Order ID</p>
                <p className="font-semibold text-gray-900 dark:text-white">{selected.orderId}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Transaction ID</p>
                <p className="font-semibold text-gray-900 dark:text-white">{selected.transactionId || '-'}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Tracking Number</p>
                <p className="font-semibold text-gray-900 dark:text-white">{selected.trackingNumber || '-'}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Customer Name</p>
                <p className="font-semibold text-gray-900 dark:text-white">{selected.customerName || '-'}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Phone Number</p>
                <p className="font-semibold text-gray-900 dark:text-white">{selected.phoneNumber || '-'}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 md:col-span-2">
                <p className="text-xs text-gray-500 mb-1">Address</p>
                <p className="font-semibold text-gray-900 dark:text-white">{selected.address || '-'}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Product Name</p>
                <p className="font-semibold text-gray-900 dark:text-white">{selected.productName || '-'}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Quantity</p>
                <p className="font-semibold text-gray-900 dark:text-white">{selected.quantity || '-'}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Price</p>
                <p className="font-semibold text-gray-900 dark:text-white">₹{selected.price || 0}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Payment Method</p>
                <p className="font-semibold text-gray-900 dark:text-white">{selected.paymentMethod || '-'}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Rider</p>
                <p className="font-semibold text-gray-900 dark:text-white">{getRiderName(selected.assignedRider)}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 md:col-span-2">
                <p className="text-xs text-gray-500 mb-1">Notes</p>
                <p className="font-semibold text-gray-900 dark:text-white whitespace-pre-wrap">{selected.notes || '-'}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => { deleteOrder(deleteId); setDeleteId(null); }}
        title="Delete Order"
        message="Are you sure you want to delete this order? This action cannot be undone."
      />
    </div>
  );
};

export default Orders;