import { useParams } from 'next/navigation';
import { useTeamMembers } from '@/hooks/useTeamMembers';
import { useNotifications } from '@/context/notificationsContext';
import { useState } from 'react';

export default function UploadTeamMemberAvatar() {
  const { teamMemberId } = useParams();
  const { uploadTeamMemberAvatar } = useTeamMembers();
  const { addNotification } = useNotifications();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpload = async (file: File) => {
    if (!teamMemberId) return;

    try {
      await uploadTeamMemberAvatar.mutateAsync({
        externalId: teamMemberId as string,
        file,
      });
      addNotification({
        message: 'Team member avatar added successfully.',
        type: 'success',
      });
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
      addNotification({
        message: 'Error adding team member avatar. Please try again.',
        type: 'error',
      });
    }
  };

  return (
    <div className="my-4">
      <h2 className="text-xl font-semibold">Upload team member avatar</h2>
      <input
        className="file-input my-4"
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleUpload(e.target.files[0]);
          }
        }}
        disabled={isSubmitting}
      />
      {isSubmitting && <p>Uploading...</p>}
    </div>
  );
}
