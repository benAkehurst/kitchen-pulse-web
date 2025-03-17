'use client';

import {
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  Send,
} from 'lucide-react';
import Link from 'next/link';
import { Message } from '@/types/Models';
import { format } from 'date-fns';

interface MessageCardProps {
  message: Message;
}

export default function MessageCard({ message }: MessageCardProps) {
  const {
    externalId,
    messageContents,
    messageFormat,
    scheduled,
    messageSent,
    sendOnDate,
    associatedCustomer,
    createdAt,
  } = message;

  return (
    <Link
      href={`/messages/${externalId}`}
      className="group block overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-transform my-4 hover:shadow-md"
    >
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          {associatedCustomer && (
            <h2 className="text-lg font-semibold text-gray-800">
              {associatedCustomer.name}
            </h2>
          )}
          <span
            className={`inline-flex items-center gap-1 text-sm font-medium ${
              messageSent ? 'text-green-600' : 'text-red-500'
            }`}
          >
            {messageSent ? <CheckCircle size={16} /> : <XCircle size={16} />}
            {messageSent ? 'Sent' : 'Not Sent'}
          </span>
        </div>

        {associatedCustomer && (
          <p className="text-gray-600">{associatedCustomer.company}</p>
        )}

        <p className="text-gray-800">&quot;{messageContents}&quot;</p>

        <div className="space-y-2 text-sm text-gray-500">
          {createdAt && (
            <div className="flex items-center gap-2">
              Message created on {format(createdAt, 'PPPpp')}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Send size={16} />
          <span className="capitalize">{messageFormat}</span>
          {scheduled && sendOnDate && (
            <span className="flex items-center gap-2">
              <Calendar size={16} />
              {new Date(sendOnDate).toLocaleString()}
            </span>
          )}
        </div>

        <div className="space-y-2 text-sm text-gray-500">
          {associatedCustomer && (
            <div className="flex items-center gap-2">
              <Mail size={16} /> {associatedCustomer.email}
            </div>
          )}
          {associatedCustomer && (
            <div className="flex items-center gap-2">
              <Phone size={16} /> {associatedCustomer.telephone}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
