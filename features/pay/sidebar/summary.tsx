import { useAppStore } from 'lib/store'
import { SaleStateTypes } from 'lib/types/sale'

const Summary = ({ totalRemaining }) => {
  const { cart } = useAppStore()
  return (
    <div className="flex justify-between my-2">
      <div
        className={`text-2xl font-bold ${
          totalRemaining === 0 ? 'text-primary' : totalRemaining < 0 ? 'text-secondary' : 'text-tertiary'
        }`}
      >
        {cart?.sale?.state === SaleStateTypes.Completed
          ? 'SALE COMPLETED'
          : totalRemaining === 0
          ? 'ALL PAID'
          : totalRemaining < 0
          ? 'CUSTOMER OWED'
          : 'LEFT TO PAY'}
      </div>
      <div className="text-2xl text-red-500 font-bold text-xl">
        {totalRemaining === 0
          ? ''
          : totalRemaining < 0
          ? `$${Math.abs(totalRemaining || 0)?.toFixed(2)}`
          : `$${(totalRemaining || 0)?.toFixed(2)}`}
      </div>
      {cart?.sale?.state !== SaleStateTypes.Completed && totalRemaining === 0 && (
        <div className="font-sm">Click complete sale to finish.</div>
      )}
    </div>
  )
}

export default Summary
