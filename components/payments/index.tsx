import { VendorPaymentTypes } from '@/lib/types'
import PaymentItem from './item'
import Title from '../layout/title'

export default function Payments({ payments, storeCredits }) {
  const paymentList = payments?.map((pay) => ({
    ...pay,
    reference:
      pay?.type === VendorPaymentTypes?.DC ||
      pay?.type === VendorPaymentTypes.Batch
        ? pay?.bank_reference
        : pay?.type === VendorPaymentTypes.Sale
        ? storeCredits?.filter((s) => s?.vendor_payment_id === pay?.id)?.[0]
            ?.item_list ||
          pay?.note ||
          ''
        : pay?.note || '',
  }))
  return (
    <div className="w-full">
      <Title title={'RIDE ON SUPER SOUND PAYMENTS'} />

      {paymentList?.length === 0 ? (
        <div>NO PAYMENTS</div>
      ) : (
        <div>
          <div className="flex bg-black py-2 text-white text-xs">
            <div className="w-2/12 md:w-1/12 px-1">DATE PAID</div>
            <div className="w-1/6 px-1 pr-4 text-right">AMOUNT PAID</div>
            <div className="w-1/6 px-1">PAYMENT TYPE</div>
            <div className="w-4/12 md:w-5/12 px-1">REFERENCE</div>
          </div>
          {payments?.map((pay, i) => (
            <PaymentItem key={i} pay={pay} />
          ))}
        </div>
      )}
    </div>
  )
}
