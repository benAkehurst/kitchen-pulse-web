'use client';

import { useEffect, useState } from 'react';
import { useCustomer } from '@/hooks/useCustomer';
import { Customer } from '@/types/Models';

interface CustomerData {
  customers: Customer[] | null;
}

export default function CustomersPage() {
  const { getCustomers } = useCustomer();

  const [data, setData] = useState<CustomerData>({
    customers: [],
  });
  console.log('data: ', data);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customers] = await Promise.all([getCustomers()]);
        setData({ customers });
      } catch (error) {
        console.error('Error fetching customer data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (data.customers && data.customers!.length === 0) {
    return <div>No customers</div>;
  }

  return (
    <div>
      <h1>Customers</h1>
    </div>
  );
}
