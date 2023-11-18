import DataCell from './data-cell'
import { useAppStore } from 'lib/store'

interface DataRowType {
  row: any
  widths: number[]
}

const DataRow = ({ row, widths }: DataRowType) => {
  const { dataTable } = useAppStore()
  return (
    <div className="w-full flex flex-none h-full items-stretch">
      {dataTable?.schema?.map((col, i) => (
        <DataCell key={col.key} row={row} col={col} width={widths?.[i]} />
      ))}
    </div>
  )
}

export default DataRow
