import CloseIcon from '@mui/icons-material/Close'
import { MouseEventHandler } from 'react'
interface CloseButtonProps {
  closeFunction: MouseEventHandler<HTMLButtonElement>
}

export default function CloseButton({ closeFunction }: CloseButtonProps) {
  return (
    <button className="items-end modal__close-button" onClick={closeFunction}>
      <CloseIcon />
    </button>
  )
}
