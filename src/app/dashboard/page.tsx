'use client';

import DashboardCard from '@/components/Cards/DashboardCard';
import { useOrders } from '@/hooks/useOrders';
import { useCustomer } from '@/hooks/useCustomer';
import { useUser } from '@/hooks/useUser';
import LoadingOverlay from '@/components/UI/LoadingOverlay';
import { useNotifications } from '@/context/notificationsContext';

export default function DashboardPage() {
  const { addNotification } = useNotifications();

  const {
    customers,
    customersQuery: { isLoading: customersLoading, isError: customersError },
  } = useCustomer();
  const {
    orders,
    ordersQuery: { isLoading: ordersLoading, isError: ordersError },
  } = useOrders();
  const {
    user,
    userQuery: { isLoading: userLoading, isError: userError },
  } = useUser();

  const isLoading = customersLoading || ordersLoading || userLoading;
  const isError = customersError || ordersError || userError;

  if (isError) {
    addNotification({
      message: 'Error fetching dashboard data',
      type: 'error',
    });
  }

  if (isLoading) return <LoadingOverlay />;

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
