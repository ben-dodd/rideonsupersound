import { useMemo } from 'react'
import { StockObject } from 'lib/types/stock'
import TableContainer from 'components/container/table'
import Table from 'components/table'
import dayjs from 'dayjs'
import { mapGiftCardObject } from 'lib/functions/giftCard'
import { useGiftCards } from 'lib/api/stock'

export default function GiftCardTable() {
  const { giftCards, isGiftCardsLoading } = useGiftCards()
  const data = useMemo(() => giftCards?.map((giftCard: StockObject) => mapGiftCardObject(giftCard)), [giftCards])

  const columns = useMemo(
    () => [
      {
        Header: 'Date Purchased',
        accessor: 'date',
        width: 280,
        Cell: (item: any) => (item ? <div>{dayjs(item?.value).format('D MMMM YYYY')}</div> : ''),
        sortType: (rowA: any, rowB: any, columnId: any) => {
          const a = rowA?.original[columnId]
          const b = rowB?.original[columnId]
          return a > b ? 1 : b > a ? -1 : 0
        },
      },
      { Header: 'Gift Card Code', accessor: 'code' },
      {
        Header: 'Initial Value',
        accessor: 'initial',
        Cell: ({ value }) => <span>${(value ? value / 100 : 0)?.toFixed(2)}</span>,
      },
      {
        Header: 'Remaining Value',
        accessor: 'remaining',
        Cell: ({ value }) => <span>${(value ? value / 100 : 0)?.toFixed(2)}</span>,
      },
      {
        Header: 'Valid',
        accessor: 'valid',
        Cell: ({ value }) => (value ? 'YES' : 'NO'),
      },
      { Header: 'Notes', accessor: 'notes', width: 350 },
    ],
    [],
  )

  return (
    <TableContainer loading={isGiftCardsLoading}>
      <Table
        color="bg-col8"
        colorLight="bg-col8-light"
        colorDark="bg-col8-dark"
        data={data}
        columns={columns}
        heading={'Gift Cards'}
        sortOptions={[{ id: 'date', desc: true }]}
      />
    </TableContainer>
  )
}
