import SidebarContainer from 'components/container/side-bar'
import TextField from 'components/inputs/text-field'
import { saveSystemLog } from 'features/log/lib/functions'
import { ModalButton } from 'lib/types'
import { useEffect, useState } from 'react'
import { checkCustomerNameConflict } from '../lib/functions'
import { createCustomer, useCustomers } from 'lib/api/customer'
import { useClerk } from 'lib/api/clerk'
import { useAppStore } from 'lib/store'
import { ViewProps } from 'lib/store/types'

export default function CreateCustomerSidebar() {
  const { clerk } = useClerk()
  const { customers, mutateCustomers } = useCustomers()
  const {
    view,
    cart: { customer },
    setCustomer,
    resetCustomer,
    closeView,
  } = useAppStore()
  const [nameConflict, setNameConflict] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  useEffect(() => {
    setNameConflict(checkCustomerNameConflict(customer, customers))
  }, [customers, customer?.name])

  function closeSidebar() {
    saveSystemLog('New customer sidebar closed.', clerk?.id)
    resetCustomer()
    closeView(ViewProps.createCustomer)
  }

  async function onClickCreateCustomer() {
    setSubmitting(true)
    const newCustomer = await createCustomer(customer, clerk)
    mutateCustomers([...customers, newCustomer], false)
    setCustomer({ customerId: newCustomer?.id })
    closeSidebar()
    setSubmitting(false)
  }

  async function onClickUpdateCustomer() {
    setSubmitting(true)
    updateCustomer(customer)
    closeSidebar()
  }

  // Constants
  const buttons: ModalButton[] = [
    {
      type: 'cancel',
      onClick: closeSidebar,
      text: 'CANCEL',
    },
    {
      type: 'ok',
      onClick: customer?.id ? onClickUpdateCustomer : onClickCreateCustomer,
      disabled: !customer?.name || nameConflict,
      text: customer?.id ? 'UPDATE' : submitting ? 'CREATING...' : 'CREATE',
    },
  ]

  return (
    <SidebarContainer
      show={view?.createCustomer}
      title={customer?.id ? 'Edit Customer' : 'Create New Customer'}
      buttons={buttons}
    >
      <TextField
        inputLabel="Name"
        fieldRequired
        error={nameConflict}
        errorText="Name already exists."
        displayOnly={Boolean(customer?.id)}
        value={customer?.name || ''}
        onChange={(e: any) => setCustomer({ name: e.target.value })}
      />
      <TextField
        inputLabel="Email"
        value={customer?.email || ''}
        onChange={(e: any) => setCustomer({ email: e.target.value })}
      />
      <TextField
        inputLabel="Phone"
        value={customer?.phone || ''}
        onChange={(e: any) => setCustomer({ phone: e.target.value })}
      />
      <TextField
        inputLabel="Postal Address"
        multiline
        rows={4}
        value={customer?.postalAddress || ''}
        onChange={(e: any) => setCustomer({ postalAddress: e.target.value })}
      />
      <TextField
        inputLabel="Notes"
        multiline
        rows={4}
        value={customer?.note || ''}
        onChange={(e: any) => setCustomer({ note: e.target.value })}
      />
    </SidebarContainer>
  )
}
