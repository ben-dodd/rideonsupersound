import { useAppStore } from 'lib/store'
import { SaleStateTypes } from 'lib/types/sale'

const Summary = ({ totalRemaining }) => {
  const { cart } = useAppStore()
  const { sale = {} } = cart || {}

  return (
    <div>
      <div className="flex justify-between my-2">
        <div
          className={`text-2xl font-bold p-2 ${
            totalRemaining === 0 ? 'text-primary' : totalRemaining < 0 ? 'text-secondary' : 'text-red-500'
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
        <div className="text-2xl text-green-200 font-bold p-2 rounded-md bg-black">
          {totalRemaining === 0
            ? ''
            : totalRemaining < 0
            ? `$${Math.abs(totalRemaining || 0)?.toFixed(2)}`
            : `$${(totalRemaining || 0)?.toFixed(2)}`}
        </div>
        {cart?.sale?.state !== SaleStateTypes.Completed && totalRemaining === 0 && (
          <div className="font-sm">Click complete sale to finish.</div>
          // TODO when totalRemaining is zero, the left to pay box should turn into a COMPLETE BUTTON
        )}
      </div>
      {/* <div className="flex justify-between border-t">
        <div className={'text-lg p-2 font-bold'}>{`${sale?.id ? `SALE #${sale?.id}` : `NEW SALE`} [${
          sale?.state ? sale?.state.toUpperCase() : 'IN PROGRESS'
        }]`}</div>
      </div> */}
    </div>
  )
}

export default Summary
