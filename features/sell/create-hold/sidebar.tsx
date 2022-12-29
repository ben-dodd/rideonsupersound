import { useState } from 'react'
import SidebarContainer from 'components/container/side-bar'
import CreateableSelect from 'components/inputs/createable-select'
import TextField from 'components/inputs/text-field'
import { CustomerObject, ModalButton } from 'lib/types'
import ListItem from './list-item'
import { useAppStore } from 'lib/store'
import { useClerk } from 'lib/api/clerk'
import { ViewProps } from 'lib/store/types'
import { useCustomers } from 'lib/api/customer'
import { createHold } from 'lib/api/sale'

export default function CreateHoldSidebar() {
  const {
    cart,
    view,
    setAlert,
    setCartSale,
    setCustomer,
    resetCart,
    resetSellSearchBar,
    openView,
    closeView,
  } = useAppStore()
  const { sale = {}, items = [] } = cart || {}
  const defaultHoldPeriod = 30
  const { clerk } = useClerk()
  const { customers } = useCustomers()
  const [holdPeriod, setHoldPeriod] = useState(defaultHoldPeriod)
  const [note, setNote] = useState(sale?.note || '')
  const [submitting, setSubmitting] = useState(false)
  const resetHold = () => {
    setHoldPeriod(defaultHoldPeriod)
    setNote('')
    resetSellSearchBar()
    resetCart()
    closeView(ViewProps.cart)
    closeView(ViewProps.createHold)
    setSubmitting(false)
  }

  async function onClickConfirmHold() {
    setSubmitting(true)
    await items.forEach((cartItem) => {
      createHold({
        customerId: sale?.customerId,
        itemId: cartItem?.itemId,
        quantity: Number(cartItem?.quantity),
        startedBy: clerk?.id,
        vendorDiscount: Number(cartItem?.vendorDiscount),
        storeDiscount: Number(cartItem?.storeDiscount),
        holdPeriod,
        note,
      })
    })
    setAlert({
      open: true,
      type: 'success',
      message: `ITEM${cart?.items?.length === 1 ? '' : 'S'} PUT ON HOLD FOR ${(
        customers?.find((c: CustomerObject) => c?.id === sale?.customerId)
          ?.name || ''
      ).toUpperCase()}.`,
    })
    resetHold()
  }

  const buttons: ModalButton[] = [
    {
      type: 'cancel',
      onClick: () => {
        closeView(ViewProps.cart)
        closeView(ViewProps.createHold)
      },
      text: 'CANCEL',
    },
    {
      type: 'ok',
      onClick: onClickConfirmHold,
      disabled: !sale?.customerId || items.length === 0 || !holdPeriod,
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
        {items?.length > 0 ? (
          items?.map((cartItem, i) => <ListItem key={i} cartItem={cartItem} />)
        ) : (
          <div>No items</div>
        )}
      </div>
      <div>
        <CreateableSelect
          inputLabel="Select customer"
          fieldRequired
          value={sale?.customerId}
          label={
            customers?.find((c: CustomerObject) => c?.id === sale?.customerId)
              ?.name || ''
          }
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
