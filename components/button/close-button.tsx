import CloseIcon from '@mui/icons-material/Close'
import { MouseEventHandler } from 'react'

export default function CloseButton({ closeFunction }: { closeFunction: MouseEventHandler<HTMLButtonElement> }) {
  return (
    <button className={`items-end modal__close-button`} onClick={closeFunction}>
      <CloseIcon />
    </button>
  )
}
