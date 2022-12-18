exports.seed = (knex) =>
  knex('stock')
    .del()
    .then(() =>
      knex('stock').insert([
        {
          id: 1,
          vendor_id: 1,
          artist: 'The Beatles',
          title: 'Abbey Road',
          format: '7"',
          is_deleted: 0,
        },
        {
          id: 2,
          vendor_id: 1,
          artist: 'The Cure',
          title: 'Pornography',
          format: '7"',
          is_deleted: 0,
        },
        {
          id: 3,
          vendor_id: 2,
          artist: 'Weyes Blood',
          title: 'Front Row Seat to Earth',
          format: '7"',
          is_deleted: 1,
        },
        {
          id: 4,
          vendor_id: 2,
          artist: 'Wire',
          title: 'Pink Flag',
          format: '7"',
          is_deleted: 0,
        },
      ])
    )
