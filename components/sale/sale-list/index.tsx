// Packages
import { useAtom } from 'jotai'
import { useMemo } from 'react'

// DB
import { loadedSaleIdAtom, pageAtom } from '@/lib/atoms'
import { useClerks, useSales } from '@/lib/swr-hooks'
import { ClerkObject, SaleObject, SaleStateTypes } from '@/lib/types'

// Components
import List from './list'

export default function SaleList() {
  // SWR
  const { sales, isSalesLoading } = useSales()
  const { clerks, isClerksLoading } = useClerks()

  // Atoms
  const [page] = useAtom(pageAtom)
  const [loadedSaleId, setLoadedSaleId] = useAtom(loadedSaleIdAtom)

  // Constants
  const data = useMemo(
    () =>
      sales
        ?.filter((s: SaleObject) => s?.state !== SaleStateTypes.Layby)
        ?.map((s: SaleObject) => {
          return {
            id: s?.id,
            date: s?.date_sale_opened,
            status: s?.state,
            clerk: clerks?.filter(
              (c: ClerkObject) => c?.id === s?.sale_opened_by
            )[0],
            numberOfItems: s?.number_of_items,
            items: s?.item_list,
            store: s?.store_cut,
            sell: s?.total_price,
          }
        }) || [],
    [sales, clerks]
  )
  // const columns = useMemo(() => {
  //   return [
  //     { Header: 'ID', accessor: 'id', width: 70 },
  //     {
  //       Header: 'Date',
  //       accessor: 'date',
  //       width: 280,
  //       Cell: (item: any) =>
  //         item ? (
  //           <div
  //             style={{
  //               paddingBottom: 8,
  //               cursor: 'pointer',
  //               textDecoration: 'underline',
  //             }}
  //             onClick={() =>
  //               setLoadedSaleId({
  //                 ...loadedSaleId,
  //                 [page]: item?.row?.original?.id,
  //               })
  //             }
  //           >
  //             {dayjs(item?.value).format('D MMMM YYYY, h:mm A')}
  //           </div>
  //         ) : (
  //           ''
  //         ),
  //       sortType: (rowA: any, rowB: any, columnId: any) => {
  //         const a = rowA?.original[columnId]
  //         const b = rowB?.original[columnId]
  //         return a > b ? 1 : b > a ? -1 : 0
  //       },
  //     },
  //     {
  //       Header: 'Status',
  //       accessor: 'status',
  //       width: 120,
  //     },
  //     {
  //       Header: 'Clerk',
  //       accessor: 'clerk',
  //       Cell: ({ value }) => value?.name || '',
  //       width: 90,
  //     },
  //     {
  //       Header: 'Store Cut',
  //       accessor: 'store',
  //       width: 120,
  //       Cell: ({ value }) =>
  //         value && !isNaN(value) ? `$${(value / 100)?.toFixed(2)}` : 'N/A',
  //     },
  //     {
  //       Header: 'Total Price',
  //       accessor: 'sell',
  //       width: 120,
  //       Cell: ({ value }) => (value ? `$${(value / 100)?.toFixed(2)}` : 'N/A'),
  //     },
  //     {
  //       Header: '#',
  //       accessor: 'numberOfItems',
  //       width: 50,
  //     },
  //     {
  //       Header: 'Items',
  //       accessor: 'items',
  //       width: 400,
  //     },
  //   ]
  // }, [sales])

  // <TableContainer loading={isSalesLoading || isClerksLoading}>
  // </TableContainer>
  return (
    <div>
      <div
        className={`text-4xl bg-col5 font-bold uppercase text-white p-2 mb-1 flex justify-between`}
      >
        <div>SALES</div>
      </div>
      {isSalesLoading || isClerksLoading ? (
        <div className="loading-screen">
          <div className="loading-icon" />
        </div>
      ) : (
        <List />
      )}
    </div>
  )
}
