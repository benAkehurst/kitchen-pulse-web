import { Customer, Order } from '@/types/Models';
import Modal from '../UI/Modal';
import SendMessageModal from '../Forms/SendMessageModal';

interface SendMessageWrapperProps {
  customers: Customer[];
  orders: Order[];
}

export default function SendMessageWrapper({
  customers,
  orders,
}: SendMessageWrapperProps) {
  return (
    <>
      <button
        className="btn btn-primary"
        onClick={() =>
          // @ts-expect-error - HTML dialog method
          document.getElementById('sendMessageModal')!.showModal()
        }
      >
        Send a new message
      </button>

      <Modal customId="sendMessageModal">
        <SendMessageModal customers={customers} orders={orders} />
      </Modal>
    </>
  );
}
