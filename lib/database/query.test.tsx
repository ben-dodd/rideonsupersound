import { StockMovementTypes } from '../types'
import {
  createJoinsQuery,
  createLimitQuery,
  createOrderQuery,
  createWhereQuery,
  getCreateQuery,
  getDeleteQuery,
  getReadQuery,
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

test('delete item', () => {
  expect(getDeleteQuery('stock', 4)).toStrictEqual({
    deleteQuery: `UPDATE stock SET is_deleted = 1 WHERE id = ?`,
    values: [4],
  })
  expect(getDeleteQuery('stock_movement', 114, 'sale_id', true)).toStrictEqual({
    deleteQuery: `DELETE FROM stock_movement WHERE sale_id = ?`,
    values: [114],
  })
  expect(getDeleteQuery('vendor', 45, null, true)).toStrictEqual({
    deleteQuery: `DELETE FROM vendor WHERE id = ?`,
    values: [45],
  })
})

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

test('read items - stock all', () => {
  const getAllStockQuery = `
    SELECT
      stock.id,
      stock.vendor_id,
      stock.artist,
      stock.title,
      stock.display_as,
      q.quantity,
      hol.quantity_hold,
      lay.quantity_layby,
      sol.quantity_sold,
      p.vendor_cut,
      p.total_sell
    FROM stock
    LEFT JOIN
      (SELECT stock_id, SUM(quantity) AS quantity FROM stock_movement GROUP BY stock_id) AS q
      ON q.stock_id = stock.id
    LEFT JOIN
      (SELECT stock_id, SUM(quantity) AS quantity_hold FROM stock_movement WHERE act = '${StockMovementTypes.Hold}' GROUP BY stock_id) AS hol
      ON hol.stock_id = stock.id
    LEFT JOIN
      (SELECT stock_id, SUM(quantity) AS quantity_layby FROM stock_movement WHERE act = '${StockMovementTypes.Layby}' GROUP BY stock_id) AS lay
      ON lay.stock_id = stock.id
    LEFT JOIN
      (SELECT stock_id, SUM(quantity) AS quantity_sold FROM stock_movement WHERE act = '${StockMovementTypes.Sold}' GROUP BY stock_id) AS sol
      ON sol.stock_id = stock.id
    LEFT JOIN (SELECT id, stock_id, vendor_cut, total_sell FROM stock_price) AS p ON p.stock_id = stock.id
    WHERE
      (p.id = (
          SELECT MAX(id)
          FROM stock_price
          WHERE stock_id = stock.id
      ) OR stock.is_gift_card OR stock.is_misc_item)
    `
  expect(
    eraseWhiteSpace(
      getReadQuery({
        columns: ['id', 'vendor_id', 'artist', 'title', 'display_as'],
        table: 'stock',
        joins: [
          {
            columns: [
              { key: 'stock_id', columnSkip: true },
              { key: 'SUM(quantity)', as: 'quantity' },
            ],
            table: 'stock_movement',
            groupBy: 'stock_id',
            on: ['stock_id', '=', 'id'],
            as: 'q',
          },
          {
            columns: [
              { key: 'stock_id', columnSkip: true },
              { key: 'SUM(quantity)', as: 'quantity_hold' },
            ],
            table: 'stock_movement',
            where: ['act', '=', `'${StockMovementTypes.Hold}'`],
            groupBy: 'stock_id',
            on: ['stock_id', '=', 'id'],
            as: 'hol',
          },
          {
            columns: [
              { key: 'stock_id', columnSkip: true },
              { key: 'SUM(quantity)', as: 'quantity_layby' },
            ],
            table: 'stock_movement',
            where: ['act', '=', `'${StockMovementTypes.Layby}'`],
            groupBy: 'stock_id',
            on: ['stock_id', '=', 'id'],
            as: 'lay',
          },
          {
            columns: [
              { key: 'stock_id', columnSkip: true },
              { key: 'SUM(quantity)', as: 'quantity_sold' },
            ],
            table: 'stock_movement',
            where: ['act', '=', `'${StockMovementTypes.Sold}'`],
            groupBy: 'stock_id',
            on: ['stock_id', '=', 'id'],
            as: 'sol',
          },
          {
            table: 'stock_price',
            columns: [
              { key: 'id', columnSkip: true },
              { key: 'stock_id', columnSkip: true },
              { key: 'vendor_cut' },
              { key: 'total_sell' },
            ],
            on: ['stock_id', '=', 'id'],
            as: 'p',
          },
        ],
        where: `(p.id = (
        SELECT MAX(id)
        FROM stock_price
        WHERE stock_id = stock.id
     ) OR stock.is_gift_card OR stock.is_misc_item)`,
      })
    )
  ).toBe(eraseWhiteSpace(getAllStockQuery))
})

test('read query - sale inventory', () => {
  const getSaleInventoryQuery = `SELECT
    stock.id,
    stock.vendor_id,
    stock.artist,
    stock.title,
    stock.display_as,
    stock.media,
    stock.format,
    stock.image_url,
    stock.is_gift_card,
    stock.gift_card_code,
    stock.gift_card_amount,
    stock.gift_card_remaining,
    stock.gift_card_is_valid,
    stock.is_misc_item,
    stock.misc_item_description,
    stock.misc_item_amount,
    p.vendor_cut,
    p.total_sell
    FROM stock
    LEFT JOIN (SELECT id, stock_id, vendor_cut, total_sell FROM stock_price) AS p ON p.stock_id = stock.id
    WHERE
    (p.id = (
        SELECT MAX(id)
        FROM stock_price
        WHERE stock_id = stock.id
    ) OR stock.is_gift_card OR stock.is_misc_item)
    AND stock.is_deleted = 0`
  expect(
    eraseWhiteSpace(
      getReadQuery({
        columns: [
          'id',
          'vendor_id',
          'artist',
          'title',
          'display_as',
          'media',
          'format',
          'image_url',
          'is_gift_card',
          'gift_card_code',
          'gift_card_amount',
          'gift_card_remaining',
          'gift_card_is_valid',
          'is_misc_item',
          'misc_item_description',
          'misc_item_amount',
        ],
        table: 'stock',
        joins: [
          {
            table: 'stock_price',
            columns: [
              { key: 'id', columnSkip: true },
              { key: 'stock_id', columnSkip: true },
              { key: 'vendor_cut' },
              { key: 'total_sell' },
            ],
            on: ['stock_id', '=', 'id'],
            as: 'p',
          },
        ],
        where: `(p.id = (
        SELECT MAX(id)
        FROM stock_price
        WHERE stock_id = stock.id
     ) OR stock.is_gift_card OR stock.is_misc_item)
    AND stock.is_deleted = 0`,
      })
    )
  ).toBe(eraseWhiteSpace(getSaleInventoryQuery))
})

test('read queries', () => {
  expect(
    eraseWhiteSpace(
      createJoinsQuery(
        [
          {
            columns: ['stock_id', 'SUM(quantity) AS quantity_layby'],
            table: 'stock_movement',
            where: ['act', '=', `'${StockMovementTypes.Layby}'`],
            groupBy: 'stock_id',
            on: ['stock_id', '=', 'id'],
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

function eraseWhiteSpace(str) {
  return str.replace(/\s+/g, ' ').trim()
}

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
