import TransactionItems from './transaction-items'
import SaleDetails from './sale-details'
import SaleItems from './sale-items'

export default function SaleSummary({ cart }) {
  const { items = [], transactions = [] } = cart || {}
  return (
    <div className={`flex flex-col justify-start h-dialoglg bg-gray-100 p-4 rounded-md`}>
      <SaleItems items={items} />
      <TransactionItems transactions={transactions} />
      <SaleDetails cart={cart} />
    </div>
  )
}
