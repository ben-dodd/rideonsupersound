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
    <div className="border border-gray-500 rounded-md p-2" onClick={() => openView(ViewProps.createMailOrder)}>
      <div className="flex mt-2">
        <input className="cursor-pointer" type="checkbox" checked={sale?.isMailOrder} onChange={resetMailOrder} />
        <div className="ml-2">Mail order</div>
      </div>
      {sale?.isMailOrder ? <div></div> : <div />}
    </div>
  )
}

export default MailOrder
