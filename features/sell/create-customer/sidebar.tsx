import SidebarContainer from 'components/container/side-bar'
import TextField from 'components/inputs/text-field'
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
    setCart,
    setCartSale,
    closeView,
    setAlert,
  } = useAppStore()
  const [nameConflict, setNameConflict] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [newCustomer, setNewCustomer] = useState({ ...customer })
  const setCustomer = (customer) => setCart({ customer })

  useEffect(() => {
    setNewCustomer({ ...customer })
  }, [customer])

  const handleClickCancel = () => {
    setCartSale({ customerId: null })
    closeSidebar()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    handleClickOK()
  }

  const handleClickOK = () => (customer?.id ? onClickUpdateCustomer() : onClickCreateCustomer())

  useEffect(() => {
    setNameConflict(checkCustomerNameConflict(newCustomer, customers))
  }, [customers, newCustomer])
  const { mutate } = useSWRConfig()

  const handleChange = (e) => {
    setNewCustomer({ ...newCustomer, [e.target.name]: e.target.value })
  }

  function closeSidebar() {
    setNewCustomer({})
    closeView(ViewProps.createCustomer)
  }

  async function onClickCreateCustomer() {
    setSubmitting(true)
    const createdCustomer = await createCustomer(newCustomer, clerk)
    if (createdCustomer instanceof Error) {
      setAlert({
        open: true,
        type: 'error',
        message: 'Error creating new customer',
      })
    } else {
      mutate('customer')
      setCustomer(createdCustomer)
      closeSidebar()
    }
    setSubmitting(false)
  }

  async function onClickUpdateCustomer() {
    setSubmitting(true)
    await updateCustomer(newCustomer, newCustomer?.id)
    mutate('customer')
    setCustomer(newCustomer)
    setSubmitting(false)
    closeSidebar()
  }

  const buttons: ModalButton[] = [
    {
      type: 'cancel',
      onClick: handleClickCancel,
      text: 'CANCEL',
    },
    {
      type: 'ok',
      disabled: !newCustomer?.name || nameConflict,
      text: newCustomer?.id ? 'UPDATE' : submitting ? 'CREATING...' : 'CREATE',
    },
  ]

  return (
    <SidebarContainer
      show={view?.createCustomer}
      title={newCustomer?.id ? 'EDIT CUSTOMER' : 'CREATE NEW CUSTOMER'}
      handleSubmit={handleSubmit}
      buttons={buttons}
    >
      <div className="flex-grow overflow-y-scroll px-1">
        <TextField
          inputLabel="Name"
          id="name"
          fieldRequired
          error={nameConflict}
          errorText="Name already exists."
          displayOnly={Boolean(newCustomer?.id)}
          value={newCustomer?.name || ''}
          onChange={handleChange}
        />
        <TextField id="email" inputLabel="Email" value={newCustomer?.email || ''} onChange={handleChange} />
        <TextField id="phone" inputLabel="Phone" value={newCustomer?.phone || ''} onChange={handleChange} />
        <TextField
          id="postalAddress"
          inputLabel="Postal Address"
          multiline
          rows={4}
          value={newCustomer?.postalAddress || ''}
          onChange={handleChange}
        />
        <TextField
          id="note"
          inputLabel="Notes"
          multiline
          rows={4}
          value={newCustomer?.note || ''}
          onChange={handleChange}
        />
      </div>
    </SidebarContainer>
  )
}
