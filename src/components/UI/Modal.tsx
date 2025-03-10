import { ReactElement } from 'react';

interface ModalProps {
  children: ReactElement;
  customId: string;
}

export default function Modal({ children, customId }: ModalProps) {
  return (
    <dialog id={customId} className="modal">
      <div className="modal-box">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        {children}
      </div>
    </dialog>
  );
}
