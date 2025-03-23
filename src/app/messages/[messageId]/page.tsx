'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMessages } from '@/hooks/useMessage';
import Modal from '@/components/UI/Modal';
import EditMessageForm from '@/components/Forms/EditMessageForm';
import { format } from 'date-fns';
import { User, Mail, Calendar, Send, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import LoadingOverlay from '@/components/UI/LoadingOverlay';
import { useNotifications } from '@/context/notificationsContext';

export default function SingleMessage() {
  const router = useRouter();
  const { messageId } = useParams();
  const { fetchSingleMessage, singleMessage, deleteMessage } = useMessages();
  const { addNotification } = useNotifications();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (!messageId) return;

    fetchSingleMessage(messageId as string, {
      onSuccess: () => setLoading(false),
      onError: () => {
        addNotification({
          message: 'Error fetching message data. Please try again.',
          type: 'error',
        });
        setLoading(false);
      },
    });
  }, [messageId]);

  const handleDeleteMessage = async () => {
    if (!messageId) return;

    try {
      await deleteMessage.mutateAsync(messageId as string);
      addNotification({
        message: 'Message deleted successfully',
        type: 'success',
      });
    } catch (error) {
      if (error) {
        addNotification({
          message: 'Error deleting message. Please try again.',
          type: 'error',
        });
      }
    }
  };

  if (loading) return <LoadingOverlay />;
  if (!singleMessage) return <div>Message not found</div>;

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
                initialData={singleMessage}
              />
            </Modal>
            <button
              className="btn btn-error ml-4"
              onClick={handleDeleteMessage}
            >
              Delete message
            </button>
          </>
        </div>
      </div>

      <h1 className="text-2xl font-semibold mb-4">Message Details</h1>
      {singleMessage.associatedCustomer && (
        <p className="mb-2 flex items-center gap-2">
          <User size={18} />
          <strong>Customer:</strong> {singleMessage.associatedCustomer.name} (
          {singleMessage.associatedCustomer.company})
        </p>
      )}
      <p className="my-2 flex items-center gap-2">
        <Send size={18} />
        <strong>Message:</strong> {singleMessage.messageContents}
      </p>
      <p className="my-2 flex items-center gap-2">
        {singleMessage.associatedCustomer?.contactable ? (
          <CheckCircle size={18} className="text-green-500" />
        ) : (
          <XCircle size={18} className="text-red-500" />
        )}
        <strong>Contactable:</strong>{' '}
        {singleMessage.associatedCustomer?.contactable ? 'Yes' : 'No'}
      </p>
      <p className="my-2 flex items-center gap-2">
        <Mail size={18} />
        <strong>Message Format:</strong> {singleMessage.messageFormat}
      </p>
      <p className="my-2 flex items-center gap-2">
        {singleMessage.scheduled ? (
          <CheckCircle size={18} className="text-green-500" />
        ) : (
          <XCircle size={18} className="text-red-500" />
        )}
        <strong>Scheduled:</strong> {singleMessage.scheduled ? 'Yes' : 'No'}
      </p>
      {singleMessage.scheduled && (
        <p className="my-2 flex items-center gap-2">
          <Calendar size={18} />
          <strong>Send On:</strong>{' '}
          {new Date(singleMessage.sendOnDate).toLocaleString()}
        </p>
      )}
      {singleMessage.messageSent && (
        <p className="my-2 flex items-center gap-2">
          <CheckCircle size={18} className="text-green-500" />
          Message Sent
        </p>
      )}
      {singleMessage.messageSent && singleMessage.sendOnDate && (
        <p className="my-2 flex items-center gap-2">
          <CheckCircle size={18} className="text-green-500" />
          This message was sent on{' '}
          <strong>
            {format(new Date(singleMessage.sendOnDate), 'MMM d, yyyy')}
          </strong>
        </p>
      )}
      {!singleMessage.messageSent && (
        <button
          className="btn btn-error"
          onClick={async () =>
            await deleteMessage
              .mutateAsync(singleMessage.externalId)
              .then((res) => {
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
