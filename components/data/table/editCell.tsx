import { ChangeEvent, useEffect, useState } from 'react'
type Option = {
  label: string
  value: string
}

export const EditCell = ({ getValue, row, column, table }) => {
  const initialValue = getValue()
  const columnMeta = column.columnDef.meta
  const tableMeta = table.options.meta
  const [value, setValue] = useState(initialValue)
  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])
  const onBlur = () => {
    tableMeta?.updateData(row.index, column.id, value)
  }
  const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setValue(e.target.value)
    tableMeta?.updateData(row.index, column.id, e.target.value)
  }
  return columnMeta?.type === 'select' ? (
    <select onChange={onSelectChange} value={initialValue}>
      {columnMeta?.options?.map((option: Option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  ) : (
    <input
      className="w-full"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={onBlur}
      type={columnMeta?.type || 'text'}
    />
  )
}
