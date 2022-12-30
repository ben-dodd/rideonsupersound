import { CustomerObject } from 'lib/types'
import CreateableSelect from 'components/inputs/createable-select'
import TextField from 'components/inputs/text-field'
import ReturnIcon from '@mui/icons-material/KeyboardReturn'
import { useAppStore } from 'lib/store'
import { ViewProps } from 'lib/store/types'
import { useCustomers } from 'lib/api/customer'
import { useSaleProperties } from 'lib/hooks'
import { SaleStateTypes } from 'lib/types/sale'

export default function Pay() {
  const { cart, openView, setCartSale, setCustomer } = useAppStore()
  const { sale = {}, items = [] } = cart || {}
  const { totalRemaining } = useSaleProperties(cart)
  const { customers = [] } = useCustomers()
  // customers?.find((c) => c?.id === sale?.customerId)?.postalAddress
  return (
    <div className="flex flex-col justify-between">
      <div className="flex justify-between my-2">
        <div
          className={`text-2xl font-bold ${
            totalRemaining === 0 ? 'text-primary' : totalRemaining < 0 ? 'text-secondary' : 'text-tertiary'
          }`}
        >
          {sale?.state === SaleStateTypes.Completed
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
      </div>
      {sale?.state !== SaleStateTypes.Completed && totalRemaining === 0 && (
        <div className="font-sm">Click complete sale to finish.</div>
      )}
      <div className="grid grid-cols-2 gap-2 mt-4">
        <button
          className="square-button"
          onClick={() => {
            openView(ViewProps.cashPaymentDialog)
          }}
          disabled={totalRemaining === 0}
        >
          CASH
        </button>
        <button
          className="square-button"
          onClick={() => {
            openView(ViewProps.cardPaymentDialog)
          }}
          disabled={totalRemaining === 0}
        >
          CARD
        </button>
        <button
          className="square-button"
          onClick={() => {
            openView(ViewProps.acctPaymentDialog)
          }}
          disabled={totalRemaining === 0}
        >
          ACCT
        </button>
        <button
          className="square-button"
          onClick={() => {
            openView(ViewProps.giftPaymentDialog)
          }}
          disabled={totalRemaining === 0}
        >
          GIFT
        </button>
      </div>
      <div className={`${sale?.state === SaleStateTypes.Completed ? 'hidden' : ''}`}>
        {sale?.state === SaleStateTypes.Layby ? (
          <div className="mt-2">
            {sale?.customerId ? (
              <div>
                <div className="font-bold">Customer</div>
                <div>{customers?.find((c: CustomerObject) => c?.id === sale?.customerId)?.name || ''}</div>
              </div>
            ) : (
              <div>No customer set.</div>
            )}
          </div>
        ) : (
          <>
            <div className="font-bold mt-2">Select customer to enable laybys and mail orders.</div>
            <CreateableSelect
              inputLabel="Select customer"
              value={sale?.customerId}
              label={customers?.find((c: CustomerObject) => c?.id === sale?.customerId)?.name || ''}
              onChange={(customerObject: any) => {
                setCartSale({ customerId: parseInt(customerObject?.value) })
              }}
              onCreateOption={(inputValue: string) => {
                setCustomer({ name: inputValue })
                openView(ViewProps.createCustomer)
              }}
              options={customers?.map((val: CustomerObject) => ({
                value: val?.id,
                label: val?.name || '',
              }))}
            />
          </>
        )}
        <div className="flex mt-2">
          <input
            disabled={!sale?.customerId}
            className="cursor-pointer"
            type="checkbox"
            checked={sale?.isMailOrder}
            onChange={() => {
              setCartSale({ isMailOrder: !sale?.isMailOrder })
            }}
          />
          <div className="ml-2">Mail order</div>
        </div>
        {sale?.isMailOrder ? (
          <div>
            <TextField
              inputLabel="Postage Fee"
              startAdornment="$"
              inputType="number"
              valueNum={sale?.postage}
              onChange={(e: any) => setCartSale({ postage: e.target.value })}
            />
            <TextField
              inputLabel="Postal Address"
              multiline
              value={
                sale?.postalAddress ||
                customers?.find((c: CustomerObject) => c?.id === sale?.customerId)?.postalAddress ||
                ''
              }
              onChange={(e: any) => setCartSale({ postalAddress: e.target.value })}
            />
          </div>
        ) : (
          <div />
        )}
      </div>
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
