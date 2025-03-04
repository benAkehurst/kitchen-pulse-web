'use client';

import { useState } from 'react';

interface OrderFileUploadFormProps {
  uploadPastOrders: (file: File) => Promise<any>;
}

export default function OrderFileUploadForm({
  uploadPastOrders,
}: OrderFileUploadFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    try {
      setIsUploading(true);
      await uploadPastOrders(selectedFile);
      showMessage('success', 'Order file uploaded successfully.');
      setSelectedFile(null);
    } catch (error) {
      console.error('Error uploading order file:', error);
      showMessage('error', 'Failed to upload order file.');
    } finally {
      setIsUploading(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="space-y-4">
      <label className="block mb-2 text-xl">Upload Past Order File</label>

      <input
        type="file"
        accept=".csv,.xlsx"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            handleFileSelect(e.target.files[0]);
          }
        }}
        disabled={isUploading}
        className="file-input file-input-bordered w-full max-w-xs"
      />

      {selectedFile && !isUploading && (
        <div className="flex gap-4">
          <button
            onClick={handleFileUpload}
            className="btn bg-blue-600 text-white hover:bg-blue-700"
          >
            Confirm Upload
          </button>
          <button
            onClick={() => setSelectedFile(null)}
            className="btn bg-gray-400 text-white hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      )}

      {isUploading && <p className="text-blue-600">Uploading Order File...</p>}

      {message && (
        <p
          className={
            message.type === 'success' ? 'text-green-600' : 'text-red-600'
          }
        >
          {message.text}
        </p>
      )}
    </div>
  );
}
