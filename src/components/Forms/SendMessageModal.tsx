'use client';

import { useState, useMemo, useEffect } from 'react';
import { useMessages } from '@/hooks/useMessage';
import { useUser } from '@/hooks/useUser';
import { Customer, Order, SendMessageData } from '@/types/Models';

interface SendMessageModalProps {
  customers: Customer[];
  orders: Order[];
}

export default function SendMessageModal({
  customers,
  orders,
}: SendMessageModalProps) {
  const { sendMessage } = useMessages();
  const { getUserInformation } = useUser();

  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userSignature, setUserSignature] = useState<string>('');
  const [useSignature, setUseSignature] = useState(false);

  const [formData, setFormData] = useState<SendMessageData>({
    customerExternalId: '',
    messageContents: '',
    messageFormat: 'sms',
    emailSubject: '',
    orderReference: undefined,
    scheduled: false,
    sendOnDate: undefined,
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const user = await getUserInformation();
        const { name, company, telephone, email } = user;

        if (!name && !company && !telephone && !email) {
          setError(
            'Update your details on the /account page to use a signature.'
          );
          return;
        }

        const signatureParts = [name, company, telephone || email].filter(
          Boolean
        );
        setUserSignature(signatureParts.join(', '));
      } catch (error) {
        console.error('Error fetching user info:', error);
        setError('Error fetching user info. Please try again.');
      }
    };

    fetchUserInfo();
  }, []);

  const handleNextStep = () => setStep((prev) => prev + 1);
  const handlePrevStep = () => setStep((prev) => prev - 1);

  const handleSendMessage = async (isScheduled: boolean) => {
    setError(null);
    setSuccess(null);

    try {
      const messageWithSignature = useSignature
        ? `${formData.messageContents} - ${userSignature}`
        : formData.messageContents;

      await sendMessage({
        ...formData,
        messageContents: messageWithSignature,
        scheduled: isScheduled,
      });
      setSuccess('Message sent successfully!');
      setTimeout(
        () => document.getElementById('sendMessageModal')?.close(),
        3000
      );
      setFormData({
        customerExternalId: '',
        messageContents: '',
        messageFormat: 'sms',
        emailSubject: '',
        orderReference: undefined,
        scheduled: false,
        sendOnDate: undefined,
      });
      setStep(1);
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Error sending message. Please try again.');
    }
  };

  const getCharacterLimit = () => {
    if (formData.messageFormat === 'sms') return 160;
    if (formData.messageFormat === 'whatsapp') return 500;
    return Infinity;
  };

  const characterLimit = getCharacterLimit();

  const selectedCustomer = useMemo(
    () => customers.find((c) => c.externalId === formData.customerExternalId),
    [formData.customerExternalId, customers]
  );

  const availableMessageTypes = useMemo(() => {
    const types = [];
    if (selectedCustomer?.telephone) {
      types.push('sms', 'whatsapp');
    }
    if (selectedCustomer?.email) {
      types.push('email');
    }
    return types;
  }, [selectedCustomer]);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-semibold">Send New Message</h2>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      {step === 1 && (
        <div className="flex flex-col gap-4">
          <label className="font-medium">Pick a Customer:</label>
          <select
            value={formData.customerExternalId}
            onChange={(e) =>
              setFormData({ ...formData, customerExternalId: e.target.value })
            }
            className="select select-bordered"
          >
            <option value="">Select Customer</option>
            {customers.map((customer) => (
              <option key={customer.externalId} value={customer.externalId}>
                {customer.name}{' '}
                {`: ${customer.company ? customer.company : ''}`}
              </option>
            ))}
          </select>

          <div className="flex justify-between">
            <button className="btn" disabled>
              Back
            </button>
            {formData.customerExternalId && (
              <button className="btn btn-primary" onClick={handleNextStep}>
                Next
              </button>
            )}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-4">
          <label className="font-medium">Message Type:</label>
          <div className="flex flex-col gap-2">
            {['sms', 'whatsapp', 'email'].map((type) => (
              <label key={type} className="flex items-center gap-2">
                <input
                  type="radio"
                  value={type}
                  checked={formData.messageFormat === type}
                  disabled={!availableMessageTypes.includes(type)}
                  onChange={() =>
                    setFormData({ ...formData, messageFormat: type })
                  }
                />
                {type.toUpperCase()}
              </label>
            ))}
          </div>

          {formData.messageFormat === 'email' && (
            <>
              <label className="font-medium">Email Subject:</label>
              <input
                value={formData.emailSubject}
                onChange={(e) =>
                  setFormData({ ...formData, emailSubject: e.target.value })
                }
                type="text"
                placeholder="Your email subject"
                className="input"
              />
            </>
          )}

          <label className="font-medium">Message Content:</label>
          <textarea
            value={formData.messageContents}
            onChange={(e) =>
              setFormData({ ...formData, messageContents: e.target.value })
            }
            maxLength={characterLimit}
            placeholder="Enter your message"
            className="textarea textarea-bordered"
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={useSignature}
              onChange={() => setUseSignature(!useSignature)}
            />
            {`Include Signature (Preview: - ${userSignature}) `}
          </label>

          {(formData.messageFormat === 'sms' ||
            formData.messageFormat === 'whatsapp') && (
            <p className="text-sm text-gray-500">
              {characterLimit -
                formData.messageContents.length -
                (useSignature ? userSignature.length + 3 : 0)}{' '}
              characters remaining
            </p>
          )}

          <div className="flex justify-between">
            <button className="btn" onClick={handlePrevStep}>
              Back
            </button>
            {formData.messageContents && (
              <button className="btn btn-primary" onClick={handleNextStep}>
                Next
              </button>
            )}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col gap-4">
          <label className="font-medium">Refer to an Order?</label>
          <select
            onChange={(e) =>
              setFormData({ ...formData, orderReference: e.target.value })
            }
            className="select select-bordered"
          >
            <option value="">No Order</option>
            {orders.map((order) => (
              <option key={order.orderId} value={order.externalId}>
                {`${order.orderDate} - £${order.totalPrice}`}
              </option>
            ))}
          </select>

          <label className="font-medium">Schedule Message?</label>
          <input
            type="datetime-local"
            onChange={(e) =>
              setFormData({ ...formData, sendOnDate: new Date(e.target.value) })
            }
            className="input input-bordered"
          />

          <div className="flex justify-between">
            <button className="btn" onClick={handlePrevStep}>
              Back
            </button>
            <div className="flex gap-4">
              <button
                onClick={() => handleSendMessage(false)}
                className="btn btn-primary"
              >
                Send Now
              </button>
              <button
                onClick={() => handleSendMessage(true)}
                className="btn btn-secondary"
              >
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
