'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useOrders } from '@/hooks/useOrders';
import Modal from '@/components/Modal';
import { Order } from '@/types/Models';
import { format } from 'date-fns';
import UpdateOrderForm from '@/components/UpdateOrderForm';

const initialOrder: Order = {
  orderId: '',
  orderDate: '',
  orderItems: '',
  quantity: '',
  totalPrice: 0,
  orderFileRef: '',
  customer: '',
  externalCustomerId: '',
  externalId: '',
  createdAt: undefined,
  updatedAt: undefined,
  associatedCustomer: undefined,
};

export default function SingleOrderPage() {
  const pathname = usePathname();
  const { getSingleOrder } = useOrders();

  const [order, setOrder] = useState<Order>(initialOrder);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get orderId from the URL
  const orderId = pathname.split('/').pop();

  useEffect(() => {
    if (!orderId) return;

    const fetchOrderData = async () => {
      try {
        // Fetch customer and orders in parallel
        const [orderData] = await Promise.all([getSingleOrder(orderId)]);
        setOrder(orderData);
      } catch (err) {
        console.error('Error fetching order data:', err);
        setError('Error fetching order details.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [orderId]);

  const handleUpdatedOrder = () => {
    const fetchOrderData = async () => {
      try {
        // Fetch customer and orders in parallel
        const [orderData] = await Promise.all([
          getSingleOrder(orderId as string),
        ]);
        setOrder(orderData);
      } catch (err) {
        console.error('Error fetching order data:', err);
        setError('Error fetching order details.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!order) return <div>Order not found</div>;

  return (
    <div className="p-6">
      <div className="flex flex-row items-center justify-between mb-4">
        <h1 className="text-3xl mb-4">{order.orderId}</h1>

        <button
          className="btn btn-primary"
          onClick={() =>
            // @ts-expect-error - HTML dialog method
            document.getElementById('updateOrderModal')!.showModal()
          }
        >
          Update order details
        </button>

        <Modal customId="updateOrderModal">
          <UpdateOrderForm
            externalId={order.externalId}
            onUpdateOrder={handleUpdatedOrder}
          />
        </Modal>
      </div>

      <div className="mb-6">
        <p>
          <strong>Order date:</strong>{' '}
          {format(new Date(order.orderDate), 'MMM d, yyyy')}
        </p>
        <p>
          <strong>Order Items:</strong> {order.orderItems}
        </p>
        <p>
          <strong>Quantity:</strong> {order.quantity || 'N/A'}
        </p>
        <p>
          <strong>Total price:</strong> {`£${order.totalPrice.toFixed(2)}`}
        </p>
      </div>
    </div>
  );
}
