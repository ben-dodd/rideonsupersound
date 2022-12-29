import Modal from 'components/modal'
import { ModalButton } from 'lib/types'
import { useAppStore } from 'lib/store'

export default function ConfirmModal() {
  const { confirmModal, closeConfirm } = useAppStore()

  // Functions
  function closeModal() {
    closeConfirm()
    setTimeout(closeConfirm, 200)
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
        closeConfirm()
      },
      type: 'ok',
    },
  ]
  return (
    <Modal
      open={confirmModal?.open}
      closeFunction={closeConfirm}
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
