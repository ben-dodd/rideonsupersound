import { useMemo } from 'react'
import { VendorObject, VendorPaymentObject } from 'lib/types'

import TableContainer from 'components/container/table'
import Table from 'components/table'
import dayjs from 'dayjs'
import { mapPayment } from 'lib/functions/displayPayments'
import { useVendors } from 'lib/api/vendor'
import { useClerks } from 'lib/api/clerk'
import { priceCentsString } from 'lib/utils'
import { dateTime } from 'lib/types/date'

export default function PaymentTable() {
  // SWR
  const { vendors, isVendorsLoading } = useVendors()
  const { vendorPayments, isVendorPaymentsLoading } = useVendorPayments()
  const { clerks, isClerksLoading } = useClerks()

  // Constants
  const data = useMemo(
    () => vendorPayments?.map((v: VendorPaymentObject) => mapPayment(v, clerks)),
    [vendorPayments, clerks],
  )

  const columns = useMemo(
    () => [
      {
        Header: 'Date',
        accessor: 'date',
        width: 270,
        Cell: (item: any) => (item ? <div>{dayjs(item?.value).format(dateTime)}</div> : <div />),
        sortType: (rowA: VendorPaymentObject, rowB: VendorPaymentObject) => {
          const a = dayjs(rowA?.date)
          const b = dayjs(rowB?.date)
          return a > b ? 1 : b > a ? -1 : 0
        },
      },
      {
        Header: 'Vendor',
        accessor: 'vendorId',
        width: 250,
        Cell: ({ value }) => vendors?.find((v: VendorObject) => v?.id === value)?.name || '',
      },
      {
        Header: 'Amount',
        accessor: 'amount',
        width: 100,
        Cell: ({ value }) => (
          <div className={value < 0 ? 'text-red-500' : 'text-black'}>
            {value && !isNaN(value)
              ? value < 0
                ? `(${priceCentsString(Math.abs(value))})`
                : priceCentsString(value)
              : 'N/A'}
          </div>
        ),
      },
      { Header: 'Clerk', accessor: 'clerk' },
      { Header: 'Type', accessor: 'type' },
      { Header: 'Notes', accessor: 'note', width: 300 },
    ],
    [vendors],
  )

  return (
    <TableContainer loading={isVendorsLoading || isVendorPaymentsLoading || isClerksLoading}>
      <Table
        color="bg-col4"
        colorLight="bg-col4-light"
        colorDark="bg-col4-dark"
        data={data}
        columns={columns}
        heading={'Vendor Payments'}
        pageSize={20}
        sortOptions={[{ id: 'date', desc: true }]}
        downloadCSV={true}
      />
    </TableContainer>
  )
}
