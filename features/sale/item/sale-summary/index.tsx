import SaleItems from './sale-items'
import SaleDetails from './sale-details'
import TransactionItems from './transaction-items'

export default function SaleSummary({ cart, isEditable = false }) {
  const { items = [], transactions = [] } = cart || {}
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