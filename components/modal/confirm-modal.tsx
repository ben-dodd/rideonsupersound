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
  const noButton = {
    text: confirmModal?.noText || 'CANCEL',
    onClick: closeModal,
    type: 'cancel',
  }
  const yesButton = {
    text: confirmModal?.yesText || 'OK',
    onClick: () => {
      confirmModal?.action && confirmModal.action()
      closeConfirm()
    },
    type: 'ok',
  }
  const buttons: ModalButton[] = confirmModal?.yesButtonOnly ? [yesButton] : [noButton, yesButton]
  return (
    <Modal
      open={confirmModal?.open}
      closeFunction={closeConfirm}
      title={confirmModal?.title || 'CONFIRM'}
      buttons={confirmModal?.buttons || buttons}
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
