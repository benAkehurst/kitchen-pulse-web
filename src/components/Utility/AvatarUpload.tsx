'use client';

import { useState } from 'react';
import { useUser } from '@/hooks/useUser';
import Avatar from '../UI/Avatar';
import { useNotifications } from '@/context/notificationsContext';

interface AvatarUploadProps {
  initialAvatar?: string;
}

export default function AvatarUpload({ initialAvatar }: AvatarUploadProps) {
  const { uploadAvatar } = useUser();
  const { addNotification } = useNotifications();
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(
    initialAvatar || undefined
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleAvatarUpload = async () => {
    if (!selectedFile) return;
    try {
      setIsUploading(true);
      const { data: uploadResponse } = await uploadAvatar.mutateAsync(
        selectedFile
      );
      setAvatarPreview(uploadResponse.fileUrl);
      addNotification({
        message: 'Avatar updated successfully',
        type: 'success',
      });
    } catch (error) {
      if (error) {
        addNotification({
          message: 'Error uploading avatar',
          type: 'error',
        });
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <label className="block mb-2 text-xl">Avatar Upload</label>

      {avatarPreview ? (
        <Avatar src={avatarPreview} alt="User avatar" size={150} />
      ) : (
        <p className="text-gray-500">No avatar uploaded</p>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            handleFileSelect(e.target.files[0]);
          }
        }}
        disabled={isUploading}
        className="border p-2 w-full rounded-lg text-xl"
      />

      {selectedFile && !isUploading && (
        <div className="flex gap-4">
          <button
            onClick={handleAvatarUpload}
            className="btn bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Confirm Upload
          </button>
          <button
            onClick={() => {
              setSelectedFile(null);
              setAvatarPreview(initialAvatar || undefined);
            }}
            className="bg-gray-400 text-white p-2 rounded hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      )}

      {isUploading && <p className="text-blue-600">Uploading Avatar...</p>}
    </div>
  );
}
