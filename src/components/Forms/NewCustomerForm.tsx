'use client';

import { useState } from 'react';
import { useCustomer } from '@/hooks/useCustomer';
import { Customer } from '@/types/Models';
import { useNotifications } from '@/context/notificationsContext';

const initialFormState: Customer = {
  firstName: '',
  lastName: '',
  title: '',
  accountName: '',
  email: '',
  mobile: '',
  phone: '',
  source: 'customerUpload',
  contactable: true,
};

export default function NewCustomerForm() {
  const { addCustomer } = useCustomer();
  const { addNotification } = useNotifications();
  const [formData, setFormData] = useState<Customer>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    // @ts-expect-error: allow the checked here
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (
      !formData.firstName ||
      !formData.title ||
      !formData.email ||
      !formData.mobile
    ) {
      addNotification({
        message:
          'Name, Title, Mobile and Email are required. Please try again.',
        type: 'error',
      });
      setIsSubmitting(false);
      return;
    }

    try {
      await addCustomer.mutateAsync(formData);
      setIsSubmitting(false);
      addNotification({
        message: 'Customer added successfully.',
        type: 'success',
      });
      setFormData(initialFormState);

      // Close modal after 3 seconds
      setTimeout(() => {
        // @ts-expect-error - HTML dialog method
        document.getElementById('newCustomerModal')?.close();
      }, 3000);
    } catch {
      setIsSubmitting(false);
      addNotification({
        message: 'Error adding customer. Please try again.',
        type: 'error',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold">Add New Customer</h2>

      <input
        type="text"
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
        placeholder="First Name*"
        className="input input-bordered w-full"
        required
      />

      <input
        type="text"
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
        placeholder="Last Name"
        className="input input-bordered w-full"
      />

      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Title*"
        className="input input-bordered w-full"
        required
      />

      <input
        type="text"
        name="accountName"
        value={formData.accountName}
        onChange={handleChange}
        placeholder="Account name"
        className="input input-bordered w-full"
      />

      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email Address*"
        className="input input-bordered w-full"
        required
      />

      <input
        type="tel"
        name="mobile"
        value={formData.mobile}
        onChange={handleChange}
        placeholder="Mobile*"
        className="input input-bordered w-full"
        required
      />

      <input
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="Phone"
        className="input input-bordered w-full"
      />

      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="contactable"
          checked={formData.contactable}
          onChange={handleChange}
          className="checkbox"
        />
        <span>Contactable</span>
      </label>

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
