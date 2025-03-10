'use client';

import { useEffect, useState } from 'react';
import { useMessages } from '@/hooks/useMessage';
import { Customer, Message, Order } from '@/types/Models';
import { useCustomer } from '@/hooks/useCustomer';
import { useOrders } from '@/hooks/useOrders';
import Modal from '@/components/UI/Modal';
import SendMessageModal from '@/components/Forms/SendMessageModal';
import MessageCard from '@/components/Cards/MessageCard';

export default function MessagesPage() {
  const { getAllMessages } = useMessages();
  const { getCustomers } = useCustomer();
  const { getAllOrders } = useOrders();

  const [messages, setMessages] = useState<Message[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredMessages = messages.filter((message: Message) => {
    const searchFields = [message.messageContents];
    return searchFields.some((field) =>
      field?.toLowerCase().includes(searchTerm.toLowerCase())
    );
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

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by message content"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered"
        />
      </div>

      {filteredMessages.map((message: Message) => (
        <MessageCard key={message.externalId} message={message} />
      ))}
    </div>
  );
}
