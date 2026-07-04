import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  STORAGE_KEYS,
  DEFAULT_SETTINGS,
  AUTH_CREDENTIALS,
} from '../utils/constants';
import { getItem, setItem, generateId, getTodayDate } from '../utils/storage';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => getItem(STORAGE_KEYS.AUTH, null));
  const [riders, setRiders] = useState(() => getItem(STORAGE_KEYS.RIDERS, []));
  const [attendance, setAttendance] = useState(() => getItem(STORAGE_KEYS.ATTENDANCE, []));
  const [shipments, setShipments] = useState(() => getItem(STORAGE_KEYS.SHIPMENTS, []));
  const [settings, setSettings] = useState(() =>
    getItem(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS)
  );
  const [theme, setTheme] = useState(() => getItem(STORAGE_KEYS.THEME, 'light'));

  useEffect(() => {
    setItem(STORAGE_KEYS.RIDERS, riders);
  }, [riders]);

  useEffect(() => {
    setItem(STORAGE_KEYS.ATTENDANCE, attendance);
  }, [attendance]);

  useEffect(() => {
    setItem(STORAGE_KEYS.SHIPMENTS, shipments);
  }, [shipments]);

  useEffect(() => {
    setItem(STORAGE_KEYS.SETTINGS, settings);
  }, [settings]);

  useEffect(() => {
    setItem(STORAGE_KEYS.THEME, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const login = (email, password) => {
    if (email === AUTH_CREDENTIALS.email && password === AUTH_CREDENTIALS.password) {
      const session = { email, loggedInAt: new Date().toISOString() };
      setAuth(session);
      setItem(STORAGE_KEYS.AUTH, session);
      return { success: true };
    }
    return { success: false, error: 'Invalid Email or Password' };
  };

  const logout = () => {
    setAuth(null);
    localStorage.removeItem(STORAGE_KEYS.AUTH);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const addRider = (riderData) => {
    const newRider = {
      ...riderData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setRiders((prev) => [newRider, ...prev]);
    return newRider;
  };

  const updateRider = (id, riderData) => {
    setRiders((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, ...riderData, updatedAt: new Date().toISOString() } : r
      )
    );
  };

  const deleteRider = (id) => {
    setRiders((prev) => prev.filter((r) => r.id !== id));
    setAttendance((prev) => prev.filter((a) => a.riderId !== id));
    setShipments((prev) => prev.filter((s) => s.riderId !== id));
  };

  const addAttendance = (data) => {
    const newRecord = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setAttendance((prev) => [newRecord, ...prev]);
    return newRecord;
  };

  const updateAttendance = (id, data) => {
    setAttendance((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...data } : a))
    );
  };

  const deleteAttendance = (id) => {
    setAttendance((prev) => prev.filter((a) => a.id !== id));
  };

  const addShipment = (data) => {
    const newShipment = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setShipments((prev) => [newShipment, ...prev]);
    return newShipment;
  };

  const updateShipment = (id, data) => {
    setShipments((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...data } : s))
    );
  };

  const deleteShipment = (id) => {
    setShipments((prev) => prev.filter((s) => s.id !== id));
  };

  const importRiders = (riderList) => {
    const newRiders = riderList.map((r) => ({
      ...r,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    setRiders((prev) => [...newRiders, ...prev]);
    return newRiders.length;
  };

  const restoreData = useCallback((data) => {
    if (data[STORAGE_KEYS.RIDERS]) setRiders(data[STORAGE_KEYS.RIDERS]);
    if (data[STORAGE_KEYS.ATTENDANCE]) setAttendance(data[STORAGE_KEYS.ATTENDANCE]);
    if (data[STORAGE_KEYS.SHIPMENTS]) setShipments(data[STORAGE_KEYS.SHIPMENTS]);
    if (data[STORAGE_KEYS.SETTINGS]) setSettings(data[STORAGE_KEYS.SETTINGS]);
    if (data[STORAGE_KEYS.THEME]) setTheme(data[STORAGE_KEYS.THEME]);
  }, []);

  const getStats = useCallback(() => {
    const today = getTodayDate();
    const todayAttendance = attendance.filter((a) => a.date === today);
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const newRidersThisMonth = riders.filter(
      (r) => r.createdAt && new Date(r.createdAt) >= monthStart
    ).length;

    return {
      totalRiders: riders.length,
      activeRiders: riders.filter((r) => r.employmentStatus === 'Active').length,
      inactiveRiders: riders.filter((r) => r.employmentStatus === 'Inactive').length,
      todayPresent: todayAttendance.filter((a) => a.status === 'Present').length,
      todayAbsent: todayAttendance.filter((a) => a.status === 'Absent').length,
      todayHalfDay: todayAttendance.filter((a) => a.status === 'Half Day').length,
      newRiders: newRidersThisMonth,
      totalShipments: shipments.length,
      pendingShipments: shipments.filter((s) => s.status === 'Pending').length,
      deliveredToday: shipments.filter(
        (s) => s.status === 'Delivered' && s.date === today
      ).length,
      latestRider: riders.length > 0 ? riders[0] : null,
    };
  }, [riders, attendance, shipments]);

  const getRiderById = useCallback(
    (id) => riders.find((r) => r.id === id),
    [riders]
  );

  const getRiderShipments = useCallback(
    (riderId) => shipments.filter((s) => s.riderId === riderId),
    [shipments]
  );

  const value = {
    auth,
    riders,
    attendance,
    shipments,
    settings,
    theme,
    login,
    logout,
    toggleTheme,
    setSettings,
    addRider,
    updateRider,
    deleteRider,
    addAttendance,
    updateAttendance,
    deleteAttendance,
    addShipment,
    updateShipment,
    deleteShipment,
    importRiders,
    restoreData,
    getStats,
    getRiderById,
    getRiderShipments,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
