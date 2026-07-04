import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiDownload, FiCalendar } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import SearchBox from '../components/SearchBox';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import { Badge, EmptyState, Pagination } from '../components/UIComponents';
import { ATTENDANCE_STATUS, ITEMS_PER_PAGE } from '../utils/constants';
import { attendanceToCSV } from '../utils/csvUtils';
import { downloadFile, getTodayDate } from '../utils/storage';

const emptyForm = {
  date: getTodayDate(),
  riderId: '',
  status: 'Present',
  inTime: '',
  outTime: '',
  late: false,
  overtime: '',
  remarks: '',
};

const Attendance = () => {
  const { attendance, riders, addAttendance, updateAttendance, deleteAttendance } = useApp();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const getRiderName = (riderId) => {
    const r = riders.find((x) => x.id === riderId);
    return r?.fullName || r?.riderId || 'Unknown';
  };

  const filtered = useMemo(() => {
    if (!search) return attendance;
    const q = search.toLowerCase();
    return attendance.filter((a) => getRiderName(a.riderId).toLowerCase().includes(q) || a.date?.includes(q));
  }, [attendance, search, riders]);

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
    if (editId) updateAttendance(editId, form);
    else addAttendance(form);
    setModal(null);
    setForm(emptyForm);
    setEditId(null);
  };

  const handleDelete = () => {
    deleteAttendance(deleteId);
    setDeleteId(null);
  };

  const handleExport = () => {
    const csv = attendanceToCSV(attendance, riders);
    downloadFile(csv, `attendance-${getTodayDate()}.csv`);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Attendance</h1>
        <div className="flex gap-2">
          <button onClick={handleExport} className="btn-secondary flex items-center gap-2 text-sm">
            <FiDownload className="w-4 h-4" /> Export CSV
          </button>
          <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm">
            <FiPlus className="w-4 h-4" /> Add Record
          </button>
        </div>
      </div>

      <div className="card">
        <div className="mb-6 max-w-md">
          <SearchBox value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search by rider name or date..." />
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={FiCalendar}
            title="No Attendance Found"
            description="Start tracking rider attendance by adding a record."
            action={<button onClick={openAdd} className="btn-primary">Add Attendance</button>}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-2 font-medium text-gray-500">Date</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-500">Rider Name</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-500">Status</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-500 hidden md:table-cell">In Time</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-500 hidden md:table-cell">Out Time</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-500 hidden lg:table-cell">Late</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-500 hidden lg:table-cell">Overtime</th>
                    <th className="text-right py-3 px-2 font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((a, i) => (
                    <motion.tr
                      key={a.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30"
                    >
                      <td className="py-3 px-2">{a.date || '-'}</td>
                      <td className="py-3 px-2 font-medium">{getRiderName(a.riderId)}</td>
                      <td className="py-3 px-2"><Badge status={a.status} /></td>
                      <td className="py-3 px-2 hidden md:table-cell">{a.inTime || '-'}</td>
                      <td className="py-3 px-2 hidden md:table-cell">{a.outTime || '-'}</td>
                      <td className="py-3 px-2 hidden lg:table-cell">{a.late ? 'Yes' : 'No'}</td>
                      <td className="py-3 px-2 hidden lg:table-cell">{a.overtime || '-'}</td>
                      <td className="py-3 px-2">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openEdit(a)} className="p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600">
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => setDeleteId(a.id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600">
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

      <Modal isOpen={modal === 'form'} onClose={() => setModal(null)} title={editId ? 'Edit Attendance' : 'Add Attendance'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Date</label>
            <input type="date" name="date" value={form.date || ''} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="label">Rider</label>
            <select name="riderId" value={form.riderId || ''} onChange={handleChange} className="input-field">
              <option value="">Select Rider...</option>
              {riders.map((r) => (
                <option key={r.id} value={r.id}>{r.fullName || r.riderId || 'Unnamed'}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Status</label>
            <select name="status" value={form.status || ''} onChange={handleChange} className="input-field">
              {Object.values(ATTENDANCE_STATUS).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">In Time</label>
              <input type="time" name="inTime" value={form.inTime || ''} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="label">Out Time</label>
              <input type="time" name="outTime" value={form.outTime || ''} onChange={handleChange} className="input-field" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" name="late" id="late" checked={form.late || false} onChange={handleChange} className="rounded" />
            <label htmlFor="late" className="text-sm text-gray-700 dark:text-gray-300">Late</label>
          </div>
          <div>
            <label className="label">Overtime (hours)</label>
            <input type="text" name="overtime" value={form.overtime || ''} onChange={handleChange} className="input-field" placeholder="e.g. 2" />
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
        title="Delete Attendance"
        message="Are you sure you want to delete this attendance record?"
      />
    </div>
  );
};

export default Attendance;
