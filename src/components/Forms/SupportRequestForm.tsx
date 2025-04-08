'use client';

import { useState } from 'react';
import { useLanding } from '@/hooks/useLanding';
import { useNotifications } from '@/context/notificationsContext';
import LoadingOverlay from '../UI/LoadingOverlay';

const initialFormState = {
  userName: '',
  email: '',
  company: '',
  message: '',
};

export default function SupportRequestForm() {
  const { sendSupportRequest } = useLanding();
  const { addNotification } = useNotifications();
  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
      await sendSupportRequest.mutateAsync({
        userName: formData.userName,
        email: formData.email,
        company: formData.company,
        message: formData.message,
      });
      setIsSubmitting(false);
      addNotification({
        message: 'Support message sent successfully',
        type: 'success',
      });
      setFormData(initialFormState);

      // Close modal after 3 seconds
      setTimeout(() => {
        // @ts-expect-error - HTML dialog method
        document.getElementById('updateCustomerModal')?.close();
      }, 3000);
    } catch {
      setIsSubmitting(false);
      addNotification({
        message: 'Error sending support request. Please try again.',
        type: 'error',
      });
    }
  };

  if (!formData) return <LoadingOverlay />;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold text-black">Send support request</h2>

      <input
        type="text"
        name="userName"
        value={formData.userName}
        onChange={handleChange}
        placeholder="Name*"
        className="input input-bordered w-full"
        required
      />

      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email*"
        className="input input-bordered w-full"
      />

      <input
        type="text"
        name="company"
        value={formData.company}
        onChange={handleChange}
        placeholder="Company*"
        className="input input-bordered w-full"
        required
      />

      <input
        type="textarea"
        name="message"
        value={formData.message}
        onChange={handleChange}
        placeholder="Message*"
        className="textarea textarea-bordered w-full"
        required
      />

      <button type="submit" className="btn btn-primary w-full">
        {isSubmitting ? (
          <span className="loading loading-spinner loading-md"></span>
        ) : (
          'Send support request'
        )}
      </button>
    </form>
  );
}
