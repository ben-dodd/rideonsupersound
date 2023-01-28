import TransactionItems from './transaction-items'
import SaleItems from './sale-items'
import { ArrowCircleLeftRounded } from '@mui/icons-material'
import { useRouter } from 'next/router'
import SaleDetails from './sale-details'

export default function SaleSummary({ cart }) {
  const { sale = {}, items = [], transactions = [] } = cart || {}
  const router = useRouter()
  const handleBackClick = () => {
    if (router.pathname?.includes('/sell')) router.push('/sell')
    else router.back()
  }
  return (
    <>
      <div className="flex h-header items-center bg-gray-100">
        <button className="hover:text-blue-500 p-2" onClick={handleBackClick}>
          <ArrowCircleLeftRounded />
        </button>
        <div className={'text-2xl p-2 font-bold'}>{`${sale?.id ? `SALE #${sale?.id}` : `NEW SALE`} [${
          sale?.state ? sale?.state.toUpperCase() : 'IN PROGRESS'
        }]`}</div>
      </div>
      <div className={`flex flex-col justify-start h-content bg-gray-100 p-4 overflow-y-scroll`}>
        <div className={`h-full`}>
          <SaleItems items={items} />
        </div>
        <div
          className={`mt-1 pt-1 border-t border-gray-500 ${!transactions || (transactions?.length === 0 && ' hidden')}`}
        >
          <TransactionItems transactions={transactions} />
        </div>
        <div>
          <SaleDetails cart={cart} />
        </div>
      </div>
    </>
  )
}
