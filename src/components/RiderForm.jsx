import { useState, useEffect } from 'react';
import PhotoUpload from './PhotoUpload';
import {
  EMPLOYMENT_STATUS,
  VEHICLE_TYPES,
  WORKING_SHIFTS,
} from '../utils/constants';

const emptyRider = {
  photo: '',
  riderId: '',
  fullName: '',
  phone: '',
  alternatePhone: '',
  address: '',
  bikeNumber: '',
  vehicleType: '',
  licenseNumber: '',
  panNumber: '',
  aadhaarNumber: '',
  bankName: '',
  accountNumber: '',
  ifscCode: '',
  dateOfJoining: '',
  employmentStatus: '',
  workingShift: '',
  startTime: '',
  endTime: '',
  emergencyContact: '',
  remarks: '',
  notes: '',
};

const RiderForm = ({ initialData, onSubmit, onCancel, submitLabel = 'Save Rider' }) => {
  const [form, setForm] = useState({ ...emptyRider, ...initialData });

  useEffect(() => {
    if (initialData) {
      setForm({ ...emptyRider, ...initialData });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PhotoUpload
        value={form.photo}
        onChange={(photo) => setForm((prev) => ({ ...prev, photo }))}
        name={form.fullName}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto pr-1">
        <Field label="Rider ID" name="riderId" value={form.riderId} onChange={handleChange} />
        <Field label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} />
        <Field label="Phone Number" name="phone" value={form.phone} onChange={handleChange} />
        <Field label="Alternate Phone" name="alternatePhone" value={form.alternatePhone} onChange={handleChange} />
        <Field label="Address" name="address" value={form.address} onChange={handleChange} className="sm:col-span-2" />
        <Field label="Bike Number" name="bikeNumber" value={form.bikeNumber} onChange={handleChange} />
        <SelectField label="Vehicle Type" name="vehicleType" value={form.vehicleType} onChange={handleChange} options={VEHICLE_TYPES} />
        <Field label="License Number" name="licenseNumber" value={form.licenseNumber} onChange={handleChange} />
        <Field label="PAN Number" name="panNumber" value={form.panNumber} onChange={handleChange} />
        <Field label="Aadhaar Number" name="aadhaarNumber" value={form.aadhaarNumber} onChange={handleChange} />
        <Field label="Bank Name" name="bankName" value={form.bankName} onChange={handleChange} />
        <Field label="Account Number" name="accountNumber" value={form.accountNumber} onChange={handleChange} />
        <Field label="IFSC Code" name="ifscCode" value={form.ifscCode} onChange={handleChange} />
        <Field label="Date of Joining" name="dateOfJoining" type="date" value={form.dateOfJoining} onChange={handleChange} />
        <SelectField label="Employment Status" name="employmentStatus" value={form.employmentStatus} onChange={handleChange} options={EMPLOYMENT_STATUS} />
        <SelectField label="Working Shift" name="workingShift" value={form.workingShift} onChange={handleChange} options={WORKING_SHIFTS} />
        <Field label="Start Time" name="startTime" type="time" value={form.startTime} onChange={handleChange} />
        <Field label="End Time" name="endTime" type="time" value={form.endTime} onChange={handleChange} />
        <Field label="Emergency Contact" name="emergencyContact" value={form.emergencyContact} onChange={handleChange} />
        <Field label="Additional Notes" name="notes" value={form.notes} onChange={handleChange} className="sm:col-span-2" type="textarea" />
      </div>

      <div className="flex gap-3 justify-end pt-4 sticky bottom-0 bg-white dark:bg-gray-800">
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-secondary px-6">
            Cancel
          </button>
        )}
        <button type="submit" className="btn-primary px-6 flex items-center gap-2">
          {submitLabel}
        </button>
      </div>
    </form>
  );
};

const Field = ({ label, name, value, onChange, type = 'text', className = '', textarea = false }) => (
  <div className={className}>
    <label className="label">{label}</label>
    {textarea ? (
      <textarea name={name} value={value || ''} onChange={onChange} className="input-field resize-none" rows={3} placeholder="Enter additional details..." />
    ) : (
      <input type={type} name={name} value={value || ''} onChange={onChange} className="input-field" />
    )}
  </div>
);

const SelectField = ({ label, name, value, onChange, options }) => (
  <div>
    <label className="label">{label}</label>
    <select name={name} value={value || ''} onChange={onChange} className="input-field">
      <option value="">Select...</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

export default RiderForm;