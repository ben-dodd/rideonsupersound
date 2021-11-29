// Packages
import { useAtom } from "jotai";

// DB
import { confirmModalAtom } from "@/lib/atoms";

// Components
import Modal from "@/components/_components/container/modal";

// Types
import { ModalButton } from "@/lib/types";

export default function ConfirmModal() {
  // Atoms
  const [confirmModal, setConfirmModal] = useAtom(confirmModalAtom);

  // Functions
  function closeModal() {
    setConfirmModal({ ...confirmModal, open: false });
    setTimeout(() => setConfirmModal({ open: false }), 200);
  }

  // Buttons
  const buttons: ModalButton[] = [
    {
      text: confirmModal?.noText || "CANCEL",
      onClick: closeModal,
      type: "cancel",
    },
    {
      text: confirmModal?.yesText || "OK",
      onClick: () => {
        confirmModal?.action();
        closeModal();
      },
      type: "ok",
    },
  ];
  return (
    <Modal
      open={confirmModal?.open}
      closeFunction={closeModal}
      title={confirmModal?.title || "CONFIRM"}
      buttons={buttons}
    >
      {confirmModal?.styledMessage || confirmModal?.message || "Are you sure?"}
    </Modal>
  );
}

// {
//   text: confirmModal?.altText || "ALT ACTION",
//   onClick: confirmModal?.altAction,
//   type: "alt",
//   hidden: Boolean(confirmModal?.altAction),
// },
