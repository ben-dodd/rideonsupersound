import { StockMovementTypes } from 'lib/types'

exports.seed = (knex) =>
  knex('stock_movement')
    .del()
    .then(() =>
      knex('stock_movement').insert([
        {
          id: 1,
          stock_id: 1,
          clerk_id: 1,
          quantity: 4,
          register_id: 1,
          act: StockMovementTypes.Received,
          is_deleted: 0,
        },
        {
          id: 2,
          stock_id: 1,
          clerk_id: 1,
          quantity: -1,
          sale_id: 1,
          register_id: 1,
          act: StockMovementTypes.Sold,
          is_deleted: 0,
        },
        {
          id: 3,
          stock_id: 2,
          clerk_id: 2,
          quantity: 1,
          register_id: 1,
          act: StockMovementTypes.Received,
          is_deleted: 0,
        },
        {
          id: 4,
          stock_id: 2,
          clerk_id: 1,
          quantity: 1,
          register_id: 1,
          act: StockMovementTypes.Received,
          is_deleted: 0,
        },
        {
          id: 5,
          stock_id: 3,
          clerk_id: 1,
          quantity: 5,
          register_id: 1,
          act: StockMovementTypes.Received,
          is_deleted: 0,
        },
        {
          id: 6,
          stock_id: 4,
          clerk_id: 1,
          quantity: 1,
          register_id: 1,
          act: StockMovementTypes.Received,
          is_deleted: 0,
        },
        {
          id: 7,
          stock_id: 4,
          clerk_id: 1,
          quantity: -1,
          register_id: 1,
          act: StockMovementTypes.Returned,
          is_deleted: 0,
        },
      ])
    )
