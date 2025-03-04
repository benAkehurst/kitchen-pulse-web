'use client';
import { useEffect, useState } from 'react';
import { useOrders } from '@/hooks/useOrders';
import { Order } from '@/types/Models';
import Modal from '@/components/Modal';
import OrderCard from '@/components/OrderCard';
import ManualOrderForm from '@/components/ManualOrderForm';

export default function OrdersPage() {
  const { getAllOrders } = useOrders();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('dateDesc');

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

  const handleAddOrder = () => {
    console.log('order added');
  };

  const filteredOrders = orders
    .filter((order) => {
      const searchFields = [
        order.orderId,
        order.associatedCustomer?.company,
        order.associatedCustomer?.name,
      ];
      return searchFields.some((field) =>
        field?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .sort((a, b) => {
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
          <ManualOrderForm onOrderSubmit={handleAddOrder} />
        </Modal>
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

      {filteredOrders.map((order) => (
        <OrderCard key={order.externalId} {...order} />
      ))}
    </div>
  );
}
