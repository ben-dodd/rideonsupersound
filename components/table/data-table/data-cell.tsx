import { arraysAreEqual, refInRange } from '../../../lib/functions/dataTable'
import { useAppStore } from 'lib/store'

interface DataCellType {
  col: any
  row: any
  width: number
}

const DataCell = ({ col, row, width }: DataCellType) => {
  const { dataTable, dtClickCell, dtSetCell } = useAppStore()
  const { active: activeCell, corner: cornerCell } = dataTable || {}
  const cellRef = [row.ref, col.ref]
  const isActive = arraysAreEqual(activeCell, cellRef)
  const isSelected = refInRange(cellRef, activeCell, cornerCell)
  const innerText = col.getValue ? col.getValue(row) : row[col.key]
  const handleMouseClick = (e: any) => dtClickCell(cellRef, e.shiftKey)
  const handleKeyDown = (e: any) => {
    if (
      e.key === 'Enter' ||
      e.key === 'Tab' ||
      e.key === 'LeftArrow' ||
      e.key === 'RightArrow' ||
      e.key === 'DownArrow' ||
      e.key === 'UpArrow'
    )
      dtSetCell(cellRef, e.target.value)
  }
  const handleFocus = (e: any) => {
    e.target.select()
  }
  return (
    <div
      className={`border-collapse text-xs border-t border-r p-1 flex flex-1 flex-col ${
        isActive ? 'border border-gray-600' : 'border-t border-r border-gray-300'
      } ${isSelected && !isActive && 'bg-gray-200'}`}
      style={{ minWidth: `${width}px` }}
      data-cellref={cellRef}
      onClick={handleMouseClick}
      onMouseDown={handleMouseClick}
    >
      {isActive ? (
        <input
          autoFocus
          className={`appearance-none border-none focus:outline-none focus:ring-0`}
          type="text"
          defaultValue={innerText}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
        />
      ) : (
        <div className="select-none">{innerText}</div>
      )}
    </div>
  )
}

export default DataCell
