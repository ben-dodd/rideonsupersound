import TextField from 'components/inputs/text-field'
import { useAppStore } from 'lib/store'
import PayButtons from './pay-buttons'
import Summary from './summary'
import Actions from './actions'

export default function Pay({ totalRemaining }) {
  const { cart, setCartSale } = useAppStore()
  const { sale = {} } = cart || {}

  return (
    <div className="flex flex-col justify-between">
      <Summary totalRemaining={totalRemaining} />
      <PayButtons totalRemaining={totalRemaining} />
      {/* <CustomerForm />
      <MailOrderForm /> */}
      <TextField
        inputLabel="Note"
        multiline
        rows={2}
        value={sale?.note}
        onChange={(e: any) => setCartSale({ note: e.target.value })}
      />
      <Actions totalRemaining={totalRemaining} />
    </div>
  )
}

// TODO Add refund items/ refund transactions
// TODO Add split sale for when person wants to take one layby item etc.
