import TextInput from './TextInput'
import CompactDateRangePicker from './compact-date-picker'

const Filter = ({ column }) => {
  const columnFilterValue = column.getFilterValue()
  const { filterVariant, selectOptions } = column.columnDef.meta ?? {}
  return filterVariant === 'range' ? (
    <div>
      <div className="flex space-x-2">
        {/* See faceted column filters example for min max values functionality */}
        <TextInput
          type="number"
          value={(columnFilterValue as [number, number])?.[0] ?? ''}
          updateFilter={(value) => column.setFilterValue((old: [number, number]) => [value, old?.[1]])}
          placeholder={`Min`}
        />
        <TextInput
          type="number"
          value={(columnFilterValue as [number, number])?.[1] ?? ''}
          updateFilter={(value) => column.setFilterValue((old: [number, number]) => [old?.[0], value])}
          placeholder={`Max`}
        />
      </div>
      <div className="h-1" />
    </div>
  ) : filterVariant === 'dateRange' ? (
    <CompactDateRangePicker
      onApply={(e) => column.setFilterValue(e)}
      initStartDate={columnFilterValue?.[0] ?? null}
      initEndDate={columnFilterValue?.[1] ?? null}
    />
  ) : filterVariant === 'select' ? (
    <select
      className="filter-input"
      onChange={(e) => column.setFilterValue(e.target.value)}
      value={columnFilterValue?.toString()}
    >
      <option value="">Show All</option>
      {selectOptions?.map((option) => (
        <option value={option?.value}>{option?.label}</option>
      ))}
    </select>
  ) : (
    <TextInput
      updateFilter={(value) => column.setFilterValue(value)}
      placeholder={`Search...`}
      type="text"
      value={(columnFilterValue ?? '') as string}
    />
    // See faceted column filters example for datalist search suggestions
  )
}

export default Filter
