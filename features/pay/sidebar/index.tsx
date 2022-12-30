import TextField from 'components/inputs/text-field'
import ReturnIcon from '@mui/icons-material/KeyboardReturn'
import { useAppStore } from 'lib/store'
import { ViewProps } from 'lib/store/types'
import PayButtons from './pay-buttons'
import MailOrderForm from './mail-order-form'
import CustomerForm from './customer-form'
import Summary from './summary'

export default function Pay({ totalRemaining }) {
  const { cart, openView, setCartSale } = useAppStore()
  const { sale = {}, items = [] } = cart || {}

  return (
    <div className="flex flex-col justify-between">
      <Summary totalRemaining={totalRemaining} />
      <PayButtons totalRemaining={totalRemaining} />
      <CustomerForm />
      <MailOrderForm />
      <TextField
        inputLabel="Note"
        multiline
        value={sale?.note}
        onChange={(e: any) => setCartSale({ note: e.target.value })}
      />
      {sale?.id && (
        <div>
          <button
            className="icon-text-button ml-0"
            onClick={() => openView(ViewProps.returnItemDialog)}
            disabled={items?.length < 1}
          >
            <ReturnIcon className="mr-1" /> Return Items
          </button>
        </div>
      )}
    </div>
  )
}

// TODO Add refund items/ refund transactions
// TODO Add split sale for when person wants to take one layby item etc.
