import dayjs from 'dayjs'
import { useClerks } from 'lib/api/clerk'
import { priceCentsString } from 'lib/utils'
import { useRouter } from 'next/router'

const SaleDaySale = ({ sale }) => {
  const router = useRouter()
  const { clerks = [] } = useClerks()
  return (
    <div className="flex border-b border-gray-500 border-dotted" key={sale?.id}>
      <div
        className="w-5/12 hover:text-blue-500 cursor-pointer"
        onClick={() => {
          console.log(`sales/${sale?.id}`)
          router.push(`sales/${sale?.id}`)
        }}
      >{`[${sale?.id}] ${sale?.itemList}`}</div>
      <div className="w-7/12 text-right">
        {sale?.transactions?.map((transaction) => (
          <div className="flex" key={transaction?.id}>
            <div className="w-1/4">{dayjs(transaction?.date).format('h:mm A')}</div>
            <div className="w-1/4">{clerks?.filter((clerk) => clerk?.id === transaction.clerkId)?.[0]?.name}</div>
            <div className="w-1/4">{transaction?.paymentMethod?.toUpperCase?.()}</div>
            <div className="w-1/4 text-right">{priceCentsString(transaction?.amount)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SaleDaySale
