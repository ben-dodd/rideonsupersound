import React from 'react'
import DataHeaderCell from './data-header'
import { useAppStore } from 'lib/store'

const DataHeaderRow = () => {
  const { dataTable } = useAppStore()
  return (
    <div className="w-full flex flex-none h-full items-stretch">
      {dataTable?.schema?.map((col) => (
        <DataHeaderCell key={col.key} col={col} />
      ))}
    </div>
  )
}

export default DataHeaderRow
