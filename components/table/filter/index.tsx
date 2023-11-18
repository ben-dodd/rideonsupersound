import React, { useEffect, useState } from 'react'
import TextInput from './TextInput'

interface FilterType {
  setFilterFunc: Function
  initFilters: Filter[]
  expandable?: boolean
}

interface Filter {
  id: number
  type: string
  value: any
  filterConstructor: (val: any) => (row: any) => boolean
}

const Filter = ({ setFilterFunc, initFilters, expandable = true }: FilterType) => {
  const [expanded, setExpanded] = useState(false)
  const [filters, setFilters]: [Filter[], Function] = useState(initFilters)
  useEffect(() => {
    setFilterFunc(() => (row: any) => {
      let ret = true
      filters.forEach((filter) => {
        if (!filter.filterConstructor(filter.value)(row)) ret = false
      })
      return ret
    })
  }, [filters])
  return (
    <div className="w-full">
      {filters?.map((filter) =>
        filter.type === 'text' ? (
          <TextInput
            key={filter.id}
            updateFilter={(val: string) => {
              setFilters((otherFilters: Filter[]) => [
                ...otherFilters.filter((otherFilter) => otherFilter.id !== filter.id),
                { ...filter, value: val },
              ])
            }}
          />
        ) : (
          <div />
        ),
      )}
    </div>
  )
}

export default Filter
