import CircularProgress from '@mui/material/CircularProgress'

const ActionButton = ({ button }) => {
  const { icon, text, onClick, type = 'ok', loading, disabled } = button
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
