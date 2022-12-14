import { useState } from 'react'
import SidebarContainer from 'components/container/side-bar'
import CreateableSelect from 'components/inputs/createable-select'
import TextField from 'components/inputs/text-field'
import { addRestockTask } from 'features/job/lib/functions'
import { logCreateHold, saveSystemLog } from 'features/log/lib/functions'
import {
  createHoldInDatabase,
  createStockMovementInDatabase,
} from 'lib/database/create'
import {
  CustomerObject,
  ModalButton,
  StockMovementTypes,
  StockObject,
} from 'lib/types'
import { getItemQuantity } from '../../sell/lib/functions'
import ListItem from './list-item'
import { useAppStore } from 'lib/store'
import { useClerk } from 'lib/api/clerk'
import { ViewProps } from 'lib/store/types'
import { useCustomers } from 'lib/api/customer'
import { useCurrentRegisterId } from 'lib/api/register'

export default function CreateHoldSidebar() {
  const {
    cart,
    view,
    setAlert,
    setCart,
    setCustomer,
    resetCart,
    resetSellSearchBar,
    openView,
    closeView,
  } = useAppStore()
  const { clerk } = useClerk()

  const { customers } = useCustomers()
  // const { inventory } = useInventory()
  // const { logs, mutateLogs } = useLogs()
  const { registerID } = useCurrentRegisterId()

  const [holdPeriod, setHoldPeriod] = useState(30)
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Functions
  async function onClickConfirmHold() {
    saveSystemLog('Confirm Hold clicked.', clerk?.id)
    setSubmitting(true)
    // Create hold

    cart?.items.forEach(
      // Create hold for each item
      async (cartItem) => {
        const item = inventory?.filter(
          (i: StockObject) => i?.id === cartItem?.itemId
        )[0]
        const itemQuantity = getItemQuantity(item, cart?.items)
        if (itemQuantity > 0) {
          addRestockTask(cartItem?.itemId)
        }
        const holdId = await createHoldInDatabase(
          cart,
          cartItem,
          holdPeriod,
          note,
          clerk,
          registerID
        )
        createStockMovementInDatabase({
          item,
          clerk,
          registerID,
          act: StockMovementTypes.Hold,
        })
        logCreateHold(
          cart,
          cartItem,
          inventory,
          customers,
          holdPeriod,
          clerk,
          holdId
        )
      }
    )
    setAlert({
      open: true,
      type: 'success',
      message: `ITEM${cart?.items?.length === 1 ? '' : 'S'} PUT ON HOLD FOR ${(
        customers?.filter((c: CustomerObject) => c?.id === cart?.customerId)[0]
          ?.name || ''
      ).toUpperCase()}.`,
    })

    // Reset vars and return to inventory scroll
    setSubmitting(false)
    resetSellSearchBar()
    resetCart()
    closeView(ViewProps.cart)
    closeView(ViewProps.createHold)
  }

  const buttons: ModalButton[] = [
    {
      type: 'cancel',
      onClick: () => {
        saveSystemLog('New hold cancelled.', clerk?.id)
        closeView(ViewProps.cart)
        closeView(ViewProps.createHold)
      },
      text: 'CANCEL',
    },
    {
      type: 'ok',
      onClick: onClickConfirmHold,
      disabled:
        !cart?.customerId ||
        Object.keys(cart?.items || {}).length === 0 ||
        !holdPeriod,
      text: submitting ? 'HOLDING...' : 'CONFIRM HOLD',
    },
  ]

  return (
    <SidebarContainer
      show={view?.createHold}
      title={'Hold Items'}
      buttons={buttons}
    >
      <div className="flex-grow overflow-x-hidden overflow-y-scroll">
        {cart?.items?.length > 0 ? (
          cart?.items?.map((cartItem, i) => (
            <ListItem key={i} cartItem={cartItem} />
          ))
        ) : (
          <div>No items</div>
        )}
      </div>
      <div>
        <CreateableSelect
          inputLabel="Select customer"
          fieldRequired
          value={cart?.customerId}
          label={
            customers?.filter(
              (c: CustomerObject) => c?.id === cart?.customerId
            )[0]?.name || ''
          }
          onChange={(customerObject: any) => {
            saveSystemLog('New hold sidebar - Customer selected.', clerk?.id)
            setCart({ customerId: parseInt(customerObject?.value) })
          }}
          onCreateOption={(inputValue: string) => {
            saveSystemLog('New hold sidebar - Customer created.', clerk?.id)
            setCustomer({ name: inputValue })
            openView(ViewProps.createCustomer)
          }}
          options={customers?.map((val: CustomerObject) => ({
            value: val?.id,
            label: val?.name || '',
          }))}
        />
        <TextField
          inputLabel="Hold for how many days?"
          selectOnFocus
          fieldRequired
          min={1}
          max={100}
          inputType="number"
          valueNum={holdPeriod}
          onChange={(e: any) => setHoldPeriod(e.target.value)}
        />
        <TextField
          inputLabel="Note"
          multiline
          value={note}
          onChange={(e: any) => setNote(e.target.value)}
        />
      </div>
    </SidebarContainer>
  )
}
