exports.seed = (knex) =>
  knex('vendor')
    .del()
    .then(() => knex('vendor').insert([{ id: 1, name: 'Nick White' }]))
