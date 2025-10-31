import { Check, Close } from '@mui/icons-material'
import dayjs from 'dayjs'
import { EditCell } from 'components/data/table/editCell'
import { getItemSku } from 'lib/functions/displayInventory'
import { getProfitMargin, getProfitMarginString } from 'lib/functions/pay'
import type { StockTableColors } from 'lib/types/table'
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
  // Essential columns (always visible)
  const essentialColumns: any[] = [
    {
      accessorKey: 'id',
      header: 'Stock ID',
      group: 'essential',
      cell: (info) => (
        <button
          type="button"
          className="text-blue-600 hover:text-blue-800 underline font-medium"
          onClick={() => router.push(`/stock/${info.getValue()}`)}
          aria-label={`View stock item ${getItemSku(info.row?.original)}`}
        >
          {getItemSku(info.row?.original)}
        </button>
      ),
      size: 100,
      minSize: 100,
      maxSize: 100,
      enableResizing: false,
    },
    {
      accessorKey: 'title',
      header: 'Title',
      group: 'essential',
      ...(isEditable && { cell: EditCell }),
      size: 300,
      minSize: 200,
      maxSize: 400,
      sortDescFirst: false,
    },
    {
      accessorKey: 'artist',
      header: 'Artist',
      group: 'essential',
      ...(isEditable && { cell: EditCell }),
      size: 190,
      minSize: 150,
      maxSize: 250,
      sortDescFirst: false,
    },
    {
      accessorKey: 'totalSell',
      header: 'Sell',
      group: 'essential',
      cell: (info) => <div className={colors.sell}>{priceCentsString(info?.getValue() as number)}</div>,
      size: 80,
      minSize: 80,
      maxSize: 80,
      enableResizing: false,
    },
    {
      accessorKey: 'quantities.inStock',
      header: 'In Stock',
      group: 'essential',
      size: 80,
      minSize: 80,
      maxSize: 80,
      enableResizing: false,
    },
  ]

  // Detail columns
  const detailColumns: any[] = [
    {
      header: 'Vendor',
      accessorKey: 'vendorName',
      group: 'details',
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
      minSize: 150,
      maxSize: 220,
    },
    {
      accessorKey: 'section',
      header: 'Section',
      group: 'details',
      size: 100,
      minSize: 80,
      maxSize: 120,
    },
    {
      accessorKey: 'media',
      header: 'Media',
      group: 'details',
      size: 100,
      minSize: 80,
      maxSize: 120,
    },
    {
      accessorKey: 'format',
      header: 'Format',
      group: 'details',
      size: 100,
      minSize: 80,
      maxSize: 120,
    },
    {
      accessorKey: 'genre',
      header: 'Genre',
      group: 'details',
      size: 100,
      minSize: 80,
      maxSize: 120,
    },
    {
      accessorKey: 'isNew',
      header: 'Is New?',
      group: 'details',
      size: 70,
      minSize: 70,
      maxSize: 70,
      enableResizing: false,
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
      group: 'details',
      size: 90,
      minSize: 80,
      maxSize: 100,
    },
    {
      accessorKey: 'needsRestock',
      header: 'Needs Restock?',
      group: 'details',
      size: 70,
      minSize: 70,
      maxSize: 70,
      enableResizing: false,
      cell: (info) => (info?.getValue() ? <Check aria-label="Yes, needs restock" /> : ''),
    },
  ]

  const priceColumns: any[] = [
    {
      accessorKey: 'vendorCut',
      header: 'Vendor Cut',
      group: 'prices',
      cell: (info) => <div className={colors.vendorCut}>{priceCentsString(info?.getValue() as number)}</div>,
      size: 90,
      minSize: 90,
      maxSize: 90,
      enableResizing: false,
    },
    {
      header: 'Store Cut',
      accessorKey: 'storeCut',
      group: 'prices',
      cell: (info) => (
        <div className={colors.storeCut}>
          {priceCentsString((info?.row?.original?.totalSell ?? 0) - (info?.row?.original?.vendorCut ?? 0))}
        </div>
      ),
      sortingFn: (rowA, rowB) =>
        (rowA?.original?.totalSell ?? 0) -
        (rowA?.original?.vendorCut ?? 0) -
        ((rowB?.original?.totalSell ?? 0) - (rowB?.original?.vendorCut ?? 0)),
      size: 90,
      minSize: 90,
      maxSize: 90,
      enableResizing: false,
    },
    {
      header: 'Margin',
      accessorKey: 'margin',
      group: 'prices',
      cell: (info) => getProfitMarginString(info?.row?.original),
      sortingFn: (rowA, rowB) => getProfitMargin(rowA?.original) - getProfitMargin(rowB?.original),
      size: 70,
      minSize: 70,
      maxSize: 70,
      enableResizing: false,
    },
  ]

  const quantityColumns: any[] = [
    {
      accessorKey: 'quantities.received',
      header: 'Received',
      group: 'quantities',
      size: 80,
      minSize: 80,
      maxSize: 80,
      enableResizing: false,
    },
    {
      accessorKey: 'quantities.returned',
      header: 'Returned',
      group: 'quantities',
      size: 80,
      minSize: 80,
      maxSize: 80,
      enableResizing: false,
    },
    {
      accessorKey: 'quantities.holdLayby',
      header: 'Hold/Layby',
      group: 'quantities',
      size: 90,
      minSize: 90,
      maxSize: 90,
      enableResizing: false,
    },
    {
      accessorKey: 'quantities.sold',
      header: 'Sold',
      group: 'quantities',
      size: 70,
      minSize: 70,
      maxSize: 70,
      enableResizing: false,
    },
  ]

  const historyColumns: any[] = [
    {
      accessorKey: 'lastMovements.sold',
      header: 'Last Sold',
      group: 'history',
      cell: (info) => (info?.getValue() ? dayjs(info?.getValue() as string).format(dateSlash) : ''),
      size: 100,
      minSize: 100,
      maxSize: 100,
      enableResizing: false,
      sortUndefined: 1,
    },
    {
      accessorKey: 'lastMovements.received',
      header: 'Last Received',
      group: 'history',
      cell: (info) => (info?.getValue() ? dayjs(info?.getValue() as string).format(dateSlash) : ''),
      size: 110,
      minSize: 110,
      maxSize: 110,
      enableResizing: false,
      sortUndefined: 1,
    },
    {
      accessorKey: 'lastMovements.returned',
      header: 'Last Returned',
      group: 'history',
      cell: (info) => (info?.getValue() ? dayjs(info?.getValue() as string).format(dateSlash) : ''),
      size: 110,
      minSize: 110,
      maxSize: 110,
      enableResizing: false,
      sortUndefined: 1,
    },
    {
      accessorKey: 'lastMovements.modified',
      header: 'Last Modified',
      group: 'history',
      cell: (info) => (info?.getValue() ? dayjs(info?.getValue() as string).format(dateSlash) : ''),
      size: 110,
      minSize: 110,
      maxSize: 110,
      enableResizing: false,
      sortUndefined: 1,
    },
  ]

  // For edit mode, return flat columns with essential + editable
  if (isEditable) {
    return [...essentialColumns.slice(0, 3), ...detailColumns, ...priceColumns, quantityColumns[0]]
  }

  // For view mode, return flat columns with groups
  return [...essentialColumns, ...detailColumns, ...priceColumns, ...quantityColumns, ...historyColumns]
}
