import { useEffect, useState } from 'react'

const ButtonGroup = ({ items, value, onChange, className = '' }) => {
  const [selected, setSelected] = useState(value)
  const handleClickSelect = (item) => {
    setSelected(item?.key)
    onChange(item)
  }
  useEffect(() => setSelected(value), [value])
  return (
    <div className={`rounded-lg border ${className} shadow-md`}>
      <div className="flex w-full h-full">
        {items?.map((item) => (
          <button
            key={item?.key}
            className={`p-2 flex-grow text-center cursor-pointer ${
              selected === item?.key ? 'bg-green-200 hover:bg-green-300' : 'hover:bg-green-100'
            }`}
            onClick={() => handleClickSelect(item)}
          >
            {item?.label || item?.key}
          </button>
        ))}
      </div>
    </div>
  )
}

export default ButtonGroup
