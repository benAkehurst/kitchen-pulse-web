'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useOrders } from '@/hooks/useOrders';
import Modal from '@/components/UI/Modal';
import { Order } from '@/types/Models';
import { format } from 'date-fns';
import UpdateOrderForm from '@/components/Forms/UpdateOrderForm';
import Link from 'next/link';
import LoadingOverlay from '@/components/UI/LoadingOverlay';
import { useNotifications } from '@/context/notificationsContext';

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
  const { addNotification } = useNotifications();
  const [order, setOrder] = useState<Order>(initialOrder);
  const [loading, setLoading] = useState(true);

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
        if (err) {
          addNotification({
            message: 'Error fetching order data. Please try again.',
            type: 'error',
          });
        }
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
        if (err) {
          addNotification({
            message: 'Error fetching order data. Please try again.',
            type: 'error',
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  };

  const handleDownloadFile = (fileUrl: string) => {
    const link = document.createElement('a');
    link.setAttribute('download', '');
    link.href = fileUrl;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  if (loading) return <LoadingOverlay />;

  if (!order) return <div>Order not found</div>;

  return (
    <div className="p-6">
      <Link href="/orders" className="my-4 btn">
        Back
      </Link>
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
        <p className="mb-2">
          <strong>Order date:</strong>{' '}
          {format(new Date(order.orderDate), 'MMM d, yyyy')}
        </p>
        <p className="my-2">
          <strong>Order Items:</strong> {order.orderItems}
        </p>
        <p className="my-2">
          <strong>Quantity:</strong> {order.quantity || 'N/A'}
        </p>
        <p className="mt-2">
          <strong>Total price:</strong> {`£${order.totalPrice.toFixed(2)}`}
        </p>
        {order.orderFileRef && (
          <button
            className="btn btn-accent my-2"
            onClick={() => handleDownloadFile(order.orderFileRef)}
          >
            Download original order file
          </button>
        )}
      </div>
    </div>
  );
}
