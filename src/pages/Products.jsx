import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEye, FiEdit2, FiTrash2, FiDownload, FiUpload, FiPrinter, FiBox, FiX, FiCheckSquare } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import SearchBox from '../components/SearchBox';
import Modal from '../components/Modal';
import { Badge, EmptyState, Pagination } from '../components/UIComponents';
import { downloadFile, formatDate, getTodayDate } from '../utils/storage';

const Products = () => {
  const { inventory, addProduct, updateProduct, deleteProduct } = useApp();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    productId: '',
    productName: '',
    sku: '',
    category: '',
    brand: '',
    quantity: '',
    weight: '',
    size: '',
    color: '',
    rackNumber: '',
    shelfNumber: '',
    purchasePrice: '',
    sellingPrice: '',
    condition: 'New',
    notes: '',
    remarks: ''
  });

  const filtered = useMemo(() => {
    let list = [...inventory];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((p) =>
        (p.productName || '').toLowerCase().includes(q) ||
        (p.sku || '').toLowerCase().includes(q) ||
        (p.productId || '').toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }, [inventory, search]);

  const totalPages = Math.ceil(filtered.length / 10);
  const paginated = filtered.slice((page - 1) * 10, page * 10);

  const handleAdd = () => {
    addProduct(form);
    setModal(null);
    setForm({ productId: '', productName: '', sku: '', category: '', brand: '', quantity: '', weight: '', size: '', color: '', rackNumber: '', shelfNumber: '', purchasePrice: '', sellingPrice: '', condition: 'New', notes: '', remarks: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <FiBox className="w-6 h-6 text-white" />
            </div>
            Products
          </h1>
          <p className="text-gray-500 mt-1">{currentTime.toLocaleTimeString('en-IN')} • {currentTime.toLocaleDateString('en-IN')}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => {
            const csv = `Product ID,Name,SKU,Category,Brand,Qty,Weight,Size,Color,Rack,Shelf,Purchase,Selling,Condition,Notes\n${inventory.map(p =>
              `${p.productId},${p.productName},${p.sku},${p.category},${p.brand},${p.quantity},${p.weight || ''},${p.size || ''},${p.color || ''},${p.rackNumber},${p.shelfNumber},${p.purchasePrice || ''},${p.sellingPrice},${p.condition || 'New'},${p.notes || ''}`
            ).join('\n')}`;
            downloadFile(csv, `products-${new Date().toISOString().split('T')[0]}.csv`);
          }} className="btn-secondary flex items-center gap-2 text-sm">
            <FiDownload className="w-4 h-4" /> Export
          </button>
          <button onClick={() => setModal('add')} className="btn-primary flex items-center gap-2">
            <FiPlus className="w-4 h-4" /> Add Product
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
            <SearchBox value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search products..." />
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={FiBox}
            title="No Products Found"
            description="Add your first product"
            action={<button onClick={() => setModal('add')} className="btn-primary">Add Product</button>}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="table-header">
                    <th className="text-left py-3 px-2">Product</th>
                    <th className="text-left py-3 px-2 hidden md:table-cell">SKU</th>
                    <th className="text-left py-3 px-2">Qty</th>
                    <th className="text-left py-3 px-2 hidden lg:table-cell">Price</th>
                    <th className="text-center py-3 px-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((product, i) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="table-row"
                    >
                      <td className="py-3 px-2 font-medium">{product.productName || '-'}</td>
                      <td className="py-3 px-2 hidden md:table-cell text-gray-500">{product.sku || '-'}</td>
                      <td className="py-3 px-2">{product.quantity || 0}</td>
                      <td className="py-3 px-2 hidden lg:table-cell">₹{product.sellingPrice || 0}</td>
                      <td className="py-3 px-2">
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={() => { setSelected(product); setModal('view'); }} className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600">
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

      <Modal isOpen={modal === 'add'} onClose={() => setModal(null)} title="Add New Product" size="lg">
        <form onSubmit={(e) => { e.preventDefault(); handleAdd(); }} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="label">Product ID</label>
              <input type="text" name="productId" value={form.productId || ''} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="label">Product Name</label>
              <input type="text" name="productName" value={form.productName || ''} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="label">SKU</label>
              <input type="text" name="sku" value={form.sku || ''} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="label">Category</label>
              <input type="text" name="category" value={form.category || ''} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="label">Brand</label>
              <input type="text" name="brand" value={form.brand || ''} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="label">Quantity</label>
              <input type="number" name="quantity" value={form.quantity || ''} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="label">Weight</label>
              <input type="text" name="weight" value={form.weight || ''} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="label">Size</label>
              <input type="text" name="size" value={form.size || ''} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="label">Color</label>
              <input type="text" name="color" value={form.color || ''} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="label">Rack</label>
              <input type="text" name="rackNumber" value={form.rackNumber || ''} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="label">Shelf</label>
              <input type="text" name="shelfNumber" value={form.shelfNumber || ''} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="label">Purchase Price</label>
              <input type="number" step="0.01" name="purchasePrice" value={form.purchasePrice || ''} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="label">Selling Price</label>
              <input type="number" step="0.01" name="sellingPrice" value={form.sellingPrice || ''} onChange={handleChange} className="input-field" />
            </div>
            <div className="md:col-span-2">
              <label className="label">Notes</label>
              <textarea name="notes" value={form.notes || ''} onChange={handleChange} className="input-field h-20 resize-none"></textarea>
            </div>
            <div className="md:col-span-2">
              <label className="label">Remarks</label>
              <textarea name="remarks" value={form.remarks || ''} onChange={handleChange} className="input-field h-20 resize-none"></textarea>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={() => setModal(null)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Add Product</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={modal === 'view'} onClose={() => { setModal(null); setSelected(null); }} title="Product Details" size="lg">
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Product Name</p>
                <p className="font-semibold text-gray-900 dark:text-white">{selected.productName || '-'}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">SKU</p>
                <p className="font-semibold text-gray-900 dark:text-white">{selected.sku || '-'}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Quantity</p>
                <p className="font-semibold text-gray-900 dark:text-white">{selected.quantity || 0}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Selling Price</p>
                <p className="font-semibold text-gray-900 dark:text-white">₹{selected.sellingPrice || 0}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Location</p>
                <p className="font-semibold text-gray-900 dark:text-white">R{selected.rackNumber}/S{selected.shelfNumber}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Notes</p>
                <p className="font-semibold text-gray-900 dark:text-white whitespace-pre-wrap">{selected.notes || '-'}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Products;