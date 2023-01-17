import { useSalesForRange } from 'lib/hooks/sales'
import { useAppStore } from 'lib/store'

export default function SalesList() {
  const { salesViewRange } = useAppStore()
  const { sales } = useSalesForRange(salesViewRange)
  console.log('sales view range', salesViewRange)
  console.log(sales)
  // const { registers, isRegistersLoading } = useRegisters(salesViewRange)
  // const { clerks, isClerksLoading } = useClerks()
  // const sortedSales = useMemo(() => {
  //   // Sort sales into 2D array
  //   // [{ day: '', sales: [{ time, sale | register }]}]
  //   console.log(saleTransactions)
  //   console.log(registers)
  //   let grandTotal = 0
  //   let saleMap = {}
  //   saleTransactions?.forEach?.((transaction) => {
  //     if (
  //       salesViewClerks?.length === 0 ||
  //       salesViewClerks?.includes(transaction?.clerk_id)
  //     ) {
  //       let day = dayjs(transaction?.date)?.format('YYYY-MM-DD')
  //       if (saleMap?.[day] === undefined)
  //         saleMap[day] = { day, sales: {}, registers: [], total: 0 }
  //       if (saleMap?.[day]?.sales[transaction?.sale_id] === undefined)
  //         saleMap[day].sales[transaction?.sale_id] = {
  //           id: transaction?.sale_id,
  //           item_list: transaction?.item_list,
  //           transactions: [],
  //         }
  //       saleMap[day].sales[transaction?.sale_id].transactions.push(transaction)
  //       saleMap[day].total += transaction.amount
  //       grandTotal += transaction.amount
  //     }
  //   })
  //   registers?.forEach?.((register) => {
  //     let openDay = dayjs(register?.open_date)?.format('YYYY-MM-DD')
  //     let closeDay = dayjs(register?.close_date)?.format('YYYY-MM-DD')
  //     if (saleMap?.[openDay] !== undefined)
  //       saleMap[openDay].registers.push({ ...register, type: 'open' })
  //     if (saleMap?.[closeDay] !== undefined)
  //       saleMap[closeDay].registers.push({ ...register, type: 'close' })
  //   })
  //   console.log(Object.values(saleMap))

  //   let saleArray = Object.values(saleMap)?.map((saleDay: any) => {
  //     console.log(saleDay)
  //     return { ...saleDay, sales: Object.values(saleDay.sales) }
  //   })

  //   console.log(saleArray)
  //   return { grandTotal, saleArray }
  // }, [saleTransactions, registers, salesViewClerks])
  return <div></div>
}
