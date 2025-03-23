'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useCustomer } from '@/hooks/useCustomer';
import { useOrders } from '@/hooks/useOrders';
import { Order } from '@/types/Models';
import Link from 'next/link';
import SendMessageWrapper from '@/components/Utility/SendMessageWrapper';
import UpdateCustomerWrapper from '@/components/Utility/UpdateCustomerWrapper';
import LoadingOverlay from '@/components/UI/LoadingOverlay';
import { useNotifications } from '@/context/notificationsContext';

export default function SingleCustomerPage() {
  const { customerId } = useParams();
  const { fetchSingleCustomer, singleCustomer, deleteCustomer } = useCustomer();
  const { fetchOrdersByCustomer } = useOrders();
  const { addNotification } = useNotifications();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState('dateDesc');

  useEffect(() => {
    setLoading(true);
    if (!customerId) return;

    // Fetch the single customer
    fetchSingleCustomer(customerId as string, {
      onSuccess: () => setLoading(false),
      onError: () => {
        addNotification({
          message: 'Error fetching customer data. Please try again.',
          type: 'error',
        });
        setLoading(false);
      },
    });

    // Fetch orders separately
    fetchOrdersByCustomer(customerId as string, {
      onSuccess: (data) => setOrders(data),
      onError: () => {
        addNotification({
          message: 'Error fetching orders. Please try again.',
          type: 'error',
        });
      },
    });
  }, [customerId]);

  const handleDeleteCustomer = async () => {
    if (!customerId) return;

    try {
      await deleteCustomer.mutateAsync(customerId as string);
      addNotification({
        message: 'Customer deleted successfully',
        type: 'success',
      });
    } catch (error) {
      if (error) {
        addNotification({
          message: 'Error deleting customer. Please try again.',
          type: 'error',
        });
      }
    }
  };

  const filteredOrders = orders.sort((a, b) => {
    const dateA = new Date(a.orderDate).getTime() || 0;
    const dateB = new Date(b.orderDate).getTime() || 0;

    if (sortOption === 'dateDesc') return dateB - dateA;
    if (sortOption === 'dateAsc') return dateA - dateB;
    if (sortOption === 'priceDesc')
      return (b.totalPrice || 0) - (a.totalPrice || 0);
    if (sortOption === 'priceAsc')
      return (a.totalPrice || 0) - (b.totalPrice || 0);

    return 0;
  });

  if (loading) return <LoadingOverlay />;
  if (!singleCustomer) return <div>Customer not found</div>;

  return (
    <div className="p-6">
      <Link href="/customers" className="my-4 btn">
        Back
      </Link>
      <div className="flex flex-row items-center justify-between mb-4">
        <h1 className="text-3xl mb-4">{singleCustomer.name}</h1>
        <div className="flex">
          <UpdateCustomerWrapper singleCustomer={singleCustomer} />
          <SendMessageWrapper customers={[singleCustomer]} orders={orders} />
          <button className="btn btn-error ml-4" onClick={handleDeleteCustomer}>
            Delete customer
          </button>
        </div>
      </div>

      <div className="mb-6">
        <p>
          <strong>Company:</strong> {singleCustomer.company}
        </p>
        <p>
          <strong>Email:</strong> {singleCustomer.email}
        </p>
        <p>
          <strong>Telephone:</strong> {singleCustomer.telephone || 'N/A'}
        </p>
        <p>
          <strong>Address:</strong> {singleCustomer.address}
        </p>
        <p>
          <strong>Contactable:</strong>{' '}
          {singleCustomer.contactable ? 'Yes' : 'No'}
        </p>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found for this customer.</p>
      ) : (
        <>
          {/* Filter Bar */}
          <div className="flex gap-4 mb-4">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="select select-bordered"
            >
              <option value="dateDesc">Date: Newest First</option>
              <option value="dateAsc">Date: Oldest First</option>
              <option value="priceDesc">Price: Highest First</option>
              <option value="priceAsc">Price: Lowest First</option>
            </select>
          </div>
          <ul className="space-y-4">
            {filteredOrders.map((order) => (
              <li
                key={order.externalId}
                className="p-4 border rounded-lg shadow-sm"
              >
                <Link
                  href={`/orders/${order.externalId}`}
                  className="text-blue-600 hover:underline"
                >
                  <p>
                    <strong>Total:</strong> £{order.totalPrice}
                  </p>
                  <p>
                    <strong>Order Date:</strong>{' '}
                    {new Date(order.orderDate).toLocaleDateString()}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
