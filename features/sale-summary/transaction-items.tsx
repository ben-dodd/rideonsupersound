import dayjs from 'dayjs'
import { SaleTransactionObject } from 'lib/types/sale'
import TransactionListItem from './transaction-list-item'

const TransactionItems = ({ transactions }) => {
  return (
    <>
      {[...transactions]
        ?.sort((transA: SaleTransactionObject, transB: SaleTransactionObject) => {
          const a = dayjs(transA?.date)
          const b = dayjs(transB?.date)
          return a > b ? 1 : b > a ? -1 : 0
        })
        ?.map((transaction: SaleTransactionObject) => (
          <TransactionListItem key={transaction?.id} transaction={transaction} />
        ))}
    </>
  )
}

export default TransactionItems
