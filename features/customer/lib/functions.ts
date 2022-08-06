import { saveSystemLog } from '@/features/log/lib/functions'
import { createCustomerInDatabase } from '@/lib/database/create'
import { ClerkObject } from '@/lib/types'
import { CustomerObject } from './types'

export async function createCustomer(
  customer: CustomerObject,
  clerk: ClerkObject
) {
  saveSystemLog(`New customer (${customer?.name}) created.`, clerk?.id)
  let newCustomer = { ...customer, created_by_clerk_id: clerk?.id }
  const id = await createCustomerInDatabase(customer, clerk)
  newCustomer = { ...newCustomer, id }
  return newCustomer
}

export function checkCustomerNameConflict(
  customer: CustomerObject,
  customers: CustomerObject[]
) {
  return customers && !customer?.id
    ? customers
        ?.map((c: CustomerObject) => c?.name?.toLowerCase())
        .includes(customer?.name?.toLowerCase())
    : false
}
