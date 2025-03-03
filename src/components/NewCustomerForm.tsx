'use client';

import { useState } from 'react';
import { useCustomer } from '@/hooks/useCustomer';
import { Customer } from '@/types/Models';

const initialFormState: Customer = {
  name: '',
  company: '',
  email: '',
  telephone: '',
  address: '',
  contactable: false,
};

export default function NewCustomerForm() {
  const { addCustomer } = useCustomer();

  const [formData, setFormData] = useState<Customer>(initialFormState);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    // @ts-expect-error: this is an html error
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Simple validation
    if (!formData.name || !formData.company || !formData.email) {
      setError('Name, Company, and Email are required');
      return;
    }

    try {
      await addCustomer(formData);
      setSuccess('Customer added successfully!');
      setFormData(initialFormState);

      // Close modal after 3 seconds
      setTimeout(() => {
        // @ts-expect-error - This is a html error
        document.getElementById('newCustomerModal')?.close();
      }, 3000);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError('Error adding customer. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold">Add New Customer</h2>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Customer Name"
        className="input input-bordered w-full"
        required
      />

      <input
        type="text"
        name="company"
        value={formData.company}
        onChange={handleChange}
        placeholder="Company Name"
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
        required
      />

      <input
        type="tel"
        name="telephone"
        value={formData.telephone}
        onChange={handleChange}
        placeholder="Telephone"
        className="input input-bordered w-full"
      />

      <textarea
        name="address"
        value={formData.address}
        onChange={handleChange}
        placeholder="Address"
        className="textarea textarea-bordered w-full"
      ></textarea>

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
        Submit
      </button>
    </form>
  );
}
