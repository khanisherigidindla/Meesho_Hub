import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEye, FiEdit2, FiTrash2, FiDownload, FiUpload, FiPrinter, FiFileText, FiAlertOctagon, FiX, FiCheckSquare } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import SearchBox from '../components/SearchBox';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import { Badge, EmptyState, Pagination } from '../components/UIComponents';
import { downloadFile, formatDate, getTodayDate } from '../utils/storage';






const DamagedProducts = () => {
  const { inventory, updateProduct, deleteAllDamagedProducts } = useApp();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [bulkSelect, setBulkSelect] = useState([]);
  const [showDeleteAll, setShowDeleteAll] = useState(false);
  const [form, setForm] = useState({
    damageId: '',
    productId: '',
    productName: '',
    orderedByCustomer: '',
    orderId: '',
    productCost: '',
    quantity: '',
    damagedQuantity: '',
    whereDamaged: '',
    rackNumber: '',
    shelfNumber: '',
    binNumber: '',
    damageType: '',
    damageDate: getTodayDate(),
    receivedDate: getTodayDate(),
    deliveredDate: '',
    returnedDate: '',
    reason: '',
    notes: '',
    remarks: '',
    customerPincode: ''
  });

  const damagedProducts = useMemo(() => {
    return inventory.filter(p => parseInt(p.damagedQuantity || 0) > 0 || p.damaged).map(p => ({
      ...p,
      damageId: p.damageId || p.id,
      damageReason: p.damageReason || p.reason || 'Not specified'
    }));
  }, [inventory]);

  const filtered = useMemo(() => {
    let list = [...damagedProducts];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((p) =>
        (p.productName || p.product || '').toLowerCase().includes(q) ||
        (p.damageReason || '').toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  }, [damagedProducts, search]);

  const totalPages = Math.ceil(filtered.length / 10);
  const paginated = filtered.slice((page - 1) * 10, page * 10);

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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-danger-600 flex items-center justify-center">
              <FiAlertOctagon className="w-6 h-6 text-white" />
            </div>
            Damaged Products
          </h1>
          <p className="text-gray-500 mt-1">{currentTime.toLocaleTimeString('en-IN')} • {currentTime.toLocaleDateString('en-IN')}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => {
            const csv = `Product Name,Damaged Qty,Reason,Rack,Shelf,Notes,Remarks\n${damagedProducts.map(p =>
              `${p.productName || p.product},${p.damagedQuantity || p.quantity},${p.damageReason || ''},${p.rackNumber || ''},${p.shelfNumber || ''},${p.notes || ''},${p.remarks || ''}`
            ).join('\n')}`;
            downloadFile(csv, `damaged-products-${new Date().toISOString().split('T')[0]}.csv`);
          }} className="btn-secondary flex items-center gap-2 text-sm">
            <FiDownload className="w-4 h-4" /> Export
          </button>

          {damagedProducts.length > 0 && (
            <button onClick={() => setShowDeleteAll(true)} className="btn-danger flex items-center gap-2 text-sm" title="Delete All Damaged Products">
              <FiTrash2 className="w-4 h-4" /> Delete All Data
            </button>
          )}
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
            <SearchBox value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search damaged products..." />
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={FiAlertOctagon}
            title="No Damaged Products Found"
            description="Products with damaged quantities will appear here"
            action={null}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="table-header">
                    <th className="text-left py-3 px-2">Product</th>
                    <th className="text-left py-3 px-2">Damaged Qty</th>
                    <th className="text-left py-3 px-2 hidden md:table-cell">Reason</th>
                    <th className="text-left py-3 px-2 hidden lg:table-cell">Location</th>
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
                      <td className="py-3 px-2 font-medium">{product.productName || product.product || '-'}</td>
                      <td className="py-3 px-2 text-red-600 font-semibold">{product.damagedQuantity || product.quantity || 0}</td>
                      <td className="py-3 px-2 hidden md:table-cell">{product.damageReason || '-'}</td>
                      <td className="py-3 px-2 hidden lg:table-cell">R{product.rackNumber}/S{product.shelfNumber}</td>
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

      <Modal isOpen={modal === 'view'} onClose={() => { setModal(null); setSelected(null); }} title="Damaged Product Details" size="lg">
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Product Name</p>
                <p className="font-semibold text-gray-900 dark:text-white">{selected.productName || '-'}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Damaged Quantity</p>
                <p className="font-semibold text-red-600">{selected.damagedQuantity || 0}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Reason</p>
                <p className="font-semibold text-gray-900 dark:text-white">{selected.damageReason || '-'}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Location</p>
                <p className="font-semibold text-gray-900 dark:text-white">R{selected.rackNumber}/S{selected.shelfNumber}/B{selected.binNumber}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 md:col-span-2">
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

export default DamagedProducts;