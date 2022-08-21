import {
  loadedSaleIdAtom,
  salesViewClerksAtom,
  salesViewRangeAtom,
} from '@/lib/atoms'
import {
  useClerks,
  useRegisters,
  useSaleTransactionsForRange,
} from '@/lib/swr-hooks'
import dayjs from 'dayjs'
import { useAtom } from 'jotai'
import { useMemo } from 'react'
import Filter from './filter'

export default function List() {
  const [salesViewRange] = useAtom(salesViewRangeAtom)
  const [salesViewClerks] = useAtom(salesViewClerksAtom)
  const [loadedSaleId, setLoadedSaleId] = useAtom(loadedSaleIdAtom)
  const { saleTransactions, isSaleTransactionsLoading } =
    useSaleTransactionsForRange(salesViewRange)
  const { registers, isRegistersLoading } = useRegisters(salesViewRange)
  const { clerks, isClerksLoading } = useClerks()
  const sortedSales = useMemo(() => {
    // Sort sales into 2D array
    // [{ day: '', sales: [{ time, sale | register }]}]
    // console.log(saleTransactions)
    // console.log(registers)
    let grandTotal = 0
    let storeCut = 0
    let saleMap = {}
    saleTransactions?.forEach?.((transaction) => {
      if (
        salesViewClerks?.length === 0 ||
        salesViewClerks?.includes(transaction?.clerk_id)
      ) {
        let day = dayjs(transaction?.date)?.format('YYYY-MM-DD')
        if (saleMap?.[day] === undefined)
          saleMap[day] = {
            day,
            sales: {},
            registers: [],
            storeCut: 0,
            total: 0,
          }
        if (saleMap?.[day]?.sales[transaction?.sale_id] === undefined)
          saleMap[day].sales[transaction?.sale_id] = {
            id: transaction?.sale_id,
            item_list: transaction?.item_list,
            total_price: transaction?.total_price,
            store_cut: transaction?.store_cut,
            store_fraction:
              (transaction?.store_cut || 0) / (transaction?.total_price || 1),
            number_of_items: transaction?.number_of_items,
            transactions: [],
          }
        const transactionStoreCut =
          (transaction.amount || 0) *
          ((transaction?.store_cut || 0) / (transaction?.total_price || 1))
        saleMap[day].sales[transaction?.sale_id].transactions.push(transaction)
        saleMap[day].storeCut += transactionStoreCut
        saleMap[day].total += transaction.amount
        grandTotal += transaction.amount
        storeCut += transactionStoreCut
      }
    })
    registers?.forEach?.((register) => {
      let openDay = dayjs(register?.open_date)?.format('YYYY-MM-DD')
      let closeDay = dayjs(register?.close_date)?.format('YYYY-MM-DD')
      if (saleMap?.[openDay] !== undefined)
        saleMap[openDay].registers.push({ ...register, type: 'open' })
      if (saleMap?.[closeDay] !== undefined)
        saleMap[closeDay].registers.push({ ...register, type: 'close' })
    })
    // console.log(Object.values(saleMap))

    let saleArray = Object.values(saleMap)?.map((saleDay: any) => {
      return { ...saleDay, sales: Object.values(saleDay.sales) }
    })
    return { grandTotal, storeCut, saleArray }
  }, [saleTransactions, registers, salesViewClerks])
  return (
    <div>
      <Filter />
      <div className="h-dialog overflow-y-scroll px-2">
        {isSaleTransactionsLoading || isRegistersLoading || isClerksLoading ? (
          <div className="loading-screen">
            <div className="loading-icon" />
          </div>
        ) : sortedSales?.saleArray?.length === 0 ? (
          <div className="font-bold text-sm my-8 text-center">
            NO SALES FOR THIS PERIOD
          </div>
        ) : (
          sortedSales?.saleArray?.map((saleDay) => (
            <div key={saleDay?.day}>
              <div className="border-b border-black border-double font-bold mb-2 mt-8">
                {dayjs(saleDay?.day).format('dddd, MMMM D, YYYY')}
              </div>
              {saleDay?.sales?.map?.((sale: any) => {
                console.log(sale)
                return (
                  <div className="flex border-b border-gray-500 border-dotted">
                    <div
                      className="w-5/12 cursor-pointer"
                      onClick={() =>
                        setLoadedSaleId({ ...loadedSaleId, sales: sale?.id })
                      }
                    >{`[${sale?.id}] ${sale?.item_list}`}</div>
                    <div className="w-7/12 text-right">
                      {sale?.transactions?.map((transaction) => {
                        return (
                          <div className="flex">
                            <div className="w-1/5">
                              {dayjs(transaction?.date).format('h:mm A')}
                            </div>
                            <div className="w-1/5">
                              {
                                clerks?.filter(
                                  (clerk) => clerk?.id === transaction.clerk_id
                                )?.[0]?.name
                              }
                            </div>
                            <div className="w-1/5">
                              {transaction?.payment_method?.toUpperCase?.()}
                            </div>
                            <div className="w-1/5 text-right">{`$${(
                              (transaction?.amount / 100) *
                              sale?.store_fraction
                            )?.toFixed(2)}`}</div>
                            <div className="w-1/5 text-right">{`$${(
                              transaction?.amount / 100
                            )?.toFixed(2)}`}</div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
              <div className="flex border-t border-black font-bold mb-8 mt-2 w-full">
                <div className="w-5/12"></div>
                <div className="w-7/12 flex">
                  <div className="w-3/5"></div>
                  <div className="w-1/5 text-right">{`$${(
                    saleDay?.storeCut / 100
                  )?.toFixed(2)}`}</div>
                  <div className="w-1/5 text-right">{`$${(
                    saleDay?.total / 100
                  )?.toFixed(2)}`}</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="bg-col5 w-full text-right font-bold text-lg pt-2 border-t-2 px-2">{`STORE CUT $${(
        sortedSales?.storeCut / 100
      ).toFixed(2)} // VENDOR SALES $${(
        (sortedSales?.grandTotal - sortedSales?.storeCut) /
        100
      ).toFixed(2)} // GRAND TOTAL $${(sortedSales?.grandTotal / 100).toFixed(
        2
      )}`}</div>
    </div>
  )
}
