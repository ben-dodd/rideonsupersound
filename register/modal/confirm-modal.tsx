import Modal from "@/components/modal";
import { useAtom } from "jotai";
import { confirmModalAtom } from "@/lib/atoms";
import CloseButton from "@/components/button/close-button";

export default function ConfirmModal() {
  const [confirmModal, setConfirmModal] = useAtom(confirmModalAtom);
  function closeModal() {
    setConfirmModal({ ...confirmModal, open: false });
    setTimeout(() => setConfirmModal({ open: false }), 200);
  }
  return (
    <Modal open={confirmModal?.open} onClose={closeModal}>
      <CloseButton closeFunction={closeModal} />
      <div className="dialog-action__title">
        {confirmModal?.title || "CONFIRM"}
      </div>
      <div className="dialog-action__body mb-6">
        {confirmModal?.styledMessage ||
          confirmModal?.message ||
          "Are you sure?"}
      </div>
      <div className="dialog__footer--actions-center">
        <button
          className="dialog__footer-buttons--cancel w-1/2"
          onClick={closeModal}
        >
          {confirmModal?.noText || "CANCEL"}
        </button>
        {confirmModal?.secondAction && (
          <button
            className="dialog__footer-buttons--ok w-1/2"
            onClick={() => {
              if (confirmModal?.secondAction) confirmModal.secondAction();
              closeModal();
            }}
          >
            {confirmModal?.secondText || "ALT ACTION"}
          </button>
        )}
        <button
          className="dialog__footer-buttons--ok w-1/2"
          onClick={() => {
            if (confirmModal?.action) confirmModal?.action();
            closeModal();
          }}
        >
          {confirmModal?.yesText || "CONFIRM"}
        </button>
      </div>
    </Modal>
  );
}
