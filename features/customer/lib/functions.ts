import { saveSystemLog } from 'features/log/lib/functions'
import { createCustomerInDatabase } from 'lib/database/create'
import { ClerkObject, CustomerObject } from 'lib/types'

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
