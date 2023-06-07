import TableContainer from 'components/container/table'
import Table from 'components/table'
import { getItemById, getItemDisplayName, getItemSkuDisplayName } from 'lib/functions/displayInventory'
import { CustomerObject } from 'lib/types'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import { useCustomers } from 'lib/api/customer'
import { HoldObject } from 'lib/types/sale'
import { dateSimple } from 'lib/types/date'

export default function HoldTable() {
  const { customers, isCustomersLoading } = useCustomers()
  const { holds, isHoldsLoading } = useHolds()

  // Constants
  const data = useMemo(
    () =>
      holds
        ?.filter((h: HoldObject) => !h?.isDeleted)
        .map((h: HoldObject) => {
          const c: CustomerObject = customers?.find((c: CustomerObject) => h?.customerId === c?.id)
          return {
            id: h?.id,
            hold: h,
            holdName: getItemSkuDisplayName(getItemById(h?.itemId, inventory)),
            expiryDate: dayjs(h?.dateFrom).add(h?.holdPeriod, 'day'),
            customer: c,
            name: c?.name,
            email: c?.email,
            phone: c?.phone,
            postal_address: c?.postalAddress,
          }
        }),
    [customers, holds],
  )
  const columns = useMemo(() => {
    return [
      {
        Header: 'sku',
        accessor: 'holdName',
      },
      {
        Header: 'Hold',
        accessor: 'hold',
        width: 400,
        Cell: ({ value }) => (
          <div
            key={value?.id}
            className={`mb-2 cursor-pointer underline whitespace-normal`}
            onClick={() => {
              saveSystemLog(`Hold table - Hold ${loadedHoldId} opened.`, clerk?.id)
              setLoadedHoldId({ ...loadedHoldId, holds: value?.id })
            }}
          >
            {`${value?.quantity || 1} x ${getItemDisplayName(
              inventory?.find((i: StockObject) => i?.id === value?.item_id),
            )}`}
          </div>
        ),
      },
      {
        Header: 'Expiry Date',
        accessor: 'expiryDate',
        Cell: ({ value }) => (
          <div className={dayjs().isAfter(value) ? 'text-red-500' : 'text-black'}>{value?.format(dateSimple)}</div>
        ),
        sortType: (rowA: any, rowB: any, columnId: any) => {
          const a = rowA?.original[columnId]
          const b = rowB?.original[columnId]
          return a?.isAfter(b) ? 1 : b?.isAfter(a) ? -1 : 0
        },
      },
      {
        Header: 'Name',
        accessor: 'name',
        width: 200,
        Cell: (item: any) => (
          <span
            className="cursor-pointer underline"
            onClick={() => {
              setCustomer(item?.row?.original?.customer)
              setView({ ...view, createCustomer: true })
            }}
          >
            {item?.value}
          </span>
        ),
      },
      {
        Header: 'Email',
        accessor: 'email',
        width: 200,
        Cell: ({ value }) => <a href={`mailto:${value}`}>{value}</a>,
      },
      {
        Header: 'Phone',
        accessor: 'phone',
        width: 150,
      },
      { Header: 'Postal Address', accessor: 'postal_address' },
    ]
  }, [inventory])

  return (
    <TableContainer loading={isInventoryLoading || isHoldsLoading || isCustomersLoading}>
      <Table
        color="bg-col7"
        colorLight="bg-col7-light"
        colorDark="bg-col7-dark"
        data={data}
        columns={columns}
        heading={'Holds'}
        pageSize={20}
        sortOptions={[{ id: 'name', desc: false }]}
        hiddenColumns={['holdName']}
      />
    </TableContainer>
  )
}
