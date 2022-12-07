exports.seed = (knex) =>
  knex('global')
    .del()
    .then(() => knex('global').insert([{ id: `current_register`, num: 666 }]))
