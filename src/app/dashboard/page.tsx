'use client';

import { useEffect, useState } from 'react';
import DashboardCard from '@/components/Cards/DashboardCard';
import { useOrders } from '@/hooks/useOrders';
import { useCustomer } from '@/hooks/useCustomer';
import { useUser } from '@/hooks/useUser';
import { useMessages } from '@/hooks/useMessage';
import { useAnalytics } from '@/hooks/useAnalytics';
import LoadingOverlay from '@/components/UI/LoadingOverlay';
import { useNotifications } from '@/context/notificationsContext';
import SendMessageModal from '@/components/Forms/SendMessageModal';
import NewCustomerForm from '@/components/Forms/NewCustomerForm';
import Modal from '@/components/UI/Modal';
import Link from 'next/link';
import OrderFileUploadForm from '@/components/Forms/OrderFileUploadForm';
import Image from 'next/image';
import AnalyticsCard from '@/components/Cards/AnalyticsCard';
import { useTeamMembers } from '@/hooks/useTeamMembers';

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
    messages,
    messagesQuery: { isLoading: messagesLoading, isError: messagesError },
  } = useMessages();

  const {
    user,
    userQuery: { isLoading: userLoading, isError: userError },
  } = useUser();

  const {
    dashboard,
    dashboardQuery: { isLoading: dashboardLoading, isError: dashboardError },
  } = useAnalytics();

  const {
    teamMembers,
    teamMembersQuery: {
      isLoading: teamMembersLoading,
      isError: teamMembersError,
    },
  } = useTeamMembers();

  const isLoading =
    customersLoading ||
    ordersLoading ||
    userLoading ||
    messagesLoading ||
    dashboardLoading ||
    teamMembersLoading;
  const isError =
    customersError ||
    ordersError ||
    userError ||
    messagesError ||
    dashboardError ||
    teamMembersError;

  useEffect(() => {
    if (isError) {
      addNotification({
        message: 'Error fetching dashboard data',
        type: 'error',
      });
    }
  }, [isError, addNotification]);

  if (isLoading) return <LoadingOverlay />;
  return (
    <>
      {/* User information */}
      <div className="flex flex-column items-center justify-between mb-4">
        <h1 className="text-4xl font-semibold">
          {user?.company ? `${user.company} Dashboard` : 'Your Dashboard'}
        </h1>
        {user?.avatar && (
          <div className="avatar">
            <div className="w-24 rounded-full border">
              <Image src={user?.avatar} alt="Logo" width={50} height={50} />
            </div>
          </div>
        )}
      </div>

      {/* Show upload orders button */}
      {orders.length === 0 && (
        <div className="mb-6 grid grid-cols-1 gap-4">
          <>
            <button
              className="p-4 bg-blue-800 text-white rounded shadow"
              onClick={() =>
                // @ts-expect-error - HTML dialog method
                document.getElementById('dashboard-upload-orders')!.showModal()
              }
            >
              Upload Orders
            </button>
            <Modal customId="dashboard-upload-orders">
              <OrderFileUploadForm />
            </Modal>
          </>
        </div>
      )}

      {/* Show upload customers button */}
      {customers.length === 0 && (
        <div className="mb-6 grid grid-cols-1 gap-4">
          <>
            <button
              className="p-4 bg-orange-800 text-white rounded shadow"
              onClick={() =>
                document
                  .getElementById('dashboard-upload-customers')!
                  // @ts-expect-error - HTML dialog method
                  .showModal()
              }
            >
              Upload customers
            </button>
            <Modal customId="dashboard-upload-customers">
              <div>Upload customers form</div>
            </Modal>
          </>
        </div>
      )}

      {/* Quick Actions */}
      <h2 className="text-2xl font-bold my-4">Quick Actions</h2>
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <>
          <button
            className="p-4 bg-blue-500 text-white rounded shadow"
            onClick={() =>
              // @ts-expect-error - HTML dialog method
              document.getElementById('dashboard-add-new-customer')!.showModal()
            }
          >
            Add a New Customer
          </button>
          <Modal customId="dashboard-add-new-customer">
            <NewCustomerForm />
          </Modal>
        </>
        <Link
          href={`/team-members`}
          className="p-4 bg-yellow-500 text-white rounded shadow text-center"
        >
          View team members
        </Link>
        <Link
          href={`/orders`}
          className="p-4 bg-green-500 text-white rounded shadow text-center"
        >
          View Orders
        </Link>
        <>
          <button
            className="p-4 bg-purple-500 text-white rounded shadow"
            onClick={() =>
              // @ts-expect-error - HTML dialog method
              document.getElementById('dashboard-send-new-message')!.showModal()
            }
          >
            Send a Message
          </button>
          <Modal customId="dashboard-send-new-message">
            <SendMessageModal customers={customers} orders={orders} />
          </Modal>
        </>
      </div>

      <div className="divider"></div>

      {/* Dashboard Cards */}
      <h2 className="text-2xl font-bold my-4">Quick Links</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <DashboardCard
          cardName="Customers"
          itemCount={customers?.length}
          onwardLink="customers"
        />
        <DashboardCard
          cardName="Team members"
          itemCount={teamMembers?.length}
          onwardLink="team-members"
        />
        <DashboardCard
          cardName="Orders"
          itemCount={orders?.length}
          onwardLink="orders"
        />
        <DashboardCard
          cardName="Messages"
          itemCount={messages?.length}
          onwardLink="messages"
        />
      </div>

      <div className="divider"></div>

      {/* Analytics */}
      <AnalyticsCard data={dashboard} />
    </>
  );
}
