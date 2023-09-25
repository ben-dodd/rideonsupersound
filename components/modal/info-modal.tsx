import { useAppStore } from 'lib/store'
import ModalBase from './base'
import CloseButton from 'components/button/close-button'

export default function InfoModal() {
  const { infoModal, closeInfo } = useAppStore()
  const { open = false, title, message, styledMessage } = infoModal || {}

  return (
    <ModalBase open={open} onClose={closeInfo} disableBackdropClick={false} width={'max-w-2xl'}>
      <div className={`info-modal__title-div`}>
        {title && <div className="modal__title">{title}</div>}
        {<CloseButton closeFunction={closeInfo} />}
      </div>
      <div className="info-modal__body">{styledMessage || message}</div>
    </ModalBase>
  )
}
