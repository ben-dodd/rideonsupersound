import axios from 'axios'
import { ClerkObject, CustomerObject } from 'lib/types'
import { apiAuth, useData } from './'

export function useCustomers() {
  return useData(`customer`, 'customers')
}

export async function createCustomer(
  customer: CustomerObject,
  clerk: ClerkObject
) {
  // saveSystemLog(`New customer (${customer?.name}) created.`, clerk?.id)
  return apiAuth().then((accessToken) =>
    axios
      .post(`/api/customer`, {
        customer: {
          ...customer,
          createdByClerkId: clerk?.id,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => ({ ...customer, id: res.data }))
      .catch((e) => Error(e.message))
  )
}

export function updateCustomer(customer: CustomerObject) {
  return axios
    .patch(`/api/customer/${customer?.id}`)
    .then((res) => res.data)
    .catch((e) => Error(e.message))
}
