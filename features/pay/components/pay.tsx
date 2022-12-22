import { CustomerObject, SaleStateTypes } from 'lib/types'
import CreateableSelect from 'components/inputs/createable-select'
import TextField from 'components/inputs/text-field'
import { saveSystemLog } from 'features/log/lib/functions'
import ReturnIcon from '@mui/icons-material/KeyboardReturn'
import { useClerk } from 'lib/api/clerk'
import { useAppStore } from 'lib/store'
import { ViewProps } from 'lib/store/types'
import { useCustomers } from 'lib/api/customer'
import { useSaleProperties } from 'lib/hooks'

export default function Pay() {
  const { clerk } = useClerk()
  const { cart, openView, setCartSale, setCustomer } = useAppStore()
  const { totalRemaining } = useSaleProperties(cart)
  const { customers } = useCustomers()
  return (
    <div className="flex flex-col justify-between">
      <div className="flex justify-between my-2">
        <div
          className={`text-2xl font-bold ${
            totalRemaining === 0
              ? 'text-primary'
              : totalRemaining < 0
              ? 'text-secondary'
              : 'text-tertiary'
          }`}
        >
          {cart?.state === SaleStateTypes.Completed
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
      {cart?.state !== SaleStateTypes.Completed && totalRemaining === 0 && (
        <div className="font-sm">Click complete sale to finish.</div>
      )}
      <div className="grid grid-cols-2 gap-2 mt-4">
        <button
          className="square-button"
          onClick={() => {
            saveSystemLog('CASH PAYMENT clicked.', clerk?.id)
            openView(ViewProps.cashPaymentDialog)
          }}
          disabled={totalRemaining === 0}
        >
          CASH
        </button>
        <button
          className="square-button"
          onClick={() => {
            saveSystemLog('CARD PAYMENT clicked.', clerk?.id)
            openView(ViewProps.cardPaymentDialog)
          }}
          disabled={totalRemaining === 0}
        >
          CARD
        </button>
        <button
          className="square-button"
          onClick={() => {
            saveSystemLog('ACCT PAYMENT clicked.', clerk?.id)
            openView(ViewProps.acctPaymentDialog)
          }}
          disabled={totalRemaining === 0}
        >
          ACCT
        </button>
        <button
          className="square-button"
          onClick={() => {
            saveSystemLog('GIFT PAYMENT clicked.', clerk?.id)
            openView(ViewProps.giftPaymentDialog)
          }}
          disabled={totalRemaining === 0}
        >
          GIFT
        </button>
      </div>
      <div
        className={`${
          cart?.state === SaleStateTypes.Completed ? 'hidden' : ''
        }`}
      >
        {cart?.state === SaleStateTypes.Layby ? (
          <div className="mt-2">
            {cart?.customerId ? (
              <div>
                <div className="font-bold">Customer</div>
                <div>
                  {customers?.find(
                    (c: CustomerObject) => c?.id === cart?.customerId
                  )?.name || ''}
                </div>
              </div>
            ) : (
              <div>No customer set.</div>
            )}
          </div>
        ) : (
          <>
            <div className="font-bold mt-2">
              Select customer to enable laybys and mail orders.
            </div>
            <CreateableSelect
              inputLabel="Select customer"
              value={cart?.customerId}
              label={
                customers?.find(
                  (c: CustomerObject) => c?.id === cart?.customerId
                )?.name || ''
              }
              onChange={(customerObject: any) => {
                saveSystemLog('SALE SCREEN customer selected.', clerk?.id)
                setCartSale({ customerId: parseInt(customerObject?.value) })
              }}
              onCreateOption={(inputValue: string) => {
                saveSystemLog(
                  'SALE SCREEN new customer screen opened.',
                  clerk?.id
                )
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
            disabled={!cart?.customerId}
            className="cursor-pointer"
            type="checkbox"
            checked={cart?.isMailOrder}
            onChange={() => {
              saveSystemLog('SALE SCREEN - IS MAIL ORDER clicked.', clerk?.id)
              setCartSale({ isMailOrder: !cart?.isMailOrder })
            }}
          />
          <div className="ml-2">Mail order</div>
        </div>
        {cart?.isMailOrder ? (
          <div>
            <TextField
              inputLabel="Postage Fee"
              startAdornment="$"
              inputType="number"
              valueNum={cart?.postage}
              onChange={(e: any) => setCartSale({ postage: e.target.value })}
            />
            <TextField
              inputLabel="Postal Address"
              multiline
              value={
                cart?.postalAddress ||
                customers?.find(
                  (c: CustomerObject) => c?.id === cart?.customerId
                )?.postalAddress ||
                ''
              }
              onChange={(e: any) =>
                setCartSale({ postalAddress: e.target.value })
              }
            />
          </div>
        ) : (
          <div />
        )}
      </div>
      <TextField
        inputLabel="Note"
        multiline
        value={cart?.note}
        onChange={(e: any) => setCartSale({ note: e.target.value })}
      />
      {cart?.id && (
        <div>
          <button
            className="icon-text-button ml-0"
            onClick={() => openView(ViewProps.returnItemDialog)}
            disabled={cart?.items?.length < 1}
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
