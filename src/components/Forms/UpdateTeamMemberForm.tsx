'use client';

import { useState } from 'react';
import { useTeamMembers } from '@/hooks/useTeamMembers';
import { SingleTeamMember, TeamMember } from '@/types/Models';
import { useNotifications } from '@/context/notificationsContext';
import LoadingOverlay from '../UI/LoadingOverlay';

export default function UpdateTeamMemberForm({
  singleTeamMember,
}: {
  singleTeamMember: SingleTeamMember;
}) {
  const { updateSingleTeamMember } = useTeamMembers();
  const { addNotification } = useNotifications();
  const [formData, setFormData] = useState<SingleTeamMember>(singleTeamMember);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    setIsSubmitting(true);

    try {
      if (singleTeamMember.externalId) {
        await updateSingleTeamMember.mutateAsync({
          externalId: singleTeamMember.externalId,
          teamMemberData: formData,
        });
      } else {
        throw new Error('External ID is missing for the team member.');
      }
      setIsSubmitting(false);
      addNotification({
        message: 'Team member updated successfully',
        type: 'success',
      });

      // Close modal after 3 seconds
      setTimeout(() => {
        // @ts-expect-error - HTML dialog method
        document.getElementById('updateTeamMember')?.close();
      }, 3000);
    } catch {
      setIsSubmitting(false);
      addNotification({
        message: 'Error updating team member. Please try again.',
        type: 'error',
      });
    }
  };

  if (!formData) return <LoadingOverlay />;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold">Update team member</h2>

      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Name*"
        className="input input-bordered w-full"
        required
      />

      <input
        type="text"
        name="role"
        value={formData.role}
        onChange={handleChange}
        placeholder="Role*"
        className="input input-bordered w-full"
        required
      />

      <input
        type="text"
        name="mobile"
        value={formData.mobile}
        onChange={handleChange}
        placeholder="Mobile*"
        className="input input-bordered w-full"
        required
      />

      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email Address"
        className="input input-bordered w-full"
      />

      <input
        type="tel"
        name="location"
        value={formData.location}
        onChange={handleChange}
        placeholder="Location"
        className="input input-bordered w-full"
      />

      <button type="submit" className="btn btn-primary w-full">
        {isSubmitting ? (
          <span className="loading loading-spinner loading-md"></span>
        ) : (
          'Submit'
        )}
      </button>
    </form>
  );
}
