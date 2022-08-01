import SidebarContainer from '@/components/container/side-bar'
import TextField from '@/components/inputs/text-field'
import { useAtom } from 'jotai'
import {
  cartAtom,
  clerkAtom,
  loadedCustomerObjectAtom,
  viewAtom,
} from 'lib/atoms'
import { createCustomerInDatabase } from 'lib/database/create'
import { useCustomers } from 'lib/database/read'
import { updateCustomerInDatabase } from 'lib/database/update'
import { saveSystemLog } from 'lib/db-functions'
import { CustomerObject, ModalButton } from 'lib/types'
import { useEffect, useState } from 'react'

export default function CreateCustomerSidebar() {
  // SWR
  const { customers, mutateCustomers } = useCustomers()

  // Atoms
  const [cart, setCart] = useAtom(cartAtom)
  const [view, setView] = useAtom(viewAtom)
  const [clerk] = useAtom(clerkAtom)
  const [customer, setCustomer] = useAtom(loadedCustomerObjectAtom)

  // State
  const [nameConflict, setNameConflict] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Load
  useEffect(() => {
    customers &&
      !customer?.id &&
      setNameConflict(
        customers?.map((c: CustomerObject) => c?.name).includes(customer?.name)
      )
  }, [customers, customer?.name])

  // Functions
  function closeSidebar() {
    saveSystemLog('New customer sidebar closed.', clerk?.id)
    setCustomer(null)
    setView({ ...view, createCustomer: false })
  }

  async function onClickCreateCustomer() {
    saveSystemLog(`New customer (${customer?.name}) created.`, clerk?.id)
    setSubmitting(true)
    let newCustomer = { ...customer, created_by_clerk_id: clerk?.id }
    const id = await createCustomerInDatabase(customer, clerk)
    newCustomer = { ...newCustomer, id }
    mutateCustomers([...customers, newCustomer], false)
    setCart({ ...cart, customer_id: id })
    closeSidebar()
    setSubmitting(false)
  }

  async function onClickUpdateCustomer() {
    setSubmitting(true)
    updateCustomerInDatabase(customer, mutateCustomers, customers)
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
        onChange={(e: any) =>
          setCustomer({ ...customer, name: e.target.value })
        }
      />
      <TextField
        inputLabel="Email"
        value={customer?.email || ''}
        onChange={(e: any) =>
          setCustomer({ ...customer, email: e.target.value })
        }
      />
      <TextField
        inputLabel="Phone"
        value={customer?.phone || ''}
        onChange={(e: any) =>
          setCustomer({ ...customer, phone: e.target.value })
        }
      />
      <TextField
        inputLabel="Postal Address"
        multiline
        rows={4}
        value={customer?.postal_address || ''}
        onChange={(e: any) =>
          setCustomer({ ...customer, postal_address: e.target.value })
        }
      />
      <TextField
        inputLabel="Notes"
        multiline
        rows={4}
        value={customer?.note || ''}
        onChange={(e: any) =>
          setCustomer({ ...customer, note: e.target.value })
        }
      />
    </SidebarContainer>
  )
}
