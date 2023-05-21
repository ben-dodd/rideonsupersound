import { useAppStore } from 'lib/store'
import { SaleStateTypes } from 'lib/types/sale'
import { priceDollarsString } from 'lib/utils'

const Summary = ({ totalRemaining }) => {
  const { cart } = useAppStore()
  const { sale = {} } = cart || {}

  return (
    <div>
      <div className={`flex my-2 ${totalRemaining === 0 ? 'justify-center' : 'justify-between'}`}>
        <div
          className={`text-2xl font-bold p-2 ${
            totalRemaining === 0 ? 'text-primary text-6xl' : totalRemaining < 0 ? 'text-secondary' : 'text-red-500'
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
        {totalRemaining !== 0 && (
          <div className="text-2xl text-green-200 font-bold p-2 rounded-md bg-black shadow-inner">
            {priceDollarsString(Math.abs(totalRemaining))}
          </div>
        )}
      </div>
      {sale?.state !== SaleStateTypes.Completed && totalRemaining === 0 && (
        <div className="flex justify-center text-xl">Click complete sale to finish.</div>
        // TODO when totalRemaining is zero, the left to pay box should turn into a COMPLETE BUTTON
      )}
      {/* <div className="flex justify-between border-t">
        <div className={'text-lg p-2 font-bold'}>{`${sale?.id ? `SALE #${sale?.id}` : `NEW SALE`} [${
          sale?.state ? sale?.state.toUpperCase() : 'IN PROGRESS'
        }]`}</div>
      </div> */}
    </div>
  )
}

export default Summary
