export const seed = (knex) =>
  knex('vendor')
    .del()
    .then(() =>
      knex('vendor').insert([
        { id: 1, name: 'Nick White' },
        { id: 2, name: 'Ben Dodd' },
        { id: 3, name: 'Guy' },
        { id: 4, name: 'Mate' },
        { id: 5, name: 'Kenny' },
        { id: 6, name: 'Michael' },
        { id: 42, name: 'John Harris' },
      ]),
    )
