import DataTable from 'components/table/data-table'
import { getItemSku } from 'lib/functions/displayInventory'

const StockListSheet = ({ stockItemList, isLoading }) => {
  const stockSchema = [
    {
      id: 'id',
      key: 'id',
      header: 'Stock ID',
      getValue: (row) => row?.item?.id,
    },
    { id: 'vendorId', key: 'vendorId', header: 'Vendor ID', getValue: (row) => row?.item?.vendorId },
    { id: 'sku', key: 'sku', header: 'SKU', getValue: (row) => getItemSku(row?.item), isLocked: true },
    {
      id: 'artist',
      key: 'artist',
      header: 'Artist',
      getValue: (row) => row?.item?.artist,
    },
    {
      id: 'title',
      key: 'title',
      header: 'Title',
      getValue: (row) => row?.item?.title,
    },
  ]
  return <DataTable initData={stockItemList} initSchema={stockSchema} isLoading={isLoading} />
}

export default StockListSheet
