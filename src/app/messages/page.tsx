'use client';

import { useState } from 'react';
import { Message } from '@/types/Models';
import { useCustomer } from '@/hooks/useCustomer';
import { useOrders } from '@/hooks/useOrders';
import { useMessages } from '@/hooks/useMessage';
import Modal from '@/components/UI/Modal';
import SendMessageModal from '@/components/Forms/SendMessageModal';
import MessageCard from '@/components/Cards/MessageCard';
import { compareAsc, compareDesc, parseISO, isValid } from 'date-fns';
import LoadingOverlay from '@/components/UI/LoadingOverlay';
import { useNotifications } from '@/context/notificationsContext';

export default function MessagesPage() {
  const {
    messages,
    messagesQuery: { isLoading: messagesLoading, isError: messagesError },
  } = useMessages();
  const {
    customers,
    customersQuery: { isLoading: customersLoading, isError: customersError },
  } = useCustomer();
  const {
    orders,
    ordersQuery: { isLoading: ordersLoading, isError: ordersError },
  } = useOrders();
  const { addNotification } = useNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('dateDesc');

  const isLoading = customersLoading || ordersLoading || messagesLoading;
  const isError = customersError || ordersError || messagesError;

  if (isError) {
    addNotification({
      message: 'Error fetching dashboard data',
      type: 'error',
    });
  }

  const filteredMessages = (messages || [])
    .filter((message: Message) => {
      const searchFields = [message.messageContents];
      return searchFields.some((field) =>
        field?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .sort((a: Message, b: Message) => {
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

  if (isLoading) return <LoadingOverlay />;
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
