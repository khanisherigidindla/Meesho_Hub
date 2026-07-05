import { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlus, FiEye, FiEdit2, FiTrash2, FiDownload, FiUpload, FiPrinter, FiFileText, FiUsers, FiX, FiCheckSquare, FiTrash } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import SearchBox from '../components/SearchBox';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import { Badge, EmptyState, Pagination } from '../components/UIComponents';
import { SORT_OPTIONS, ITEMS_PER_PAGE } from '../utils/constants';
import { downloadFile, formatDate, getTodayDate } from '../utils/storage';

const Riders = () => {
  const { riders, addRider, updateRider, deleteRider, deleteAllRiders, getRiderShipments } = useApp();
  const location = useLocation();

  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteAllId, setDeleteAllId] = useState(null);
  const [bulkSelect, setBulkSelect] = useState([]);
  const [form, setForm] = useState({
    riderId: '',
    fullName: '',
    phone: '',
    address: '',
    bikeNumber: '',
    bankAccount: '',
    panCard: '',
    ifscCode: '',
    aadharNumber: '',
    dateOfJoining: '',
    employmentStatus: 'Active',
    notes: '',
    remarks: ''
  });

  // Current time display
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (location.state?.openAdd) {
      setModal('add');
      window.history.replaceState({}, '');
    }
  }, [location.state]);

  const filtered = useMemo(() => {
    let list = [...riders];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.fullName?.toLowerCase().includes(q) ||
          r.phone?.includes(q) ||
          r.bikeNumber?.toLowerCase().includes(q) ||
          r.riderId?.toLowerCase().includes(q) ||
          r.bankAccount?.includes(q) ||
          r.panCard?.includes(q) ||
          r.aadharNumber?.includes(q)
      );
    }

    if (statusFilter) {
      list = list.filter((r) => r.employmentStatus === statusFilter);
    }

    if (sort === 'newest') list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    else if (sort === 'oldest') list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    else if (sort === 'name-az') list.sort((a, b) => (a.fullName || '').localeCompare(b.fullName || ''));

    return list;
  }, [riders, search, sort, statusFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleAdd = () => {
    addRider(form);
    setModal(null);
    setForm({
      riderId: '', fullName: '', phone: '', address: '', bikeNumber: '',
      bankAccount: '', panCard: '', ifscCode: '', aadharNumber: '',
      dateOfJoining: '', employmentStatus: 'Active', notes: '', remarks: ''
    });
  };

  const handleUpdate = () => {
    updateRider(selected.id, form);
    setModal(null);
    setSelected(null);
  };

  const handleDelete = () => {
    deleteRider(deleteId);
    setDeleteId(null);
  };

  const handleExport = () => {
    const csv = `Rider ID,Name,Phone,Address,Bike,Bank Account,PAN,IFSC,Aadhar,Joining Date,Status,Notes,Remarks\n${riders.map(r =>
      `${r.riderId || ''},${r.fullName},${r.phone || ''},${r.address || ''},${r.bikeNumber || ''},${r.bankAccount || ''},${r.panCard || ''},${r.ifscCode || ''},${r.aadharNumber || ''},${r.dateOfJoining || ''},${r.employmentStatus || ''},${r.notes || ''},${r.remarks || ''}`
    ).join('\n')}`;
    downloadFile(csv, `riders-${getTodayDate()}.csv`);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Riders Data - Meesho Warehouse</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
            th { background: #3b82f6; color: white; }
          </style>
        </head>
        <body>
          <h1>Riders - Meesho Warehouse</h1>
          <p>Generated on: ${new Date().toLocaleString()}</p>
          <table>
            <thead>
              <tr>
                <th>Name</th><th>Phone</th><th>Bike</th><th>Status</th><th>Bank</th><th>PAN</th>
              </tr>
            </thead>
            <tbody>
              ${riders.map(r => `<tr>
                <td>${r.fullName || '-'}</td>
                <td>${r.phone || '-'}</td>
                <td>${r.bikeNumber || '-'}</td>
                <td>${r.employmentStatus || '-'}</td>
                <td>${r.bankAccount || '-'}</td>
                <td>${r.panCard || '-'}</td>
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
      setBulkSelect(filtered.map(r => r.id));
    }
  };

  const handleBulkDelete = () => {
    bulkSelect.forEach(id => deleteRider(id));
    setBulkSelect([]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center">
              <FiUsers className="w-6 h-6 text-white" />
            </div>
            Riders Management
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
          {riders.length > 0 && (
            <button onClick={() => setDeleteAllId('all')} className="btn-danger flex items-center gap-2 text-sm" title="Delete All Riders">
              <FiTrash className="w-4 h-4" /> Delete All
            </button>
          )}
          <button onClick={() => setModal('add')} className="btn-primary flex items-center gap-2">
            <FiPlus className="w-4 h-4" /> Add Rider
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchBox value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search by name, phone, bike, ID..." />
          </div>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="input-field w-full sm:w-40">
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="input-field w-full sm:w-40">
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={FiUsers}
            title="No Riders Found"
            description="Add your first rider to get started"
            action={<button onClick={() => setModal('add')} className="btn-primary">Add Rider</button>}
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
                    <th className="text-left py-3 px-2">Rider ID</th>
                    <th className="text-left py-3 px-2">Name</th>
                    <th className="text-left py-3 px-2 hidden md:table-cell">Phone</th>
                    <th className="text-left py-3 px-2 hidden lg:table-cell">Bike</th>
                    <th className="text-left py-3 px-2 hidden lg:table-cell">Bank</th>
                    <th className="text-left py-3 px-2">Status</th>
                    <th className="text-right py-3 px-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((rider, i) => (
                    <motion.tr
                      key={rider.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30"
                    >
                      <td className="py-3 px-2 hidden sm:table-cell">
                        <input
                          type="checkbox"
                          checked={bulkSelect.includes(rider.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setBulkSelect([...bulkSelect, rider.id]);
                            } else {
                              setBulkSelect(bulkSelect.filter(id => id !== rider.id));
                            }
                          }}
                          className="w-4 h-4 text-primary-600 rounded"
                        />
                      </td>
                      <td className="py-3 px-2 font-medium">{rider.riderId || '-'}</td>
                      <td className="py-3 px-2">{rider.fullName || '-'}</td>
                      <td className="py-3 px-2 hidden md:table-cell">{rider.phone || '-'}</td>
                      <td className="py-3 px-2 hidden lg:table-cell">{rider.bikeNumber || '-'}</td>
                      <td className="py-3 px-2 hidden lg:table-cell">{rider.bankAccount || '-'}</td>
                      <td className="py-3 px-2"><Badge status={rider.employmentStatus || 'Inactive'} /></td>
                      <td className="py-3 px-2">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => { setSelected(rider); setModal('view'); }} className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600" title="View">
                            <FiEye className="w-4 h-4" />
                          </button>
                          <button onClick={() => { setSelected(rider); setForm(rider); setModal('edit'); }} className="p-2 rounded-lg bg-green-50 hover:bg-green-100 text-green-600" title="Edit">
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => setDeleteId(rider.id)} className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600" title="Delete">
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

      {/* Add/Edit Modal */}
      <Modal isOpen={modal === 'add' || modal === 'edit'} onClose={() => setModal(null)} title={modal === 'add' ? 'Add New Rider' : 'Edit Rider'} size="lg">
        <form onSubmit={(e) => { e.preventDefault(); modal === 'add' ? handleAdd() : handleUpdate(); }} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="label">Rider ID</label>
              <input type="text" name="riderId" value={form.riderId || ''} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="label">Full Name</label>
              <input type="text" name="fullName" value={form.fullName || ''} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="label">Phone Number</label>
              <input type="tel" name="phone" value={form.phone || ''} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="label">Address</label>
              <textarea name="address" value={form.address || ''} onChange={handleChange} className="input-field resize-none" rows="2"></textarea>
            </div>
            <div>
              <label className="label">Bike Number</label>
              <input type="text" name="bikeNumber" value={form.bikeNumber || ''} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="label">Bank Account Number</label>
              <input type="text" name="bankAccount" value={form.bankAccount || ''} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="label">PAN Card</label>
              <input type="text" name="panCard" value={form.panCard || ''} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="label">IFSC Code</label>
              <input type="text" name="ifscCode" value={form.ifscCode || ''} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="label">Aadhar Number</label>
              <input type="text" name="aadharNumber" value={form.aadharNumber || ''} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="label">Joining Date</label>
              <input type="date" name="dateOfJoining" value={form.dateOfJoining || ''} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="label">Status</label>
              <select name="employmentStatus" value={form.employmentStatus || ''} onChange={handleChange} className="input-field">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
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
            <button type="submit" className="btn-primary">{modal === 'add' ? 'Add Rider' : 'Update Rider'}</button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal isOpen={modal === 'view'} onClose={() => { setModal(null); setSelected(null); }} title="Rider Details" size="lg">
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl">
                {selected.fullName?.charAt(0) || 'R'}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selected.fullName}</h3>
                <p className="text-gray-500">Rider ID: {selected.riderId}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Phone</p>
                <p className="font-semibold">{selected.phone || '-'}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Bike Number</p>
                <p className="font-semibold">{selected.bikeNumber || '-'}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Bank Account</p>
                <p className="font-semibold">{selected.bankAccount || '-'}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">PAN Card</p>
                <p className="font-semibold">{selected.panCard || '-'}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">IFSC Code</p>
                <p className="font-semibold">{selected.ifscCode || '-'}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Aadhar Number</p>
                <p className="font-semibold">{selected.aadharNumber || '-'}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Joining Date</p>
                <p className="font-semibold">{formatDate(selected.dateOfJoining)}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Status</p>
                <Badge status={selected.employmentStatus || 'Inactive'} />
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 md:col-span-2">
                <p className="text-xs text-gray-500 mb-1">Notes</p>
                <p className="font-semibold whitespace-pre-wrap">{selected.notes || '-'}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Rider"
        message="Are you sure you want to delete this rider? All related records will also be removed."
      />
      <ConfirmModal
        isOpen={!!deleteAllId}
        onClose={() => setDeleteAllId(null)}
        onConfirm={() => { deleteAllRiders(); setDeleteAllId(null); }}
        title="Delete All Riders"
        message="Are you sure you want to delete ALL riders? This will permanently remove all rider records and cannot be undone."
        confirmLabel="Delete All"
        confirmColor="danger"
      />
    </div>
  );
};

export default Riders;
