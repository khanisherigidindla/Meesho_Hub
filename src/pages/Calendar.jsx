import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiChevronLeft, FiChevronRight, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import { getTodayDate } from '../utils/storage';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [events, setEvents] = useState([]);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    const stored = localStorage.getItem('warehouse_calendar_events');
    if (stored) {
      setEvents(JSON.parse(stored));
    }
    return () => clearInterval(timer);
  }, []);

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleAddEvent = () => {
    if (!newEvent.trim()) return;
    const event = {
      id: Date.now(),
      date: selectedDate,
      content: newEvent,
      createdAt: new Date().toISOString()
    };
    const updated = [...events, event];
    setEvents(updated);
    localStorage.setItem('warehouse_calendar_events', JSON.stringify(updated));
    setNewEvent('');
    setShowAddEvent(false);
  };

  const handleDeleteEvent = (id) => {
    const updated = events.filter(e => e.id !== id);
    setEvents(updated);
    localStorage.setItem('warehouse_calendar_events', JSON.stringify(updated));
  };

  const getEventsForDate = (dateStr) => {
    return events.filter(e => e.date === dateStr);
  };

  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center">
              <FiCalendar className="w-6 h-6 text-white" />
            </div>
            Calendar
          </h1>
          <p className="text-gray-500 mt-1">{currentTime.toLocaleTimeString('en-IN')} • {currentTime.toLocaleDateString('en-IN')}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handlePrevMonth} className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <FiChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button onClick={handleNextMonth} className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <FiChevronRight className="w-5 h-5" />
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <div className="grid grid-cols-7 gap-2 mb-4">
          {dayNames.map(day => (
            <div key={day} className="text-center font-semibold text-gray-600 dark:text-gray-400 py-2">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => {
            if (!day) {
              return <div key={`empty-${index}`} className="h-24"></div>;
            }
            const dateStr = day.toISOString().split('T')[0];
            const dayEvents = getEventsForDate(dateStr);
            const isToday = dateStr === getTodayDate();
            const isSelected = dateStr === selectedDate;

            return (
              <motion.div
                key={dateStr}
                whileHover={{ scale: 1.05 }}
                onClick={() => setSelectedDate(dateStr)}
                className={`h-24 rounded-lg border-2 p-2 cursor-pointer transition-all ${
                  isSelected ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 
                  isToday ? 'border-success-500 bg-success-50 dark:bg-success-900/20' : 
                  'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30'
                }`}
              >
                <div className={`text-sm font-semibold ${
                  isToday ? 'text-success-600' : isSelected ? 'text-primary-600' : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {day.getDate()}
                </div>
                {dayEvents.length > 0 && (
                  <div className="mt-1">
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Events for {new Date(selectedDate).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </h3>
          <button onClick={() => setShowAddEvent(true)} className="btn-primary-sm flex items-center gap-1">
            <FiPlus className="w-4 h-4" /> Add
          </button>
        </div>

        {showAddEvent && (
          <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
            <textarea
              value={newEvent}
              onChange={(e) => setNewEvent(e.target.value)}
              className="input-field h-24 resize-none mb-2"
              placeholder="Enter event details..."
            />
            <div className="flex gap-2">
              <button onClick={handleAddEvent} className="btn-primary text-sm">Save</button>
              <button onClick={() => setShowAddEvent(false)} className="btn-secondary text-sm">Cancel</button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {getEventsForDate(selectedDate).length === 0 ? (
            <p className="text-gray-500 text-center py-4">No events for this date</p>
          ) : (
            getEventsForDate(selectedDate).map(event => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg"
              >
                <p className="text-gray-900 dark:text-white">{event.content}</p>
                <button onClick={() => handleDeleteEvent(event.id)} className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600">
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Calendar;