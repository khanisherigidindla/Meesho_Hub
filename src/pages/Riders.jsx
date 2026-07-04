import { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlus, FiEye, FiEdit2, FiTrash2, FiDownload, FiUpload, FiUsers } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import SearchBox from '../components/SearchBox';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import RiderForm from '../components/RiderForm';
import RiderViewModal from '../components/RiderViewModal';
import Avatar, { Badge, EmptyState, Pagination } from '../components/UIComponents';
import { SORT_OPTIONS, ITEMS_PER_PAGE } from '../utils/constants';
import { ridersToCSV, parseRidersCSV } from '../utils/csvUtils';
import { downloadFile, readFileAsText, formatDate } from '../utils/storage';

const Riders = () => {
  const { riders, addRider, updateRider, deleteRider, importRiders, getRiderShipments } = useApp();
  const location = useLocation();

  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

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
          r.riderId?.toLowerCase().includes(q)
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

  const handleAdd = (data) => {
    addRider(data);
    setModal(null);
  };

  const handleEdit = (data) => {
    updateRider(selected.id, data);
    setModal(null);
    setSelected(null);
  };

  const handleDelete = () => {
    deleteRider(deleteId);
    setDeleteId(null);
  };

  const handleExport = () => {
    const csv = ridersToCSV(riders);
    downloadFile(csv, `riders-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const text = await readFileAsText(file);
      const parsed = parseRidersCSV(text);
      if (parsed.length > 0) {
        importRiders(parsed);
        alert(`Imported ${parsed.length} riders successfully`);
      } else {
        alert('No valid riders found in CSV');
      }
    } catch {
      alert('Failed to import CSV');
    }
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Riders</h1>
        <div className="flex flex-wrap gap-2">
          <button onClick={handleExport} className="btn-secondary flex items-center gap-2 text-sm">
            <FiDownload className="w-4 h-4" /> Export CSV
          </button>
          <label className="btn-secondary flex items-center gap-2 text-sm cursor-pointer">
            <FiUpload className="w-4 h-4" /> Import CSV
            <input type="file" accept=".csv" onChange={handleImport} className="hidden" />
          </label>
          <button onClick={() => setModal('add')} className="btn-primary flex items-center gap-2 text-sm">
            <FiPlus className="w-4 h-4" /> Add Rider
          </button>
        </div>
      </div>

      <div className="card">
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
            description="Add your first rider or adjust your search filters."
            action={<button onClick={() => setModal('add')} className="btn-primary">Add Rider</button>}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-2 font-medium text-gray-500">Photo</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-500">Rider ID</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-500">Name</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-500 hidden md:table-cell">Phone</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-500 hidden lg:table-cell">Bike</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-500 hidden lg:table-cell">Joining</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-500">Status</th>
                    <th className="text-right py-3 px-2 font-medium text-gray-500">Actions</th>
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
                      <td className="py-3 px-2"><Avatar src={rider.photo} name={rider.fullName} size="sm" /></td>
                      <td className="py-3 px-2 font-medium">{rider.riderId || '-'}</td>
                      <td className="py-3 px-2">{rider.fullName || '-'}</td>
                      <td className="py-3 px-2 hidden md:table-cell">{rider.phone || '-'}</td>
                      <td className="py-3 px-2 hidden lg:table-cell">{rider.bikeNumber || '-'}</td>
                      <td className="py-3 px-2 hidden lg:table-cell">{formatDate(rider.dateOfJoining)}</td>
                      <td className="py-3 px-2"><Badge status={rider.employmentStatus || 'Inactive'} /></td>
                      <td className="py-3 px-2">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => { setSelected(rider); setModal('view'); }} className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600" title="View">
                            <FiEye className="w-4 h-4" />
                          </button>
                          <button onClick={() => { setSelected(rider); setModal('edit'); }} className="p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600" title="Edit">
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => setDeleteId(rider.id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600" title="Delete">
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
      </div>

      <Modal isOpen={modal === 'add'} onClose={() => setModal(null)} title="Add New Rider" size="lg">
        <RiderForm onSubmit={handleAdd} onCancel={() => setModal(null)} />
      </Modal>

      <Modal isOpen={modal === 'edit'} onClose={() => { setModal(null); setSelected(null); }} title="Edit Rider" size="lg">
        <RiderForm initialData={selected} onSubmit={handleEdit} onCancel={() => { setModal(null); setSelected(null); }} submitLabel="Update Rider" />
      </Modal>

      <Modal isOpen={modal === 'view'} onClose={() => { setModal(null); setSelected(null); }} title="Rider Details" size="lg">
        <RiderViewModal rider={selected} shipments={selected ? getRiderShipments(selected.id) : []} onClose={() => { setModal(null); setSelected(null); }} />
      </Modal>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Rider"
        message="Are you sure you want to delete this rider? All related attendance and shipment records will also be removed."
      />
    </div>
  );
};

export default Riders;
