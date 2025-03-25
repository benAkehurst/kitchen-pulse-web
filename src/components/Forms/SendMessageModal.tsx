'use client';

import { useState, useMemo, useEffect } from 'react';
import { useMessages } from '@/hooks/useMessage';
import { useUser } from '@/hooks/useUser';
import { Customer, Order, SendMessageData } from '@/types/Models';
import { isFeatureEnabled } from '@/lib/featureFlags';
import { useNotifications } from '@/context/notificationsContext';
import { useParams } from 'next/navigation';

interface SendMessageModalProps {
  customers: Customer[];
  orders: Order[];
}

export default function SendMessageModal({
  customers,
  orders,
}: SendMessageModalProps) {
  const { sendMessage } = useMessages();
  const { addNotification } = useNotifications();
  const {
    user,
    userQuery: { isLoading: userLoading, isError: userError },
  } = useUser();
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userSignature, setUserSignature] = useState<string>('');
  const [useSignature, setUseSignature] = useState(false);
  const [multipleRecipients, setMultipleRecipients] = useState(false);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const params = useParams();

  const currentCustomerId = params?.customerId;

  const [formData, setFormData] = useState<SendMessageData>({
    customerExternalId: [''],
    messageContents: '',
    messageFormat: 'sms',
    emailSubject: '',
    orderReference: undefined,
    scheduled: false,
    sendOnDate: undefined,
    multipleRecipients: false,
  });

  const contactMethods = ['sms', 'email'];

  if (isFeatureEnabled('enableWhatsapp')) {
    contactMethods.splice(1, 0, 'whatsapp');
  }

  useEffect(() => {
    if (currentCustomerId) {
      const foundCustomer = customers.find(
        (c) => c.externalId === currentCustomerId
      );
      if (foundCustomer) {
        setFormData((prev) => ({
          ...prev,
          customerExternalId: [foundCustomer.externalId!],
        }));
        setSelectedCustomers([foundCustomer.externalId!]); // Preselect in UI
      }
    }
  }, [currentCustomerId, customers]);

  useEffect(() => {
    if (user && !userLoading && !userError) {
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
    }
  }, [user]);

  const handleNextStep = () => setStep((prev) => prev + 1);
  const handlePrevStep = () => setStep((prev) => prev - 1);

  const toggleCustomerSelection = (customerId: string) => {
    setSelectedCustomers((prev) => {
      const newSelection = prev.includes(customerId)
        ? prev.filter((id) => id !== customerId)
        : [...prev, customerId];

      setFormData((prevForm) => ({
        ...prevForm,
        customerExternalId: newSelection.length > 0 ? newSelection : [''],
      }));

      return newSelection;
    });
  };

  const handleSendMessage = async (isScheduled: boolean) => {
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      const messageWithSignature = useSignature
        ? `${formData.messageContents} - ${userSignature}`
        : formData.messageContents;

      await sendMessage.mutateAsync({
        ...formData,
        customerExternalId: multipleRecipients
          ? selectedCustomers
          : formData.customerExternalId,
        messageContents: messageWithSignature,
        scheduled: isScheduled,
        multipleRecipients: multipleRecipients,
      });
      setIsSubmitting(false);
      addNotification({
        message: 'Message sent successfully',
        type: 'success',
      });
      setTimeout(
        // @ts-expect-error: ignore this html stuff
        () => document.getElementById('sendMessageModal')?.close(),
        3000
      );
      setFormData({
        customerExternalId: [''],
        messageContents: '',
        messageFormat: 'sms',
        emailSubject: '',
        orderReference: undefined,
        scheduled: false,
        sendOnDate: undefined,
        multipleRecipients: false,
      });
      setSelectedCustomers([]);
      setStep(1);
    } catch (error) {
      if (error) {
        setIsSubmitting(false);
        addNotification({
          message: 'Error sending message. Please try again.',
          type: 'error',
        });
      }
    }
  };

  const getCharacterLimit = () => {
    if (formData.messageFormat === 'sms') return 160;
    if (formData.messageFormat === 'whatsapp') return 500;
    return Infinity;
  };

  const characterLimit = getCharacterLimit();

  const selectedCustomer = useMemo(
    () =>
      customers.find((c) =>
        formData.customerExternalId.includes(c.externalId!)
      ) || null,
    [formData.customerExternalId, customers]
  );

  const availableMessageTypes = useMemo(() => {
    if (!selectedCustomer) return [];
    const types = [];
    if (selectedCustomer.telephone) types.push('sms', 'whatsapp');
    if (selectedCustomer.email) types.push('email');
    return types;
  }, [selectedCustomer]);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-semibold">Send New Message</h2>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      {step === 1 && (
        <div className="flex flex-col gap-4">
          <label className="font-medium">Send to:</label>
          <div className="flex gap-4">
            <button
              className={`btn ${!multipleRecipients ? 'btn-primary' : ''}`}
              onClick={() => setMultipleRecipients(false)}
            >
              One Customer
            </button>
            <button
              className={`btn ${multipleRecipients ? 'btn-primary' : ''}`}
              onClick={() => setMultipleRecipients(true)}
            >
              Many Customers
            </button>
          </div>

          {!multipleRecipients ? (
            <select
              value={formData.customerExternalId[0]}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  customerExternalId: [e.target.value],
                })
              }
              className="select select-bordered"
              disabled={!!currentCustomerId} // Disable if preselected
            >
              {customers.map((customer) => (
                <option key={customer.externalId} value={customer.externalId}>
                  {customer.name}{' '}
                  {`: ${customer.company ? customer.company : ''}`}
                </option>
              ))}
            </select>
          ) : (
            <div className="flex flex-col gap-2">
              {customers.map((customer) => (
                <label
                  key={customer.externalId}
                  className="flex items-center gap-2"
                >
                  <input
                    type="checkbox"
                    checked={formData.customerExternalId.includes(
                      customer.externalId!
                    )}
                    onChange={() =>
                      toggleCustomerSelection(customer.externalId!)
                    }
                  />
                  {customer.name}{' '}
                  {customer.company ? ` - ${customer.company}` : ''}
                </label>
              ))}
            </div>
          )}

          <div className="flex justify-between">
            <button className="btn" disabled>
              Back
            </button>
            {(formData.customerExternalId || selectedCustomers.length > 0) && (
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
            {contactMethods.map((type) => (
              <label key={type} className="flex items-center gap-2">
                <input
                  type="radio"
                  value={type}
                  checked={formData.messageFormat === type}
                  disabled={
                    !availableMessageTypes.includes(type) &&
                    availableMessageTypes.length > 0
                  }
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

          <label className="font-medium">Preview Message</label>
          <div className="border rounded-lg shadow-md p-4">
            {formData.messageFormat === 'email' && (
              <p>{formData.emailSubject}</p>
            )}
            <p>
              {formData.messageContents} - {useSignature && userSignature}
            </p>
          </div>

          <div className="flex justify-between">
            <button className="btn" onClick={handlePrevStep}>
              Back
            </button>
            <div className="flex gap-4">
              <button
                onClick={() => handleSendMessage(false)}
                className="btn btn-primary"
              >
                {isSubmitting ? (
                  <span className="loading loading-spinner loading-md"></span>
                ) : (
                  'Send now'
                )}
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
