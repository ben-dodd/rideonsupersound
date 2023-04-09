import CreateableSelect from 'components/inputs/createable-select'
import { useCustomers } from 'lib/api/customer'
import { useAppStore } from 'lib/store'
import { ViewProps } from 'lib/store/types'
import { CustomerObject } from 'lib/types'
import { SaleStateTypes } from 'lib/types/sale'

const CustomerForm = () => {
  const { cart, setCart, setCartSale, openView } = useAppStore()
  const { sale = {} } = cart || {}
  const { customers = [] } = useCustomers()

  return (
    <div className={`${sale?.state === SaleStateTypes.Completed ? 'hidden' : ''}`}>
      {sale?.state === SaleStateTypes.Layby ? (
        <div className="mt-2">
          {sale?.customerId ? (
            <div>
              <div className="font-bold">Customer</div>
              <div>{customers?.find((c: CustomerObject) => c?.id === sale?.customerId)?.name || ''}</div>
            </div>
          ) : (
            <div>No customer set.</div>
          )}
        </div>
      ) : (
        <>
          <div className="font-bold mt-2">Select customer to enable laybys and mail orders.</div>
          <CreateableSelect
            inputLabel="Select customer"
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
        </>
      )}
    </div>
  )
}

export default CustomerForm
