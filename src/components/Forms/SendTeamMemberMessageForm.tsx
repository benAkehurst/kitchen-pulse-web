'use client';

import { useState, useEffect, useMemo } from 'react';
import { useMessages } from '@/hooks/useMessage';
import { useUser } from '@/hooks/useUser';
import { SendMessageData, SingleTeamMember } from '@/types/Models';
import { isFeatureEnabled } from '@/lib/featureFlags';
import { useNotifications } from '@/context/notificationsContext';
import { useParams } from 'next/navigation';

interface SendMessageModalProps {
  teamMembers: SingleTeamMember[];
}

export default function SendTeamMemberMessageForm({
  teamMembers,
}: SendMessageModalProps) {
  const { sendMessage } = useMessages();
  const { addNotification } = useNotifications();
  const {
    user,
    userQuery: { isLoading: userLoading, isError: userError },
  } = useUser();
  const params = useParams();
  const [userSignature, setUserSignature] = useState<string>('');
  const [useSignature, setUseSignature] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [signature, setSignature] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);

  const currentTeamMemberId = params?.teamMemberId;

  const [formData, setFormData] = useState<SendMessageData>({
    recipientType: 'teamMember',
    recipientExternalIds: [],
    messageContents: '',
    messageFormat: 'sms',
    emailSubject: '',
    orderReference: undefined,
    scheduled: false,
    sendOnDate: undefined,
    multipleRecipients: false,
  });

  const contactMethods = useMemo(() => {
    const base = ['sms', 'email'];
    if (isFeatureEnabled('enableWhatsapp')) base.splice(1, 0, 'whatsapp');
    return base;
  }, []);

  useEffect(() => {
    if (user && !userLoading && !userError) {
      const parts = [user.name, user.company, user.mobile || user.email].filter(
        Boolean
      );
      setSignature(parts.join(', '));
    }
  }, [user]);

  useEffect(() => {
    if (currentTeamMemberId) {
      setSelectedIds([currentTeamMemberId as string]);
    } else if (teamMembers.length) {
      setSelectedIds([teamMembers[0].externalId as string]);
    }
  }, [currentTeamMemberId, teamMembers]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      recipientExternalIds: selectedIds.length ? selectedIds : [''],
      multipleRecipients: selectedIds.length > 1,
    }));
  }, [selectedIds]);

  useEffect(() => {
    if (user && !userLoading && !userError) {
      const { name, company, mobile, email } = user;
      if (!name && !company && !mobile && !email) {
        setError(
          'Update your details on the /account page to use a signature.'
        );
        return;
      }
      const signatureParts = [name, company, mobile || email].filter(Boolean);
      setUserSignature(signatureParts.join(', '));
    }
  }, [user]);

  const handleToggleRecipient = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSend = async (schedule: boolean) => {
    setError(null);
    setIsSubmitting(true);

    try {
      await sendMessage.mutateAsync({
        ...formData,
        messageContents: useSignature
          ? `${formData.messageContents} - ${signature}`
          : formData.messageContents,
        scheduled: schedule,
      });

      addNotification({
        message: 'Message sent successfully',
        type: 'success',
      });
      // @ts-expect-error - HTML dialog method
      document.getElementById('sendMessageModal')?.close();

      setStep(1);
      setSelectedIds([]);
      setFormData({
        recipientType: 'teamMember',
        recipientExternalIds: [],
        messageContents: '',
        messageFormat: 'sms',
        emailSubject: '',
        orderReference: undefined,
        scheduled: false,
        sendOnDate: undefined,
        multipleRecipients: false,
      });
    } catch (e) {
      setError('Error sending message. Please try again.');
      addNotification({
        message: 'Error sending message. Please try again.',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedTeamMembers = useMemo(
    () =>
      teamMembers.filter((member) => {
        return selectedIds.includes(member.externalId as string);
      }),
    [selectedIds, teamMembers]
  );

  const availableTypes = useMemo(() => {
    const types = new Set<string>();
    selectedTeamMembers.forEach(({ mobile, email }) => {
      if (mobile) types.add('sms'), types.add('whatsapp');
      if (email) types.add('email');
    });
    return Array.from(types);
  }, [selectedTeamMembers]);

  const charLimit =
    formData.messageFormat === 'sms'
      ? 160
      : formData.messageFormat === 'whatsapp'
      ? 500
      : Infinity;

  const handleNextStep = () => setStep((prev) => prev + 1);
  const handlePrevStep = () => setStep((prev) => prev - 1);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-semibold">Send New Message</h2>
      {error && <p className="text-red-500">{error}</p>}

      {step === 1 && (
        <div className="flex flex-col gap-4">
          <label className="font-medium">Select Recipients:</label>
          <div className="flex flex-col gap-2">
            {teamMembers.map(({ externalId, name, role }) => (
              <label key={externalId} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(externalId as string)}
                  disabled={
                    !!currentTeamMemberId && externalId === currentTeamMemberId
                  }
                  onChange={() => handleToggleRecipient(externalId as string)}
                />
                {name} {role && `- ${role}`}
              </label>
            ))}
          </div>
          <button
            className="btn btn-primary mt-4"
            onClick={handleNextStep}
            disabled={!selectedIds.length}
          >
            Next
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-4">
          <label className="font-medium">Message Type:</label>
          <div className="flex gap-4">
            {contactMethods.map((type) => (
              <label key={type} className="flex items-center gap-2">
                <input
                  type="radio"
                  value={type}
                  checked={formData.messageFormat === type}
                  disabled={!availableTypes.includes(type)}
                  onChange={() =>
                    setFormData({ ...formData, messageFormat: type })
                  }
                />
                {type.toUpperCase()}
              </label>
            ))}
          </div>

          {formData.messageFormat === 'email' && (
            <input
              className="input input-bordered"
              type="text"
              placeholder="Email Subject"
              value={formData.emailSubject}
              onChange={(e) =>
                setFormData({ ...formData, emailSubject: e.target.value })
              }
            />
          )}

          <textarea
            className="textarea textarea-bordered"
            placeholder="Message content"
            value={formData.messageContents}
            onChange={(e) =>
              setFormData({ ...formData, messageContents: e.target.value })
            }
            maxLength={charLimit}
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={useSignature}
              onChange={() => setUseSignature(!useSignature)}
            />
            Include signature ({signature})
          </label>

          <p className="text-sm text-gray-500">
            {charLimit -
              formData.messageContents.length -
              (useSignature ? signature.length + 3 : 0)}{' '}
            characters remaining
          </p>

          <div className="flex justify-between">
            <button className="btn" onClick={handlePrevStep}>
              Back
            </button>
            <button
              className="btn btn-primary"
              onClick={handleNextStep}
              disabled={!formData.messageContents}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col gap-4">
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
              {formData.messageContents}
              {useSignature && ` - ${userSignature}`}
            </p>
          </div>

          <div className="border rounded-lg shadow-md p-4">
            <label className="font-medium">Sending to:</label>
            <ul className="list-disc pl-5">
              {selectedTeamMembers.map(({ name, role, externalId }) => (
                <li key={externalId}>
                  {name} - {role}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-between">
            <button className="btn" onClick={handlePrevStep}>
              Back
            </button>
            <div className="flex gap-4">
              <button
                onClick={() => handleSend(false)}
                className="btn btn-primary"
              >
                {isSubmitting ? (
                  <span className="loading loading-spinner loading-md"></span>
                ) : (
                  'Send now'
                )}
              </button>
              <button
                onClick={() => handleSend(true)}
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
