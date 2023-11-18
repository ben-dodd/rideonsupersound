import { useEffect, useState } from 'react'
import DataRow from './data-row'
import { getColumnRatios, parseClipboardData } from '../../../lib/functions/dataTable'
import DataHeaderRow from './data-header-row'
import { useAppStore } from 'lib/store'
import { getItemSku } from 'lib/functions/displayInventory'
import { StockItemObject } from 'lib/types/stock'

const DataTable = ({ initData, initSchema, isLoading }) => {
  const {
    dataTable,
    dtSelectByKeyboard,
    dtClearSelection,
    dtClearCellRange,
    dtGetSelectionAsText,
    // undo,
    // redo,
    dtSetSchema,
    dtSetCellRange,
    dtSelectByDrag,
    dtSetInitialWidthRatios,
  } = useAppStore()
  const { data, schema, active, corner, widthRatios } = dataTable || {}
  const tableWidth = document.getElementById('table')?.offsetWidth
  const widths = widthRatios?.map((ratio) => Math.floor(ratio * tableWidth))
  const [mouseDown, setMouseDown] = useState(false)
  useEffect(() => {
    dtSetSchema(defaultSchema.map((col, i) => ({ ...col, ref: i })))
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        dtClearSelection()
      } else if (['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Enter', 'Tab'].includes(e.key)) {
        e.preventDefault()
        dtSelectByKeyboard(e)
        // } else if (e.metaKey && e.key === 'z') {
        //   e.preventDefault()
        //   undo()
        // } else if (e.metaKey && e.key === 'y') {
        //   e.preventDefault()
        //   redo()
      } else if (e.key === 'Delete') {
        e.preventDefault()
        dtClearCellRange()
      }
    })
    document.addEventListener('copy', (e) => {
      handleCopy(e)
    })
    document.addEventListener('cut', (e) => {
      handleCut(e)
    })
    document.addEventListener('paste', (e) => {
      handlePaste(e)
    })
  }, [])
  // }, [undo])
  useEffect(() => {
    dtSetInitialWidthRatios(getColumnRatios(schema, data))
  }, [isLoading])

  const handleMouseDown = () => setMouseDown(true)
  const handleMouseOver = (e: any) => {
    if (mouseDown) {
      const callref = e?.target?.dataset?.cellref || e?.target?.parentNode?.dataset?.cellref
      const mouseoverCell = callref?.split?.(',')?.map((num: string) => Number(num))
      mouseoverCell && dtSelectByDrag(mouseoverCell)
    }
  }
  const handleMouseUp = () => setMouseDown(false)

  const handlePaste = (e: any) => {
    e.preventDefault()
    dtSetCellRange(parseClipboardData(e))
  }
  const handleCopy = (e: any) => {
    e.preventDefault()
    e.clipboardData.setData('text', dtGetSelectionAsText())
  }
  const handleCut = (e: any) => {
    e.preventDefault()
    handleCopy(e)
    dtClearCellRange()
  }

  console.log(active, corner)

  return (
    <div id="table">
      <div className="flex p-1">
        {/* <button onClick={undo} className={'btn-elevated'}>
          UNDO
        </button>
        <button onClick={redo} className={'btn-elevated ml-2'}>
          REDO
        </button> */}
      </div>
      <div
        className="h-full w-full m-8 shadow-inner"
        onMouseDown={handleMouseDown}
        onMouseOver={handleMouseOver}
        onMouseUp={handleMouseUp}
      >
        <DataHeaderRow />
        {data.map((dataRow, i) => (
          <DataRow key={i} row={dataRow} widths={widths} />
        ))}
      </div>
    </div>
  )
}

const defaultSchema: any[] = [
  { key: 'id', header: 'Item ID' },
  { key: 'vendorId', header: 'Vendor ID' },
  { key: 'sku', header: 'SKU', getValue: (row: StockItemObject) => getItemSku(row), isLocked: true },
  {
    key: 'artist',
    header: 'Artist',
  },
  {
    key: 'title',
    header: 'Title',
  },
]

export default DataTable
