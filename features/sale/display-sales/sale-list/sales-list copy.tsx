import MidScreenContainer from 'components/container/mid-screen'
import dayjs from 'dayjs'
import { useClerks } from 'lib/api/clerk'
import { useSalesForRange } from 'lib/hooks/sales'
import { useAppStore } from 'lib/store'
import { useMemo } from 'react'
import Filter from './sales-view-filter'

export default function SalesList() {
  const { salesViewRange } = useAppStore()
  const { sales } = useSalesForRange(salesViewRange)
  const { registers, isRegistersLoading } = useRegisters(salesViewRange)
  const { clerks, isClerksLoading } = useClerks()
  const sortedSales = useMemo(() => {
    // Sort sales into 2D array
    // [{ day: '', sales: [{ time, sale | register }]}]
    console.log(saleTransactions)
    console.log(registers)
    let grandTotal = 0
    let saleMap = {}
    saleTransactions?.forEach?.((transaction) => {
      if (salesViewClerks?.length === 0 || salesViewClerks?.includes(transaction?.clerk_id)) {
        let day = dayjs(transaction?.date)?.format('YYYY-MM-DD')
        if (saleMap?.[day] === undefined) saleMap[day] = { day, sales: {}, registers: [], total: 0 }
        if (saleMap?.[day]?.sales[transaction?.sale_id] === undefined)
          saleMap[day].sales[transaction?.sale_id] = {
            id: transaction?.sale_id,
            item_list: transaction?.item_list,
            transactions: [],
          }
        saleMap[day].sales[transaction?.sale_id].transactions.push(transaction)
        saleMap[day].total += transaction.amount
        grandTotal += transaction.amount
      }
    })
    registers?.forEach?.((register) => {
      let openDay = dayjs(register?.open_date)?.format('YYYY-MM-DD')
      let closeDay = dayjs(register?.close_date)?.format('YYYY-MM-DD')
      if (saleMap?.[openDay] !== undefined) saleMap[openDay].registers.push({ ...register, type: 'open' })
      if (saleMap?.[closeDay] !== undefined) saleMap[closeDay].registers.push({ ...register, type: 'close' })
    })
    console.log(Object.values(saleMap))

    let saleArray = Object.values(saleMap)?.map((saleDay: any) => {
      console.log(saleDay)
      return { ...saleDay, sales: Object.values(saleDay.sales) }
    })

    console.log(saleArray)
    return { grandTotal, saleArray }
  }, [saleTransactions, registers, salesViewClerks])
  return (
    <MidScreenContainer title={'SALES'} titleClass={'bg-col5'} isLoading={isClerksLoading}>
      <div>
        <Filter />
        <div className="h-dialog overflow-y-scroll px-2">
          {isSaleTransactionsLoading || isRegistersLoading || isClerksLoading ? (
            <div className="loading-screen">
              <div className="loading-icon" />
            </div>
          ) : sortedSales?.saleArray?.length === 0 ? (
            <div className="font-bold text-sm my-8 text-center">NO SALES FOR THIS PERIOD</div>
          ) : (
            sortedSales?.saleArray?.map((saleDay) => (
              <div key={saleDay?.day}>
                <div className="border-b border-black border-double font-bold mb-2 mt-8">
                  {dayjs(saleDay?.day).format('dddd, MMMM D, YYYY')}
                </div>
                {saleDay?.sales?.map?.((sale: any) => (
                  <div className="flex border-b border-gray-500 border-dotted" key={sale?.id}>
                    <div className="w-5/12">{`[${sale?.id}] ${sale?.item_list}`}</div>
                    <div className="w-7/12 text-right">
                      {sale?.transactions?.map((transaction) => (
                        <div className="flex" key={transaction?.id}>
                          <div className="w-1/4">{dayjs(transaction?.date).format('h:mm A')}</div>
                          <div className="w-1/4">
                            {clerks?.filter((clerk) => clerk?.id === transaction.clerk_id)?.[0]?.name}
                          </div>
                          <div className="w-1/4">{transaction?.payment_method?.toUpperCase?.()}</div>
                          <div className="w-1/4 text-right">{`$${(transaction?.amount / 100)?.toFixed(2)}`}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="border-t border-black font-bold mb-8 mt-2 w-full text-right">{`$${(
                  saleDay?.total / 100
                )?.toFixed(2)}`}</div>
              </div>
            ))
          )}
        </div>
        <div className="bg-col5 w-full text-right font-bold text-lg pt-2 border-t-2 px-2">{`GRAND TOTAL $${(
          sortedSales?.grandTotal / 100
        ).toFixed(2)}`}</div>
      </div>
    </MidScreenContainer>
  )
}
