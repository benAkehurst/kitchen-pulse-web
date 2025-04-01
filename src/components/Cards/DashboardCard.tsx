'use client';

import Link from 'next/link';
import { Users, ShoppingCart, MessageSquare, BookUser } from 'lucide-react';

interface DashboardCardProps {
  cardName: string;
  onwardLink: string;
  itemCount?: number;
}

const iconMap = {
  customers: <Users className="w-6 h-6 text-blue-500" />,
  orders: <ShoppingCart className="w-6 h-6 text-green-500" />,
  messages: <MessageSquare className="w-6 h-6 text-purple-500" />,
};

export default function DashboardCard({
  cardName,
  onwardLink,
  itemCount,
}: DashboardCardProps) {
  return (
    <Link
      href={`/${onwardLink}`}
      className="flex items-center justify-between p-5 bg-white shadow-lg rounded-2xl border border-gray-200 transition-transform transform hover:scale-105 hover:shadow-xl"
    >
      <div className="flex items-center gap-3">
        {iconMap[cardName.toLowerCase() as keyof typeof iconMap] || (
          <BookUser className="w-6 h-6 text-yellow-500" />
        )}
        <p className="text-lg font-semibold text-gray-700">{cardName}</p>
      </div>
      {itemCount !== undefined && (
        <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
          {itemCount}
        </span>
      )}
    </Link>
  );
}
