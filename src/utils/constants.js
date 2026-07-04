// Storage Keys
export const STORAGE_KEYS = {
  AUTH: 'wrms_auth',
  RIDERS: 'wrms_riders',
  ATTENDANCE: 'wrms_attendance',
  SHIPMENTS: 'wrms_shipments',
  CUSTOMERS: 'wrms_customers',
  ORDERS: 'wrms_orders',
  INVENTORY: 'wrms_inventory',
  RETURNS: 'wrms_returns',
  REVENUE: 'wrms_revenue',
  STOCK_MOVEMENTS: 'wrms_stock_movements',
  SETTINGS: 'wrms_settings',
  THEME: 'wrms_theme',
  ACTIVITY_LOG: 'wrms_activity_log',
  NOTIFICATIONS: 'wrms_notifications',
};

// Auth
export const AUTH_CREDENTIALS = {
  email: 'admin@gmail.com',
  password: 'admin123',
};

// Settings
export const DEFAULT_SETTINGS = {
  warehouseName: 'Meesho Warehouse',
  adminName: 'Khanish Erigidindla',
  warehouseAddress: '',
};

// Riders
export const EMPLOYMENT_STATUS = ['Active', 'Inactive'];
export const VEHICLE_TYPES = ['Bike', 'Scooter', 'Bicycle', 'EV Bike', 'Other'];
export const WORKING_SHIFTS = ['Morning', 'Afternoon', 'Evening', 'Night', 'Flexible'];

// Attendance
export const ATTENDANCE_STATUS = {
  PRESENT: 'Present',
  ABSENT: 'Absent',
  LATE: 'Late',
  HALF_DAY: 'Half Day',
  LEAVE: 'Leave',
  HOLIDAY: 'Holiday',
};

// Orders
export const ORDER_STATUS = ['Pending', 'Packed', 'Ready', 'Out for Delivery', 'Delivered', 'Returned', 'Cancelled'];
export const PAYMENT_STATUS = ['Paid', 'Pending', 'Partial', 'Failed'];
export const PAYMENT_MODE = ['Cash', 'UPI', 'Card', 'COD', 'Bank Transfer'];

// Inventory
export const PRODUCT_STATUS = ['Available', 'Low Stock', 'Out of Stock', 'Discontinued'];
export const DAMAGE_TYPE = ['Minor', 'Major', 'Discard', 'Repair', 'Return to Supplier'];

// Returns
export const RETURN_REASON = ['Opened', 'Unused', 'Damaged', 'Wrong Item', 'Exchange', 'Refund'];
export const RETURN_STATUS = ['Pending', 'Returned to Warehouse', 'Returned to Meesho', 'Completed'];
export const RETURN_TO_MEESHO_STATUS = ['Pending', 'In Transit', 'Completed'];

// Revenue
export const EXPENSE_TYPE = ['Fuel', 'Packaging', 'Miscellaneous'];
export const PAYMENT_TYPE = ['Cash', 'PhonePe', 'Google Pay', 'Paytm', 'Card', 'Bank Transfer', 'Pending COD'];

// Time Slots
export const TIME_SLOTS = ['9-12 AM', '12-3 PM', '3-6 PM', '6-9 PM', 'Anytime'];

// Racks
export const RACK_LETTERS = ['A', 'B', 'C', 'D', 'E'];

// Categories
export const PRODUCT_CATEGORIES = ['Electronics', 'Clothing', 'Accessories', 'Home', 'Beauty', 'Other'];

// Sort & Pagination
export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'name-az', label: 'Name A-Z' },
];

export const ITEMS_PER_PAGE = 10;

// Theme Colors - 10 Professional Options
export const THEME_COLORS = [
  { name: 'Blue', value: 'blue', primary: '#3b82f6', secondary: '#60a5fa' },
  { name: 'Emerald', value: 'emerald', primary: '#10b981', secondary: '#34d399' },
  { name: 'Purple', value: 'purple', primary: '#8b5cf6', secondary: '#a78bfa' },
  { name: 'Rose', value: 'rose', primary: '#f43f5e', secondary: '#fb7185' },
  { name: 'Orange', value: 'orange', primary: '#f97316', secondary: '#fb923c' },
  { name: 'Cyan', value: 'cyan', primary: '#06b6d4', secondary: '#22d3ee' },
  { name: 'Indigo', value: 'indigo', primary: '#6366f1', secondary: '#818cf8' },
  { name: 'Green', value: 'green', primary: '#22c55e', secondary: '#4ade80' },
  { name: 'Violet', value: 'violet', primary: '#7c3aed', secondary: '#8b5cf6' },
  { name: 'Pink', value: 'pink', primary: '#ec4899', secondary: '#f472b6' },
];
