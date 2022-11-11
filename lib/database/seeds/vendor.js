exports.seed = (knex) =>
  knex('vendor')
    .del()
    .then(() =>
      knex('vendor').insert([
        { id: 1, text: 'Clean the dishes', isCompleted: false },
        { id: 2, text: 'Wash the dog', isCompleted: false },
        { id: 3, text: 'Take books back to the library', isCompleted: false },
      ])
    )
