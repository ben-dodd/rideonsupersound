import { useState } from 'react'
import SidebarContainer from 'components/container/side-bar'
import CreateableSelect from 'components/inputs/createable-select'
import { CustomerObject, ModalButton } from 'lib/types'
import { useAppStore } from 'lib/store'
import { useClerk } from 'lib/api/clerk'
import { ViewProps } from 'lib/store/types'
import { useCustomers } from 'lib/api/customer'
import { saveCart } from 'lib/api/sale'
import { SaleStateTypes } from 'lib/types/sale'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
// import { useSWRConfig } from 'swr'

export default function CreateLaybySidebar() {
  const { cart, view, setAlert, resetCart, openView, closeView, setCreateableCustomerName } = useAppStore()
  const { sale = {} } = cart || {}
  const { clerk } = useClerk()
  const { customers } = useCustomers()
  const [submitting] = useState(false)
  const [customerId, setCustomerId] = useState(sale?.customerId || null)
  const router = useRouter()
  // const { mutate } = useSWRConfig()

  const handleSubmit = (e) => {
    e.preventDefault()
    onClickConfirmLayby()
  }

  async function onClickConfirmLayby() {
    let laybySale = { ...sale }
    if (sale?.state !== SaleStateTypes.Layby) {
      laybySale = {
        ...sale,
        state: SaleStateTypes.Layby,
        dateLaybyStarted: dayjs.utc().format(),
        laybyStartedBy: clerk?.id,
      }
      setAlert({
        open: true,
        type: 'success',
        message: 'LAYBY STARTED.',
      })
    }
    await saveCart({ ...cart, sale: laybySale })
    resetCart()
    router.push('/sell')
  }

  const buttons: ModalButton[] = [
    {
      type: 'cancel',
      onClick: () => {
        closeView(ViewProps.createLayby)
      },
      text: 'CANCEL',
    },
    {
      type: 'ok',
      onClick: onClickConfirmLayby,
      disabled: !sale?.customerId,
      text: submitting ? 'LAYBYING...' : 'CONFIRM LAYBY',
    },
  ]

  return (
    <SidebarContainer
      show={view?.createLayby}
      title={`${sale?.state === SaleStateTypes.Layby ? 'CONTINUE' : 'START'} LAYBY`}
      buttons={buttons}
      handleSubmit={handleSubmit}
    >
      <div className="flex-grow overflow-y-scroll px-1">
        <CreateableSelect
          inputLabel="Select customer"
          autoFocus
          fieldRequired
          value={customerId}
          label={customers?.find((c: CustomerObject) => c?.id === sale?.customerId)?.name || ''}
          onChange={(customerObject: any) => {
            setCustomerId(parseInt(customerObject?.value))
          }}
          onCreateOption={(inputValue: string) => {
            setCreateableCustomerName(inputValue)
            openView(ViewProps.createCustomer)
          }}
          options={customers?.map((val: CustomerObject) => ({
            value: val?.id,
            label: val?.name || '',
          }))}
        />
      </div>
    </SidebarContainer>
  )
}
