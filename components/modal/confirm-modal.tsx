import Modal from "@/components/modal";
import { useAtom } from "jotai";
import { confirmModalAtom } from "@/lib/atoms";

import CloseIcon from "@material-ui/icons/Close";

export default function ConfirmModal() {
  const [confirmModal, setConfirmModal] = useAtom(confirmModalAtom);
  return (
    <Modal
      open={confirmModal?.open}
      onClose={() => setConfirmModal({ open: false })}
    >
      <div className="flex justify-end">
        <button
          className="p-2 text-black hover:text-white outline-none border-none"
          onClick={() => setConfirmModal({ open: false })}
        >
          <CloseIcon />
        </button>
      </div>
      <div className="dialog-action__title">
        {confirmModal?.title || "CONFIRM"}
      </div>
      <div className="dialog-action__body mb-6">
        {confirmModal?.message || "Are you sure?"}
      </div>
      <div className="dialog__footer--actions-center">
        <button
          className="dialog__footer-buttons--cancel w-1/2"
          onClick={() => setConfirmModal({ open: false })}
        >
          {confirmModal?.noText || "CANCEL"}
        </button>
        <button
          className="dialog__footer-buttons--ok w-1/2"
          onClick={() => (confirmModal?.action ? confirmModal?.action() : null)}
        >
          {confirmModal?.yesText || "CONFIRM"}
        </button>
      </div>
    </Modal>
  );
}
