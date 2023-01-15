import { useAppStore } from 'lib/store'
import { ViewProps } from 'lib/store/types'

const PayButtons = ({ totalRemaining }) => {
  const { openView } = useAppStore()
  return (
    <div className="grid grid-cols-2 gap-2 mt-4">
      <button
        className={`square-button ${totalRemaining < 0 ? 'secondary-button' : 'tertiary-button'}`}
        onClick={() => {
          openView(ViewProps.cashPaymentDialog)
        }}
        disabled={totalRemaining === 0}
      >
        CASH
      </button>
      <button
        className={`square-button ${totalRemaining < 0 ? 'secondary-button' : 'tertiary-button'}`}
        onClick={() => {
          openView(ViewProps.cardPaymentDialog)
        }}
        disabled={totalRemaining === 0}
      >
        CARD
      </button>
      <button
        className={`square-button ${totalRemaining < 0 ? 'secondary-button' : 'tertiary-button'}`}
        onClick={() => {
          openView(ViewProps.acctPaymentDialog)
        }}
        disabled={totalRemaining === 0}
      >
        ACCT
      </button>
      <button
        className={`square-button ${totalRemaining < 0 ? 'secondary-button' : 'tertiary-button'}`}
        onClick={() => {
          openView(ViewProps.giftPaymentDialog)
        }}
        disabled={totalRemaining === 0}
      >
        GIFT
      </button>
    </div>
  )
}

export default PayButtons
