import { ClerkObject, CustomerObject } from 'lib/types'
import { axiosAuth, useData } from './'

export function useCustomers() {
  return useData(`customer`, 'customers')
}

export async function createCustomer(customer: CustomerObject, clerk: ClerkObject) {
  return axiosAuth
    .post(`/api/customer`, {
      ...customer,
      createdByClerkId: clerk?.id,
    })
    .then((res) => ({
      ...customer,
      createdByClerkId: clerk?.id,
      id: res,
    }))
}

export function updateCustomer(update: any, id) {
  return axiosAuth.patch(`/api/customer/${id}`, update)
}
