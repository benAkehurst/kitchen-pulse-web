'use client';

import { useEffect, useState } from 'react';
import { useCustomer } from '@/hooks/useCustomer';
import { Customer } from '@/types/Models';
import CustomerCard from '@/components/CustomerCard';
import Modal from '@/components/Modal';
import NewCustomerForm from '@/components/NewCustomerForm';

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
      <div className="flex flex-row items-center justify-between mb-4">
        <h1 className="text-3xl mb-4">Customers</h1>
        <button
          className="btn"
          onClick={() =>
            // @ts-expect-error - This is a html error
            document.getElementById('newCustomerModal')!.showModal()
          }
        >
          Add new customer
        </button>
        <Modal customId="newCustomerModal">
          <NewCustomerForm />
        </Modal>
      </div>
      {data.customers &&
        data.customers.map((customer: Customer) => {
          return (
            <CustomerCard
              key={customer.externalId}
              name={customer.name}
              company={customer.company}
              email={customer.email}
              telephone={customer.telephone}
              address={customer.address}
              contactable={customer.contactable}
              externalId={customer.externalId!}
            />
          );
        })}
    </div>
  );
}
