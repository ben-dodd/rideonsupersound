import { AccountBalance, AddCard, EventBusy, Input, Money, Output } from '@mui/icons-material'
import dayjs from 'dayjs'
import { dateTime } from 'lib/types/date'
import { VendorPaymentTypes } from 'lib/types/vendor'
import { priceCentsString } from 'lib/utils'
import { useRouter } from 'next/router'

const PaymentListItem = ({ payment }) => {
  const router = useRouter()
  let categoryIcon = <AccountBalance />
  let description = <span />
  switch (payment?.type) {
    case VendorPaymentTypes.Batch:
      categoryIcon = <AccountBalance className="text-blue-300" />
      description = (
        <span
          className={`${payment?.batchId ? 'link-blue' : ''}`}
          onClick={() => (payment?.batchId ? router.push(`/batch-payment/${payment?.batchId}`) : null)}
        >
          {payment?.batchId ? `Batch payment ID #${payment?.batchId}` : 'Batch payment (No ID found)'}
        </span>
      )
      break
    case VendorPaymentTypes.Cash:
      categoryIcon = <Money className="text-yellow-400" />
      description = <span>{`Cash given by ${payment?.clerkName}`}</span>
      break
    case VendorPaymentTypes.DC:
      categoryIcon = <AddCard className="text-yellow-400" />
      description = <span>Direct bank transfer</span>
      break
    case VendorPaymentTypes.Sale:
      categoryIcon = <Money className="text-purple-300" />
      description = (
        <span
          className={`${payment?.saleId ? 'link-blue' : ''}`}
          onClick={() => (payment?.saleId ? router.push(`/sales/${payment?.saleId}`) : null)}
        >
          {payment?.saleId
            ? `Account payment for sale ID #${payment?.saleId}`
            : 'Account payment for sale (No ID found)'}
        </span>
      )
      break
    case VendorPaymentTypes.SaleRefund:
      categoryIcon = <EventBusy className="text-orange-800" />
      description = (
        <span
          className={`${payment?.saleId ? 'link-blue' : ''}`}
          onClick={() => (payment?.saleId ? router.push(`/sales/${payment?.saleId}`) : null)}
        >
          {payment?.saleId ? `Account refund for sale ID #${payment?.saleId}` : 'Account refund for sale (No ID found)'}
        </span>
      )
      break
    case VendorPaymentTypes.TransferFrom:
      categoryIcon = <Output className="text-red-500" />
      description = <span>Transfer to other vendor</span>
      break
    case VendorPaymentTypes.TransferTo:
      categoryIcon = <Input className="text-green-600" />
      description = <span>Transfer from other vendor</span>
      break
  }
  return (
    <div className={`list-item-compact text-sm`}>
      <div className="flex w-full">
        <div className="w-1/12">{categoryIcon}</div>
        {/* <div className="w-3/12">{`[${`000000${payment?.id}`.slice(-6)}] ${payment?.type?.toUpperCase()}`}</div> */}
        <div className="w-3/12">{dayjs(payment?.date).format(dateTime)}</div>
        <div className="w-2/12">
          <span className="link-blue" onClick={() => router.push(`/vendors/${payment?.vendorId}`)}>
            {payment?.vendorName}
          </span>
        </div>
        <div className="w-5/12">{description}</div>
        <div className="w-1/12 text-right">{priceCentsString(payment?.amount)}</div>
      </div>
      <div />
    </div>
  )
}

export default PaymentListItem
