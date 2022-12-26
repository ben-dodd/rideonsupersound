import { axiosAuth, useData } from './'

export function useVendors() {
  return useData(`vendor`, 'vendors')
}

export function useVendorNames() {
  return useData(`vendor/names`, 'vendorNames')
}

export function useVendorFromVendorPayment(vendorPaymentId) {
  return useData(`vendor/payment/${vendorPaymentId}`, 'vendor')
}

export function useVendor(id) {
  return useData(`vendor/${id}`, 'vendor')
}

export function createVendor(vendor) {
  return axiosAuth
    .post(`/api/vendor`, vendor)
    .then((res) => {
      const id = res.data
      // saveSystemLog(`New sale (${id}) created.`, clerk?.id)
      return id
    })
    .catch((e) => Error(e.message))
}

export function updateVendor(id, update) {
  return axiosAuth
    .patch(`/api/vendor/${id}`, { update })
    .then((res) => res.data)
    .catch((e) => Error(e.message))
}

export function createVendorPayment(payment) {
  return axiosAuth
    .post(`/api/vendor/payment`, payment)
    .then((res) => {
      const id = res.data
      // saveSystemLog(`New sale (${id}) created.`, clerk?.id)
      return id
    })
    .catch((e) => Error(e.message))
}
