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
<<<<<<< HEAD:features/sale/sale-item/sale-summary/transaction-items.tsx
          <TransactionListItem key={transaction?.id} transaction={transaction} isCompleted={isCompleted} />
=======
          <TransactionListItem key={transaction?.id} transaction={transaction} />
>>>>>>> parent of ca46a57... Make InProgress and Complete sale screens:features/sale-summary/transaction-items.tsx
        ))}
    </>
  )
}

export default TransactionItems
