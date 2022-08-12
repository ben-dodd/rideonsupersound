import { eraseWhiteSpace } from '@lib/utils'
import { StockMovementTypes } from '../types'
import {
  createJoinsQuery,
  createLimitQuery,
  createOrderQuery,
  createWhereQuery,
  getCreateQuery,
  getDeleteQuery,
  getUpdateQuery,
  mysqlSafeValue,
  reverseMysqlSafeValue,
} from './query'

const testObj1 = {
  artist: 'Nirvana',
  title: 'Nevermind',
  isGoodAlbum: true,
}

const testObj2 = {
  items: ['Bag', 'Record', 'CD'],
  clerk: 1,
  customer: { name: 'Ben', age: 15 },
}

describe('CREATE', () => {
  test('create item', () => {
    expect(getCreateQuery('stock', testObj1)).toStrictEqual({
      createQuery: `INSERT INTO stock (artist, title, isGoodAlbum) VALUES (?, ?, ?)`,
      values: ['Nirvana', 'Nevermind', 1],
    })
    expect(getCreateQuery('sale', testObj2)).toStrictEqual({
      createQuery: `INSERT INTO sale (items, clerk, customer) VALUES (?, ?, ?)`,
      values: [
        JSON.stringify(['Bag', 'Record', 'CD']),
        1,
        JSON.stringify({ name: 'Ben', age: 15 }),
      ],
    })
  })
})

describe('DELETE', () => {
  test('delete item', () => {
    expect(getDeleteQuery('stock', 4)).toStrictEqual({
      deleteQuery: `UPDATE stock SET is_deleted = 1 WHERE id = ?`,
      values: [4],
    })
    expect(
      getDeleteQuery('stock_movement', 114, 'sale_id', true)
    ).toStrictEqual({
      deleteQuery: `DELETE FROM stock_movement WHERE sale_id = ?`,
      values: [114],
    })
    expect(getDeleteQuery('vendor', 45, null, true)).toStrictEqual({
      deleteQuery: `DELETE FROM vendor WHERE id = ?`,
      values: [45],
    })
  })
})

describe('UPDATE', () => {
  test('update item', () => {
    expect(getUpdateQuery('stock', testObj1, 4)).toStrictEqual({
      updateQuery: `UPDATE stock SET artist = ?, title = ?, isGoodAlbum = ? WHERE id = ?`,
      values: ['Nirvana', 'Nevermind', 1, 4],
    })
    expect(getUpdateQuery('sales', testObj2, 321)).toStrictEqual({
      updateQuery: `UPDATE sales SET items = ?, clerk = ?, customer = ? WHERE id = ?`,
      values: [
        JSON.stringify(['Bag', 'Record', 'CD']),
        1,
        JSON.stringify({ name: 'Ben', age: 15 }),
        321,
      ],
    })
  })
})

describe('READ', () => {
  test('read queries', () => {
    expect(
      eraseWhiteSpace(
        createJoinsQuery(
          [
            {
              columns: ['stock_id', 'SUM(quantity) AS quantity_layby'],
              table: 'stock_movement',
              where: `act = '${StockMovementTypes.Layby}'`,
              groupBy: 'stock_id',
              on: 'lay.stock_id = sale.id',
              as: 'lay',
            },
          ],
          'sale'
        )
      )
    ).toBe(
      eraseWhiteSpace(
        `LEFT JOIN
  (SELECT stock_id, SUM(quantity) AS quantity_layby FROM stock_movement WHERE act = '${StockMovementTypes.Layby}' GROUP BY stock_id) AS lay
  ON lay.stock_id = sale.id`
      )
    )
  })
})

describe('Partial queries', () => {
  test('order queries', () => {
    expect(createOrderQuery('dogs', '')).toBe(' ORDER BY dogs')
    expect(createOrderQuery('trains', 'true')).toBe(' ORDER BY trains DESC')
  })

  test('limit queries', () => {
    expect(createLimitQuery('bugs')).toBe('')
    expect(createLimitQuery('15')).toBe(' LIMIT 15')
    expect(createLimitQuery({ artist: 'Nirvana' })).toBe('')
  })

  test('where queries', () => {
    const example1 = `
    WHERE
        (p.id = (
          SELECT MAX(id)
          FROM stock_price
          WHERE stock_id = s.id
        ) OR s.is_gift_card OR s.is_misc_item)
    AND s.is_deleted = 0
      `
    const example2 = `
    WHERE sale.id = ?
      AND (sale_item.is_gift_card OR sale_item.is_misc_item OR stock_price.date_valid_from <= sale.date_sale_opened)
      AND sale.is_deleted = 0
      AND sale_item.is_deleted = 0
  `
    const example3 = `
    WHERE sale_item.item_id IN
      (SELECT id FROM stock
        WHERE vendor_id = ?
      )
    AND stock_price.date_valid_from <= sale.date_sale_opened
    AND sale.state = 'completed'
    AND sale.is_deleted = 0
    AND sale_item.is_deleted = 0
  `
    const example4 = `
    WHERE is_deleted = 0
  `
    const example5 = ` WHERE id = 5`
    expect(createWhereQuery('is_deleted = 0')).toBe(' WHERE is_deleted = 0')
  })
})

describe('Helper functions', () => {
  const arrayExample = [
    'Hello',
    17,
    { name: 'Ben', age: 15 },
    ['biking', 'tramping', 'walking'],
  ]
  const objectExample = { name: 'Ben', age: 15 }

  test('mysql safe', () => {
    expect(mysqlSafeValue(0)).toBe(0)
    expect(mysqlSafeValue(false)).toBe(0)
    expect(mysqlSafeValue(objectExample)).toBe(JSON.stringify(objectExample))
    expect(mysqlSafeValue(arrayExample)).toBe(JSON.stringify(arrayExample))
    expect(mysqlSafeValue('Nirvana')).toBe('Nirvana')
  })

  test('reverse mysql safe', () => {
    expect(reverseMysqlSafeValue(0)).toBe(0)
    expect(reverseMysqlSafeValue(JSON.stringify(objectExample))).toStrictEqual(
      objectExample
    )
    expect(reverseMysqlSafeValue(JSON.stringify(arrayExample))).toStrictEqual(
      arrayExample
    )
    expect(reverseMysqlSafeValue('Nirvana')).toBe('Nirvana')
  })
})
