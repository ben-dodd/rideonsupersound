exports.seed = (knex) =>
  knex('stock_price')
    .del()
    .then(() =>
      knex('stock_price').insert([
        {
          id: 1,
          stock_id: 1,
          clerk_id: 1,
          vendor_cut: 1500,
          total_sell: 1800,
        },
        {
          id: 2,
          stock_id: 1,
          clerk_id: 2,
          vendor_cut: 1800,
          total_sell: 2000,
        },
        {
          id: 3,
          stock_id: 2,
          clerk_id: 1,
          vendor_cut: 3500,
          total_sell: 4000,
        },
        {
          id: 4,
          stock_id: 3,
          clerk_id: 1,
          vendor_cut: 1200,
          total_sell: 1500,
        },
        {
          id: 5,
          stock_id: 4,
          clerk_id: 1,
          vendor_cut: 700,
          total_sell: 1000,
        },
      ])
    )
