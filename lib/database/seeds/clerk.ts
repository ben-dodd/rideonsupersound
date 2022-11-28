exports.seed = (knex) =>
  knex('clerk')
    .del()
    .then(() =>
      knex('clerk').insert([
        { id: 1, name: 'Nick White', sub: '123' },
        { id: 2, name: 'Ben', sub: 'abc' },
      ])
    )
