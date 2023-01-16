import { Add, Delete, Edit } from '@mui/icons-material'
import { useCustomers } from 'lib/api/customer'
import { useAppStore } from 'lib/store'
import { ViewProps } from 'lib/store/types'
import { useEffect } from 'react'

const MailOrder = () => {
  const { cart, setCartSale, openView } = useAppStore()
  const { sale = {} } = cart || {}
  const { customers } = useCustomers()

  useEffect(() => {
    resetMailOrder()
  }, [sale?.customerId])

  function resetMailOrder() {
    setCartSale({ isMailOrder: false, postage: null, postalAddress: null })
  }

  return (
    <div
      className={`mt-2 border border-gray-500 rounded-md p-2 ${
        !sale?.isMailOrder && 'cursor-pointer hover:bg-gray-100'
      }`}
      // onClick={() => openView(ViewProps.createMailOrder)}
      onClick={!sale?.isMailOrder ? () => openView(ViewProps.createMailOrder) : null}
    >
      {sale?.isMailOrder ? (
        <div className="flex justify-between">
          <div>
            <div className="font-bold">{customers?.find((customer) => sale?.customerId === customer?.id)?.name}</div>
            <div>{sale?.postalAddress}</div>
            <div>{`$${Number(sale?.postage)?.toFixed(2)}`}</div>
          </div>
          <div className="flex">
            <button onClick={() => openView(ViewProps.createMailOrder)}>
              <Edit />
            </button>
            <button onClick={resetMailOrder}>
              <Delete />
            </button>
          </div>
        </div>
      ) : (
        <div>
          <Add className="mr-2" />
          {'Add Mail Order'}
        </div>
      )}
    </div>
  )
}

export default MailOrder
