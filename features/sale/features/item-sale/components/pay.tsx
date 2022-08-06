// Packages
import { useAtom } from 'jotai'

// DB
import {
  cartAtom,
  clerkAtom,
  loadedCustomerObjectAtom,
  viewAtom,
} from 'lib/atoms'
import { useCustomers, useInventory } from 'lib/database/read'
import { CustomerObject, SaleStateTypes } from 'lib/types'

// Functions
import { getSaleVars } from 'lib/data-functions'

// Components
import CreateableSelect from '@/components/inputs/createable-select'
import TextField from '@/components/inputs/text-field'

import ReturnIcon from '@mui/icons-material/KeyboardReturn'
import { saveSystemLog } from 'lib/db-functions'

export default function Pay() {
  // Atoms
  const [cart, setCart] = useAtom(cartAtom)
  const [, setCustomer] = useAtom(loadedCustomerObjectAtom)
  const [clerk] = useAtom(clerkAtom)
  const [view, setView] = useAtom(viewAtom)

  // SWR
  const { customers } = useCustomers()
  const { inventory } = useInventory()

  // State
  const { totalRemaining } = getSaleVars(cart, inventory)
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
            setView({ ...view, cashPaymentDialog: true })
          }}
          disabled={totalRemaining === 0}
        >
          CASH
        </button>
        <button
          className="square-button"
          onClick={() => {
            saveSystemLog('CARD PAYMENT clicked.', clerk?.id)
            setView({ ...view, cardPaymentDialog: true })
          }}
          disabled={totalRemaining === 0}
        >
          CARD
        </button>
        <button
          className="square-button"
          onClick={() => {
            saveSystemLog('ACCT PAYMENT clicked.', clerk?.id)
            setView({ ...view, acctPaymentDialog: true })
          }}
          disabled={totalRemaining === 0}
        >
          ACCT
        </button>
        <button
          className="square-button"
          onClick={() => {
            saveSystemLog('GIFT PAYMENT clicked.', clerk?.id)
            setView({ ...view, giftPaymentDialog: true })
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
            {cart?.customer_id ? (
              <div>
                <div className="font-bold">Customer</div>
                <div>
                  {customers?.filter(
                    (c: CustomerObject) => c?.id === cart?.customer_id
                  )[0]?.name || ''}
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
              value={cart?.customer_id}
              label={
                customers?.filter(
                  (c: CustomerObject) => c?.id === cart?.customer_id
                )[0]?.name || ''
              }
              onChange={(customerObject: any) => {
                saveSystemLog('SALE SCREEN customer selected.', clerk?.id)
                setCart((s) => ({
                  ...s,
                  customer_id: parseInt(customerObject?.value),
                }))
              }}
              onCreateOption={(inputValue: string) => {
                saveSystemLog(
                  'SALE SCREEN new customer screen opened.',
                  clerk?.id
                )
                setCustomer({ name: inputValue })
                setView({ ...view, createCustomer: true })
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
            disabled={!cart?.customer_id}
            className="cursor-pointer"
            type="checkbox"
            checked={cart?.is_mail_order}
            onChange={() => {
              saveSystemLog('SALE SCREEN - IS MAIL ORDER clicked.', clerk?.id)
              setCart((s) => ({ ...s, is_mail_order: !s?.is_mail_order }))
            }}
          />
          <div className="ml-2">Mail order</div>
        </div>
        {cart?.is_mail_order ? (
          <div>
            <TextField
              inputLabel="Postage Fee"
              startAdornment="$"
              inputType="number"
              valueNum={cart?.postage}
              onChange={(e: any) =>
                setCart({ ...cart, postage: e.target.value })
              }
            />
            <TextField
              inputLabel="Postal Address"
              multiline
              value={
                cart?.postal_address ||
                customers?.filter(
                  (c: CustomerObject) => c?.id === cart?.customer_id
                )[0]?.postal_address ||
                ''
              }
              onChange={(e: any) =>
                setCart({ ...cart, postal_address: e.target.value })
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
        onChange={(e: any) => setCart({ ...cart, note: e.target.value })}
      />
      {cart?.id && (
        <div>
          <button
            className="icon-text-button ml-0"
            onClick={() => setView({ ...view, returnItemDialog: true })}
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
