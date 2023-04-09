import TransactionItems from './transaction-items'
import SaleItems from './sale-items'
import SaleDetails from './sale-details'
import { SaleStateTypes } from 'lib/types/sale'

export default function SaleSummary({ saleObject }) {
  const { items = [], transactions = [], sale = {} } = saleObject || {}
  const isCompleted = sale?.state === SaleStateTypes.Completed
  return (
    <div className="flex flex-col h-content p-2">
      <div>
        <SaleItems items={items} isCompleted />
      </div>
      <div className={`mt-1 pt-1 ${!transactions || (transactions?.length === 0 && ' hidden')}`}>
        <TransactionItems transactions={transactions} isCompleted />
      </div>
      <div>
        <SaleDetails saleObject={saleObject} />
      </div>
    </div>
  )
}
