'use client';

import { useState } from 'react';
import { useUser } from '@/hooks/useUser';
import Avatar from '../UI/Avatar';

interface AvatarUploadProps {
  initialAvatar?: string;
}

export default function AvatarUpload({ initialAvatar }: AvatarUploadProps) {
  const { uploadAvatar } = useUser();

  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(
    initialAvatar || undefined
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleAvatarUpload = async () => {
    if (!selectedFile) return;
    try {
      setIsUploading(true);
      const { data: uploadResponse } = await uploadAvatar(selectedFile);
      setAvatarPreview(uploadResponse.fileUrl);
      showMessage('success', 'Avatar updated successfully');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      showMessage('error', 'Failed to upload avatar');
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
