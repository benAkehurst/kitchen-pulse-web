'use client';

import { useState, useEffect } from 'react';
import { useCustomer } from '@/hooks/useCustomer';
import { Customer } from '@/types/Models';

interface UpdateCustomerFormProps {
  externalId: string;
  onUpdateCustomer: (customer: Customer) => void;
}

export default function UpdateCustomerForm({
  externalId,
  onUpdateCustomer,
}: UpdateCustomerFormProps) {
  const { getSingleCustomer, updateSingleCustomer } = useCustomer();

  const [formData, setFormData] = useState<Customer | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const customer = await getSingleCustomer(externalId);
        setFormData(customer);
      } catch {
        setError('Error fetching customer data.');
      }
    };

    fetchCustomer();
  }, [externalId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    // @ts-expect-error: allow the checked here
    const { name, value, type, checked } = e.target;
    setFormData((prev) =>
      prev ? { ...prev, [name]: type === 'checkbox' ? checked : value } : null
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    setError(null);
    setSuccess(null);

    try {
      await updateSingleCustomer(formData);
      onUpdateCustomer(formData);
      setSuccess('Customer updated successfully!');

      // Close modal after 3 seconds
      setTimeout(() => {
        // @ts-expect-error - HTML dialog method
        document.getElementById('updateCustomerModal')?.close();
      }, 3000);
    } catch {
      setError('Error updating customer. Please try again.');
    }
  };

  if (!formData) return <p>Loading...</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold">Update Customer</h2>

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
        Update Customer
      </button>
    </form>
  );
}
