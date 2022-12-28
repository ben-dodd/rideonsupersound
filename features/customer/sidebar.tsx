import SidebarContainer from 'components/container/side-bar'
import TextField from 'components/inputs/text-field'
import { saveSystemLog } from 'lib/functions/log'
import { ModalButton } from 'lib/types'
import { useEffect, useState } from 'react'
import { createCustomer, updateCustomer, useCustomers } from 'lib/api/customer'
import { useClerk } from 'lib/api/clerk'
import { useAppStore } from 'lib/store'
import { ViewProps } from 'lib/store/types'
import { useSWRConfig } from 'swr'
import { checkCustomerNameConflict } from 'lib/functions/customer'

export default function CreateCustomerSidebar() {
  const { clerk } = useClerk()
  const { customers } = useCustomers()
  const {
    view,
    cart: { customer },
    setCustomer,
    setCartSale,
    resetCustomer,
    closeView,
    setAlert,
  } = useAppStore()
  const [nameConflict, setNameConflict] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleClickCancel = () => {
    setCartSale({ customerId: null })
    closeSidebar()
  }

  const handleClickOK = () =>
    customer?.id ? onClickUpdateCustomer() : onClickCreateCustomer()

  // useEffect(() => {
  //   const handleKeyPress = (event) => {
  //     if (view?.createCustomer) {
  //       console.log(event.key)
  //       if (event.key === 'Enter') handleClickOK()
  //       if (event.key === 'Escape') handleClickCancel()
  //     }
  //   }
  //   document.addEventListener('keydown', handleKeyPress)

  //   return () => {
  //     document.removeEventListener('keydown', handleKeyPress)
  //   }
  // }, [])

  useEffect(() => {
    setNameConflict(checkCustomerNameConflict(customer, customers))
  }, [customers, customer])
  const { mutate } = useSWRConfig()

  const handleChange = (e) => {
    setCustomer({ [e.target.name]: e.target.value })
  }

  function closeSidebar() {
    // saveSystemLog('New customer sidebar closed.', clerk?.id)
    resetCustomer()
    closeView(ViewProps.createCustomer)
  }

  async function onClickCreateCustomer() {
    setSubmitting(true)
    const newCustomer = await createCustomer(customer, clerk)
    if (newCustomer instanceof Error) {
      setAlert({
        open: true,
        type: 'error',
        message: 'Error creating new customer',
      })
    } else {
      mutate('customer')
      setCustomer(newCustomer)
      setCartSale({ customerId: newCustomer?.id })
      closeSidebar()
    }
    setSubmitting(false)
  }

  async function onClickUpdateCustomer() {
    setSubmitting(true)
    updateCustomer(customer, customer?.id)
    closeSidebar()
  }
  // Constants
  const buttons: ModalButton[] = [
    {
      type: 'cancel',
      onClick: handleClickCancel,
      text: 'CANCEL',
    },
    {
      type: 'ok',
      onClick: handleClickOK,
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
        id="name"
        fieldRequired
        error={nameConflict}
        errorText="Name already exists."
        displayOnly={Boolean(customer?.id)}
        value={customer?.name || ''}
        onChange={handleChange}
      />
      <TextField
        id="email"
        inputLabel="Email"
        value={customer?.email || ''}
        onChange={handleChange}
      />
      <TextField
        id="phone"
        inputLabel="Phone"
        value={customer?.phone || ''}
        onChange={handleChange}
      />
      <TextField
        id="postalAddress"
        inputLabel="Postal Address"
        multiline
        rows={4}
        value={customer?.postalAddress || ''}
        onChange={handleChange}
      />
      <TextField
        id="note"
        inputLabel="Notes"
        multiline
        rows={4}
        value={customer?.note || ''}
        onChange={handleChange}
      />
    </SidebarContainer>
  )
}
