'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useOrders } from '@/hooks/useOrders';
import Modal from '@/components/UI/Modal';
import { format } from 'date-fns';
import UpdateOrderForm from '@/components/Forms/UpdateOrderForm';
import Link from 'next/link';
import LoadingOverlay from '@/components/UI/LoadingOverlay';
import { useNotifications } from '@/context/notificationsContext';

export default function SingleOrderPage() {
  const { orderId } = useParams();
  const { fetchSingleOrder, singleOrder, deleteOrder } = useOrders();
  const { addNotification } = useNotifications();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (!orderId) return;

    fetchSingleOrder(orderId as string, {
      onSuccess: () => setLoading(false),
      onError: () => {
        addNotification({
          message: 'Error fetching order data. Please try again.',
          type: 'error',
        });
        setLoading(false);
      },
    });
  }, [orderId]);

  const handleDeleteOrder = async () => {
    if (!orderId) return;

    try {
      await deleteOrder.mutateAsync(orderId as string);
      addNotification({
        message: 'Order deleted successfully',
        type: 'success',
      });
    } catch (error) {
      if (error) {
        addNotification({
          message: 'Error deleting order. Please try again.',
          type: 'error',
        });
      }
    }
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
  if (!singleOrder) return <div>Order not found</div>;

  return (
    <div className="p-6">
      <Link href="/orders" className="my-4 btn">
        Back
      </Link>
      <div className="flex flex-row items-center justify-between mb-4">
        <h1 className="text-3xl mb-4">{singleOrder.orderId}</h1>

        <div className="flex">
          <>
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
              <UpdateOrderForm singleOrder={singleOrder} />
            </Modal>
          </>
          <button className="btn btn-error ml-4" onClick={handleDeleteOrder}>
            Delete order
          </button>
        </div>
      </div>

      <div className="mb-6">
        <p className="mb-2">
          <strong>Order date:</strong>{' '}
          {format(new Date(singleOrder.orderDate), 'MMM d, yyyy')}
        </p>
        <p className="my-2">
          <strong>Order Items:</strong> {singleOrder.orderItems}
        </p>
        <p className="my-2">
          <strong>Quantity:</strong> {singleOrder.quantity || 'N/A'}
        </p>
        <p className="mt-2">
          <strong>Total price:</strong>{' '}
          {`£${singleOrder.totalPrice.toFixed(2)}`}
        </p>
        {singleOrder.orderFileRef && (
          <button
            className="btn btn-accent my-2"
            onClick={() => handleDownloadFile(singleOrder.orderFileRef)}
          >
            Download original order file
          </button>
        )}
      </div>
    </div>
  );
}
