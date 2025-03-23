'use client';

import { useState } from 'react';
import { useOrders } from '@/hooks/useOrders';
import { useCustomer } from '@/hooks/useCustomer';
import { Customer, ManualOrder } from '@/types/Models';
import { useNotifications } from '@/context/notificationsContext';

export default function ManualOrderForm() {
  const { uploadManualOrder } = useOrders();
  const {
    customers,
    customersQuery: { isLoading: customersLoading, isError: customersError },
  } = useCustomer();
  const { addNotification } = useNotifications();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<ManualOrder>({
    externalCustomerId: '',
    orderItems: '',
    quantity: '',
    totalPrice: 0,
    orderDate: new Date(),
  });

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
    setIsSubmitting(true);
    try {
      await uploadManualOrder.mutateAsync(formData);
      setIsSubmitting(false);
      addNotification({
        message: 'Manual order submitted successfully.',
        type: 'success',
      });

      setTimeout(() => {
        // @ts-expect-error - HTML dialog method
        document.getElementById('manualOrderModal')?.close();
      }, 3000);
    } catch {
      setIsSubmitting(false);
      addNotification({
        message: 'Error submitting order. Please try again.',
        type: 'error',
      });
    }
  };

  const isLoading = customersLoading;
  const isError = customersError;

  if (isError && !isLoading) {
    addNotification({
      message: 'Error fetching customer data',
      type: 'error',
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold">Add Manual Order</h2>

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
        {customers.map((customer: Customer) => (
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
        {isSubmitting ? (
          <span className="loading loading-spinner loading-md"></span>
        ) : (
          'Submit Order'
        )}
      </button>
    </form>
  );
}
