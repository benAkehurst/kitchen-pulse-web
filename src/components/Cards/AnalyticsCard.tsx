import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { MessageCircle, ShoppingCart } from 'lucide-react';

// Define types for API response
interface Customer {
  name: string;
  company?: string;
  lastOrder?: string;
  totalSpent?: number;
  createdAt?: string;
}

interface MessageStats {
  messagesLastWeek: number;
  messagesLastDay: number;
  smsStats: {
    topNumbers: { number: string; count: number }[];
    totalMessages: number;
  };
}

interface OrdersStats {
  ordersLastWeek: number;
  ordersLastDay: number;
}

interface AnalyticsData {
  customers: {
    inactiveCustomers: Customer[];
    highValueCustomers: Customer[];
    recentCustomers: Customer[];
    newCustomers: Customer[];
  };
  messages: MessageStats;
  orders: OrdersStats;
}

interface AnalyticsCardProps {
  data: AnalyticsData;
}

const COLORS = ['#3b82f6', '#facc15', '#ef4444'];

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ data }) => {
  const { customers, messages, orders } = data;

  // Format message stats for Pie Chart
  const smsChartData = messages.smsStats.topNumbers.map((num) => ({
    name: num.number,
    value: num.count,
  }));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Orders Card */}
      <div className="bg-base-100 shadow-md p-5 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Orders</h3>
          <ShoppingCart className="text-green-500 w-6 h-6" />
        </div>
        <p className="text-3xl font-bold">{orders.ordersLastWeek}</p>
        <p className="text-sm text-gray-500">Orders in the last week</p>
        <p className="text-lg font-semibold mt-2">{orders.ordersLastDay}</p>
        <p className="text-sm text-gray-500">Orders in the last 24 hours</p>
      </div>

      {/* Messages Card */}
      <div className="bg-base-100 shadow-md p-5 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Messages</h3>
          <MessageCircle className="text-purple-500 w-6 h-6" />
        </div>
        <p className="text-3xl font-bold">{messages.messagesLastWeek}</p>
        <p className="text-sm text-gray-500">Messages sent in the last week</p>
        <p className="text-lg font-semibold mt-2">{messages.messagesLastDay}</p>
        <p className="text-sm text-gray-500">Messages sent today</p>
      </div>

      {/* SMS Pie Chart */}
      <div className="bg-base-100 shadow-md p-5 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-2">Top SMS Numbers</h3>
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie data={smsChartData} dataKey="value" outerRadius={70} label>
              {smsChartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* High Value Customers Bar Chart */}
      <div className="bg-base-100 shadow-md p-5 rounded-lg border border-gray-200 col-span-2">
        <h3 className="text-lg font-semibold mb-2">High Value Customers</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={customers.highValueCustomers}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="totalSpent" fill="#6366f1" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Customers */}
      <div className="bg-base-100 shadow-md p-5 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-2">Recent Customers</h3>
        <ul className="space-y-2">
          {customers.recentCustomers.map((customer, index) => (
            <li key={index} className="text-sm">
              <span className="font-semibold">{customer.name}</span> -{' '}
              {customer.company || 'N/A'}
              <p className="text-xs text-gray-500">
                {new Date(customer.lastOrder!).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* New Customers */}
      <div className="bg-base-100 shadow-md p-5 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-2">New Customers</h3>
        <ul className="space-y-2">
          {customers.newCustomers.map((customer, index) => (
            <li key={index} className="text-sm">
              <span className="font-semibold">{customer.name}</span> -{' '}
              {customer.company || 'N/A'}
              <p className="text-xs text-gray-500">
                {new Date(customer.createdAt!).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AnalyticsCard;
