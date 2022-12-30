import TextField from 'components/inputs/text-field'
import { useCustomers } from 'lib/api/customer'
import { useAppStore } from 'lib/store'

const MailOrderForm = () => {
  const { cart, setCartSale } = useAppStore()
  const { sale = {} } = cart || {}
  const { customers } = useCustomers()

  function handleToggleMailOrder() {
    if (sale?.isMailOrder) {
      resetMailOrder()
    } else {
      setCartSale({
        isMailOrder: true,
        postage: 0,
        postalAddress: customers?.find((c) => c?.id === sale?.customerId)?.postalAddress || '',
      })
    }
  }

  function resetMailOrder() {
    setCartSale({ isMailOrder: false, postage: null, postalAddress: null })
  }

  return (
    <div className="border border-gray-500 rounded-md p-2">
      <div className="flex mt-2">
        <input
          disabled={!sale?.customerId}
          className="cursor-pointer"
          type="checkbox"
          checked={sale?.isMailOrder}
          onChange={handleToggleMailOrder}
        />
        <div className="ml-2">Mail order</div>
      </div>
      {sale?.isMailOrder ? (
        <div>
          <TextField
            inputLabel="Postage Fee"
            startAdornment="$"
            inputType="number"
            valueNum={sale?.postage}
            onChange={(e: any) => setCartSale({ postage: e.target.value })}
          />
          <TextField
            inputLabel="Postal Address"
            multiline
            value={sale?.postalAddress}
            onChange={(e: any) => setCartSale({ postalAddress: e.target.value })}
          />
        </div>
      ) : (
        <div />
      )}
    </div>
  )
}

export default MailOrderForm
