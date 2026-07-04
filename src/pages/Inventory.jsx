import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEye, FiEdit2, FiTrash2, FiDownload, FiBox, FiMap, FiGrid, FiAlertTriangle, FiSearch } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import SearchBox from '../components/SearchBox';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import { Badge, EmptyState, Pagination } from '../components/UIComponents';
import { downloadFile, getTodayDate } from '../utils/storage';

const Inventory = () => {
  const { inventory, addProduct, updateProduct, deleteProduct } = useApp();
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // table or grid
  const [page, setPage] = useState(1);
  const [form, setForm] = useState({
    productId: '', productName: '', category: '', brand: '', sku: '', quantity: '', rackNumber: '', shelfNumber: '', binNumber: '', supplier: '', costPrice: '', sellingPrice: ''
  });

  const filtered = useMemo(() => {
    let list = [...inventory];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((p) => 
        p.productName?.toLowerCase().includes(q) || 
        p.sku?.toLowerCase().includes(q) || 
        p.productId?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [inventory, search]);

  const totalPages = Math.ceil(filtered.length / 10);
  const paginated = filtered.slice((page - 1) * 10, page * 10);

  const handleAdd = () => { addProduct(form); setModal(null); setForm({ productId: '', productName: '', category: '', brand: '', sku: '', quantity: '', rackNumber: '', shelfNumber: '', binNumber: '', supplier: '', costPrice: '', sellingPrice: '' }); };

  const handleUpdate = () => { updateProduct(selected.id, form); setModal(null); setSelected(null); };

  const handleExport = () => {
    const csv = `Product ID,Name,SKU,Brand,Category,Qty,Rack,Shelf,Bin,Cost,Selling,Supplier\n${inventory.map(p => 
      `${p.productId},${p.productName},${p.sku},${p.brand},${p.category},${p.quantity},${p.rackNumber},${p.shelfNumber},${p.binNumber},${p.costPrice},${p.sellingPrice},${p.supplier}`
    ).join('\n')}`;
    downloadFile(csv, `inventory-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const isLowStock = (quantity) => parseInt(quantity) <= 5;

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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center">
              <FiBox className="w-6 h-6 text-white" />
            </div>
            Inventory Management
          </h1>
          <p className="text-gray-500 mt-1">Manage warehouse stock with rack locations</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-1.5 border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg transition-all ${viewMode === 'table' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <FiGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <FiMap className="w-4 h-4" />
            </button>
          </div>
          <button onClick={handleExport} className="btn-secondary flex items-center gap-2">
            <FiDownload className="w-4 h-4" /> Export
          </button>
          <button onClick={() => setModal('add')} className="btn-primary flex items-center gap-2">
            <FiPlus className="w-4 h-4" /> Add Product
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
        <SearchBox value={search} onChange={setSearch} placeholder="Search products by name, SKU, brand..." />
      </motion.div>

      {/* Table View */}
      {viewMode === 'table' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          {filtered.length === 0 ? (
            <EmptyState
              icon={FiBox}
              title="No Products Found"
              description="Add your first product to get started"
              action={<button onClick={() => setModal('add')} className="btn-primary">Add Product</button>}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="table-header">
                    <th className="text-left py-4 px-3">Product</th>
                    <th className="text-left py-4 px-3 hidden md:table-cell">SKU</th>
                    <th className="text-left py-4 px-3 hidden lg:table-cell">Location</th>
                    <th className="text-left py-4 px-3">Qty</th>
                    <th className="text-left py-4 px-3 hidden md:table-cell">Selling Price</th>
                    <th className="text-center py-4 px-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((product, i) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="table-row"
                    >
                      <td className="py-4 px-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                            <FiBox className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">{product.productName || '-'}</p>
                            <p className="text-xs text-gray-500">{product.brand || '-'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-3 hidden md:table-cell text-gray-500">{product.sku || '-'}</td>
                      <td className="py-4 px-3 hidden lg:table-cell">
                        <div className="text-sm">
                          <span className="font-medium">R{product.rackNumber || '-'}</span>
                          <span className="mx-1">-</span>
                          <span>S{product.shelfNumber || '-'}</span>
                          <span className="mx-1">-</span>
                          <span>B{product.binNumber || '-'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-3">
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold ${isLowStock(product.quantity) ? 'text-red-600' : 'text-gray-900'}`}>
                            {product.quantity || 0}
                          </span>
                          {isLowStock(product.quantity) && (
                            <FiAlertTriangle className="w-4 h-4 text-red-500 animate-pulse" title="Low Stock" />
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-3 hidden md:table-cell font-medium">₹{product.sellingPrice || 0}</td>
                      <td className="py-4 px-3">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => { setSelected(product); setModal('view'); }} className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600">
                            <FiEye className="w-4 h-4" />
                          </button>
                          <button onClick={() => { setSelected(product); setForm(product); setModal('edit'); }} className="p-2 rounded-lg bg-green-50 hover:bg-green-100 text-green-600">
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => setDeleteId(product.id)} className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600">
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
      )}

      {/* Grid View - Rack Visualization */}
      {viewMode === 'grid' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {filtered.length === 0 ? (
            <EmptyState
              icon={FiBox}
              title="No Products Found"
              description="Add your first product to get started"
              action={<button onClick={() => setModal('add')} className="btn-primary">Add Product</button>}
            />
          ) : (
            Object.entries(
              filtered.reduce((acc, p) => {
                const rack = p.rackNumber || 'Unassigned';
                if (!acc[rack]) acc[rack] = [];
                acc[rack].push(p);
                return acc;
              }, {})
            ).map(([rack, products]) => (
              <motion.div key={rack} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FiBox className="w-5 h-5 text-primary-600" />
                  Rack {rack}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((product) => (
                    <motion.div
                      key={product.id}
                      whileHover={{ scale: 1.02 }}
                      className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 border border-gray-100 dark:border-gray-700 cursor-pointer"
                      onClick={() => { setSelected(product); setModal('view'); }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold">
                          {product.productName?.charAt(0) || 'P'}
                        </div>
                        {isLowStock(product.quantity) && (
                          <FiAlertTriangle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{product.productName}</h4>
                      <p className="text-xs text-gray-500 mt-1">{product.sku}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-sm font-medium">Qty: {product.quantity}</span>
                        <span className="text-sm text-gray-500">₹{product.sellingPrice}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={modal === 'add' || modal === 'edit'} onClose={() => setModal(null)} title={modal === 'add' ? 'Add New Product' : 'Edit Product'} size="lg">
        <form onSubmit={(e) => { e.preventDefault(); modal === 'add' ? handleAdd() : handleUpdate(); }} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="label">Product ID <span className="text-red-500">*</span></label>
              <input type="text" name="productId" value={form.productId || ''} onChange={handleChange} className="input-field" required />
            </div>
            <div>
              <label className="label">Product Name <span className="text-red-500">*</span></label>
              <input type="text" name="productName" value={form.productName || ''} onChange={handleChange} className="input-field" required />
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
              <label className="label">SKU</label>
              <input type="text" name="sku" value={form.sku || ''} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="label">Quantity <span className="text-red-500">*</span></label>
              <input type="number" name="quantity" value={form.quantity || ''} onChange={handleChange} className="input-field" min="0" required />
            </div>
            <div className="border-t border-gray-100 pt-4 md:col-span-2">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <FiMap className="w-4 h-4" /> Rack Location
              </h4>
            </div>
            <div>
              <label className="label">Rack Number</label>
              <input type="text" name="rackNumber" value={form.rackNumber || ''} onChange={handleChange} className="input-field" placeholder="A, B, C..." />
            </div>
            <div>
              <label className="label">Shelf Number</label>
              <input type="text" name="shelfNumber" value={form.shelfNumber || ''} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="label">Bin Number</label>
              <input type="text" name="binNumber" value={form.binNumber || ''} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="label">Supplier</label>
              <input type="text" name="supplier" value={form.supplier || ''} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="label">Cost Price (₹)</label>
              <input type="number" step="0.01" name="costPrice" value={form.costPrice || ''} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="label">Selling Price (₹)</label>
              <input type="number" step="0.01" name="sellingPrice" value={form.sellingPrice || ''} onChange={handleChange} className="input-field" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={() => setModal(null)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">{modal === 'add' ? 'Add Product' : 'Update Product'}</button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal isOpen={modal === 'view'} onClose={() => setModal(null)} title="Product Details" size="lg">
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl">
                {selected.productName?.charAt(0) || 'P'}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selected.productName}</h3>
                <p className="text-gray-500">Product ID: {selected.productId}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">SKU</p>
                <p className="font-semibold">{selected.sku || '-'}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Category</p>
                <p className="font-semibold">{selected.category || '-'}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Brand</p>
                <p className="font-semibold">{selected.brand || '-'}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Supplier</p>
                <p className="font-semibold">{selected.supplier || '-'}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Quantity</p>
                <p className="font-semibold">{selected.quantity || 0} {isLowStock(selected.quantity) && <FiAlertTriangle className="inline w-4 h-4 text-red-500" />}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Selling Price</p>
                <p className="font-semibold">₹{selected.sellingPrice || 0}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Rack Location</p>
                <p className="font-semibold">R{selected.rackNumber} - S{selected.shelfNumber} - B{selected.binNumber}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Profit Margin</p>
                <p className="font-semibold">₹{(selected.sellingPrice - selected.costPrice) || 0}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => { deleteProduct(deleteId); setDeleteId(null); }}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
      />
    </div>
  );
};

export default Inventory;