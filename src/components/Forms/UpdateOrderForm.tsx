'use client';

import { useState } from 'react';
import { useOrders } from '@/hooks/useOrders';
import { Order, UpdatingOrder } from '@/types/Models';
import { useNotifications } from '@/context/notificationsContext';
import LoadingOverlay from '../UI/LoadingOverlay';

export default function UpdateOrderForm({
  singleOrder,
}: {
  singleOrder: Order;
}) {
  const { updateSingleOrder } = useOrders();
  const { addNotification } = useNotifications();
  const [formData, setFormData] = useState<UpdatingOrder | Order | null>(
    singleOrder
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsSubmitting(true);

    try {
      await updateSingleOrder.mutateAsync({
        externalId: singleOrder.externalId,
        orderData: formData as UpdatingOrder,
      });
      setIsSubmitting(false);
      addNotification({
        message: 'Order updated successfully',
        type: 'success',
      });

      // Close modal after 3 seconds
      setTimeout(() => {
        // @ts-expect-error - HTML dialog method
        document.getElementById('updateOrderModal')?.close();
      }, 3000);
    } catch {
      setIsSubmitting(false);
      addNotification({
        message: 'Error updating order, please try again.',
        type: 'error',
      });
    }
  };

  if (!formData) return <LoadingOverlay />;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold">Update Order</h2>

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
        {isSubmitting ? (
          <span className="loading loading-spinner loading-md"></span>
        ) : (
          'Update Order'
        )}
      </button>
    </form>
  );
}
