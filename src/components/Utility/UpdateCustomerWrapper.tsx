import Modal from '../UI/Modal';
import UpdateCustomerForm from '../Forms/UpdateCustomerForm';
import { Customer } from '@/types/Models';

interface UpdateCustomerWrapper {
  singleCustomer: Customer;
}

export default function UpdateCustomerWrapper({
  singleCustomer,
}: UpdateCustomerWrapper) {
  return (
    <div className="mr-4">
      <button
        className="btn btn-primary"
        onClick={() =>
          // @ts-expect-error - HTML dialog method
          document.getElementById('updateCustomerModal')!.showModal()
        }
      >
        Update customer details
      </button>

      <Modal customId="updateCustomerModal">
        <UpdateCustomerForm singleCustomer={singleCustomer!} />
      </Modal>
    </div>
  );
}
