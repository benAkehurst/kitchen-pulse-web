'use client';
import { useEffect, useState } from 'react';
import { useOrders } from '@/hooks/useOrders';
import { Order } from '@/types/Models';

export default function OrdersPage() {
  const { getAllOrders } = useOrders();
  const [fetchedOrders, setFetchedOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const orders: Order[] = await getAllOrders();
      console.log(orders);
      setFetchedOrders(orders);
    };
    fetchOrders();
  }, []);

  return (
    <div>
      <h1>Orders</h1>
      {fetchedOrders.map((order) => (
        <div key={order.orderId}>
          <h2>{order.orderDate}</h2>
          <p>{order.totalPrice}</p>
        </div>
      ))}
    </div>
  );
}
