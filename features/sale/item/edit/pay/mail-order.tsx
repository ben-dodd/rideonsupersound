import { Add, Delete, Edit } from '@mui/icons-material'
import { useCustomers } from 'lib/api/customer'
import { useAppStore } from 'lib/store'
import { ViewProps } from 'lib/store/types'
import { priceDollarsString } from 'lib/utils'

const MailOrder = () => {
  const { cart, setCartSale, openView } = useAppStore()
  const { sale = {} } = cart || {}
  const { customers } = useCustomers()
  const resetMailOrder = () => setCartSale({ isMailOrder: false, postage: null, postalAddress: null })

  return (
    <div
      className={`mt-2 border border-gray-500 rounded-md p-2 ${
        !sale?.isMailOrder && 'cursor-pointer hover:bg-gray-100'
      }`}
      onClick={!sale?.isMailOrder ? () => openView(ViewProps.createMailOrder) : null}
    >
      {sale?.isMailOrder ? (
        <>
          <div className="flex justify-between border-b">
            <div className="font-bold">MAIL ORDER</div>
            <div className="flex">
              <button onClick={() => openView(ViewProps.createMailOrder)}>
                <Edit />
              </button>
              <button onClick={resetMailOrder}>
                <Delete />
              </button>
            </div>
          </div>
          <div>
            <div>{customers?.find((customer) => sale?.customerId === customer?.id)?.name}</div>
            <div className="whitespace-pre-wrap italic">{sale?.postalAddress}</div>
            <div className="font-bold text-primary">{`${priceDollarsString(sale?.postage)} POSTAGE FEE`}</div>
          </div>
        </>
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
