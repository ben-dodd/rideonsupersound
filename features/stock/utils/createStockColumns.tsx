import { Check, Close } from '@mui/icons-material'
import dayjs from 'dayjs'
import { EditCell } from 'components/data/table/editCell'
import { getItemSku } from 'lib/functions/displayInventory'
import { getProfitMargin, getProfitMarginString } from 'lib/functions/pay'
import type { CollatedStockItem, StockTableColors } from 'lib/types/table'
import { STOCK_TABLE_COLORS } from 'lib/types/table'
import { dateSlash } from 'lib/types/date'
import { priceCentsString } from 'lib/utils'
import type { NextRouter } from 'next/router'

interface CreateStockColumnsOptions {
  router: NextRouter
  isEditable?: boolean
  colors?: StockTableColors
}

export const createStockColumns = ({
  router,
  isEditable = false,
  colors = STOCK_TABLE_COLORS,
}: CreateStockColumnsOptions): any[] => {
  const detailColumns: any[] = [
    {
      accessorKey: 'id',
      header: 'Stock ID',
      cell: (info) => (
        <button
          type="button"
          className={colors.link}
          onClick={() => router.push(`/stock/${info.getValue()}`)}
          aria-label={`View stock item ${getItemSku(info.row?.original)}`}
        >
          {getItemSku(info.row?.original)}
        </button>
      ),
      size: 100,
    },
    {
      accessorKey: 'title',
      header: 'Title',
      cell: isEditable ? EditCell : undefined,
      size: 300,
      sortDescFirst: false,
    },
    {
      accessorKey: 'artist',
      header: 'Artist',
      cell: isEditable ? EditCell : undefined,
      size: 190,
      sortDescFirst: false,
    },
    {
      header: 'Vendor',
      accessorKey: 'vendorName',
      cell: (info) => {
        const row = info?.row?.original
        return (
          <button
            type="button"
            className={colors.link}
            onClick={() => router.push(`/vendors/${row?.vendorId}`)}
            aria-label={`View vendor ${row?.vendorName}`}
          >
            {`[${row?.vendorId}] ${row?.vendorName}`}
          </button>
        )
      },
      size: 180,
    },
    {
      accessorKey: 'section',
      header: 'Section',
      size: 100,
    },
    {
      accessorKey: 'media',
      header: 'Media',
      size: 100,
    },
    {
      accessorKey: 'format',
      header: 'Format',
      size: 100,
    },
    {
      accessorKey: 'genre',
      header: 'Genre',
      size: 100,
    },
    {
      accessorKey: 'isNew',
      header: 'Is New?',
      size: 50,
      cell: (info) =>
        info?.getValue() ? (
          <Check aria-label="Yes, is new" />
        ) : (
          <Close className="text-red-500" aria-label="No, not new" />
        ),
    },
    {
      accessorKey: 'cond',
      header: 'Condition',
      size: 50,
    },
    {
      accessorKey: 'needsRestock',
      header: 'Needs Restock?',
      size: 50,
      cell: (info) => (info?.getValue() ? <Check aria-label="Yes, needs restock" /> : ''),
    },
  ]

  const priceColumns: any[] = [
    {
      accessorKey: 'totalSell',
      header: 'Sell',
      cell: (info) => <div className={colors.sell}>{priceCentsString(info?.getValue() as number)}</div>,
      size: 80,
    },
    {
      accessorKey: 'vendorCut',
      header: 'Vendor Cut',
      cell: (info) => <div className={colors.vendorCut}>{priceCentsString(info?.getValue() as number)}</div>,
      size: 80,
    },
    {
      header: 'Store Cut',
      accessorKey: 'storeCut',
      cell: (info) => (
        <div className={colors.storeCut}>
          {priceCentsString((info?.row?.original?.totalSell ?? 0) - (info?.row?.original?.vendorCut ?? 0))}
        </div>
      ),
      sortingFn: (rowA, rowB) =>
        (rowA?.original?.totalSell ?? 0) -
        (rowA?.original?.vendorCut ?? 0) -
        ((rowB?.original?.totalSell ?? 0) - (rowB?.original?.vendorCut ?? 0)),
      size: 80,
    },
    {
      header: 'Margin',
      accessorKey: 'margin',
      cell: (info) => getProfitMarginString(info?.row?.original),
      sortingFn: (rowA, rowB) => getProfitMargin(rowA?.original) - getProfitMargin(rowB?.original),
      size: 80,
    },
  ]

  const quantityColumns: any[] = [
    { accessorKey: 'quantities.inStock', header: 'QTY', size: 60 },
    { accessorKey: 'quantities.received', header: 'REC', size: 60 },
    { accessorKey: 'quantities.returned', header: 'RET', size: 60 },
    {
      accessorKey: 'quantities.holdLayby',
      header: 'H/L',
      size: 60,
    },
    {
      accessorKey: 'quantities.sold',
      header: 'SOLD',
      size: 60,
    },
  ]

  const actionColumns: any[] = [
    {
      accessorKey: 'lastMovements.sold',
      header: 'Last Sold',
      cell: (info) => (info?.getValue() ? dayjs(info?.getValue() as string).format(dateSlash) : ''),
      size: 80,
      sortUndefined: 1,
    },
    {
      accessorKey: 'lastMovements.received',
      header: 'Last Received',
      cell: (info) => (info?.getValue() ? dayjs(info?.getValue() as string).format(dateSlash) : ''),
      size: 80,
      sortUndefined: 1,
    },
    {
      accessorKey: 'lastMovements.returned',
      header: 'Last Returned',
      cell: (info) => (info?.getValue() ? dayjs(info?.getValue() as string).format(dateSlash) : ''),
      size: 80,
      sortUndefined: 1,
    },
    {
      accessorKey: 'lastMovements.modified',
      header: 'Last Modified',
      cell: (info) => (info?.getValue() ? dayjs(info?.getValue() as string).format(dateSlash) : ''),
      size: 80,
      sortUndefined: 1,
    },
  ]

  // For edit mode, return flat columns
  if (isEditable) {
    return [...detailColumns, ...priceColumns, quantityColumns[0]]
  }

  // For view mode, return grouped columns
  return [
    {
      header: 'Details',
      columns: detailColumns,
    },
    {
      header: 'Prices',
      columns: priceColumns,
    },
    {
      header: 'Quantities',
      columns: quantityColumns,
    },
    {
      header: 'Actions',
      columns: actionColumns,
    },
  ]
}
