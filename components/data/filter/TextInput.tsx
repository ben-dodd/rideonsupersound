import React, { useEffect, useState } from 'react'

interface TextInputType {
  initialValue?: string | number
  updateFilter: (val: string | number) => void
  debounce?: number
}

const TextInput = ({
  initialValue = '',
  updateFilter,
  debounce = 500,
  ...props
}: TextInputType & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) => {
  const [value, setValue] = useState(initialValue)
  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      updateFilter(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

  return <input {...props} value={value} onChange={(e) => setValue(e.target.value)} className="filter-input" />
}

export default TextInput
