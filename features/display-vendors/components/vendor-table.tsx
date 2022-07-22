// Packages
import { useAtom } from 'jotai'
import { useMemo } from 'react'

// DB
import { loadedVendorIdAtom } from '@/lib/atoms'
import {
  useClerks,
  useCustomers,
  useInventory,
  useSalesJoined,
  useVendorPayments,
  useVendors,
} from '@/lib/swr-hooks'
import { ClerkObject, StockObject, VendorObject } from '@/lib/types'

// Functions
import { getVendorDetails } from '@/lib/data-functions'

// Components
import TableContainer from '@/components/container/table'
import Table from '@/components/table'

export default function VendorsScreen() {
  // Atoms
  const [loadedVendorId, setLoadedVendorId] = useAtom(loadedVendorIdAtom)

  // SWR
  const { inventory, isInventoryLoading } = useInventory()
  const { sales, isSalesLoading } = useSalesJoined()
  const { vendorPayments, isVendorPaymentsLoading } = useVendorPayments()
  const { vendors, isVendorsLoading } = useVendors()
  const { clerks, isClerksLoading } = useClerks()
  const { customers, isCustomersLoading } = useCustomers()

  // const wrongSales: any[] = sales?.filter((s: any) => {
  //   let vendorDiscountFactor = 100,
  //     storeDiscountFactor = 100;
  //   if (s?.vendor_discount > 0) vendorDiscountFactor = 100 - s?.vendor_discount;
  //   if (s?.store_discount > 0) storeDiscountFactor = 100 - s?.store_discount;
  //   let storeCut =
  //     ((s?.total_sell - s?.vendor_cut) * storeDiscountFactor) / 100;
  //   let vendorCut = (s?.vendor_cut * vendorDiscountFactor) / 100;
  //   let calcPrice = (storeCut + vendorCut) * s?.quantity;
  //   return s?.total_price !== calcPrice;
  // });

  // TODO Vendor totals are different between vendor screen adn table - Muz Moeller, Andrew Tolley, clubhouse records

  // Constants
  const data = useMemo(
    () =>
      vendors
        ? vendors
            ?.filter((v: VendorObject) => !v?.is_deleted)
            .map((v: VendorObject) => {
              let vendorVars = getVendorDetails(
                inventory,
                sales,
                vendorPayments,
                v?.id
              )
              return {
                id: v?.id,
                name: v?.name || '-',
                contactName: v?.contact_name || '-',
                storeContact:
                  clerks?.filter((c: ClerkObject) => c?.id === v?.clerk_id)[0]
                    ?.name || '-',
                type: v?.vendor_category || '-',
                email: v?.email || '',
                bankAccountNumber: v?.bank_account_number || '-',
                totalTake: vendorVars?.totalSell || 0,
                totalOwing: vendorVars?.totalOwing || 0,
                totalDebitAmount: vendorVars?.totalPaid || 0,
                numberOfSales: vendorVars?.totalSales?.length,
                numberOfPayments: vendorVars?.totalPayments?.length,
                uniqueItemsInStock: vendorVars?.totalItems?.length,
                totalItemsInStock: vendorVars?.totalItems?.reduce(
                  (sum: number, item: StockObject) =>
                    (item?.quantity || 0) + sum,
                  0
                ),
                url: `../vendor/${v?.uid}`,
              }
            })
        : [],
    [vendors, sales, inventory, vendorPayments, customers, clerks]
  )

  const columns = useMemo(() => {
    // const openVendorDialog = (item: any) =>
    //   setShowVendorScreen(item?.row?.original?.id);
    return [
      {
        Header: 'ID',
        accessor: 'id',
        width: 60,
      },
      {
        Header: 'Name',
        accessor: 'name',
        width: 200,
        Cell: (item: any) => (
          <span
            className="cursor-pointer underline"
            onClick={() =>
              setLoadedVendorId({
                ...loadedVendorId,
                vendors: item?.row?.original?.id,
              })
            }
          >
            {item?.value || ''}
          </span>
        ),
      },
      // {
      //   Header: "Contact Name",
      //   accessor: "contactName",
      //   width: 150,
      //   Cell: ({ value }) => value?.name || "-",
      // },
      {
        Header: 'Staff',
        accessor: 'storeContact',
        width: 80,
      },
      { Header: 'Type', accessor: 'type', width: 100 },
      {
        Header: 'Email',
        accessor: 'email',
        Cell: ({ value }) => (
          <a href={`mailto:${value}`} className="underline">
            {value}
          </a>
        ),
        width: 220,
      },
      {
        Header: 'Link',
        accessor: 'url',
        Cell: ({ value }) => (
          <a href={`${value}`} target="_blank" className="underline">
            Link
          </a>
        ),
        width: 100,
      },
      // { Header: "Bank Account #", accessor: "bankAccountNumber", width: 220 },
      {
        Header: 'Total Take',
        accessor: 'totalTake',
        width: 100,
        Cell: ({ value }) =>
          value && !isNaN(value) ? `$${(value / 100)?.toFixed(2)}` : '$0.00',
      },
      {
        Header: 'Total Paid',
        accessor: 'totalDebitAmount',
        width: 100,
        Cell: ({ value }) =>
          value && !isNaN(value) ? `$${(value / 100)?.toFixed(2)}` : '$0.00',
      },
      {
        Header: 'Total Owing',
        accessor: 'totalOwing',
        width: 120,
        Cell: ({ value }) =>
          value && !isNaN(value) ? `$${(value / 100)?.toFixed(2)}` : '$0.00',
      },
      {
        Header: 'Unique Items',
        accessor: 'uniqueItemsInStock',
        width: 130,
      },
      {
        Header: 'Total Items',
        accessor: 'totalItemsInStock',
        width: 110,
      },
    ]
  }, [])

  return (
    <TableContainer
      loading={
        isSalesLoading ||
        isClerksLoading ||
        isVendorsLoading ||
        isCustomersLoading ||
        isInventoryLoading ||
        isVendorPaymentsLoading
      }
    >
      <Table
        color="bg-col3"
        colorLight="bg-col3-light"
        colorDark="bg-col3-dark"
        data={data}
        columns={columns}
        heading={'Vendors'}
        pageSize={20}
        sortOptions={[{ id: 'name', desc: false }]}
        downloadCSV={true}
      />
      {/* <CSVLink
        className={`bg-col2-dark hover:bg-col2 disabled:bg-gray-200 p-2 rounded`}
        data={wrongSales}
        // headers={["SKU", "ARTIST", "TITLE", "NEW/USED", "SELL PRICE", "GENRE"]}
        filename={`wrong-sales.csv`}
      >
        WRONG SALES
      </CSVLink> */}
    </TableContainer>
  )
}
