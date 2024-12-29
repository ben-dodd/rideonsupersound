import CircularProgress from '@mui/material/CircularProgress'
import { useEffect } from 'react'

const ActionButton = ({ button }) => {
  const { icon, text, onClick, type = 'ok', loading, disabled, useEnterKey } = button

  useEffect(() => {
    if (useEnterKey) {
      const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !disabled) {
          console.log('Enter key pressed') // Debugging
          onClick()
        }
      }

      // Attach keydown event to the document
      document.addEventListener('keydown', handleKeyDown)

      return () => {
        document.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [useEnterKey, onClick, disabled])

  return (
    <button className={`w-full modal__button--${type}`} disabled={disabled} onClick={onClick}>
      {loading ? (
        <span className="pr-4">
          <CircularProgress color="inherit" size={18} />
        </span>
      ) : (
        icon
      )}
      <div className="ml-2">{text}</div>
    </button>
  )
}

export default ActionButton
