import TransactionItems from './transaction-items'
import SaleDetails from './sale-details'
import SaleItems from './sale-items'

export default function SaleSummary({ cart }) {
  const { items = [], transactions = [] } = cart || {}
  // TODO make sale summary editable for in progress sales
  return (
    <div className={`flex flex-col justify-start h-menu bg-gray-100 p-4 overflow-y-scroll`}>
      <div className={`h-auto`}>
        <SaleItems items={items} />
      </div>
      <div
        className={`h-auto mt-1 pt-1 border-t border-gray-500 ${
          !transactions || (transactions?.length === 0 && ' hidden')
        }`}
      >
        <TransactionItems transactions={transactions} />
      </div>
      <div className="h-auto">
        <SaleDetails cart={cart} />
      </div>
    </div>
  )
}
