'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useCustomer } from '@/hooks/useCustomer';
import { useOrders } from '@/hooks/useOrders';
import { Customer, Order } from '@/types/Models';
import Link from 'next/link';
import Modal from '@/components/Modal';
import UpdateCustomerForm from '@/components/UpdateCustomerForm';
import SendMessageWrapper from '@/components/SendMessageWrapper';
import UpdateCustomerWrapper from '@/components/UpdateCustomerWrapper';

export default function SingleCustomerPage() {
  const pathname = usePathname();
  const { getSingleCustomer } = useCustomer();
  const { getOrdersByCustomer } = useOrders();

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState('dateDesc');

  // Get customerId from the URL
  const customerId = pathname.split('/').pop();

  useEffect(() => {
    if (!customerId) return;

    const fetchCustomerData = async () => {
      try {
        // Fetch customer and orders in parallel
        const [customerData, customerOrders] = await Promise.all([
          getSingleCustomer(customerId),
          getOrdersByCustomer(customerId),
        ]);
        setCustomer(customerData);
        setOrders(customerOrders);
      } catch (err) {
        console.error('Error fetching customer data:', err);
        setError('Error fetching customer details.');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [customerId]);

  const handleUpdatedCustomer = (updatedCustomer: Customer) => {
    setCustomer(updatedCustomer);
  };

  const filteredOrders = orders.sort((a, b) => {
    if (sortOption === 'dateDesc') {
      return new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime();
    } else if (sortOption === 'dateAsc') {
      return new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime();
    } else if (sortOption === 'priceDesc') {
      return b.totalPrice - a.totalPrice;
    } else if (sortOption === 'priceAsc') {
      return a.totalPrice - b.totalPrice;
    }
    return 0;
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!customer) return <div>Customer not found</div>;

  return (
    <div className="p-6">
      <div className="flex flex-row items-center justify-between mb-4">
        <h1 className="text-3xl mb-4">{customer.name}</h1>
        <div className="flex">
          <UpdateCustomerWrapper
            handleUpdatedCustomer={handleUpdatedCustomer}
            externalId={customer.externalId as string}
          />
          <SendMessageWrapper customers={[customer]} orders={orders} />
        </div>
      </div>

      <div className="mb-6">
        <p>
          <strong>Company:</strong> {customer.company}
        </p>
        <p>
          <strong>Email:</strong> {customer.email}
        </p>
        <p>
          <strong>Telephone:</strong> {customer.telephone || 'N/A'}
        </p>
        <p>
          <strong>Address:</strong> {customer.address}
        </p>
        <p>
          <strong>Contactable:</strong> {customer.contactable ? 'Yes' : 'No'}
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
