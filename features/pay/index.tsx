import { useEffect } from 'react'
import { useAppStore } from 'lib/store'
import { useRouter } from 'next/router'
import SaleSummary from '../sale-summary'
import Pay from './sidebar'
import Loading from 'components/loading'

const PayScreen = ({ totalRemaining, isLoading }) => {
  const { cart } = useAppStore()
  const { sale = {}, items = [] } = cart || {}
  const router = useRouter()
  useEffect(() => {
    if (!sale?.id && items?.length === 0) router.replace('/sell')
  }, [sale, items])

  return (
    <div className="flex items-start overflow-auto w-full h-main">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className="w-2/3">
            <SaleSummary cart={cart} />
          </div>
          <div className="w-1/3 h-main p-2 flex flex-col justify-between shadow-md">
            <Pay totalRemaining={totalRemaining} />
          </div>
        </>
      )}
    </div>
  )
}

export default PayScreen

// TODO add returns to sale items
// TODO refund dialog like PAY, refund with store credit, cash or card

// BUG fix bug where close register screen appears (pressing TAB) - have fixed by just hiding sidebars and screens
// BUG fix bug where bottom of dialog is visible
// BUG dates are wrong on vercel
// BUG why are some sales showing items as separate line items, not 2x quantity
// TODO refunding items, then adding the same item again
