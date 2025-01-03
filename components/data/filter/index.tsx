import TextInput from './TextInput'
import CompactDateRangePicker from './compact-date-picker'
import MinMaxInput from './minMaxInput'

const Filter = ({ column }) => {
  const columnFilterValue = column.getFilterValue()
  const { filterVariant, selectOptions } = column.columnDef.meta ?? {}
  return filterVariant === 'range' ? (
    <MinMaxInput
      onChange={column.setFilterValue}
      initMin={columnFilterValue?.[0] ?? null}
      initMax={columnFilterValue?.[1] ?? null}
    />
  ) : filterVariant === 'dateRange' ? (
    <CompactDateRangePicker
      onApply={column.setFilterValue}
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
