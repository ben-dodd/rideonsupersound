import useData from './'

export function useVendors() {
  return useData(`vendor`, 'vendors')
}

export function useVendorNames() {
  return useData(`vendor/names`, 'vendorNames')
}

export function useVendorFromVendorPayment(vendorPaymentId) {
  return useData(`vendor/payment/${vendorPaymentId}`, 'vendor')
}
