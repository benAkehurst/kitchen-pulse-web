'use client';

import { useState, useEffect } from 'react';
import { useOrders } from '@/hooks/useOrders';
import { Order, UpdatingOrder } from '@/types/Models';

interface UpdateOrderFormProps {
  externalId: string;
  onUpdateOrder: (order: Order) => void;
}

export default function UpdateOrderForm({
  externalId,
  onUpdateOrder,
}: UpdateOrderFormProps) {
  const { getSingleOrder, updateSingleOrder } = useOrders();

  const [formData, setFormData] = useState<UpdatingOrder | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const order = await getSingleOrder(externalId);
        setFormData({
          orderId: order.orderId,
          orderItems: order.orderItems || '',
          quantity: order.quantity || 0,
          totalPrice: order.totalPrice || 0,
          orderDate: order.orderDate || new Date().toISOString(),
        });
      } catch {
        setError('Error fetching order data.');
      }
    };

    fetchOrder();
  }, [externalId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) =>
      prev
        ? { ...prev, [name]: type === 'number' ? Number(value) : value }
        : null
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    setError(null);
    setSuccess(null);

    try {
      await updateSingleOrder(externalId, formData);
      const updatedOrder = await getSingleOrder(externalId);
      onUpdateOrder(updatedOrder);
      setSuccess('Order updated successfully!');

      // Close modal after 3 seconds
      setTimeout(() => {
        // @ts-expect-error - HTML dialog method
        document.getElementById('updateOrderModal')?.close();
      }, 3000);
    } catch {
      setError('Error updating order. Please try again.');
    }
  };

  if (!formData) return <p>Loading...</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold">Update Order</h2>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      <input
        type="text"
        name="orderId"
        value={formData.orderId}
        onChange={handleChange}
        placeholder="Order Id"
        className="input input-bordered w-full"
        required
      />

      <textarea
        name="orderItems"
        value={formData.orderItems}
        onChange={handleChange}
        placeholder="Order Items"
        className="textarea textarea-bordered w-full"
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
        placeholder="Total Price (£)"
        className="input input-bordered w-full"
        required
      />

      <input
        type="date"
        name="orderDate"
        value={formData.orderDate.split('T')[0]}
        onChange={handleChange}
        className="input input-bordered w-full"
        required
      />

      <button type="submit" className="btn btn-primary w-full">
        Update Order
      </button>
    </form>
  );
}
