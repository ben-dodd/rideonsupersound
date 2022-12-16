import axios from 'axios'
import { saveSystemLog } from 'features/log/lib/functions'
import { ClerkObject, CustomerObject } from 'lib/types'
import useData from './'

export function useCustomers() {
  return useData(`customer`, 'customers')
}

export async function createCustomer(
  customer: CustomerObject,
  clerk: ClerkObject
) {
  // saveSystemLog(`New customer (${customer?.name}) created.`, clerk?.id)
  return axios
    .post(`/api/customer`, {
      ...customer,
      createdByClerkId: clerk?.id,
    })
    .then((res) => ({ ...customer, id: res.data }))
    .catch((e) => Error(e.message))
}

export function updateCustomer(customer: CustomerObject) {
  return axios
    .patch(`/api/customer/${customer?.id}`)
    .then((res) => res.data)
    .catch((e) => Error(e.message))
}
