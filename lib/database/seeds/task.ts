exports.seed = (knex) =>
  knex('task')
    .del()
    .then(() => knex('task').insert([{ id: 1, description: 'Post Sale 000 (Something)' }]))
