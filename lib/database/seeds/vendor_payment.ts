import { VendorPaymentTypes } from 'lib/types/vendor'

export const seed = (knex) =>
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
          is_deleted: 0,
        },
        {
          id: 2,
          clerk_id: 1,
          vendor_id: 42,
          register_id: 100,
          amount: 4000,
          type: VendorPaymentTypes.Cash,
          is_deleted: 0,
        },
        {
          id: 3,
          clerk_id: 1,
          vendor_id: 1,
          register_id: 100,
          amount: 1000,
          type: VendorPaymentTypes.Batch,
          is_deleted: 0,
        },
        {
          id: 4,
          clerk_id: 1,
          vendor_id: 1,
          register_id: 100,
          amount: 2000,
          type: VendorPaymentTypes.Cash,
          is_deleted: 0,
        },
        {
          id: 5,
          clerk_id: 1,
          vendor_id: 1,
          register_id: 100,
          amount: 4000,
          type: VendorPaymentTypes.TransferTo,
          is_deleted: 1,
        },
        {
          id: 6,
          clerk_id: 1,
          vendor_id: 2,
          register_id: 100,
          amount: 3500,
          type: VendorPaymentTypes.Cash,
          is_deleted: 0,
        },
        {
          id: 7,
          clerk_id: 1,
          vendor_id: 2,
          register_id: 100,
          amount: -4000,
          type: VendorPaymentTypes.TransferFrom,
          is_deleted: 0,
        },
        {
          id: 8,
          clerk_id: 1,
          vendor_id: 42,
          register_id: 100,
          amount: 1700,
          type: VendorPaymentTypes.Sale,
          is_deleted: 0,
        },
      ]),
    )
