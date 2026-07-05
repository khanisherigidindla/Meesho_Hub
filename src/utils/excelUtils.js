// Excel Export/Import Utilities using SheetJS (xlsx) - CDN based
// For proper Excel support, we'll use a simple approach that works without additional dependencies

// Parse Excel file and return data
export const importFromExcel = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    const name = file.name.toLowerCase();
    
    if (name.endsWith('.xlsx') || name.endsWith('.xls')) {
      reader.onload = (e) => {
        try {
          // Simple CSV fallback for Excel files - since we can't use xlsx library directly
          // We'll read as text and parse as CSV if it's actually a CSV or simple format
          const text = e.target.result;
          if (typeof text === 'string') {
            resolve(parseCSV(text));
          } else {
            // For binary Excel, we need to warn user to use CSV
            alert('Excel (.xlsx) files require CSV format. Please save as .csv and try again.');
            resolve([]);
          }
        } catch (err) {
          reject(err);
        }
      };
      reader.readAsText(file);
    } else {
      reader.onload = (e) => {
        resolve(parseCSV(e.target.result));
      };
      reader.readAsText(file);
    }
  });
};

// Export data to Excel format (actually CSV with .xlsx extension for compatibility)
export const exportToExcel = (data, moduleName, date) => {
  const headers = Object.keys(data[0] || {}).filter(h => !['id', 'createdAt', 'updatedAt'].includes(h));
  const csv = [
    headers.join(','),
    ...data.map(row => 
      headers.map(h => {
        const val = row[h];
        if (val == null) return '';
        return String(val).includes(',') ? `"${val}"` : val;
      }).join(',')
    )
  ].join('\n');
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${moduleName}-${date}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Parse CSV text
const parseCSV = (text) => {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];
  
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = values[i] || '';
    });
    return obj;
  });
};

// Format data for Excel export
export const formatExcelData = (data, columns) => {
  return data.map(item => {
    const formatted = {};
    columns.forEach(col => {
      formatted[col.label] = item[col.key] || '-';
    });
    return formatted;
  });
};

// Generate Excel blob
export const generateExcelBlob = (data) => {
  const csv = data;
  return new Blob([csv], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
};