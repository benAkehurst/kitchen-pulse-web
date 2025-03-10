'use client';

import { useState } from 'react';
import { EditMessage } from '@/types/Models';
import { useMessages } from '@/hooks/useMessage';

interface EditMessageFormProps {
  externalId: string;
  initialData: EditMessage;
}

export default function EditMessageForm({
  externalId,
  initialData,
}: EditMessageFormProps) {
  const { editMessage } = useMessages();

  const [formData, setFormData] = useState<EditMessage>({
    messageContents: initialData.messageContents,
    sendOnDate: new Date(initialData.sendOnDate),
    scheduled: initialData.scheduled,
    repeat: initialData.repeat,
    repeatUntil: new Date(initialData.repeatUntil || Date.now()),
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    // @ts-expect-error: allow the checked here
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleDateChange = (date: Date) => {
    setFormData((prev) => ({ ...prev, sendOnDate: date }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await editMessage(externalId, formData);
      setSuccess('Message updated successfully!');

      // Close modal after 3 seconds
      setTimeout(() => {
        // @ts-expect-error - HTML dialog method
        document.getElementById('updateOrderModal')?.close();
      }, 3000);
    } catch {
      setError('Error updating message. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold">Edit Message</h2>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      <textarea
        name="messageContents"
        value={formData.messageContents}
        onChange={handleChange}
        placeholder="Message Contents"
        className="textarea textarea-bordered w-full"
        required
      />

      <div className="form-control">
        <label className="label">Send On Date</label>
        <input
          type="date"
          value={formData.sendOnDate.toISOString().split('T')[0]}
          onChange={(e) => handleDateChange(new Date(e.target.value))}
          className="input input-bordered w-full"
          required
        />
      </div>

      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="scheduled"
          checked={formData.scheduled}
          onChange={handleChange}
        />
        <span>Scheduled</span>
      </label>

      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="repeat"
          checked={formData.repeat}
          onChange={handleChange}
        />
        <span>Repeat</span>
      </label>

      {formData.repeat && (
        <div className="form-control">
          <label className="label">Repeat Until</label>
          <input
            type="date"
            value={formData.repeatUntil.toISOString().split('T')[0]}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                repeatUntil: new Date(e.target.value),
              }))
            }
            className="input input-bordered w-full"
          />
        </div>
      )}

      <button type="submit" className="btn btn-primary w-full">
        Update Message
      </button>
    </form>
  );
}
