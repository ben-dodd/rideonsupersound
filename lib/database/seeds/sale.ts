import { SaleStateTypes } from 'lib/types/sale'

export const seed = (knex) =>
  knex('sale')
    .del()
    .then(() =>
      knex('sale').insert([
        {
          id: 1,
          state: SaleStateTypes.Completed,
          date_sale_opened: new Date('2018-11-12').toISOString(),
          date_sale_closed: new Date('2018-11-12').toISOString(),
          is_deleted: 0,
        },
        {
          id: 2,
          state: SaleStateTypes.Completed,
          date_sale_opened: new Date('2018-11-12').toISOString(),
          date_sale_closed: new Date('2018-11-12').toISOString(),
          is_deleted: 1,
        },
        {
          id: 3,
          state: SaleStateTypes.Layby,
          date_sale_opened: new Date('2018-11-12').toISOString(),
          date_layby_started: new Date('2018-10-08').toISOString(),
          is_deleted: 0,
        },
        {
          id: 4,
          state: SaleStateTypes.Completed,
          date_sale_opened: new Date('2018-11-15').toISOString(),
          date_sale_closed: new Date('2019-01-05').toISOString(),
          is_deleted: 0,
        },
        {
          id: 5,
          state: SaleStateTypes.Completed,
          date_sale_opened: new Date('2019-05-01').toISOString(),
          date_sale_closed: new Date('2019-05-01').toISOString(),
          is_deleted: 0,
        },
        {
          id: 6,
          state: SaleStateTypes.Completed,
          date_sale_opened: new Date('2020-05-01').toISOString(),
          date_sale_closed: new Date('2020-05-01').toISOString(),
          is_deleted: 0,
        },
        {
          id: 7,
          state: SaleStateTypes.Completed,
          date_sale_opened: new Date('2020-05-01').toISOString(),
          date_sale_closed: new Date('2020-05-01').toISOString(),
          is_deleted: 0,
        },
        {
          id: 8,
          state: SaleStateTypes.Completed,
          date_sale_opened: new Date('2020-05-01').toISOString(),
          date_sale_closed: new Date('2020-05-01').toISOString(),
          is_deleted: 0,
        },
        {
          id: 9,
          state: SaleStateTypes.Completed,
          date_sale_opened: new Date('2020-05-01').toISOString(),
          date_sale_closed: new Date('2020-05-01').toISOString(),
          is_deleted: 0,
        },
        {
          id: 10,
          state: SaleStateTypes.Completed,
          date_sale_opened: new Date('2020-05-01').toISOString(),
          date_sale_closed: new Date('2020-05-01').toISOString(),
          is_deleted: 0,
        },
        {
          id: 11,
          state: SaleStateTypes.Completed,
          date_sale_opened: new Date('2018-08-01').toISOString(),
          date_sale_closed: new Date('2020-08-01').toISOString(),
          is_deleted: 0,
        },
        {
          id: 12,
          state: SaleStateTypes.Completed,
          date_sale_opened: new Date('2018-10-01').toISOString(),
          date_sale_closed: new Date('2018-10-01').toISOString(),
          is_deleted: 0,
        },
        {
          id: 13,
          state: SaleStateTypes.Completed,
          date_sale_opened: new Date('2018-12-01').toISOString(),
          date_sale_closed: new Date('2018-12-03').toISOString(),
          is_deleted: 0,
        },
      ]),
    )
