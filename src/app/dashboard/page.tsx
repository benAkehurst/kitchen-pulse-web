'use client';

import { useEffect, useState } from 'react';
import Loading from './loading';
import DashboardCard from '@/components/Cards/DashboardCard';
import { useOrders } from '@/hooks/useOrders';
import { useCustomer } from '@/hooks/useCustomer';
import { useUser } from '@/hooks/useUser';
import { Customer, Order, User } from '@/types/Models';

interface DashboardData {
  customers: Customer[] | null;
  orders: Order[] | null;
  user: User | null;
}

export default function DashboardPage() {
  const { getUserInformation } = useUser();
  const { getCustomers } = useCustomer();
  const { getAllOrders } = useOrders();

  const [data, setData] = useState<DashboardData>({
    customers: [],
    orders: [],
    user: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customers, orders, user] = await Promise.all([
          getCustomers(),
          getAllOrders(),
          getUserInformation(),
        ]);
        setData({ customers, orders, user });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Loading />;

  const { customers, orders, user } = data;

  return (
    <>
      <h1 className="text-4xl font-semibold mb-4">
        {user?.company ? `${user.company} dashboard` : 'Your dashboard'}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {customers && (
          <DashboardCard
            cardName="Customers"
            itemCount={customers.length}
            onwardLink="customers"
          />
        )}
        {orders && (
          <DashboardCard
            cardName="Orders"
            itemCount={orders.length}
            onwardLink="orders"
          />
        )}
        <DashboardCard cardName="Messages" onwardLink="messages" />
      </div>
    </>
  );
}
