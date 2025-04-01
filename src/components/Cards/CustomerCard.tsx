'use client';

import Link from 'next/link';
import {
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  XCircle,
  Smartphone,
} from 'lucide-react';
import { Customer } from '@/types/Models';

export default function CustomerCard({
  name,
  company,
  email,
  mobile,
  address,
  contactable,
  firstName,
  lastName,
  title,
  accountName,
  phone,
  source,
  externalId,
}: Customer) {
  return source === 'customerUpload' ? (
    <Link
      href={`/customers/${externalId}`}
      className="group block overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-transform my-4 hover:shadow-md"
    >
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">
            {firstName} {lastName}
          </h2>
          <span
            className={`inline-flex items-center gap-1 text-sm font-medium ${
              contactable ? 'text-green-600' : 'text-red-500'
            }`}
          >
            {contactable ? <CheckCircle size={16} /> : <XCircle size={16} />}
            {contactable ? 'Contactable' : 'Not Contactable'}
          </span>
        </div>

        <p className="text-gray-600">{accountName}</p>
        <p className="text-gray-600">{title}</p>

        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Mail size={16} /> <span>{email || 'No email provided'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Smartphone size={16} /> <span>{mobile || 'No phone number'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={16} /> <span>{phone || 'No phone number'}</span>
          </div>
        </div>
      </div>
    </Link>
  ) : (
    <Link
      href={`/customers/${externalId}`}
      className="group block overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-transform my-4 hover:shadow-md"
    >
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">{name}</h2>
          <span
            className={`inline-flex items-center gap-1 text-sm font-medium ${
              contactable ? 'text-green-600' : 'text-red-500'
            }`}
          >
            {contactable ? <CheckCircle size={16} /> : <XCircle size={16} />}
            {contactable ? 'Contactable' : 'Not Contactable'}
          </span>
        </div>

        <p className="text-gray-600">{company}</p>

        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Mail size={16} /> <span>{email || 'No email provided'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={16} /> <span>{mobile || 'No phone number'}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} />{' '}
            <span>{address || 'No address available'}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
