export const seed = (knex) =>
  knex('register')
    .del()
    .then(() =>
      knex('register').insert([
        {
          id: 666,
          opened_by_id: 1,
          open_amount: 50000,
          open_note: 'Opened with $500',
          open_till_id: 1,
        },
      ]),
    )
