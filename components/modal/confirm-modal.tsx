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
  const altButton = {
    text: confirmModal?.altText || 'ALT ACTION',
    onClick: () => {
      confirmModal?.altAction && confirmModal.altAction()
      closeConfirm()
    },
    type: 'alt1',
    hidden: Boolean(confirmModal?.altAction),
  }
  const buttons: ModalButton[] = confirmModal?.yesButtonOnly
    ? [yesButton]
    : confirmModal?.altAction
    ? [altButton, yesButton]
    : [noButton, yesButton]
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
