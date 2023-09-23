const CheckBox = ({ value, onChange, inputLabel = null, disabled = false }) => {
  return (
    <div className="flex items-center">
      <input type="checkbox" className="cursor-pointer" checked={value} onChange={onChange} disabled={disabled} />
      {inputLabel && <div className="ml-2">{inputLabel}</div>}
    </div>
  )
}

export default CheckBox
