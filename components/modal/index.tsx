import CloseButton from 'components/button/close-button'
import ModalBase from 'components/modal/base'
import CircularProgress from '@mui/material/CircularProgress'
import { CSVLink } from 'react-csv'

import { ModalButton } from 'lib/types'
import { MouseEventHandler } from 'react'

interface ModalProps {
  open: boolean
  closeFunction: MouseEventHandler<HTMLButtonElement>
  disableBackdropClick?: boolean
  title?: string
  buttons?: ModalButton[]
  loading?: boolean
  width?: string
  // modalTitleClass?: string
  children: JSX.Element
}

export default function Modal({
  open,
  closeFunction,
  disableBackdropClick,
  title,
  buttons,
  loading = false,
  width,
  // modalTitleClass = '',
  children,
}: ModalProps) {
  return (
    <ModalBase open={open} onClose={closeFunction} disableBackdropClick={disableBackdropClick} width={width}>
      <div className={`modal__title-div`}>
        <div />
        {title && <div className="modal__title">{title}</div>}
        {closeFunction ? <CloseButton closeFunction={closeFunction} /> : <div />}
      </div>
      <div className="modal__body">
        {loading ? (
          <div className="loading-screen h-dialogsm">
            <div className="loading-icon" />
          </div>
        ) : (
          children
        )}
      </div>
      {buttons && (
        <div className={`grid gap-4 ${buttons?.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} p-4 pt-6`}>
          {buttons.map((button: ModalButton, i: number) =>
            button?.data && !button?.disabled ? (
              <CSVLink
                key={i}
                className={`modal__button--${button?.type}`}
                data={button?.data}
                headers={button?.headers}
                filename={button?.fileName}
                onClick={() => button?.onClick()}
              >
                {button?.text}
              </CSVLink>
            ) : (
              <button
                key={i}
                className={`modal__button--${button?.type}`}
                onClick={() => button?.onClick()}
                disabled={button?.disabled}
              >
                {button?.loading ? (
                  <span className="pr-4">
                    <CircularProgress color="inherit" thickness={5} size={18} />
                  </span>
                ) : (
                  <span />
                )}
                {button?.text}
              </button>
            ),
          )}
        </div>
      )}
    </ModalBase>
  )
}
