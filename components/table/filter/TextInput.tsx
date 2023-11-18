import React, { useState } from 'react'

interface TextInputType {
  updateFilter: (val: string) => void
}

const TextInput = ({ updateFilter }: TextInputType) => {
  const [value, setValue] = useState('')
  const handleChange = (e: any) => {
    setValue(e.target.value)
    updateFilter(e.target.value)
  }
  return (
    <input
      type="text"
      value={value}
      onChange={handleChange}
      className="w-full border border-gray-400 hover:bg-gray-100 rounded-md mb-2"
    />
  )
}

export default TextInput
