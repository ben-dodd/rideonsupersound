import CircularProgress from '@mui/material/CircularProgress'
import CloseButton from 'components/button/close-button'
import ModalBase from 'components/modal/base'
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
  children: JSX.Element
}

// BUG widths on deployed version are two large

export default function Modal({
  open,
  closeFunction,
  disableBackdropClick,
  title,
  buttons,
  loading = false,
  width,
  children,
}: ModalProps) {
  return (
    <ModalBase
      open={open}
      onClose={closeFunction}
      disableBackdropClick={disableBackdropClick}
      width={width}
    >
      <div className="top-0 sticky">
        {closeFunction && <CloseButton closeFunction={closeFunction} />}
        {title && <div className="modal__title">{title}</div>}
      </div>
      <div className="modal__body">
        {loading ? (
          <div className="loading-screen">
            <div className="loading-icon" />
          </div>
        ) : (
          children
        )}
      </div>
      {buttons && (
        <div className={`modal__button-div`}>
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
            )
          )}
        </div>
      )}
    </ModalBase>
  )
}
