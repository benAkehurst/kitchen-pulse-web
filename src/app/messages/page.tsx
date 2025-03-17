'use client';

import { useEffect, useState } from 'react';
import { useMessages } from '@/hooks/useMessage';
import { Customer, Message, Order } from '@/types/Models';
import { useCustomer } from '@/hooks/useCustomer';
import { useOrders } from '@/hooks/useOrders';
import Modal from '@/components/UI/Modal';
import SendMessageModal from '@/components/Forms/SendMessageModal';
import MessageCard from '@/components/Cards/MessageCard';
import { compareAsc, compareDesc, parseISO, isValid } from 'date-fns';

export default function MessagesPage() {
  const { getAllMessages } = useMessages();
  const { getCustomers } = useCustomer();
  const { getAllOrders } = useOrders();

  const [messages, setMessages] = useState<Message[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('dateDesc');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [messagesList, customerList, orderList] = await Promise.all([
          getAllMessages(),
          getCustomers(),
          getAllOrders(),
        ]);
        setMessages(messagesList);
        setCustomers(customerList);
        setOrders(orderList);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredMessages = messages
    .filter((message) => {
      const searchFields = [message.messageContents];
      return searchFields.some((field) =>
        field?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (!a.createdAt || !b.createdAt) return 0; // Handle missing timestamps

      // Ensure createdAt is a Date object
      const dateA =
        a.createdAt instanceof Date ? a.createdAt : parseISO(a.createdAt);
      const dateB =
        b.createdAt instanceof Date ? b.createdAt : parseISO(b.createdAt);

      // Ensure parsed dates are valid
      if (!isValid(dateA) || !isValid(dateB)) return 0;

      if (sortOption === 'dateDesc') {
        return compareDesc(dateA, dateB);
      } else if (sortOption === 'dateAsc') {
        return compareAsc(dateA, dateB);
      }

      return 0;
    });

  const sendMessageModal = (
    <>
      <button
        className="btn btn-primary"
        onClick={() =>
          // @ts-expect-error - HTML dialog method
          document.getElementById('sendMessageModal')!.showModal()
        }
      >
        Send a new message
      </button>

      <Modal customId="sendMessageModal">
        <SendMessageModal customers={customers} orders={orders} />
      </Modal>
    </>
  );

  if (loading) return <div>Loading...</div>;
  if (messages.length === 0) return <div>No messages {sendMessageModal}</div>;

  return (
    <div>
      <div className="flex flex-row items-center justify-between mb-4">
        <h1 className="text-3xl mb-4">Messages</h1>
        {sendMessageModal}
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
        </select>
      </div>

      {filteredMessages.map((message: Message) => (
        <MessageCard key={message.externalId} message={message} />
      ))}
    </div>
  );
}
