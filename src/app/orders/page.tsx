'use client';
import { useEffect, useState } from 'react';
import { useOrders } from '@/hooks/useOrders';
import { Order } from '@/types/Models';

interface OrderData {
  orders: Order[] | null;
}

export default function OrdersPage() {
  const { getAllOrders } = useOrders();
  const [data, setData] = useState<OrderData>({
    orders: [],
  });
  console.log('data: ', data);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [orders] = await Promise.all([getAllOrders()]);
        setData({ orders });
      } catch (error) {
        console.error('Error fetching customer data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (data.orders && data.orders.length === 0) {
    return <div>No orders</div>;
  }

  return (
    <div>
      <h1>Orders</h1>
      {data.orders &&
        data.orders.map((order) => (
          <div key={order.orderId}>
            <h2>{order.orderDate}</h2>
            <p>{order.totalPrice}</p>
          </div>
        ))}
    </div>
  );
}
