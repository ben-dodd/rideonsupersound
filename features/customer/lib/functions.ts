import { CustomerObject } from 'lib/types'

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
