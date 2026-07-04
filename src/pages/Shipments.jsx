import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiDownload, FiPackage } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import SearchBox from '../components/SearchBox';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import { Badge, EmptyState, Pagination } from '../components/UIComponents';
import { ORDER_STATUS, ITEMS_PER_PAGE } from '../utils/constants';
// DELIVERY_STATUS is now ORDER_STATUS
import { shipmentsToCSV } from '../utils/csvUtils';
import { downloadFile, getTodayDate } from '../utils/storage';

const emptyForm = {
  shipmentId: '',
  riderId: '',
  status: 'Pending',
  parcelCount: '',
  date: getTodayDate(),
  remarks: '',
};

const Shipments = () => {
  const { shipments, riders, addShipment, updateShipment, deleteShipment } = useApp();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const getRiderName = (riderId) => {
    const r = riders.find((x) => x.id === riderId);
    return r?.fullName || r?.riderId || 'Unassigned';
  };

  const riderStats = useMemo(() => {
    const stats = {};
    shipments.forEach((s) => {
      if (!s.riderId) return;
      if (!stats[s.riderId]) stats[s.riderId] = { total: 0, delivered: 0 };
      stats[s.riderId].total++;
      if (s.status === 'Delivered') stats[s.riderId].delivered++;
    });
    return stats;
  }, [shipments]);

  const filtered = useMemo(() => {
    if (!search) return shipments;
    const q = search.toLowerCase();
    return shipments.filter(
      (s) =>
        s.shipmentId?.toLowerCase().includes(q) ||
        getRiderName(s.riderId).toLowerCase().includes(q) ||
        s.status?.toLowerCase().includes(q)
    );
  }, [shipments, search, riders]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const openAdd = () => {
    setForm({ ...emptyForm, date: getTodayDate() });
    setEditId(null);
    setModal('form');
  };

  const openEdit = (record) => {
    setForm({ ...record });
    setEditId(record.id);
    setModal('form');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) updateShipment(editId, form);
    else addShipment(form);
    setModal(null);
    setForm(emptyForm);
    setEditId(null);
  };

  const handleDelete = () => {
    deleteShipment(deleteId);
    setDeleteId(null);
  };

  const handleExport = () => {
    const csv = shipmentsToCSV(shipments, riders);
    downloadFile(csv, `shipments-${getTodayDate()}.csv`);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const today = getTodayDate();
  const todayShipments = shipments.filter((s) => s.date === today);
  const todayDelivered = todayShipments.filter((s) => s.status === 'Delivered').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Shipments</h1>
          <p className="text-sm text-gray-500 mt-1">
            Today: {todayShipments.length} shipments, {todayDelivered} delivered
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExport} className="btn-secondary flex items-center gap-2 text-sm">
            <FiDownload className="w-4 h-4" /> Export CSV
          </button>
          <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm">
            <FiPlus className="w-4 h-4" /> Add Shipment
          </button>
        </div>
      </div>

      {Object.keys(riderStats).length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(riderStats).slice(0, 6).map(([riderId, stat]) => (
            <div key={riderId} className="card text-sm">
              <p className="font-semibold text-gray-900 dark:text-white">{getRiderName(riderId)}</p>
              <p className="text-gray-500 mt-1">Total: {stat.total} | Delivered: {stat.delivered}</p>
            </div>
          ))}
        </div>
      )}

      <div className="card">
        <div className="mb-6 max-w-md">
          <SearchBox value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search shipment ID, rider, status..." />
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={FiPackage}
            title="No Shipments Found"
            description="Assign parcels to riders by creating a shipment."
            action={<button onClick={openAdd} className="btn-primary">Add Shipment</button>}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-2 font-medium text-gray-500">Shipment ID</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-500">Rider</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-500">Status</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-500 hidden md:table-cell">Parcels</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-500 hidden md:table-cell">Date</th>
                    <th className="text-right py-3 px-2 font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((s, i) => (
                    <motion.tr
                      key={s.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30"
                    >
                      <td className="py-3 px-2 font-medium">{s.shipmentId || '-'}</td>
                      <td className="py-3 px-2">{getRiderName(s.riderId)}</td>
                      <td className="py-3 px-2"><Badge status={s.status} /></td>
                      <td className="py-3 px-2 hidden md:table-cell">{s.parcelCount || '-'}</td>
                      <td className="py-3 px-2 hidden md:table-cell">{s.date || '-'}</td>
                      <td className="py-3 px-2">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openEdit(s)} className="p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600">
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => setDeleteId(s.id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600">
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

      <Modal isOpen={modal === 'form'} onClose={() => setModal(null)} title={editId ? 'Edit Shipment' : 'Add Shipment'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Shipment ID</label>
            <input type="text" name="shipmentId" value={form.shipmentId || ''} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="label">Assign Rider</label>
            <select name="riderId" value={form.riderId || ''} onChange={handleChange} className="input-field">
              <option value="">Select Rider...</option>
              {riders.map((r) => (
                <option key={r.id} value={r.id}>{r.fullName || r.riderId || 'Unnamed'}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Delivery Status</label>
<select name="status" value={form.status || ''} onChange={handleChange} className="input-field">
              {ORDER_STATUS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Parcel Count</label>
              <input type="number" name="parcelCount" value={form.parcelCount || ''} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="label">Date</label>
              <input type="date" name="date" value={form.date || ''} onChange={handleChange} className="input-field" />
            </div>
          </div>
          <div>
            <label className="label">Remarks</label>
            <input type="text" name="remarks" value={form.remarks || ''} onChange={handleChange} className="input-field" />
          </div>
          <div className="flex gap-3 justify-end pt-4">
            <button type="button" onClick={() => setModal(null)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">{editId ? 'Update' : 'Save'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Shipment"
        message="Are you sure you want to delete this shipment record?"
      />
    </div>
  );
};

export default Shipments;
