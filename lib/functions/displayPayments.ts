import { ClerkObject } from 'lib/types'
import { VendorPaymentObject } from 'lib/types/vendor'

export function mapPayment(vendorPayment: VendorPaymentObject, clerks: ClerkObject[]) {
  return {
    date: vendorPayment?.date,
    payment_id: vendorPayment?.id,
    vendor_id: vendorPayment?.vendorId,
    amount: vendorPayment?.amount,
    type: vendorPayment?.type,
    clerk: clerks?.find((c: ClerkObject) => c?.id === vendorPayment?.clerkId)?.name,
    note: vendorPayment?.note,
  }
}
