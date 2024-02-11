import Table from 'components/table'
import { useVendors } from 'lib/api/vendor'
import { priceCentsString } from 'lib/utils'
import { useMemo } from 'react'

const StockListTable = ({ stockItemList }) => {
  const { vendors } = useVendors()
  const data = useMemo(
    () =>
      stockItemList?.map((stockItem) => {
        const { item = {}, price = {}, quantities = {} } = stockItem || {}
        console.log(stockItem)
        const vendor = vendors?.find((vendor) => vendor?.id === item?.vendorId)
        return {
          id: item?.id,
          // sku: getItemSku(item),
          artist: item?.artist,
          title: item?.title,
          vendor: `[${item?.vendorId}] ${vendor?.name}`,
          section: item?.section,
          format: item?.format,
          sell: priceCentsString(price?.totalSell),
          qty: quantities?.inStock,
          qtyHoldLayby: quantities?.hold + quantities?.layby,
          qtySold: quantities?.sold,
        }
      }),
    [stockItemList, vendors],
  )

  const schema = [
    {
      accessor: 'id',
      Header: 'Stock ID',
      width: 100,
    },
    {
      accessor: 'title',
      Header: 'Title',
      width: 300,
    },
    {
      accessor: 'artist',
      Header: 'Artist',
      width: 190,
    },
    { accessor: 'vendor', Header: 'Vendor', width: 180 },
    { accessor: 'section', Header: 'Section', width: 100 },
    { accessor: 'format', Header: 'Format', width: 100 },
    { accessor: 'sell', Header: 'Sell', width: 80 },
    { accessor: 'qty', Header: 'QTY', width: 60 },
    { accessor: 'qtyHoldLayby', Header: 'H/L', width: 60 },
    { accessor: 'qtySold', Header: 'SOLD', width: 60 },
  ]
  console.log(data)
  return <Table columns={schema} data={data} />
}

export default StockListTable
