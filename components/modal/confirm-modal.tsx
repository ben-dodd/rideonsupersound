import Modal from 'components/modal'
import { confirmModalAtom } from 'lib/atoms'
import { ModalButton } from 'lib/types'
import { useAtom } from 'jotai'

export default function ConfirmModal() {
  const [confirmModal, setConfirmModal] = useAtom(confirmModalAtom)

  // Functions
  function closeModal() {
    setConfirmModal({ ...confirmModal, open: false })
    setTimeout(() => setConfirmModal({ open: false }), 200)
  }

  // Buttons
  const buttons: ModalButton[] = [
    {
      text: confirmModal?.noText || 'CANCEL',
      onClick: closeModal,
      type: 'cancel',
    },
    {
      text: confirmModal?.yesText || 'OK',
      onClick: () => {
        confirmModal?.action()
        closeModal()
      },
      type: 'ok',
    },
  ]
  return (
    <Modal
      open={confirmModal?.open}
      closeFunction={closeModal}
      title={confirmModal?.title || 'CONFIRM'}
      buttons={buttons}
    >
      {confirmModal?.styledMessage || confirmModal?.message || 'Are you sure?'}
    </Modal>
  )
}

// {
//   text: confirmModal?.altText || "ALT ACTION",
//   onClick: confirmModal?.altAction,
//   type: "alt",
//   hidden: Boolean(confirmModal?.altAction),
// },
