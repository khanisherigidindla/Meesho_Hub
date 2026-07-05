import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  STORAGE_KEYS,
  DEFAULT_SETTINGS,
  AUTH_CREDENTIALS,
  ORDER_STATUS,
  PAYMENT_STATUS,
  PAYMENT_MODE,
  PRODUCT_STATUS,
  DAMAGE_TYPE,
  RETURN_REASON,
  RETURN_STATUS,
  RETURN_TO_MEESHO_STATUS,
  EXPENSE_TYPE,
  SAMPLE_DATA,
} from '../utils/constants';
import { getItem, setItem, generateId, getTodayDate, isStorageAvailable } from '../utils/storage';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => getItem(STORAGE_KEYS.AUTH, null));
  const [riders, setRiders] = useState(() => {
    const stored = getItem(STORAGE_KEYS.RIDERS, null);
    return stored || SAMPLE_DATA.riders;
  });
  const [attendance, setAttendance] = useState(() => getItem(STORAGE_KEYS.ATTENDANCE, []));
  const [shipments, setShipments] = useState(() => getItem(STORAGE_KEYS.SHIPMENTS, []));
  const [customers, setCustomers] = useState(() => {
    const stored = getItem(STORAGE_KEYS.CUSTOMERS, null);
    return stored || SAMPLE_DATA.customers;
  });
  const [orders, setOrders] = useState(() => {
    const stored = getItem(STORAGE_KEYS.ORDERS, null);
    return stored || SAMPLE_DATA.orders;
  });
  const [inventory, setInventory] = useState(() => {
    const stored = getItem(STORAGE_KEYS.INVENTORY, null);
    return stored || SAMPLE_DATA.inventory;
  });
  const [returns, setReturns] = useState(() => {
    const stored = getItem(STORAGE_KEYS.RETURNS, null);
    return stored || SAMPLE_DATA.returns;
  });
  const [revenue, setRevenue] = useState(() => {
    const stored = getItem(STORAGE_KEYS.REVENUE, null);
    return stored || SAMPLE_DATA.revenue;
  });
  const [damagedProducts, setDamagedProducts] = useState(() => {
    const stored = getItem(STORAGE_KEYS.DAMAGED_PRODUCTS, null);
    return stored || SAMPLE_DATA.damagedProducts;
  });
  const [expenses, setExpenses] = useState(() => {
    const stored = getItem(STORAGE_KEYS.EXPENSES, null);
    return stored || SAMPLE_DATA.expenses;
  });
  const [stockMovements, setStockMovements] = useState(() => getItem(STORAGE_KEYS.STOCK_MOVEMENTS, []));
  const [settings, setSettings] = useState(() => getItem(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS));
  const [theme, setTheme] = useState(() => getItem(STORAGE_KEYS.THEME, 'light'));
  const [activityLog, setActivityLog] = useState(() => getItem(STORAGE_KEYS.ACTIVITY_LOG, []));

// Save to localStorage
  useEffect(() => { setItem(STORAGE_KEYS.RIDERS, riders); }, [riders]);
  useEffect(() => { setItem(STORAGE_KEYS.ATTENDANCE, attendance); }, [attendance]);
  useEffect(() => { setItem(STORAGE_KEYS.SHIPMENTS, shipments); }, [shipments]);
  useEffect(() => { setItem(STORAGE_KEYS.CUSTOMERS, customers); }, [customers]);
  useEffect(() => { setItem(STORAGE_KEYS.ORDERS, orders); }, [orders]);
  useEffect(() => { setItem(STORAGE_KEYS.INVENTORY, inventory); }, [inventory]);
  useEffect(() => { setItem(STORAGE_KEYS.RETURNS, returns); }, [returns]);
  useEffect(() => { setItem(STORAGE_KEYS.REVENUE, revenue); }, [revenue]);
  useEffect(() => { setItem(STORAGE_KEYS.DAMAGED_PRODUCTS, damagedProducts); }, [damagedProducts]);
  useEffect(() => { setItem(STORAGE_KEYS.EXPENSES, expenses); }, [expenses]);
  useEffect(() => { setItem(STORAGE_KEYS.STOCK_MOVEMENTS, stockMovements); }, [stockMovements]);
  useEffect(() => { setItem(STORAGE_KEYS.SETTINGS, settings); }, [settings]);
  useEffect(() => {
    setItem(STORAGE_KEYS.THEME, theme);
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [theme]);
  useEffect(() => { setItem(STORAGE_KEYS.ACTIVITY_LOG, activityLog); }, [activityLog]);

  // Damaged Products CRUD
  const addDamagedProduct = (data) => {
    const newDamaged = { ...data, id: generateId(), createdAt: new Date().toISOString() };
    setDamagedProducts((prev) => [newDamaged, ...prev]);
    addActivity('Added Damaged Product', data.product || 'Unnamed');
    return newDamaged;
  };
  const updateDamagedProduct = (id, data) => {
    setDamagedProducts((prev) => prev.map((d) => d.id === id ? { ...d, ...data } : d));
    addActivity('Updated Damaged Product', data.product || 'Updated');
  };
  const deleteDamagedProduct = (id) => {
    setDamagedProducts((prev) => prev.filter((d) => d.id !== id));
    addActivity('Deleted Damaged Product', `ID: ${id}`);
  };

  // Expenses CRUD
  const addExpense = (data) => {
    const newExpense = { ...data, id: generateId(), date: data.date || getTodayDate() };
    setExpenses((prev) => [newExpense, ...prev]);
    addActivity('Added Expense', `₹${data.amount || 0}`);
    return newExpense;
  };
  const updateExpense = (id, data) => {
    setExpenses((prev) => prev.map((e) => e.id === id ? { ...e, ...data } : e));
    addActivity('Updated Expense', data.type || 'Updated');
  };
  const deleteExpense = (id) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    addActivity('Deleted Expense', `ID: ${id}`);
  };

  const login = (email, password) => {
    if (email === AUTH_CREDENTIALS.email && password === AUTH_CREDENTIALS.password) {
      const session = { email, loggedInAt: new Date().toISOString() };
      setAuth(session);
      setItem(STORAGE_KEYS.AUTH, session);
      return { success: true };
    }
    return { success: false, error: 'Invalid Email or Password' };
  };

  const logout = () => { setAuth(null); localStorage.removeItem(STORAGE_KEYS.AUTH); };
  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  const addActivity = (action, details) => {
    const entry = { id: generateId(), timestamp: new Date().toISOString(), action, details };
    setActivityLog((prev) => [entry, ...prev].slice(0, 100));
  };

  // Rider CRUD
  const addRider = (riderData) => {
    const newRider = { ...riderData, id: generateId(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    setRiders((prev) => [newRider, ...prev]);
    addActivity('Added Rider', riderData.fullName || 'Unnamed');
    return newRider;
  };
  const updateRider = (id, riderData) => {
    setRiders((prev) => prev.map((r) => r.id === id ? { ...r, ...riderData, updatedAt: new Date().toISOString() } : r));
    addActivity('Updated Rider', riderData.fullName || 'Unnamed');
  };
  const deleteRider = (id) => {
    setRiders((prev) => prev.filter((r) => r.id !== id));
    setAttendance((prev) => prev.filter((a) => a.riderId !== id));
    setShipments((prev) => prev.filter((s) => s.riderId !== id));
    addActivity('Deleted Rider', `ID: ${id}`);
  };

  // Customer CRUD
  const addCustomer = (customerData) => {
    const newCustomer = { ...customerData, id: generateId(), createdAt: new Date().toISOString() };
    setCustomers((prev) => [newCustomer, ...prev]);
    addActivity('Added Customer', customerData.customerName || 'Unnamed');
    return newCustomer;
  };
  const updateCustomer = (id, customerData) => {
    setCustomers((prev) => prev.map((c) => c.id === id ? { ...c, ...customerData } : c));
    addActivity('Updated Customer', customerData.customerName || 'Unnamed');
  };
  const deleteCustomer = (id) => { setCustomers((prev) => prev.filter((c) => c.id !== id)); addActivity('Deleted Customer', `ID: ${id}`); };

  // Shipment CRUD
  const addShipment = (shipmentData) => {
    const newShipment = { ...shipmentData, id: generateId(), createdAt: new Date().toISOString() };
    setShipments((prev) => [newShipment, ...prev]);
    addActivity('Added Shipment', shipmentData.shipmentId || 'New Shipment');
    return newShipment;
  };
  const updateShipment = (id, shipmentData) => { setShipments((prev) => prev.map((s) => s.id === id ? { ...s, ...shipmentData } : s)); addActivity('Updated Shipment', shipmentData.shipmentId || 'Updated'); };
  const deleteShipment = (id) => { setShipments((prev) => prev.filter((s) => s.id !== id)); addActivity('Deleted Shipment', `ID: ${id}`); };

  // Order CRUD
  const addOrder = (orderData) => {
    const newOrder = { ...orderData, id: generateId(), createdAt: new Date().toISOString(), orderDate: orderData.deliveryDate || getTodayDate() };
    setOrders((prev) => [newOrder, ...prev]);
    addActivity('Added Order', orderData.orderId || 'Unnamed');
    return newOrder;
  };
  const updateOrder = (id, orderData) => { setOrders((prev) => prev.map((o) => o.id === id ? { ...o, ...orderData } : o)); addActivity('Updated Order', orderData.orderId || 'Updated'); };
  const deleteOrder = (id) => { setOrders((prev) => prev.filter((o) => o.id !== id)); addActivity('Deleted Order', `ID: ${id}`); };

  // Inventory CRUD
  const addProduct = (productData) => {
    const newProduct = { ...productData, id: generateId(), receivedDate: productData.receivedDate || getTodayDate() };
    setInventory((prev) => [newProduct, ...prev]);
    addActivity('Added Product', productData.productName || 'Unnamed');
    return newProduct;
  };
  const updateProduct = (id, productData) => { setInventory((prev) => prev.map((p) => p.id === id ? { ...p, ...productData } : p)); addActivity('Updated Product', productData.productName || 'Updated'); };
  const deleteProduct = (id) => { setInventory((prev) => prev.filter((p) => p.id !== id)); addActivity('Deleted Product', `ID: ${id}`); };

  // Return CRUD
  const addReturn = (returnData) => {
    const newReturn = { ...returnData, id: generateId(), createdAt: new Date().toISOString() };
    setReturns((prev) => [newReturn, ...prev]);
    addActivity('Added Return', returnData.returnId || 'New Return');
    return newReturn;
  };
  const updateReturn = (id, returnData) => { setReturns((prev) => prev.map((r) => r.id === id ? { ...r, ...returnData } : r)); addActivity('Updated Return', returnData.returnId || 'Updated'); };

// Revenue
  const addRevenue = (revenueData) => {
    const newRevenue = { ...revenueData, id: generateId(), date: revenueData.date || getTodayDate() };
    setRevenue((prev) => [newRevenue, ...prev]);
    addActivity('Added Revenue', `₹${revenueData.amount || 0}`);
    return newRevenue;
  };
  const updateRevenue = (id, data) => {
    setRevenue((prev) => prev.map((r) => r.id === id ? { ...r, ...data } : r));
    addActivity('Updated Revenue', `₹${data.amount || 0}`);
  };
  const deleteRevenue = (id) => {
    setRevenue((prev) => prev.filter((r) => r.id !== id));
    addActivity('Deleted Revenue', `ID: ${id}`);
  };

  // Stats
  const getStats = useCallback(() => {
    const today = getTodayDate();
    const todayAttendance = attendance.filter((a) => a.date === today);
    const todayOrders = orders.filter((o) => o.deliveryDate === today);
    const monthStart = new Date(); monthStart.setDate(1); monthStart.setHours(0, 0, 0, 0);
    const todayRevenue = revenue.filter((r) => r.date === today);
    const totalRevenue = todayRevenue.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0);

    return {
      totalRiders: riders.length,
      activeRiders: riders.filter((r) => r.employmentStatus === 'Active').length,
      inactiveRiders: riders.filter((r) => r.employmentStatus === 'Inactive').length,
      todayPresent: todayAttendance.filter((a) => a.status === 'Present').length,
      todayAbsent: todayAttendance.filter((a) => a.status === 'Absent').length,
      todayHalfDay: todayAttendance.filter((a) => a.status === 'Half Day').length,
      newRiders: riders.filter((r) => r.createdAt && new Date(r.createdAt) >= monthStart).length,
      totalOrders: orders.length,
      todayOrders: todayOrders.length,
      pendingOrders: orders.filter((o) => o.deliveryStatus === 'Pending').length,
      outForDelivery: orders.filter((o) => o.deliveryStatus === 'Out for Delivery').length,
      deliveredToday: orders.filter((o) => o.deliveryStatus === 'Delivered' && o.deliveryDate === today).length,
      totalStock: inventory.reduce((sum, p) => sum + (parseInt(p.quantity) || 0), 0),
      lowStockAlerts: inventory.filter((p) => parseInt(p.quantity) <= 5).length,
      todayRevenue: totalRevenue,
      cashCollected: todayRevenue.filter((r) => r.paymentType === 'Cash').reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0),
      latestRider: riders.length > 0 ? riders[0] : null,
    };
  }, [riders, attendance, orders, inventory, revenue]);

const value = {
    auth, riders, attendance, shipments, customers, orders, inventory, returns, revenue,
    damagedProducts, expenses, stockMovements, settings, theme, activityLog, 
    login, logout, toggleTheme, setSettings,
    addRider, updateRider, deleteRider, deleteAllRiders: () => { setRiders([]); addActivity('Deleted All Riders', 'Cleared all records'); },
    addAttendance: (data) => { setAttendance((prev) => [{...data, id: generateId(), createdAt: new Date().toISOString()}, ...prev]); },
    updateAttendance: (id, data) => { setAttendance((prev) => prev.map((a) => a.id === id ? {...a, ...data} : a)); },
    deleteAttendance: (id) => { setAttendance((prev) => prev.filter((a) => a.id !== id)); },
    deleteAllAttendance: () => { setAttendance([]); addActivity('Deleted All Attendance', 'Cleared all records'); },
    addShipment, updateShipment, deleteShipment, 
    addDamagedProduct, updateDamagedProduct, deleteDamagedProduct,
    deleteAllDamagedProducts: () => { setDamagedProducts([]); addActivity('Deleted All Damaged Products', 'Cleared all records'); },
    addExpense, updateExpense, deleteExpense,
    deleteAllExpenses: () => { setExpenses([]); addActivity('Deleted All Expenses', 'Cleared all records'); },
    importRiders: (list) => { list.forEach(addRider); },
    restoreData: () => {},
    addCustomer, updateCustomer, deleteCustomer,
    deleteAllCustomers: () => { setCustomers([]); addActivity('Deleted All Customers', 'Cleared all records'); },
    addOrder, updateOrder, deleteOrder,
    deleteAllOrders: () => { setOrders([]); addActivity('Deleted All Orders', 'Cleared all records'); },
    addProduct, updateProduct, deleteProduct,
    deleteAllProducts: () => { setInventory([]); addActivity('Deleted All Products', 'Cleared all records'); },
    addReturn, updateReturn,
    deleteAllReturns: () => { setReturns([]); addActivity('Deleted All Returns', 'Cleared all records'); },
    addRevenue,
    deleteAllRevenue: () => { setRevenue([]); addActivity('Deleted All Revenue', 'Cleared all records'); },
    getStats, getRiderById: (id) => riders.find((r) => r.id === id),
    getRiderShipments: (riderId) => shipments.filter((s) => s.riderId === riderId),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};