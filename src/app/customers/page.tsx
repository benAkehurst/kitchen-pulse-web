'use client';

import { useState } from 'react';
import { useCustomer } from '@/hooks/useCustomer';
import { Customer } from '@/types/Models';
import CustomerCard from '@/components/Cards/CustomerCard';
import Modal from '@/components/UI/Modal';
import NewCustomerForm from '@/components/Forms/NewCustomerForm';
import LoadingOverlay from '@/components/UI/LoadingOverlay';
import { useNotifications } from '@/context/notificationsContext';
import UploadCustomersForm from '@/components/Forms/UploadCustomersForm';

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { addNotification } = useNotifications();

  const {
    customers,
    customersQuery: { isLoading: customersLoading, isError: customersError },
  } = useCustomer();

  const filteredCustomers =
    customers?.filter((customer: Customer) => {
      const searchFields = [
        customer.company,
        customer.firstName,
        customer.lastName,
        customer.name,
        customer.accountName,
        customer.title,
      ];
      return searchFields.some((field) =>
        field?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }) || [];

  const addCustomer = (
    <>
      <button
        className="btn btn-secondary"
        onClick={() =>
          // @ts-expect-error - HTML dialog method
          document.getElementById('newCustomerModal')!.showModal()
        }
      >
        Add new customer
      </button>

      <Modal customId="newCustomerModal">
        <NewCustomerForm />
      </Modal>
    </>
  );

  const uploadCustomers = (
    <>
      <button
        className="btn btn-primary mr-4"
        onClick={() =>
          // @ts-expect-error - HTML dialog method
          document.getElementById('uploadCustomers')!.showModal()
        }
      >
        Upload customers
      </button>

      <Modal customId="uploadCustomers">
        <UploadCustomersForm />
      </Modal>
    </>
  );

  if (customersLoading) return <LoadingOverlay />;
  if (customersError) {
    addNotification({
      message: 'Error fetching customers',
      type: 'error',
    });
  }

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

        <div className="flex">
          {uploadCustomers}
          {addCustomer}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by Company, Name, Account or Title"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((customer: Customer) => (
          <CustomerCard key={customer.externalId} {...customer} />
        ))}
      </div>
    </div>
  );
}
