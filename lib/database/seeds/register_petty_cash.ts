exports.seed = (knex) =>
  knex('register_petty_cash')
    .del()
    .then(() =>
      knex('register_petty_cash').insert([
        {
          id: 1,
          register_id: 666,
          clerk_id: 1,
          amount: 5000,
          is_take: 0,
          note: 'Put $50 in the till',
        },
        {
          id: 2,
          register_id: 666,
          clerk_id: 1,
          amount: 2000,
          is_take: 1,
          note: 'Took $20 form the till for beers',
        },
      ])
    )
