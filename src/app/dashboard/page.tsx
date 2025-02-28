'use client';

import { useEffect, useState } from 'react';
import { Suspense } from 'react';
import Loading from './loading';
import DashboardCard from '@/components/DashboardCard';
import { useOrders } from '@/hooks/useOrders';
import { useCustomer } from '@/hooks/useCustomer';

export default function DashboardPage() {
  const { getCustomers } = useCustomer();
  const { getAllOrders } = useOrders();
  const [fetchedCustomers, setFetchedCustomers] = useState([]);
  const [fetchedOrders, setFetchedOrders] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      const customers = await getCustomers();
      setFetchedCustomers(customers);
    };
    const fetchOrders = async () => {
      const orders = await getAllOrders();
      setFetchedOrders(orders);
    };
    fetchCustomers();
    fetchOrders();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Suspense fallback={<Loading />}>
        <DashboardCard
          cardName={'Customers'}
          itemCount={fetchedCustomers.length}
          onwardLink="customers"
        />
      </Suspense>
      <Suspense fallback={<Loading />}>
        <DashboardCard
          cardName={'Orders'}
          itemCount={fetchedOrders.length}
          onwardLink="orders"
        />
      </Suspense>
      <DashboardCard cardName="Messages" onwardLink="messages" />
    </div>
  );
}
