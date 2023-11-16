import { useEffect, useState } from 'react'
import SidebarContainer from 'components/container/side-bar'
import CreateableSelect from 'components/inputs/createable-select'
import { CustomerObject, ModalButton } from 'lib/types'
import { useAppStore } from 'lib/store'
import { ViewProps } from 'lib/store/types'
import { useCustomers } from 'lib/api/customer'
import TextField from 'components/inputs/text-field'

export default function CreateMailOrder() {
  const { cart, view, setCartSale, setCart, openView, closeView } = useAppStore()
  const { sale = {} } = cart || {}
  const { customers } = useCustomers()
  const [postage, setPostage] = useState(sale?.postage)
  const [postalAddress, setPostalAddress] = useState(sale?.postalAddress)

  useEffect(() => {
    setPostage(sale?.postage)
    setPostalAddress(sale?.postalAddress)
  }, [sale?.postage, sale?.postalAddress])

  const handleSubmit = (e) => {
    e.preventDefault()
    onClickCreateMailOrder()
  }

  async function onClickCreateMailOrder() {
    setCartSale({ isMailOrder: true, postage: Number(postage), postalAddress })
    closeView(ViewProps.createMailOrder)
    setPostage(0)
    setPostalAddress('')
  }

  const buttons: ModalButton[] = [
    {
      type: 'cancel',
      onClick: () => {
        closeView(ViewProps.createMailOrder)
      },
      text: 'CANCEL',
    },
    {
      type: 'ok',
      onClick: onClickCreateMailOrder,
      disabled: !sale?.customerId || !postalAddress || !postage,
      text: 'ADD MAIL ORDER',
    },
  ]

  return (
    <SidebarContainer
      show={view?.createMailOrder}
      title={`${sale?.isMailOrder ? 'EDIT' : 'CREATE'} MAIL ORDER`}
      buttons={buttons}
      handleSubmit={handleSubmit}
    >
      <div className="flex-grow overflow-y-scroll px-1">
        <CreateableSelect
          inputLabel="Select customer"
          autoFocus
          fieldRequired
          value={sale?.customerId}
          label={customers?.find((c: CustomerObject) => c?.id === sale?.customerId)?.name || ''}
          onChange={(customerObject: any) => {
            setCartSale({ customerId: parseInt(customerObject?.value) })
          }}
          onCreateOption={(inputValue: string) => {
            setCart({ customer: { name: inputValue } })
            openView(ViewProps.createCustomer)
          }}
          options={customers?.map((val: CustomerObject) => ({
            value: val?.id,
            label: val?.name || '',
          }))}
        />
        <TextField
          inputLabel="Postage Fee"
          startAdornment="$"
          error={Number.isNaN(postage)}
          value={`${postage || ''}`}
          onChange={(e: any) => setPostage(e.target.value)}
        />
        <TextField
          inputLabel="Postal Address"
          multiline
          value={postalAddress || ''}
          onChange={(e: any) => setPostalAddress(e.target.value)}
        />
      </div>
    </SidebarContainer>
  )
}
