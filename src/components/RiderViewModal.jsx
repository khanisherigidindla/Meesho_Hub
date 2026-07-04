import { FiPrinter } from 'react-icons/fi';
import Avatar, { Badge } from './UIComponents';
import { formatDate } from '../utils/storage';

const DetailRow = ({ label, value }) => (
  <div className="py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
    <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
    <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">{value || '-'}</p>
  </div>
);

const RiderViewModal = ({ rider, shipments = [], onClose, onPrint }) => {
  if (!rider) return null;

  const handlePrint = () => {
    if (onPrint) onPrint(rider);
    else {
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html><head><title>Rider - ${rider.fullName || rider.riderId}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; }
          h1 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
          .row { display: flex; margin: 8px 0; }
          .label { font-weight: bold; width: 200px; color: #666; }
          .value { flex: 1; }
          img { width: 120px; height: 120px; border-radius: 50%; object-fit: cover; margin-bottom: 20px; }
        </style></head><body>
        ${rider.photo ? `<img src="${rider.photo}" alt="Photo" />` : ''}
        <h1>Rider Details</h1>
        ${[
          ['Rider ID', rider.riderId],
          ['Full Name', rider.fullName],
          ['Phone', rider.phone],
          ['Alternate Phone', rider.alternatePhone],
          ['Address', rider.address],
          ['Bike Number', rider.bikeNumber],
          ['Vehicle Type', rider.vehicleType],
          ['License Number', rider.licenseNumber],
          ['PAN Number', rider.panNumber],
          ['Aadhaar Number', rider.aadhaarNumber],
          ['Bank Name', rider.bankName],
          ['Account Number', rider.accountNumber],
          ['IFSC Code', rider.ifscCode],
          ['Date of Joining', formatDate(rider.dateOfJoining)],
          ['Employment Status', rider.employmentStatus],
          ['Working Shift', rider.workingShift],
          ['Start Time', rider.startTime],
          ['End Time', rider.endTime],
          ['Emergency Contact', rider.emergencyContact],
          ['Remarks', rider.remarks],
        ].map(([l, v]) => `<div class="row"><span class="label">${l}:</span><span class="value">${v || '-'}</span></div>`).join('')}
        </body></html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-200 dark:border-gray-700">
        <Avatar src={rider.photo} name={rider.fullName} size="xl" />
        <div className="text-center sm:text-left">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {rider.fullName || 'Unnamed Rider'}
          </h3>
          <p className="text-gray-500 dark:text-gray-400">{rider.riderId || 'No ID'}</p>
          <div className="mt-2">
            <Badge status={rider.employmentStatus || 'Inactive'} />
          </div>
        </div>
        <button onClick={handlePrint} className="btn-secondary flex items-center gap-2 ml-auto no-print">
          <FiPrinter className="w-4 h-4" />
          Print
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
        <DetailRow label="Phone Number" value={rider.phone} />
        <DetailRow label="Alternate Phone" value={rider.alternatePhone} />
        <DetailRow label="Address" value={rider.address} />
        <DetailRow label="Bike Number" value={rider.bikeNumber} />
        <DetailRow label="Vehicle Type" value={rider.vehicleType} />
        <DetailRow label="License Number" value={rider.licenseNumber} />
        <DetailRow label="PAN Number" value={rider.panNumber} />
        <DetailRow label="Aadhaar Number" value={rider.aadhaarNumber} />
        <DetailRow label="Bank Name" value={rider.bankName} />
        <DetailRow label="Account Number" value={rider.accountNumber} />
        <DetailRow label="IFSC Code" value={rider.ifscCode} />
        <DetailRow label="Date of Joining" value={formatDate(rider.dateOfJoining)} />
        <DetailRow label="Working Shift" value={rider.workingShift} />
        <DetailRow label="Start Time" value={rider.startTime} />
        <DetailRow label="End Time" value={rider.endTime} />
        <DetailRow label="Emergency Contact" value={rider.emergencyContact} />
        <DetailRow label="Remarks" value={rider.remarks} />
      </div>

      {shipments.length > 0 && (
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
            Shipment History ({shipments.length})
          </h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {shipments.slice(0, 10).map((s) => (
              <div key={s.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-sm">
                <span>{s.shipmentId || 'N/A'}</span>
                <Badge status={s.status} />
                <span className="text-gray-500">{formatDate(s.date)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end pt-4">
        <button onClick={onClose} className="btn-secondary">Close</button>
      </div>
    </div>
  );
};

export default RiderViewModal;
