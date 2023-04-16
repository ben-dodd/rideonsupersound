exports.seed = (knex) =>
  knex('customer')
    .del()
    .then(() =>
      knex('customer').insert([
        { id: 1, name: 'Lil Jim' },
        { id: 2, name: 'Lil Jan' },
      ]),
    )
