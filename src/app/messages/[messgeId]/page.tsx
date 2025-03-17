'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Message } from '@/types/Models';
import { useMessages } from '@/hooks/useMessage';
import Modal from '@/components/UI/Modal';
import EditMessageForm from '@/components/Forms/EditMessageForm';
import { format } from 'date-fns';
import { User, Mail, Calendar, Send, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

const initialMessage: Message = {
  externalCustomerReference: '',
  repeat: false,
  repeatUntil: new Date(),
  scheduled: false,
  sendOnDate: new Date(),
  messageContents: '',
  messageFormat: '',
  messageSent: false,
  externalId: '',
  createdAt: undefined,
  associatedCustomer: {
    name: '',
    company: '',
    email: '',
    telephone: '',
    externalId: '',
  },
};

export default function SingleMessage() {
  const router = useRouter();
  const pathname = usePathname();
  const { getSingleMessage, deleteMessage } = useMessages();

  const [message, setMessage] = useState<Message>(initialMessage);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const messageId = pathname.split('/').pop();

  useEffect(() => {
    if (!messageId) return;

    const fetchMessageData = async () => {
      try {
        const messageData = await getSingleMessage(messageId);
        setMessage(messageData);
      } catch (err) {
        if (err) setError('Error fetching message details.');
      } finally {
        setLoading(false);
      }
    };

    fetchMessageData();
  }, [messageId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!message) return <div>Message not found</div>;

  return (
    <div className="p-6">
      <div className="flex flex-row items-center justify-between mb-4">
        <Link href="/messages" className="my-4 btn">
          Back
        </Link>

        <div className="flex flex-row items-center">
          <>
            <button
              className="btn btn-primary"
              onClick={() =>
                // @ts-expect-error - HTML dialog method
                document.getElementById('editMessageModal')!.showModal()
              }
            >
              Edit message
            </button>

            <Modal customId="editMessageModal">
              <EditMessageForm
                externalId={messageId as string}
                initialData={message}
              />
            </Modal>
          </>
        </div>
      </div>

      <h1 className="text-2xl font-semibold mb-4">Message Details</h1>
      {message.associatedCustomer && (
        <p className="mb-2 flex items-center gap-2">
          <User size={18} />
          <strong>Customer:</strong> {message.associatedCustomer.name} (
          {message.associatedCustomer.company})
        </p>
      )}
      <p className="my-2 flex items-center gap-2">
        <Send size={18} />
        <strong>Message:</strong> {message.messageContents}
      </p>
      <p className="my-2 flex items-center gap-2">
        {message.associatedCustomer?.contactable ? (
          <CheckCircle size={18} className="text-green-500" />
        ) : (
          <XCircle size={18} className="text-red-500" />
        )}
        <strong>Contactable:</strong>{' '}
        {message.associatedCustomer?.contactable ? 'Yes' : 'No'}
      </p>
      <p className="my-2 flex items-center gap-2">
        <Mail size={18} />
        <strong>Message Format:</strong> {message.messageFormat}
      </p>
      <p className="my-2 flex items-center gap-2">
        {message.scheduled ? (
          <CheckCircle size={18} className="text-green-500" />
        ) : (
          <XCircle size={18} className="text-red-500" />
        )}
        <strong>Scheduled:</strong> {message.scheduled ? 'Yes' : 'No'}
      </p>
      {message.scheduled && (
        <p className="my-2 flex items-center gap-2">
          <Calendar size={18} />
          <strong>Send On:</strong>{' '}
          {new Date(message.sendOnDate).toLocaleString()}
        </p>
      )}
      {message.messageSent && (
        <p className="my-2 flex items-center gap-2">
          <CheckCircle size={18} className="text-green-500" />
          Message Sent
        </p>
      )}
      {message.messageSent && message.sendOnDate && (
        <p className="my-2 flex items-center gap-2">
          <CheckCircle size={18} className="text-green-500" />
          This message was sent on{' '}
          <strong>{format(new Date(message.sendOnDate), 'MMM d, yyyy')}</strong>
        </p>
      )}
      {!message.messageSent && (
        <button
          className="btn btn-error"
          onClick={() =>
            deleteMessage(message.externalId).then((res) => {
              if (res) {
                router.replace('/messages');
              }
            })
          }
        >
          Delete Message
        </button>
      )}
    </div>
  );
}
