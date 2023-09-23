import { useEffect, useState } from 'react'

const ButtonGroup = ({ items, value, onChange, className = '' }) => {
  const [selected, setSelected] = useState(value)
  const handleClickSelect = (item) => {
    setSelected(item?.key)
    onChange(item)
  }
  useEffect(() => setSelected(value), [value])
  return (
    <div className={`rounded-lg border ${className}`}>
      <div className="flex grow w-full h-full">
        {items?.map((item) => (
          <div
            key={item?.key}
            className={`p-2 cursor-pointer ${
              selected === item?.key ? 'bg-green-200 hover:bg-green-300' : 'hover:bg-green-100'
            }`}
            onClick={() => handleClickSelect(item)}
          >
            {item?.label || item?.key}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ButtonGroup
