import { Customer } from '@/types/Models';
import Modal from '../UI/Modal';
import UpdateCustomerForm from '../Forms/UpdateCustomerForm';

interface UpdateCustomerWrapper {
  handleUpdatedCustomer: (updatedCustomer: Customer) => void;
  externalId: string;
}

export default function UpdateCustomerWrapper({
  handleUpdatedCustomer,
  externalId,
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
        <UpdateCustomerForm
          onUpdateCustomer={handleUpdatedCustomer}
          externalId={externalId!}
        />
      </Modal>
    </div>
  );
}
