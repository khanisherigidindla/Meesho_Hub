import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiDownload, FiBox } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import SearchBox from '../components/SearchBox';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import { Badge, EmptyState } from '../components/UIComponents';
import { downloadFile, getTodayDate } from '../utils/storage';

const Inventory = () => {
  const { inventory, addProduct, updateProduct, deleteProduct } = useApp();
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState({
    productId: '', productName: '', category: '', brand: '', sku: '', quantity: '', rackNumber: '', shelfNumber: '', binNumber: '', supplier: '', costPrice: '', sellingPrice: ''
  });

  const filtered = useMemo(() => {
    let list = [...inventory];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.productName?.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q) || p.productId?.toLowerCase().includes(q));
    }
    return list;
  }, [inventory, search]);

  const handleAdd = () => { addProduct(form); setModal(null); setForm({ productId: '', productName: '', category: '', brand: '', sku: '', quantity: '', rackNumber: '', shelfNumber: '', binNumber: '', supplier: '', costPrice: '', sellingPrice: '' }); };
  const handleEdit = () => { updateProduct(selected.id, form); setModal(null); setSelected(null); };
  const handleDelete = () => { deleteProduct(deleteId); setDeleteId(null); };

  const handleExport = () => {
    const csv = `Product ID,Name,Category,SKU,Qty,Rack,Shelf,Bin\n${inventory.map(p => `${p.productId},${p.productName},${p.category},${p.sku},${p.quantity},${p.rackNumber},${p.shelfNumber},${p.binNumber}`).join('\n')}`;
    downloadFile(csv, `inventory-${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Inventory</h1>
        <div className="flex flex-wrap gap-2">
          <button onClick={handleExport} className="btn-secondary flex items-center gap-2 text-sm"><FiDownload className="w-4 h-4" /> Export CSV</button>
          <button onClick={() => setModal('add')} className="btn-primary flex items-center gap-2 text-sm"><FiPlus className="w-4 h-4" /> Add Product</button>
        </div>
      </div>
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1"><SearchBox value={search} onChange={setSearch} placeholder="Search products..." /></div>
        </div>
        {filtered.length === 0 ? <EmptyState icon={FiBox} title="No Products Found" description="Add your first product." action={<button onClick={() => setModal('add')} className="btn-primary">Add Product</button>} /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-2">Product</th>
                  <th className="text-left py-3 px-2 hidden md:table-cell">SKU</th>
                  <th className="text-left py-3 px-2">Qty</th>
                  <th className="text-left py-3 px-2 hidden lg:table-cell">Location</th>
                  <th className="text-right py-3 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-gray-100 dark:border-gray-700/50">
                    <td className="py-3 px-2 font-medium">{p.productName || '-'}</td>
                    <td className="py-3 px-2 hidden md:table-cell">{p.sku || '-'}</td>
                    <td className="py-3 px-2">{p.quantity || 0}</td>
                    <td className="py-3 px-2 hidden lg:table-cell">{[p.rackNumber, p.shelfNumber, p.binNumber].filter(Boolean).join('-') || '-'}</td>
                    <td className="py-3 px-2">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => { setSelected(p); setForm({ ...p }); setModal('edit'); }} className="p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20" title="Edit"><FiEdit2 className="w-4 h-4" /></button>
                        <button onClick={() => setDeleteId(p.id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20" title="Delete"><FiTrash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Modal isOpen={modal === 'add'} onClose={() => setModal(null)} title="Add Product" size="lg">
        <form onSubmit={(e) => { e.preventDefault(); handleAdd(); }} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="label">Product ID</label><input type="text" value={form.productId} onChange={(e) => setForm({ ...form, productId: e.target.value })} className="input-field" /></div>
            <div><label className="label">Product Name *</label><input type="text" value={form.productName} onChange={(e) => setForm({ ...form, productName: e.target.value })} className="input-field" required /></div>
            <div><label className="label">Category</label><input type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field" /></div>
            <div><label className="label">Brand</label><input type="text" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="input-field" /></div>
            <div><label className="label">SKU</label><input type="text" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className="input-field" /></div>
            <div><label className="label">Quantity *</label><input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} className="input-field" min="0" required /></div>
            <div><label className="label">Rack</label><input type="text" value={form.rackNumber} onChange={(e) => setForm({ ...form, rackNumber: e.target.value })} className="input-field" placeholder="e.g., A1, B2" /></div>
            <div><label className="label">Shelf</label><input type="text" value={form.shelfNumber} onChange={(e) => setForm({ ...form, shelfNumber: e.target.value })} className="input-field" /></div>
            <div><label className="label">Bin</label><input type="text" value={form.binNumber} onChange={(e) => setForm({ ...form, binNumber: e.target.value })} className="input-field" /></div>
            <div><label className="label">Supplier</label><input type="text" value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} className="input-field" /></div>
            <div><label className="label">Cost Price</label><input type="number" step="0.01" value={form.costPrice} onChange={(e) => setForm({ ...form, costPrice: e.target.value })} className="input-field" /></div>
            <div><label className="label">Selling Price</label><input type="number" step="0.01" value={form.sellingPrice} onChange={(e) => setForm({ ...form, sellingPrice: e.target.value })} className="input-field" /></div>
          </div>
          <div className="flex justify-end gap-3 pt-4"><button type="button" onClick={() => setModal(null)} className="btn-secondary">Cancel</button><button type="submit" class="btn-primary">Add Product</button></div>
        </form>
      </Modal>
      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Product" message="Are you sure?" />
    </div>
  );
};

export default Inventory;