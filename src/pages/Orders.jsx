import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEye, FiEdit2, FiTrash2, FiDownload, FiShoppingCart } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import SearchBox from '../components/SearchBox';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import { Badge, EmptyState, Pagination } from '../components/UIComponents';
import { SORT_OPTIONS, ORDER_STATUS, ITEMS_PER_PAGE } from '../utils/constants';
import { downloadFile, formatDate } from '../utils/storage';

const Orders = () => {
  const { orders, addOrder, updateOrder, deleteOrder, riders, customers } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState({
    orderId: '', trackingNumber: '', customerName: '', product: '', quantity: '', price: '', deliveryStatus: 'Pending', deliveryDate: new Date().toISOString().split('T')[0], riderId: ''
  });

  const filtered = useMemo(() => {
    let list = [...orders];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((o) => o.orderId?.toLowerCase().includes(q) || o.trackingNumber?.toLowerCase().includes(q) || o.customerName?.toLowerCase().includes(q));
    }
    if (statusFilter) list = list.filter((o) => o.deliveryStatus === statusFilter);
    return list;
  }, [orders, search, statusFilter]);

  const handleAdd = () => { addOrder(form); setModal(null); setForm({ orderId: '', trackingNumber: '', customerName: '', product: '', quantity: '', price: '', deliveryStatus: 'Pending', deliveryDate: new Date().toISOString().split('T')[0], riderId: '' }); };
  const handleEdit = () => { updateOrder(selected.id, form); setModal(null); setSelected(null); };
  const handleDelete = () => { deleteOrder(deleteId); setDeleteId(null); };

  const handleExport = () => {
    const csv = `Order ID,Tracking,Customer,Product,Qty,Price,Status\n${orders.map(o => `${o.orderId},${o.trackingNumber},${o.customerName},${o.product},${o.quantity},${o.price},${o.deliveryStatus}`).join('\n')}`;
    downloadFile(csv, `orders-${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Orders</h1>
        <div className="flex flex-wrap gap-2">
          <button onClick={handleExport} className="btn-secondary flex items-center gap-2 text-sm"><FiDownload className="w-4 h-4" /> Export CSV</button>
          <button onClick={() => setModal('add')} className="btn-primary flex items-center gap-2 text-sm"><FiPlus className="w-4 h-4" /> Add Order</button>
        </div>
      </div>
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1"><SearchBox value={search} onChange={setSearch} placeholder="Search orders..." /></div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field w-full sm:w-40">
            <option value="">All Status</option>
            {ORDER_STATUS?.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        {filtered.length === 0 ? <EmptyState icon={FiShoppingCart} title="No Orders Found" description="Add your first order." action={<button onClick={() => setModal('add')} className="btn-primary">Add Order</button>} /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-2">Order ID</th>
                  <th className="text-left py-3 px-2 hidden md:table-cell">Customer</th>
                  <th className="text-left py-3 px-2 hidden lg:table-cell">Product</th>
                  <th className="text-left py-3 px-2">Status</th>
                  <th className="text-right py-3 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o, i) => (
                  <motion.tr key={o.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-gray-100 dark:border-gray-700/50">
                    <td className="py-3 px-2 font-medium">{o.orderId || '-'}</td>
                    <td className="py-3 px-2 hidden md:table-cell">{o.customerName || '-'}</td>
                    <td className="py-3 px-2 hidden lg:table-cell">{o.product || '-'}</td>
                    <td className="py-3 px-2"><Badge status={o.deliveryStatus || 'Pending'} /></td>
                    <td className="py-3 px-2">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => { setSelected(o); setForm({ ...o }); setModal('edit'); }} className="p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20" title="Edit"><FiEdit2 className="w-4 h-4" /></button>
                        <button onClick={() => setDeleteId(o.id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20" title="Delete"><FiTrash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Modal isOpen={modal === 'add'} onClose={() => setModal(null)} title="Add Order" size="lg">
        <form onSubmit={(e) => { e.preventDefault(); handleAdd(); }} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="label">Order ID *</label><input type="text" value={form.orderId} onChange={(e) => setForm({ ...form, orderId: e.target.value })} className="input-field" required /></div>
            <div><label className="label">Customer *</label><input type="text" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} className="input-field" required /></div>
            <div><label className="label">Product *</label><input type="text" value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })} className="input-field" required /></div>
            <div><label className="label">Quantity *</label><input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} className="input-field" min="1" required /></div>
            <div><label className="label">Price *</label><input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-field" required /></div>
            <div><label className="label">Delivery Status</label><select value={form.deliveryStatus} onChange={(e) => setForm({ ...form, deliveryStatus: e.target.value })} className="input-field">{ORDER_STATUS?.map((s) => <option key={s} value={s}>{s}</option>)}</select></div>
          </div>
          <div className="flex justify-end gap-3 pt-4"><button type="button" onClick={() => setModal(null)} className="btn-secondary">Cancel</button><button type="submit" className="btn-primary">Add Order</button></div>
        </form>
      </Modal>
      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Order" message="Are you sure?" />
    </div>
  );
};

export default Orders;