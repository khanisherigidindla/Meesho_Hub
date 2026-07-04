export const ridersToCSV = (riders) => {
  const headers = [
    'Rider ID',
    'Full Name',
    'Phone Number',
    'Alternate Phone',
    'Address',
    'Bike Number',
    'Vehicle Type',
    'License Number',
    'PAN Number',
    'Aadhaar Number',
    'Bank Name',
    'Account Number',
    'IFSC Code',
    'Date of Joining',
    'Employment Status',
    'Working Shift',
    'Start Time',
    'End Time',
    'Emergency Contact',
    'Remarks',
  ];

  const rows = riders.map((r) =>
    [
      r.riderId || '',
      r.fullName || '',
      r.phone || '',
      r.alternatePhone || '',
      r.address || '',
      r.bikeNumber || '',
      r.vehicleType || '',
      r.licenseNumber || '',
      r.panNumber || '',
      r.aadhaarNumber || '',
      r.bankName || '',
      r.accountNumber || '',
      r.ifscCode || '',
      r.dateOfJoining || '',
      r.employmentStatus || '',
      r.workingShift || '',
      r.startTime || '',
      r.endTime || '',
      r.emergencyContact || '',
      r.remarks || '',
    ]
      .map((field) => `"${String(field).replace(/"/g, '""')}"`)
      .join(',')
  );

  return [headers.join(','), ...rows].join('\n');
};

export const attendanceToCSV = (attendance, riders) => {
  const getRiderName = (riderId) => {
    const rider = riders.find((r) => r.id === riderId);
    return rider?.fullName || rider?.riderId || 'Unknown';
  };

  const headers = [
    'Date',
    'Rider Name',
    'Present',
    'Absent',
    'Half Day',
    'Late',
    'Overtime',
    'In Time',
    'Out Time',
    'Remarks',
  ];

  const rows = attendance.map((a) =>
    [
      a.date || '',
      getRiderName(a.riderId),
      a.status === 'Present' ? 'Yes' : '',
      a.status === 'Absent' ? 'Yes' : '',
      a.status === 'Half Day' ? 'Yes' : '',
      a.late ? 'Yes' : '',
      a.overtime || '',
      a.inTime || '',
      a.outTime || '',
      a.remarks || '',
    ]
      .map((field) => `"${String(field).replace(/"/g, '""')}"`)
      .join(',')
  );

  return [headers.join(','), ...rows].join('\n');
};

export const parseRidersCSV = (csvText) => {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map((h) => h.replace(/"/g, '').trim().toLowerCase());

  const headerMap = {
    'rider id': 'riderId',
    'full name': 'fullName',
    'phone number': 'phone',
    'alternate phone': 'alternatePhone',
    address: 'address',
    'bike number': 'bikeNumber',
    'vehicle type': 'vehicleType',
    'license number': 'licenseNumber',
    'pan number': 'panNumber',
    'aadhaar number': 'aadhaarNumber',
    'bank name': 'bankName',
    'account number': 'accountNumber',
    'ifsc code': 'ifscCode',
    'date of joining': 'dateOfJoining',
    'employment status': 'employmentStatus',
    'working shift': 'workingShift',
    'start time': 'startTime',
    'end time': 'endTime',
    'emergency contact': 'emergencyContact',
    remarks: 'remarks',
  };

  const riders = [];

  for (let i = 1; i < lines.length; i++) {
    const values = [];
    let current = '';
    let inQuotes = false;

    for (const char of lines[i]) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());

    const rider = {};
    headers.forEach((header, idx) => {
      const field = headerMap[header];
      if (field && values[idx]) {
        rider[field] = values[idx].replace(/^"|"$/g, '');
      }
    });

    if (Object.keys(rider).length > 0) {
      riders.push(rider);
    }
  }

  return riders;
};

export const shipmentsToCSV = (shipments, riders) => {
  const getRiderName = (riderId) => {
    const rider = riders.find((r) => r.id === riderId);
    return rider?.fullName || rider?.riderId || 'Unassigned';
  };

  const headers = ['Shipment ID', 'Rider Name', 'Status', 'Parcel Count', 'Date', 'Remarks'];

  const rows = shipments.map((s) =>
    [
      s.shipmentId || '',
      getRiderName(s.riderId),
      s.status || '',
      s.parcelCount || '',
      s.date || '',
      s.remarks || '',
    ]
      .map((field) => `"${String(field).replace(/"/g, '""')}"`)
      .join(',')
  );

  return [headers.join(','), ...rows].join('\n');
};
