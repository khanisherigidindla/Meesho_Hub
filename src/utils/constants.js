export const STORAGE_KEYS = {
  AUTH: 'wrms_auth',
  RIDERS: 'wrms_riders',
  ATTENDANCE: 'wrms_attendance',
  SHIPMENTS: 'wrms_shipments',
  SETTINGS: 'wrms_settings',
  THEME: 'wrms_theme',
};

export const AUTH_CREDENTIALS = {
  email: 'admin@gmail.com',
  password: 'admin10',
};

export const DEFAULT_SETTINGS = {
  warehouseName: 'Meesho Warehouse',
  adminName: 'Khanish Erigidindla',
  warehouseAddress: '',
};

export const EMPLOYMENT_STATUS = ['Active', 'Inactive'];
export const VEHICLE_TYPES = ['Bike', 'Scooter', 'Bicycle', 'EV Bike', 'Other'];
export const WORKING_SHIFTS = ['Morning', 'Afternoon', 'Evening', 'Night', 'Flexible'];
export const DELIVERY_STATUS = ['Pending', 'Out for Delivery', 'Delivered', 'Returned'];

export const ATTENDANCE_STATUS = {
  PRESENT: 'Present',
  ABSENT: 'Absent',
  HALF_DAY: 'Half Day',
};

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'name-az', label: 'Name A-Z' },
];

export const ITEMS_PER_PAGE = 10;
