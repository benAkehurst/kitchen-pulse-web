'use client';
import { useEffect, useState } from 'react';
import { useOrders } from '@/hooks/useOrders';
import { Order } from '@/types/Models';
import Modal from '@/components/Modal';
import OrderCard from '@/components/OrderCard';

export default function OrdersPage() {
  const { getAllOrders } = useOrders();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersList = await getAllOrders();
        setOrders(ordersList);
      } catch (error) {
        console.error('Error fetching order data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddOrder = (newOrder: Order) => {
    setOrders((prevOrders) => [newOrder, ...prevOrders]);
  };

  if (loading) return <div>Loading...</div>;
  if (orders.length === 0) return <div>No orders</div>;

  return (
    <div>
      <div className="flex flex-row items-center justify-between mb-4">
        <h1 className="text-3xl mb-4">Orders</h1>

        <button
          className="btn"
          onClick={() =>
            // @ts-expect-error - HTML dialog method
            document.getElementById('addManualOrder')!.showModal()
          }
        >
          Add new order
        </button>

        <Modal customId="addManualOrder">
          <div>Add manual order form</div>
        </Modal>
      </div>

      {/* TODO: Add a search input to filter the list client side by searching again name or company */}

      {orders.map((order) => (
        <OrderCard key={order.externalId} {...order} />
      ))}
    </div>
  );
}
