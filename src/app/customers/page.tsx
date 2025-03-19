'use client';

import { useEffect, useState } from 'react';
import { useCustomer } from '@/hooks/useCustomer';
import { Customer } from '@/types/Models';
import CustomerCard from '@/components/Cards/CustomerCard';
import Modal from '@/components/UI/Modal';
import NewCustomerForm from '@/components/Forms/NewCustomerForm';
import LoadingOverlay from '@/components/UI/LoadingOverlay';
import { useNotifications } from '@/context/notificationsContext';

export default function CustomersPage() {
  const { getCustomers } = useCustomer();
  const { addNotification } = useNotifications();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customerList = await getCustomers();
        setCustomers(customerList);
      } catch (error) {
        if (error) {
          addNotification({
            message: 'Error fetching customer data',
            type: 'error',
          });
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddCustomer = (newCustomer: Customer) => {
    setCustomers((prevCustomers) => [newCustomer, ...prevCustomers]);
  };

  const filteredCustomers = customers.filter((customer) => {
    const searchFields = [customer.company, customer.name];
    return searchFields.some((field) =>
      field?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const addCustomer = (
    <>
      <button
        className="btn btn-primary"
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
    </>
  );

  if (loading) return <LoadingOverlay />;

  if (customers.length === 0)
    return (
      <div className="flex flex-row items-center justify-between">
        No customers {addCustomer}
      </div>
    );

  return (
    <div>
      <div className="flex flex-row items-center justify-between mb-4">
        <h1 className="text-3xl mb-4">Customers</h1>

        {addCustomer}
      </div>

      {/* Filter Bar */}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by Company or Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered"
        />
      </div>

      {filteredCustomers.map((customer) => (
        <CustomerCard key={customer.externalId} {...customer} />
      ))}
    </div>
  );
}
