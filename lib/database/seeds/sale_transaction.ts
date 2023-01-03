import { PaymentMethodTypes } from 'lib/types/sale'

exports.seed = (knex) =>
  knex('sale_transaction')
    .del()
    .then(() =>
      knex('sale_transaction').insert([
        {
          id: 1,
          sale_id: 1,
          clerk_id: 2,
          payment_method: PaymentMethodTypes.Cash,
          amount: 6700,
          cash_received: 8000,
          change_given: 1300,
          register_id: 666,
        },
        {
          id: 2,
          sale_id: 2,
          clerk_id: 1,
          payment_method: PaymentMethodTypes.Cash,
          amount: 5000,
          cash_received: 5000,
          register_id: 666,
        },
      ]),
    )
