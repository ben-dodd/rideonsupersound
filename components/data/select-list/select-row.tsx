import React from 'react'

interface SelectRowType {
  text: string
  id: number
  isSelected: boolean
  onClick: (evt: any, id: number) => void
  dblClickCallback: (evt: any) => void
}

const SelectRow = ({ text, id, isSelected, onClick, dblClickCallback }: SelectRowType) => {
  return (
    <div
      onClick={(evt) => onClick(evt, id)}
      onDoubleClick={() => dblClickCallback(id)}
      className={`${isSelected ? 'bg-gray-300' : ''} cursor-default select-none py-1 px-2`}
    >
      {text}
    </div>
  )
}

export default SelectRow
