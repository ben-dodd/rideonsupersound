import { saveSystemLog } from 'features/log/lib/functions'
import { ClerkObject, CustomerObject } from 'lib/types'
import useData from '.'
import request from 'superagent'

export function useCustomers() {
  return useData(`customer`, 'customers')
}

export async function createCustomer(
  customer: CustomerObject,
  clerk: ClerkObject
) {
  saveSystemLog(`New customer (${customer?.name}) created.`, clerk?.id)
  return request
    .post(`/api/customer`)
    .send({
      ...customer,
      createdByClerkId: clerk?.id,
    })
    .then((res) => ({ ...customer, id: res.json() }))
}
