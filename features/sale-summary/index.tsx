import TransactionItems from './transaction-items'
import SaleItems from './sale-items'
import SaleDetails from './sale-details'

export default function SaleSummary({ cart }) {
  const { items = [], transactions = [] } = cart || {}
  return (
    <div className="flex flex-col h-content p-2">
      <div>
        <SaleItems items={items} />
      </div>
      <div className={`mt-1 pt-1 ${!transactions || (transactions?.length === 0 && ' hidden')}`}>
        <TransactionItems transactions={transactions} />
      </div>
      <div>
        <SaleDetails cart={cart} />
      </div>
    </div>
  )
}
