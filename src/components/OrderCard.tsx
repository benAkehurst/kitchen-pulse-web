'use client';

import Link from 'next/link';
import {
  Calendar,
  Package,
  ShoppingCart,
  PoundSterling,
  MapPin,
} from 'lucide-react';
import { format } from 'date-fns';
import { Order } from '@/types/Models';

export default function OrderCard({
  orderId,
  orderDate,
  orderItems,
  quantity,
  totalPrice,
  associatedCustomer,
  externalId,
}: Order) {
  return (
    <Link
      href={`/orders/${externalId}`}
      className="group block overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-transform my-4 hover:shadow-md"
    >
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">{orderId}</h2>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-gray-600">
            <Calendar size={16} />
            {format(new Date(orderDate), 'MMM d, yyyy')}
          </span>
        </div>

        <p className="text-gray-600">{associatedCustomer!.company}</p>

        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Package size={16} /> <span>{orderItems}</span>
          </div>

          <div className="flex items-center gap-2">
            <ShoppingCart size={16} /> <span>{quantity} item(s)</span>
          </div>

          <div className="flex items-center gap-2">
            <PoundSterling size={16} /> <span>£{totalPrice}</span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin size={16} /> <span>{associatedCustomer!.address}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
