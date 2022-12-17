import { useMemo } from 'react'
import {
  ClerkObject,
  CustomerObject,
  SaleObject,
  SaleStateTypes,
} from 'lib/types'

// Components
import TableContainer from 'components/container/table'
import Table from 'components/table'
import dayjs from 'dayjs'
import { useClerks } from 'lib/api/clerk'
import { useCustomers } from 'lib/api/customer'

export default function LaybyTable() {
  // SWR
  const { sales, isSalesLoading } = useSales()
  // const { saleItems, isSaleItemsLoading } = useSaleItems();
  const { customers, isCustomersLoading } = useCustomers()
  const { clerks, isClerksLoading } = useClerks()

  // Atoms
  // const [view, setView] = useAtom(viewAtom);
  const [loadedSaleId, setLoadedSaleId] = useAtom(loadedSaleIdAtom)

  // Constants
  const data = useMemo(
    () =>
      sales
        ?.filter((s: SaleObject) => s?.state === SaleStateTypes.Layby)
        ?.map((s: SaleObject) => {
          return {
            id: s?.id,
            date: s?.dateSaleOpened,
            customer: customers?.find(
              (c: CustomerObject) => c?.id === s?.customerId
            ),
            clerk: clerks?.find((c: ClerkObject) => c?.id === s?.saleOpenedBy),
            numberOfItems: s?.numberOfItems,
            items: s?.itemList,
            store: s?.storeCut,
            sell: s?.totalPrice,
          }
        }),
    [sales, customers, clerks]
  )
  const columns = useMemo(() => {
    return [
      { Header: 'ID', accessor: 'id', width: 70 },
      {
        Header: 'Date Started',
        accessor: 'date',
        width: 280,
        Cell: (item: any) =>
          item ? (
            <div
              className="pb-2 cursor-pointer underline"
              onClick={() =>
                setLoadedSaleId({
                  ...loadedSaleId,
                  [page]: item?.row?.original?.id,
                })
              }
            >
              {dayjs(item?.value).format('D MMMM YYYY, h:mm A')}
            </div>
          ) : (
            ''
          ),
        sortType: (rowA: any, rowB: any, columnId: any) => {
          const a = rowA?.original[columnId]
          const b = rowB?.original[columnId]
          return a > b ? 1 : b > a ? -1 : 0
        },
      },
      {
        Header: 'Clerk',
        accessor: 'clerk',
        Cell: ({ value }) => value?.name || '',
        width: 90,
      },
      {
        Header: 'Store Cut',
        accessor: 'store',
        width: 120,
        Cell: ({ value }) =>
          value && !isNaN(value) ? `$${(value / 100)?.toFixed(2)}` : 'N/A',
      },
      {
        Header: 'Total Price',
        accessor: 'sell',
        width: 120,
        Cell: ({ value }) => (value ? `$${(value / 100)?.toFixed(2)}` : 'N/A'),
      },
      {
        Header: 'Customer',
        accessor: 'customer',
        Cell: ({ value }) => value?.name || '',
      },
      {
        Header: '#',
        accessor: 'numberOfItems',
        width: 30,
      },
      {
        Header: 'Items',
        accessor: 'items',
        width: 400,
      },
    ]
  }, [sales])

  return (
    <TableContainer
      loading={isSalesLoading || isClerksLoading || isCustomersLoading}
    >
      <Table
        color="bg-col6"
        colorLight="bg-col6-light"
        colorDark="bg-col6-dark"
        data={data}
        columns={columns}
        heading={'Laybys'}
        pageSize={20}
        sortOptions={[{ id: 'date', desc: true }]}
      />
    </TableContainer>
  )
}
