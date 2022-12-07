import { VendorPaymentTypes } from 'lib/types'

exports.seed = (knex) =>
  knex('vendor_payment')
    .del()
    .then(() =>
      knex('vendor_payment').insert([
        {
          id: 1,
          clerk_id: 1,
          vendor_id: 42,
          register_id: 666,
          amount: 2000,
          type: VendorPaymentTypes.Cash,
        },
        {
          id: 2,
          clerk_id: 1,
          vendor_id: 42,
          register_id: 100,
          amount: 4000,
          type: VendorPaymentTypes.Cash,
        },
      ])
    )
