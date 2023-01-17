import { ClerkObject } from 'lib/types'
import dayjs from 'dayjs'
import { useClerks } from 'lib/api/clerk'
import { SaleTransactionObject } from 'lib/types/sale'

export default function CashItem({
  transaction,
  field,
  negative,
}: {
  transaction: SaleTransactionObject
  field?: string
  negative?: boolean
}) {
  const { clerks } = useClerks()
  const transactionBy = clerks?.find((c: ClerkObject) => c?.id === transaction?.clerkId)?.name
  const date = dayjs(transaction?.date).format('H:mm A, D MMMM YYYY')

  // REVIEW Add more info to cash items, possibly add receipt pop up info dialog
  const value = transaction[field || 'amount']

  return (
    <>
      <div className="flex justify-between text-sm">
        <div
          className={
            value < 0 ? (negative ? 'text-secondary' : 'text-tertiary') : negative ? 'text-tertiary' : 'text-secondary'
          }
        >{`${value < 0 ? (negative ? '+' : '-') : negative ? '-' : '+'} $${Math.abs(value / 100)?.toFixed(2)}`}</div>
        <div>{`${transactionBy} (${date})`}</div>
      </div>
      {/*transaction?.note && <div className="text-xs">{transaction?.note}</div>*/}
    </>
  )
}