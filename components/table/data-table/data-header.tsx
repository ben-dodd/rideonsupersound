import { useAppStore } from 'lib/store'
import React, { useState } from 'react'

interface DataHeaderType {
  col: any
}

const DataHeader = ({ col }: DataHeaderType) => {
  const { dtSetWidthRatios, dataTable } = useAppStore()
  const tableWidth = document.getElementById('table')?.offsetWidth
  const [dragStartRatio, setDragStartRatio] = useState(null)
  const ratios = dataTable?.widthRatios
  const width = Math.floor(tableWidth * ratios[col.ref])
  const [dragging, setDragging] = useState(false)
  const handleDragBegin = (e) => {
    e.preventDefault()
    setDragging(true)
    setDragStartRatio(tableWidth / e.clientX)
    console.log('Begin', e)
  }
  const handleDrag = (e) => {
    e.preventDefault()
    if (dragging) {
      console.log('Drag', e)
      console.log(tableWidth / e.clientX)
      console.log(tableWidth / e.clientX - dragStartRatio)
      dtSetWidthRatios(col.ref, tableWidth / e.clientX - dragStartRatio)
    }
  }
  const handleDragEnd = (e) => {
    e.preventDefault()
    console.log('end')
    setDragging(false)
    setDragStartRatio(null)
  }
  return (
    <div
      className={`border-t border-b border-l border-gray-500 flex flex-none hover:bg-gray-100`}
      style={{ maxWidth: `${width}px` }}
    >
      <div className="select-none text-xs font-bold p-1" style={{ minWidth: `${width - 4}px` }}>
        {col.header}
      </div>
      <div
        className="cursor-col-resize hover:bg-gray-100 border-r border-gray-500 p-0"
        style={{ minWidth: '4px' }}
        // onMouseDown={handleDragBegin}
        // onMouseMove={handleDrag}
        // onMouseOut={handleDragEnd}
      />
    </div>
  )
}

export default DataHeader
