import { ClerkObject, VendorPaymentObject } from 'lib/types'

export function mapPayment(
  vendorPayment: VendorPaymentObject,
  clerks: ClerkObject[]
) {
  return {
    date: vendorPayment?.date,
    payment_id: vendorPayment?.id,
    vendor_id: vendorPayment?.vendor_id,
    amount: vendorPayment?.amount,
    type: vendorPayment?.type,
    clerk: clerks?.filter(
      (c: ClerkObject) => c?.id === vendorPayment?.clerk_id
    )[0]?.name,
    note: vendorPayment?.note,
  }
}
