import Payments from '@/components/payments'
import Sales from '@/components/sales'
import SaleSummary from '@/components/saleSummary'
import ScreenSaver from '@/components/screenSaver'
import Stock from '@/components/stock'
import Tabs from '@/components/layout/tabs'
import { sumPrices } from '@/lib/data-functions'
import {
  useVendorByUid,
  useVendorPaymentsByUid,
  useVendorSalesByUid,
  useVendorStockByUid,
  useVendorStockMovementByUid,
  useVendorStockPriceByUid,
  useVendorStoreCreditsByUid,
} from '@/lib/swr-hooks'
import dayjs from 'dayjs'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Charts from '@/components/charts'
import Download from '@/components/download'

export default function VendorScreen() {
  const router = useRouter()
  const { id } = router.query
  const { vendor, isVendorLoading, isVendorError } = useVendorByUid(id)
  const { vendorStock, isVendorStockLoading, isVendorStockError } =
    useVendorStockByUid(id)
  const { isVendorStockMovementLoading, isVendorStockMovementError } =
    useVendorStockMovementByUid(id)
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
  const [startDate, setStartDate] = useState('2018-11-03')
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [sales, setSales] = useState([])
  const [payments, setPayments] = useState([])
  const [totalTake, setTotalTake] = useState(0)
  const [totalPaid, setTotalPaid] = useState(0)

  useEffect(() => {
    const totalSales = vendorSales?.map((sale) => {
      const price = vendorStockPrice?.filter(
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
    const filteredSales = totalSales?.filter((sale) =>
      dayjs(sale?.date_sale_closed)?.isBetween(
        dayjs(startDate),
        dayjs(endDate),
        null,
        '[]'
      )
    )
    const filteredPayments = vendorPayments?.filter((payment) =>
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
      ) : vendor?.id !== undefined ? (
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
                src="https://ross.syd1.digitaloceanspaces.com/img/POS-RIDEONSUPERSOUNDLOGOBLACK.png"
                width="500px"
              />
            </div>
            <div className="bg-orange-800 font-4xl font-black italic text-white uppercase py-1 mb-2 px-2 flex justify-between">
              <div>{vendor?.name}</div>
              <div>{`VENDOR ID: ${vendor?.id}`}</div>
            </div>
            <div className="w-full">
              <Tabs
                tabs={['Sales', 'Payments', 'Stock', 'Charts', 'Download']}
                value={tab}
                onChange={setTab}
              />
            </div>
            {/* <div className="bg-orange-800 text-white font-bold italic px-2 py-1 mb-2" /> */}
            {tab === 0 ||
              (tab === 1 && (
                <SaleSummary
                  startDate={startDate}
                  endDate={endDate}
                  setStartDate={setStartDate}
                  setEndDate={setEndDate}
                  totalTake={totalTake}
                  totalPaid={totalPaid}
                />
              ))}
            <div hidden={tab !== 0}>
              <Sales sales={sales} vendorStock={vendorStock} />
            </div>
            <div hidden={tab !== 1}>
              <Payments payments={payments} storeCredits={vendorStoreCredits} />
            </div>
            <div hidden={tab !== 2}>
              <Stock vendorStock={vendorStock} />
            </div>
            <div hidden={tab !== 3}>
              <Charts />
            </div>
            <div hidden={tab !== 4}>
              <Download />
            </div>
          </div>
        </div>
      ) : (
        <ScreenSaver />
      )}
    </>
  )
}
