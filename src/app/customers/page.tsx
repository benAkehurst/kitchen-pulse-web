'use client';

import { useEffect, useState } from 'react';
import { useCustomer } from '@/hooks/useCustomer';
import { Customer } from '@/types/Models';
import CustomerCard from '@/components/CustomerCard';
import Modal from '@/components/Modal';
import NewCustomerForm from '@/components/NewCustomerForm';

export default function CustomersPage() {
  const { getCustomers } = useCustomer();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customerList = await getCustomers();
        setCustomers(customerList);
      } catch (error) {
        console.error('Error fetching customer data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddCustomer = (newCustomer: Customer) => {
    setCustomers((prevCustomers) => [newCustomer, ...prevCustomers]);
  };

  if (loading) return <div>Loading...</div>;
  if (customers.length === 0) return <div>No customers</div>;

  return (
    <div>
      <div className="flex flex-row items-center justify-between mb-4">
        <h1 className="text-3xl mb-4">Customers</h1>

        <button
          className="btn"
          onClick={() =>
            // @ts-expect-error - HTML dialog method
            document.getElementById('newCustomerModal')!.showModal()
          }
        >
          Add new customer
        </button>

        <Modal customId="newCustomerModal">
          <NewCustomerForm onAddCustomer={handleAddCustomer} />
        </Modal>
      </div>

      {/* TODO: Add a search input to filter the list client side by searching again name or company */}
      {customers.map((customer) => (
        <CustomerCard key={customer.externalId} {...customer} />
      ))}
    </div>
  );
}
