import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSave, FiTrash2, FiDownload, FiPrinter, FiEdit, FiFileText } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import { downloadFile, getTodayDate } from '../utils/storage';

const Notepad = () => {
  const [notes, setNotes] = useState('');
  const [savedNotes, setSavedNotes] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    const stored = localStorage.getItem('warehouse_notepad');
    if (stored) {
      setSavedNotes(JSON.parse(stored));
    }
    return () => clearInterval(timer);
  }, []);

  const handleSave = () => {
    const note = {
      id: Date.now(),
      content: notes,
      date: new Date().toISOString(),
      dateStr: getTodayDate()
    };
    const updated = [note, ...savedNotes];
    setSavedNotes(updated);
    localStorage.setItem('warehouse_notepad', JSON.stringify(updated));
    setNotes('');
    alert('Note saved successfully!');
  };

  const handleDelete = (id) => {
    const updated = savedNotes.filter(note => note.id !== id);
    setSavedNotes(updated);
    localStorage.setItem('warehouse_notepad', JSON.stringify(updated));
  };

  const handleExport = () => {
    const content = savedNotes.map(n => `[${new Date(n.date).toLocaleString()}] ${n.content}`).join('\n\n');
    downloadFile(content, `notepad-${getTodayDate()}.txt`);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Notepad - Warehouse</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .note { margin-bottom: 20px; padding: 10px; border-bottom: 1px solid #ddd; }
            .date { color: #666; font-size: 12px; }
            h1 { color: #3b82f6; }
          </style>
        </head>
        <body>
          <h1>Warehouse Notes</h1>
          <p>Generated on: ${new Date().toLocaleString()}</p>
          ${savedNotes.map(n => `<div class="note">
            <p class="date">${new Date(n.date).toLocaleString()}</p>
            <p>${n.content.replace(/\n/g, '<br>')}</p>
          </div>`).join('')}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-500 to-slate-600 flex items-center justify-center">
              <FiEdit className="w-6 h-6 text-white" />
            </div>
            Notepad
          </h1>
          <p className="text-gray-500 mt-1">{currentTime.toLocaleTimeString('en-IN')} • {currentTime.toLocaleDateString('en-IN')}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={handlePrint} className="btn-secondary flex items-center gap-2 text-sm">
            <FiPrinter className="w-4 h-4" /> Print
          </button>
          <button onClick={handleExport} className="btn-secondary flex items-center gap-2 text-sm">
            <FiDownload className="w-4 h-4" /> Export
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="input-field h-64 resize-none w-full"
          placeholder="Write your notes here... (All fields saved to LocalStorage)"
        />
        <div className="flex justify-end mt-4">
          <button onClick={handleSave} className="btn-primary flex items-center gap-2">
            <FiSave className="w-4 h-4" /> Save Note
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Saved Notes</h2>
        {savedNotes.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No saved notes yet. Start writing above!</p>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {savedNotes.map((note, i) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs text-gray-500">{new Date(note.date).toLocaleString('en-IN')}</span>
                  <button onClick={() => handleDelete(note.id)} className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600">
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{note.content}</p>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Notepad;