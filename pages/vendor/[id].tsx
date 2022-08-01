import Payments from '@/features/web-vendor/components/payments'
import Sales from '@/features/web-vendor/components/sales'
import StockItem from '@/features/web-vendor/components/stock-item'
import Tabs from '@/features/web-vendor/components/tabs'
import dayjs from 'dayjs'
import { filterInventory, sumPrices } from 'lib/data-functions'
import { StockObject } from 'lib/types'
import {
  useVendorByUid,
  useVendorPaymentsByUid,
  useVendorSalesByUid,
  useVendorStockByUid,
  useVendorStockMovementByUid,
  useVendorStockPriceByUid,
  useVendorStoreCreditsByUid,
} from 'lib/vendor-swr-hooks'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function VendorScreen() {
  const router = useRouter()
  const { id } = router.query
  const { vendor, isVendorLoading, isVendorError } = useVendorByUid(id)
  const { vendorStock, isVendorStockLoading, isVendorStockError } =
    useVendorStockByUid(id)
  const {
    vendorStockMovement,
    isVendorStockMovementLoading,
    isVendorStockMovementError,
  } = useVendorStockMovementByUid(id)
  const {
    vendorStockPrice,
    isVendorStockPriceLoading,
    isVendorStockPriceError,
  } = useVendorStockPriceByUid(id)
  const { vendorSales, isVendorSalesLoading, isVendorSalesError } =
    useVendorSalesByUid(id)
  const { vendorPayments, isVendorPaymentsLoading, isVendorPaymentsError } =
    useVendorPaymentsByUid(id)
  const {
    vendorStoreCredits,
    isVendorStoreCreditsError,
    isVendorStoreCreditsLoading,
  } = useVendorStoreCreditsByUid(id)
  const loading =
    isVendorLoading ||
    isVendorStockLoading ||
    isVendorStockMovementLoading ||
    isVendorStockPriceLoading ||
    isVendorSalesLoading ||
    isVendorPaymentsLoading ||
    isVendorStoreCreditsLoading
  const error =
    isVendorError ||
    isVendorStockError ||
    isVendorStockMovementError ||
    isVendorStockPriceError ||
    isVendorSalesError ||
    isVendorPaymentsError ||
    isVendorStoreCreditsError

  const [tab, setTab] = useState(0)
  const [stockSearch, setStockSearch] = useState('')

  // const [startDate, setStartDate] = useState(
  //   dayjs().subtract(1, "year").format("YYYY-MM-DD")
  // );
  const [startDate, setStartDate] = useState('2018-11-03')
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [sales, setSales] = useState([])
  const [payments, setPayments] = useState([])
  const [totalTake, setTotalTake] = useState(0)
  const [totalPaid, setTotalPaid] = useState(0)

  useEffect(() => {
    const totalSales = vendorSales?.map((sale) => {
      const price = vendorStockPrice?.filter?.(
        (v) =>
          v?.stock_id === sale?.item_id &&
          dayjs(v?.date_valid_from)?.isBefore(dayjs(sale?.date_sale_closed))
      )?.[0]
      return {
        ...sale,
        vendor_cut: price?.vendor_cut,
        total_sell: price?.total_sell,
      }
    })
    const filteredSales = totalSales?.filter?.((sale) =>
      dayjs(sale?.date_sale_closed)?.isBetween(
        dayjs(startDate),
        dayjs(endDate),
        null,
        '[]'
      )
    )
    const filteredPayments = vendorPayments?.filter?.((payment) =>
      dayjs(payment?.date)?.isBetween(
        dayjs(startDate),
        dayjs(endDate),
        null,
        '[]'
      )
    )
    setSales(filteredSales)
    setPayments(filteredPayments)
    setTotalTake(sumPrices(totalSales, null, 'vendorPrice'))
    setTotalPaid(vendorPayments?.reduce((prev, pay) => prev + pay?.amount, 0))
  }, [vendorStockPrice, vendorSales, vendorPayments, startDate, endDate])

  return (
    <>
      <Head>
        <title>R.O.S.S. VENDOR SHEET</title>
      </Head>
      {loading ? (
        <div className="flex h-screen w-screen p-8">
          <div className="loading-icon" />
        </div>
      ) : error ? (
        <div className="flex h-screen w-screen p-8">
          AN UNKNOWN ERROR HAS OCCURRED!
        </div>
      ) : (
        <div className="flex h-screen w-screen p-4 md:p-8">
          <div
            style={{
              width: '1000px',
              // minWidth: "380px",
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            <div className="pb-4">
              <img
                src="http://hmn.exu.mybluehost.me/img/POS-RIDEONSUPERSOUNDLOGOBLACK.png"
                width="500px"
              />
            </div>
            <div className="bg-orange-800 font-4xl font-black italic text-white uppercase py-1 mb-2 px-2 flex justify-between">
              <div>{vendor?.name}</div>
              <div>{`VENDOR ID: ${vendor?.id}`}</div>
            </div>
            <div className="w-full">
              <Tabs
                tabs={['Sales', 'Payments', 'Stock']}
                value={tab}
                onChange={setTab}
              />
            </div>
            {/* <div className="bg-orange-800 text-white font-bold italic px-2 py-1 mb-2" /> */}
            {tab !== 2 && (
              <div className="mb-2 md:flex md:justify-between">
                <div className="flex items-start mb-2">
                  <div className="font-bold mr-2">FROM</div>
                  <input
                    type="date"
                    onChange={(e) => setStartDate(e.target.value)}
                    value={startDate}
                  />
                  <div className="font-bold mx-2">TO</div>
                  <input
                    type="date"
                    onChange={(e) => setEndDate(e.target.value)}
                    value={endDate}
                  />
                </div>
                <div className="w-full text-sm font-bold text-right md:w-2/5">
                  <div className="w-full flex">
                    <div className="p-2 w-3/4 whitespace-nowrap bg-gradient-to-r from-white to-gray-300 hover:to-red-300">
                      TOTAL TAKE TO DATE
                    </div>
                    <div className="pl-2 py-2 w-1/12 text-left">$</div>
                    <div className="py-2 w-2/12">
                      {(totalTake / 100)?.toFixed(2)}
                    </div>
                  </div>
                  <div className="w-full flex">
                    <div className="p-2 w-3/4 whitespace-nowrap bg-gradient-to-r from-white to-gray-200 hover:to-orange-200">
                      TOTAL PAID TO DATE
                    </div>
                    <div className="pl-2 py-2 w-1/12 text-left">$</div>
                    <div className="py-2 w-2/12">
                      {(totalPaid / 100)?.toFixed(2)}
                    </div>
                  </div>
                  <div className="w-full flex">
                    <div className="p-2 w-3/4 whitespace-nowrap bg-gradient-to-r from-white to-gray-100 hover:to-green-100">
                      PAYMENT OWING ►
                    </div>
                    <div className="pl-2 py-2 w-1/12 text-left">$</div>
                    <div className="py-2 w-2/12">
                      {((totalTake - totalPaid) / 100)?.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* <div hidden={tab !== 0}>
              <Summary id={id} sales={sales} payments={payments} />
            </div> */}
            <div hidden={tab !== 0}>
              <Sales sales={sales} vendorStock={vendorStock} />
            </div>
            <div hidden={tab !== 1}>
              <Payments payments={payments} storeCredits={vendorStoreCredits} />
            </div>
            <div hidden={tab !== 2}>
              <div className="w-full">
                <input
                  type="text"
                  className="w-full p-1 border border-gray-200 mb-8"
                  onChange={(e) => setStockSearch(e.target.value)}
                  placeholder="Search.."
                />
                {filterInventory({
                  inventory: vendorStock?.sort(
                    (a: StockObject, b: StockObject) => {
                      if (a?.quantity === b?.quantity) return 0
                      if (a?.quantity < 1) return 1
                      if (b?.quantity < 1) return -1
                      return 0
                    }
                  ),
                  search: stockSearch,
                  slice: 1000,
                  emptyReturn: true,
                })?.map((item: StockObject) => (
                  <StockItem key={item.id} item={item} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
