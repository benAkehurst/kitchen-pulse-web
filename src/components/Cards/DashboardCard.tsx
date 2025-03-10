'use client';

import Link from 'next/link';

interface DashboardCardProps {
  cardName: string;
  onwardLink: string;
  itemCount?: number;
}

export default function DashboardCard({
  cardName,
  onwardLink,
  itemCount,
}: DashboardCardProps) {
  return (
    <Link href={`/${onwardLink}`} className="p-4 bg-white shadow rounded block">
      <p>{cardName}</p>
      {itemCount && <span>{itemCount}</span>}
    </Link>
  );
}
