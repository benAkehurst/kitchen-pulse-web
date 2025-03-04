'use client';

import { useState, useEffect } from 'react';
import { useOrders } from '@/hooks/useOrders';
import { useCustomer } from '@/hooks/useCustomer';
import { ManualOrder } from '@/types/Models';

interface ManualOrderFormProps {
  onOrderSubmit: () => void;
}

export default function ManualOrderForm({
  onOrderSubmit,
}: ManualOrderFormProps) {
  const { uploadManualOrder } = useOrders();
  const { getCustomers } = useCustomer();

  const [customers, setCustomers] = useState<
    { name: string; externalId: string }[]
  >([]);
  const [formData, setFormData] = useState<ManualOrder>({
    externalCustomerId: '',
    orderItems: '',
    quantity: '',
    totalPrice: 0,
    orderDate: new Date(),
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const customerData = await getCustomers();
        setCustomers(customerData);
      } catch {
        setError('Error fetching customers.');
      }
    };

    fetchCustomers();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date) => {
    setFormData((prev) => ({ ...prev, orderDate: date }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await uploadManualOrder(formData);
      onOrderSubmit(formData);
      setSuccess('Manual order submitted successfully!');

      setTimeout(() => {
        // @ts-expect-error - HTML dialog method
        document.getElementById('manualOrderModal')?.close();
      }, 3000);
    } catch {
      setError('Error submitting order. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold">Add Manual Order</h2>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      <select
        name="externalCustomerId"
        value={formData.externalCustomerId}
        onChange={handleChange}
        className="select select-bordered w-full"
        required
      >
        <option value="" disabled>
          Select Customer
        </option>
        {customers.map((customer) => (
          <option key={customer.externalId} value={customer.externalId}>
            {customer.name}
          </option>
        ))}
      </select>

      <input
        type="text"
        name="orderItems"
        value={formData.orderItems}
        onChange={handleChange}
        placeholder="Order Items"
        className="input input-bordered w-full"
        required
      />

      <input
        type="number"
        name="quantity"
        value={formData.quantity}
        onChange={handleChange}
        placeholder="Quantity"
        className="input input-bordered w-full"
        required
      />

      <input
        type="number"
        name="totalPrice"
        value={formData.totalPrice}
        onChange={handleChange}
        placeholder="Total Price"
        className="input input-bordered w-full"
        required
      />

      <div className="form-control">
        <label className="label">Order Date</label>
        <input
          type="date"
          value={formData.orderDate.toISOString().split('T')[0]}
          onChange={(e) => handleDateChange(new Date(e.target.value))}
          className="input input-bordered w-full"
          required
        />
      </div>

      <button type="submit" className="btn btn-primary w-full">
        Submit Order
      </button>
    </form>
  );
}
