'use client';
import { useState } from 'react';
import { useOrders } from '@/hooks/useOrders';
import { Order } from '@/types/Models';
import Modal from '@/components/UI/Modal';
import OrderCard from '@/components/Cards/OrderCard';
import ManualOrderForm from '@/components/Forms/ManualOrderForm';
import OrderFileUploadForm from '@/components/Forms/OrderFileUploadForm';
import LoadingOverlay from '@/components/UI/LoadingOverlay';
import { useNotifications } from '@/context/notificationsContext';

export default function OrdersPage() {
  const {
    orders,
    ordersQuery: { isLoading: ordersLoading, isError: ordersError },
  } = useOrders();
  const { addNotification } = useNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('dateDesc');

  const isError = ordersError;

  if (isError) {
    addNotification({
      message: 'Error fetching dashboard data',
      type: 'error',
    });
  }

  const filteredOrders = (orders || [])
    .filter((order: Order) => {
      const searchFields = [
        order.orderId,
        order.associatedCustomer?.company,
        order.associatedCustomer?.name,
      ];
      return searchFields.some((field) =>
        field?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .sort((a: Order, b: Order) => {
      if (sortOption === 'dateDesc') {
        return (
          new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
        );
      } else if (sortOption === 'dateAsc') {
        return (
          new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime()
        );
      } else if (sortOption === 'priceDesc') {
        return b.totalPrice - a.totalPrice;
      } else if (sortOption === 'priceAsc') {
        return a.totalPrice - b.totalPrice;
      }
      return 0;
    });

  const addOrderModal = (
    <>
      <button
        className="btn btn-primary"
        onClick={() =>
          // @ts-expect-error - HTML dialog method
          document.getElementById('addManualOrder')!.showModal()
        }
      >
        Add new order
      </button>

      <Modal customId="addManualOrder">
        <ManualOrderForm />
      </Modal>
    </>
  );

  const uploadOrdersModal = (
    <>
      <button
        className="btn btn-accent ml-4"
        onClick={() =>
          // @ts-expect-error - HTML dialog method
          document.getElementById('uploadOrders')!.showModal()
        }
      >
        Upload orders
      </button>

      <Modal customId="uploadOrders">
        <OrderFileUploadForm />
      </Modal>
    </>
  );

  if (ordersLoading) return <LoadingOverlay />;

  if (orders.length === 0)
    return (
      <div className="flex flex-row items-center justify-between">
        <p>No orders</p>
        <div>{uploadOrdersModal}</div>
      </div>
    );

  return (
    <div>
      <div className="flex flex-row items-center justify-between mb-4">
        <h1 className="text-3xl mb-4">Orders</h1>

        <div className="flex flex-row items-center">
          {addOrderModal}
          {uploadOrdersModal}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by Order ID, Company, or Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered"
        />
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOrders.map((order: Order) => (
          <OrderCard key={order.externalId} {...order} />
        ))}
      </div>
    </div>
  );
}
