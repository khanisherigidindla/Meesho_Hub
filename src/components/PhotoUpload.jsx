import { useState } from 'react';
import { FiUpload, FiX } from 'react-icons/fi';
import { fileToBase64 } from '../utils/storage';
import Avatar from './UIComponents';

const PhotoUpload = ({ value, onChange, name }) => {
  const [preview, setPreview] = useState(value || null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('Image size should be less than 2MB');
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      setPreview(base64);
      onChange(base64);
    } catch {
      alert('Failed to upload image');
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange('');
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar src={preview} name={name} size="xl" />
      <div className="flex gap-2">
        <label className="btn-primary cursor-pointer flex items-center gap-2 text-sm">
          <FiUpload className="w-4 h-4" />
          Upload Photo
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </label>
        {preview && (
          <button type="button" onClick={handleRemove} className="btn-secondary flex items-center gap-2 text-sm">
            <FiX className="w-4 h-4" />
            Remove
          </button>
        )}
      </div>
    </div>
  );
};

export default PhotoUpload;
