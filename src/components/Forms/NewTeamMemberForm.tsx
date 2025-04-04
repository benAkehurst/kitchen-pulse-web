'use client';

import { useState } from 'react';
import { useTeamMembers } from '@/hooks/useTeamMembers';
import { TeamMember } from '@/types/Models';
import { useNotifications } from '@/context/notificationsContext';

const initialFormState: TeamMember = {
  name: '',
  role: '',
  mobile: '',
  company: '',
  email: '',
  location: '',
  avatar: '',
};

export default function NewTeamMemberForm() {
  const { createSingleTeamMember } = useTeamMembers();
  const { addNotification } = useNotifications();
  const [formData, setFormData] = useState<TeamMember>(initialFormState);
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
    setIsSubmitting(true);

    if (!formData.name || !formData.role || !formData.mobile) {
      addNotification({
        message: 'Name, Role and Mobile are required. Please try again.',
        type: 'error',
      });
      setIsSubmitting(false);
      return;
    }

    try {
      await createSingleTeamMember.mutateAsync(formData);
      setIsSubmitting(false);
      addNotification({
        message: 'Team member added successfully.',
        type: 'success',
      });
      setFormData(initialFormState);

      // Close modal after 3 seconds
      setTimeout(() => {
        // @ts-expect-error - HTML dialog method
        document.getElementById('addNewTeamMember')?.close();
      }, 3000);
    } catch {
      setIsSubmitting(false);
      addNotification({
        message: 'Error adding team member. Please try again.',
        type: 'error',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold">Add new team member</h2>

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
        type="text"
        name="company"
        value={formData.company}
        onChange={handleChange}
        placeholder="Company"
        className="input input-bordered w-full"
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
