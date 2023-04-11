import SaleItems from './sale-items'
import SaleDetails from './sale-details'
import { useRouter } from 'next-router-mock'
import TransactionItems from './transaction-items'

export default function SaleSummary({ cart }) {
  const { items = [], transactions = [], sale = {} } = cart || {}
  const router = useRouter()
  const isEditable = router.pathname.includes('/sell')
  return (
    <div className="flex flex-col h-content p-2">
      <div>
        <SaleItems items={items} isEditable={isEditable} />
      </div>
      <div className={`mt-1 pt-1 ${!transactions || (transactions?.length === 0 && ' hidden')}`}>
        <TransactionItems transactions={transactions} isEditable={isEditable} />
      </div>
      <div>
        <SaleDetails cart={cart} />
      </div>
    </div>
  )
}
