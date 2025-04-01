'use client';

import { useState } from 'react';
import { useNotifications } from '@/context/notificationsContext';
import { useOrders } from '@/hooks/useOrders';
import { useCustomer } from '@/hooks/useCustomer';

export default function UploadCustomersForm() {
  const { addNotification } = useNotifications();
  const { uploadCustomers } = useCustomer();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;
    setIsSubmitting(true);

    try {
      setIsUploading(true);
      await uploadCustomers.mutateAsync(selectedFile);
      setIsSubmitting(false);
      addNotification({
        message: 'Customers file uploaded successfully.',
        type: 'success',
      });
      setSelectedFile(null);
    } catch (error) {
      if (error) {
        setIsSubmitting(false);
        addNotification({
          message: 'Failed to upload customers file.',
          type: 'error',
        });
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <label className="block mb-2 text-xl">Upload Customers</label>

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
            {isSubmitting ? (
              <span className="loading loading-spinner loading-md"></span>
            ) : (
              'Confirm Upload'
            )}
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
    </div>
  );
}
