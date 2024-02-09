import { ClerkObject } from 'lib/types'
import dayjs from 'dayjs'
import { useClerks } from 'lib/api/clerk'
import { SaleTransactionObject } from 'lib/types/sale'
import { useRouter } from 'next/router'
import { priceCentsString } from 'lib/utils'
import { timeDateShort } from 'lib/types/date'

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
  const date = dayjs(transaction?.date).format(timeDateShort)
  const router = useRouter()

  // REVIEW Add more info to cash items, possibly add receipt pop up info dialog
  const value = transaction[field || 'amount']

  return (
    <>
      <div className="flex text-sm w-full">
        <div
          className={`text-right w-1/3 ${
            value < 0 ? (negative ? 'text-secondary' : 'text-tertiary') : negative ? 'text-tertiary' : 'text-secondary'
          }`}
        >{`${value < 0 ? (negative ? '+' : '-') : negative ? '-' : '+'} ${priceCentsString(Math.abs(value))}`}</div>
        <div
          className={`ml-2 w-2/3 ${transaction?.saleId ? 'link-yellow' : ''}`}
          onClick={transaction?.saleId ? () => router.push(`/sales/${transaction?.saleId}`) : null}
        >{`${date} ${transactionBy ? ` [${transactionBy}]` : ''}`}</div>
      </div>
      {/*transaction?.note && <div className="text-xs">{transaction?.note}</div>*/}
    </>
  )
}
