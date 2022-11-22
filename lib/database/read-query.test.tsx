import { StockMovementTypes } from 'lib/types'
import { eraseWhiteSpace } from 'lib/utils'
import dayjs from 'dayjs'
import { getReadQuery } from './query'
import {
  getAccountClerksQuery,
  getAccountQuery,
  getAllSelectsQuery,
  getCashGivenQuery,
  getCashReceivedQuery,
  getClerksQuery,
  getCustomerQuery,
  getCustomersQuery,
  getGiftCardsQuery,
  getHelpsQuery,
  getHoldsQuery,
  getJobsQuery,
  getLogsQuery,
  getManualPaymentsQuery,
  getPettyCashQuery,
  getRegisterIDQuery,
  getRegisterQuery,
  getRegistersQuery,
  getSaleByIdQuery,
  getSaleInventoryQuery,
  getSaleItemsQuery,
  getSalesByVendorUid,
  getSalesJoinedQuery,
  getSalesQuery,
  getSaleTransactionsForRangeQuery,
  getSaleTransactionsForSaleQuery,
  getSaleWithItemsQuery,
  getStockMovementByStockIdQuery,
  getStockMovementByVendorUid,
  getStockMovementJoins,
  getStockMovementsQuery,
  getStockPriceByVendorUid,
  getStockQuery,
  getStocktakeItemsByStocktakeQuery,
  getStocktakesByTemplateQuery,
  getStocktakesQuery,
  getStocktakeTemplatesQuery,
  getVendorByUidQuery,
  getVendorFromVendorPaymentQuery,
  getVendorNamesQuery,
  getVendorPaymentsByVendorUid,
  getVendorPaymentsQuery,
  getVendorsQuery,
  getVendorStoreCreditByVendorUid,
  getVendorTotalPaymentsQuery,
} from './read-query'

const vendorUid = 'd6a53cd6-937a-4348-a760-c1b821385ee1'

describe('ACCOUNT/CLERKS QUERIES', () => {
  test('get account from email', () => {
    const email = 'thebillham@gmail.com'
    const expected = `SELECT account.id, account.email, account.is_admin, account.is_authenticated
    FROM account
    WHERE email='${email}'`
    expect(eraseWhiteSpace(getReadQuery(getAccountQuery(email)))).toBe(
      eraseWhiteSpace(expected)
    )
  })

  test('get clerks from account', () => {
    const account_id = 1
    const expected = `SELECT *
    FROM clerk
    WHERE id IN (
      SELECT clerk_id
      FROM account_clerk
      WHERE account_id = ${account_id}
    )
    ORDER BY colour`
    expect(
      eraseWhiteSpace(getReadQuery(getAccountClerksQuery(account_id)))
    ).toBe(eraseWhiteSpace(expected))
  })

  test('get all clerks', () => {
    const expected = `SELECT *
    FROM clerk
    ORDER BY colour`
    expect(eraseWhiteSpace(getReadQuery(getClerksQuery()))).toBe(
      eraseWhiteSpace(expected)
    )
  })
})

describe('VENDOR QUERIES', () => {
  test('get all vendors', () => {
    const expected = `SELECT *
    FROM vendor
    WHERE NOT is_deleted`
    expect(eraseWhiteSpace(getReadQuery(getVendorsQuery()))).toBe(
      eraseWhiteSpace(expected)
    )
  })

  test('get vendor names', () => {
    const expected = `SELECT vendor.id, vendor.name FROM vendor WHERE NOT is_deleted`
    expect(eraseWhiteSpace(getReadQuery(getVendorNamesQuery()))).toBe(
      eraseWhiteSpace(expected)
    )
  })

  test('get vendor by uid', () => {
    const vendorId = 666
    const expected = `SELECT * FROM vendor
    WHERE uid = ${vendorId}`
    expect(eraseWhiteSpace(getReadQuery(getVendorByUidQuery(vendorId)))).toBe(
      eraseWhiteSpace(expected)
    )
  })

  test('get vendor from vendor payment', () => {
    const vendor_payment_id = 123
    const expected = `SELECT * FROM vendor
    WHERE id IN
      (SELECT vendor_id
        FROM vendor_payment
        WHERE id = ${vendor_payment_id}
      )`
    expect(
      eraseWhiteSpace(
        getReadQuery(getVendorFromVendorPaymentQuery(vendor_payment_id))
      )
    ).toBe(eraseWhiteSpace(expected))
  })
})

describe('CUSTOMER QUERIES', () => {
  test('get customer from id', () => {
    const id = 1
    const expected = `SELECT *
    FROM customer
    WHERE id = ${id}`
    expect(eraseWhiteSpace(getReadQuery(getCustomerQuery(id)))).toBe(
      eraseWhiteSpace(expected)
    )
  })

  test('get all customers', () => {
    const id = 1
    const expected = `SELECT *
    FROM customer
    WHERE NOT is_deleted`
    expect(eraseWhiteSpace(getReadQuery(getCustomersQuery()))).toBe(
      eraseWhiteSpace(expected)
    )
  })
})

describe('PAYMENTS QUERIES', () => {
  test('get all vendor payments', () => {
    const expected = `SELECT *
    FROM vendor_payment
    WHERE NOT is_deleted`
    expect(eraseWhiteSpace(getReadQuery(getVendorPaymentsQuery()))).toBe(
      eraseWhiteSpace(expected)
    )
  })

  test('get single vendors total payments', () => {
    const vendor_id = 1
    const getVendorTotalPaymentsQueryExpected = `SELECT vendor_payment.date, vendor_payment.amount
FROM vendor_payment
WHERE vendor_id = ${vendor_id}
AND NOT is_deleted`
    expect(
      eraseWhiteSpace(getReadQuery(getVendorTotalPaymentsQuery(vendor_id)))
    ).toBe(eraseWhiteSpace(getVendorTotalPaymentsQueryExpected))
  })

  test('get vendor payment by uid', () => {
    const expected = `SELECT * FROM vendor_payment
    WHERE NOT is_deleted AND
    vendor_id = (SELECT id FROM vendor WHERE uid = '${vendorUid}')
      ORDER BY date DESC`
    expect(
      eraseWhiteSpace(getReadQuery(getVendorPaymentsByVendorUid(vendorUid)))
    ).toBe(eraseWhiteSpace(expected))
  })

  test('get store credit by vendor uid', () => {
    const expected = `SELECT sale.item_list, payment.vendor_payment_id
    FROM sale INNER JOIN
      (SELECT sale_id, vendor_payment_id FROM sale_transaction
        WHERE vendor_payment_id IN
          (SELECT id FROM vendor_payment WHERE vendor_id = (
            SELECT id FROM vendor WHERE uid = ${vendorUid}
            ))) AS payment
        ON sale.id = payment.sale_id`
    expect(
      eraseWhiteSpace(getReadQuery(getVendorStoreCreditByVendorUid(vendorUid)))
    ).toBe(eraseWhiteSpace(expected))
  })
})

describe('SALE QUERIES', () => {
  test('get all sales', () => {
    const expected = `SELECT
    sale.id,
    sale.customer_id,
    sale.state,
    sale.date_sale_opened,
    sale.sale_opened_by,
    sale.date_sale_closed,
    sale.sale_closed_by,
    sale.store_cut,
    sale.total_price,
    sale.number_of_items,
    sale.item_list,
    sale.is_mail_order,
    sale.postage,
    sale.postal_address,
    sale.weather,
    sale.note
  FROM sale
  WHERE NOT is_deleted`
    expect(eraseWhiteSpace(getReadQuery(getSalesQuery()))).toBe(
      eraseWhiteSpace(expected)
    )
  })

  test('get sales join', () => {
    const expected = `
  SELECT
    sale_item.id,
    sale_item.sale_id,
    sale_item.item_id,
    sale_item.quantity,
    sale_item.store_discount,
    sale_item.vendor_discount,
    sale_item.is_refunded,
    stock.vendor_id,
    sale.date_sale_opened,
    sale.date_sale_closed,
    sale.store_cut,
    sale.total_price,
    sale.number_of_items,
    sale.item_list,
    stock_price.vendor_cut,
    stock_price.total_sell,
    stock_price.date_valid_from AS date_price_valid_from
  FROM sale_item
  LEFT JOIN stock
    ON sale_item.item_id = stock.id
  LEFT JOIN sale
    ON sale.id = sale_item.sale_id
  LEFT JOIN stock_price
    ON stock_price.stock_id = sale_item.item_id
  WHERE stock_price.date_valid_from <= sale.date_sale_opened
  AND stock_price.id = (
    SELECT MAX(id) FROM stock_price WHERE stock_id = sale_item.item_id)
  AND sale.state = 'completed'
  AND sale.is_deleted = 0
  AND sale_item.is_deleted = 0
  `
    expect(eraseWhiteSpace(getReadQuery(getSalesJoinedQuery()))).toBe(
      eraseWhiteSpace(expected)
    )
  })

  test('get sale by id', () => {
    const sale_id = 666
    const expected = `SELECT *
    FROM sale
    WHERE id = ${sale_id}`
    expect(eraseWhiteSpace(getReadQuery(getSaleByIdQuery(sale_id)))).toBe(
      eraseWhiteSpace(expected)
    )
  })

  test('get sale items from sale', () => {
    const sale_id = 666
    const expected = `SELECT
    sale_item.id,
    sale_item.sale_id,
    sale_item.item_id,
    sale_item.quantity,
    sale_item.store_discount,
    sale_item.vendor_discount,
    sale_item.is_refunded,
    sale_item.date_refunded,
    sale_item.is_gift_card,
    sale_item.is_misc_item,
    sale.date_sale_opened,
    sale.date_sale_closed,
    stock_price.vendor_cut,
    stock_price.total_sell,
    stock_price.date_valid_from AS date_price_valid_from
  FROM sale
  LEFT JOIN sale_item
    ON sale_item.sale_id = sale.id
  LEFT JOIN stock_price
    ON stock_price.stock_id = sale_item.item_id
  WHERE sale.id = ${sale_id}
  AND (sale_item.is_gift_card OR sale_item.is_misc_item OR stock_price.date_valid_from <= sale.date_sale_opened)
  AND sale.is_deleted = 0
  AND sale_item.is_deleted = 0`
    expect(eraseWhiteSpace(getReadQuery(getSaleWithItemsQuery(sale_id)))).toBe(
      eraseWhiteSpace(expected)
    )
  })

  test('get all sale items', () => {
    const expected = `SELECT *
    FROM sale_item`
    expect(eraseWhiteSpace(getReadQuery(getSaleItemsQuery()))).toBe(
      eraseWhiteSpace(expected)
    )
  })

  test('get sale transactions between date range', () => {
    const start_date = dayjs().startOf('week').format('YYYY-MM-DD')
    const end_date = dayjs().format('YYYY-MM-DD')
    const expected = `SELECT
    sale_transaction.id,
    sale_transaction.sale_id,
    sale_transaction.clerk_id,
    sale_transaction.date,
    sale_transaction.payment_method,
    sale_transaction.amount,
    sale_transaction.cash_received,
    sale_transaction.change_given,
    sale_transaction.vendor_payment_id,
    sale_transaction.gift_card_id,
    sale_transaction.gift_card_taken,
    sale_transaction.gift_card_change,
    sale_transaction.register_id,
    sale_transaction.is_refund,
    sale.item_list
  FROM sale_transaction
  LEFT JOIN sale
    ON sale.id = sale_transaction.sale_id
  WHERE sale_transaction.date >= '${start_date}'
  AND sale_transaction.date <= '${end_date}'
  AND sale.is_deleted = 0
  AND sale_transaction.is_deleted = 0
  ORDER BY sale_transaction.date`
    expect(
      eraseWhiteSpace(
        getReadQuery(getSaleTransactionsForRangeQuery(start_date, end_date))
      )
    ).toBe(eraseWhiteSpace(expected))
  })

  test('get sale transactions for sale', () => {
    const sale_id = 666
    const expected = `SELECT *
    FROM sale_transaction
    WHERE sale_id = ${sale_id}`
    expect(
      eraseWhiteSpace(getReadQuery(getSaleTransactionsForSaleQuery(sale_id)))
    ).toBe(eraseWhiteSpace(expected))
  })

  test('get sales for vendor', () => {
    const expected = `SELECT
    sale_item.sale_id,
    sale_item.item_id,
    sale_item.quantity,
    sale_item.vendor_discount,
    sale_item.store_discount,
    stock_price.vendor_cut,
    stock_price.total_sell,
    stock_price.date_valid_from AS date_price_valid_from,
    sale.date_sale_opened,
    sale.date_sale_closed
  FROM sale_item
  LEFT JOIN sale
    ON sale.id = sale_item.sale_id
  LEFT JOIN stock_price
    ON stock_price.stock_id = sale_item.item_id
  WHERE sale_item.item_id IN
    (SELECT id FROM stock
      WHERE vendor_id = ?
    )
  AND stock_price.date_valid_from <= sale.date_sale_opened
  AND sale.state = 'completed'
  AND sale.is_deleted = 0
  AND sale_item.is_deleted = 0`
  })

  test('get sales by vendor uid', () => {
    const expected = `SELECT
    sale_item.sale_id,
    sale_item.item_id,
    sale_item.quantity,
    sale_item.is_refunded,
    sale_item.store_discount,
    sale_item.vendor_discount,
    sale.date_sale_closed,
    stock.vendor_id
  FROM sale_item
  LEFT JOIN sale
    ON sale.id = sale_item.sale_id    
  LEFT JOIN stock
    ON stock.id = sale_item.item_id
  WHERE sale.state = 'completed'
  AND NOT sale.is_deleted
  AND NOT sale_item.is_deleted
  AND stock.vendor_id = (SELECT id FROM vendor WHERE uid = '${vendorUid}')
    ORDER BY sale.date_sale_closed DESC`
    expect(eraseWhiteSpace(getReadQuery(getSalesByVendorUid(vendorUid)))).toBe(
      eraseWhiteSpace(expected)
    )
  })

  test('get all holds', () => {
    const expected = `SELECT *
    FROM hold
    WHERE NOT is_deleted AND date_removed_from_hold IS NULL`
    expect(eraseWhiteSpace(getReadQuery(getHoldsQuery()))).toBe(
      eraseWhiteSpace(expected)
    )
  })
})

describe('STOCK QUERIES', () => {
  test('get stock movement join', () => {
    const expected = [
      {
        columns: [
          { key: 'stock_id', columnSkip: true },
          { key: 'SUM(quantity)', as: `quantity_received` },
        ],
        table: 'stock_movement',
        groupBy: 'stock_id',
        where: `act = '${StockMovementTypes.Received}'`,
        on: `rec.stock_id = stock.id`,
        as: 'rec',
      },
    ]
    expect(getStockMovementJoins([StockMovementTypes.Received])).toEqual(
      expected
    )
  })

  test('get all stock', () => {
    const expected = `
    SELECT
        stock.id,
        stock.vendor_id,
        stock.artist,
        stock.title,
        stock.display_as,
        stock.media,
        stock.format,
        stock.section,
        stock.country,
        stock.is_new,
        stock.cond,
        stock.image_url,
        stock.is_gift_card,
        stock.gift_card_code,
        stock.gift_card_amount,
        stock.gift_card_remaining,
        stock.gift_card_is_valid,
        stock.is_misc_item,
        stock.misc_item_description,
        stock.misc_item_amount,
        stock.needs_restock,
        stock.is_deleted,
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
      LEFT JOIN stock_price AS p ON p.stock_id = stock.id
      WHERE
         (p.id = (
            SELECT MAX(id)
            FROM stock_price
            WHERE stock_id = stock.id
         ) OR stock.is_gift_card OR stock.is_misc_item)
  `
    expect(eraseWhiteSpace(getReadQuery(getStockQuery()))).toBe(
      eraseWhiteSpace(expected)
    )
  })

  test('get stock by id', () => {
    const stock_id = 100
    const expected = `SELECT
    stock.*,
    q.quantity,
    rec.quantity_received,
    ret.quantity_returned,
    sol.quantity_sold,
    uns.quantity_unsold,
    hol.quantity_hold,
    unh.quantity_unhold,
    lay.quantity_layby,
    unl.quantity_unlayby,
    los.quantity_lost,
    fou.quantity_found,
    dis.quantity_discarded,
    adj.quantity_adjustment,
    p.vendor_cut,
    p.total_sell
  FROM stock
  LEFT JOIN
    (SELECT stock_id, SUM(quantity) AS quantity FROM stock_movement GROUP BY stock_id) AS q
    ON q.stock_id = stock.id
  LEFT JOIN
    (SELECT stock_id, SUM(quantity) AS quantity_received FROM stock_movement WHERE act = '${StockMovementTypes.Received}' GROUP BY stock_id) AS rec
    ON rec.stock_id = stock.id
  LEFT JOIN
    (SELECT stock_id, SUM(quantity) AS quantity_returned FROM stock_movement WHERE act = '${StockMovementTypes.Returned}' GROUP BY stock_id) AS ret
    ON ret.stock_id = stock.id
  LEFT JOIN
    (SELECT stock_id, SUM(quantity) AS quantity_sold FROM stock_movement WHERE act = '${StockMovementTypes.Sold}' GROUP BY stock_id) AS sol
    ON sol.stock_id = stock.id
  LEFT JOIN
    (SELECT stock_id, SUM(quantity) AS quantity_unsold FROM stock_movement WHERE act = '${StockMovementTypes.Unsold}' GROUP BY stock_id) AS uns
    ON uns.stock_id = stock.id
  LEFT JOIN
    (SELECT stock_id, SUM(quantity) AS quantity_hold FROM stock_movement WHERE act = '${StockMovementTypes.Hold}' GROUP BY stock_id) AS hol
    ON hol.stock_id = stock.id
  LEFT JOIN
    (SELECT stock_id, SUM(quantity) AS quantity_unhold FROM stock_movement WHERE act = '${StockMovementTypes.Unhold}' GROUP BY stock_id) AS unh
    ON unh.stock_id = stock.id
  LEFT JOIN
    (SELECT stock_id, SUM(quantity) AS quantity_layby FROM stock_movement WHERE act = '${StockMovementTypes.Layby}' GROUP BY stock_id) AS lay
    ON lay.stock_id = stock.id
  LEFT JOIN
    (SELECT stock_id, SUM(quantity) AS quantity_unlayby FROM stock_movement WHERE act = '${StockMovementTypes.Unlayby}' GROUP BY stock_id) AS unl
    ON unl.stock_id = stock.id
  LEFT JOIN
    (SELECT stock_id, SUM(quantity) AS quantity_lost FROM stock_movement WHERE act = '${StockMovementTypes.Lost}' GROUP BY stock_id) AS los
    ON los.stock_id = stock.id
  LEFT JOIN
    (SELECT stock_id, SUM(quantity) AS quantity_found FROM stock_movement WHERE act = '${StockMovementTypes.Found}' GROUP BY stock_id) AS fou
    ON fou.stock_id = stock.id
  LEFT JOIN
    (SELECT stock_id, SUM(quantity) AS quantity_discarded FROM stock_movement WHERE act = '${StockMovementTypes.Discarded}' GROUP BY stock_id) AS dis
    ON dis.stock_id = stock.id
  LEFT JOIN
    (SELECT stock_id, SUM(quantity) AS quantity_adjustment FROM stock_movement WHERE act = '${StockMovementTypes.Adjustment}' GROUP BY stock_id) AS adj
    ON adj.stock_id = stock.id
  LEFT JOIN
    stock_price AS p ON p.stock_id = stock.id
    WHERE
       p.id = (
          SELECT MAX(id)
          FROM stock_price
          WHERE stock_id = stock.id
        )
  AND id = ${stock_id}`
    expect(eraseWhiteSpace(getReadQuery(getStockQuery(stock_id)))).toBe(
      eraseWhiteSpace(expected)
    )
  })

  test('get stock for a vendor', () => {
    const vendor_id = 666
    const expected = `SELECT
        stock.id,
        stock.vendor_id,
        stock.artist,
        stock.title,
        stock.display_as,
        stock.media,
        stock.format,
        stock.section,
        stock.country,
        stock.is_new,
        stock.cond,
        stock.image_url,
        stock.is_gift_card,
        stock.gift_card_code,
        stock.gift_card_amount,
        stock.gift_card_remaining,
        stock.gift_card_is_valid,
        stock.is_misc_item,
        stock.misc_item_description,
        stock.misc_item_amount,
        stock.needs_restock,
        stock.is_deleted,
        q.quantity,
        hol.quantity_hold,
        lay.quantity_layby,
        sol.quantity_sold,
        p.vendor_cut,
        p.total_sell
      FROM stock
      LEFT JOIN (SELECT stock_id, SUM(quantity) AS quantity FROM stock_movement GROUP BY stock_id) AS q ON q.stock_id = stock.id LEFT JOIN (SELECT stock_id, SUM(quantity) AS quantity_hold FROM stock_movement WHERE act = 'hold' GROUP BY stock_id) AS hol ON hol.stock_id = stock.id
      LEFT JOIN (SELECT stock_id, SUM(quantity) AS quantity_layby FROM stock_movement WHERE act = 'layby' GROUP BY stock_id) AS lay ON lay.stock_id = stock.id
      LEFT JOIN (SELECT stock_id, SUM(quantity) AS quantity_sold FROM stock_movement WHERE act = 'sold' GROUP BY stock_id) AS sol ON sol.stock_id = stock.id
      LEFT JOIN stock_price AS p ON p.stock_id = stock.id
      WHERE stock.vendor_id = 666 AND (p.id = ( SELECT MAX(id) FROM stock_price WHERE stock_id = stock.id ) OR stock.is_gift_card OR stock.is_misc_item)`
    expect(eraseWhiteSpace(getReadQuery(getStockQuery(null, vendor_id)))).toBe(
      eraseWhiteSpace(expected)
    )
  })

  test('get stock by vendor uid', () => {
    const expected = `SELECT
    stock.id,
    stock.vendor_id,
    stock.artist,
    stock.title,
    stock.display_as,
    stock.media,
    stock.format,
    stock.section,
    stock.country,
    stock.is_new,
    stock.cond,
    stock.image_url,
    stock.is_gift_card,
    stock.gift_card_code,
    stock.gift_card_amount,
    stock.gift_card_remaining,
    stock.gift_card_is_valid,
    stock.is_misc_item,
    stock.misc_item_description,
    stock.misc_item_amount,
    stock.needs_restock,
    stock.is_deleted,
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
  LEFT JOIN stock_price AS p ON p.stock_id = stock.id
  WHERE vendor_id = (SELECT id FROM vendor WHERE uid = '${vendorUid}')
  AND NOT is_deleted
    AND (p.id = (
        SELECT MAX(id)
        FROM stock_price
        WHERE stock_id = stock.id
     ) OR stock.is_gift_card OR stock.is_misc_item)`
    expect(
      eraseWhiteSpace(getReadQuery(getStockQuery(null, null, vendorUid)))
    ).toBe(eraseWhiteSpace(expected))
  })

  test('get stock price by vendor uid', () => {
    const expected = `SELECT * FROM stock_price
    WHERE stock_id IN (SELECT id FROM stock WHERE vendor_id=(SELECT id FROM vendor WHERE uid = '${vendorUid}'))
      ORDER BY date_valid_from DESC`
    expect(
      eraseWhiteSpace(getReadQuery(getStockPriceByVendorUid(vendorUid)))
    ).toBe(eraseWhiteSpace(expected))
  })

  test('get sale inventory', () => {
    const expected = `SELECT
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
  LEFT JOIN stock_price AS p ON p.stock_id = stock.id
  WHERE
  (p.id = (
      SELECT MAX(id)
      FROM stock_price
      WHERE stock_id = stock.id
  ) OR stock.is_gift_card OR stock.is_misc_item)
  AND stock.is_deleted = 0`
    expect(eraseWhiteSpace(getReadQuery(getSaleInventoryQuery()))).toBe(
      eraseWhiteSpace(expected)
    )
  })

  test('get all gift cards', () => {
    const expected = `SELECT
    stock.id,
    stock.is_gift_card,
    stock.gift_card_code,
    stock.gift_card_amount,
    stock.gift_card_remaining,
    stock.gift_card_is_valid,
    stock.note,
    stock.date_created,
    stock.date_modified
  FROM stock
  WHERE is_gift_card AND NOT is_deleted`
    expect(eraseWhiteSpace(getReadQuery(getGiftCardsQuery()))).toBe(
      eraseWhiteSpace(expected)
    )
  })

  test('get all stock movments', () => {
    const limit = 100
    const expected = `SELECT *
    FROM stock_movement
    ORDER BY date_moved DESC`
    const expectedLimit = `SELECT * FROM stock_movement ORDER BY date_moved DESC LIMIT ${limit}`
    expect(eraseWhiteSpace(getReadQuery(getStockMovementsQuery()))).toBe(
      eraseWhiteSpace(expected)
    )
    expect(eraseWhiteSpace(getReadQuery(getStockMovementsQuery(limit)))).toBe(
      eraseWhiteSpace(expectedLimit)
    )
  })

  test('get stock movements for stock item', () => {
    const stockId = 100
    const expected = `SELECT * FROM stock_movement
    WHERE NOT is_deleted AND
    stock_id = ${stockId}
    ORDER BY date_moved DESC`
    expect(
      eraseWhiteSpace(getReadQuery(getStockMovementByStockIdQuery(stockId)))
    ).toBe(eraseWhiteSpace(expected))
  })

  test('get stock movements by vendor uid', () => {
    const expected = `SELECT * FROM stock_movement
    WHERE NOT is_deleted AND
    stock_id IN (SELECT id FROM stock WHERE vendor_id=(SELECT id FROM vendor WHERE uid = '${vendorUid}'))
    ORDER BY date_moved`
    expect(
      eraseWhiteSpace(getReadQuery(getStockMovementByVendorUid(vendorUid)))
    ).toBe(eraseWhiteSpace(expected))
  })
})

describe('REGISTER QUERIES', () => {
  test('get cash given by register id', () => {
    const register_id = 100
    const expected = `SELECT
      sale_transaction.sale_id,
      sale_transaction.clerk_id,
      sale_transaction.date,
      sale_transaction.payment_method,
      sale_transaction.amount,
      sale_transaction.change_given
    FROM sale_transaction
    WHERE register_id = ${register_id} AND change_given AND NOT is_deleted`
    expect(eraseWhiteSpace(getReadQuery(getCashGivenQuery(register_id)))).toBe(
      eraseWhiteSpace(expected)
    )
  })

  test('get cash received by register id', () => {
    const register_id = 100
    const expected = `SELECT
      sale_transaction.sale_id,
      sale_transaction.clerk_id,
      sale_transaction.date,
      sale_transaction.payment_method,
      sale_transaction.amount,
      sale_transaction.cash_received
    FROM sale_transaction
    WHERE register_id = ${register_id} AND cash_received AND NOT is_deleted`
    expect(
      eraseWhiteSpace(getReadQuery(getCashReceivedQuery(register_id)))
    ).toBe(eraseWhiteSpace(expected))
  })

  test('get manual payments for register', () => {
    const register_id = 101
    const expected = `SELECT
      vendor_payment.date,
      vendor_payment.amount,
      vendor_payment.clerk_id,
      vendor_payment.vendor_id
    FROM vendor_payment
    WHERE register_id = ${register_id} AND type = 'cash'`
    expect(
      eraseWhiteSpace(getReadQuery(getManualPaymentsQuery(register_id)))
    ).toBe(eraseWhiteSpace(expected))
  })

  test('get petty cash for register', () => {
    const register_id = 40
    const expected = `SELECT *
    FROM register_petty_cash
    WHERE register_id = ${register_id}`
    expect(eraseWhiteSpace(getReadQuery(getPettyCashQuery(register_id)))).toBe(
      eraseWhiteSpace(expected)
    )
  })

  test('get current register id', () => {
    const expected = `SELECT global.num
    FROM global
    WHERE id='current_register'`
    expect(eraseWhiteSpace(getReadQuery(getRegisterIDQuery()))).toBe(
      eraseWhiteSpace(expected)
    )
  })

  test('get register', () => {
    const register_id = 100
    const expected = `SELECT *
    FROM register
    WHERE id = ${register_id}`
    expect(eraseWhiteSpace(getReadQuery(getRegisterQuery(register_id)))).toBe(
      eraseWhiteSpace(expected)
    )
  })

  test('get registers between dates', () => {
    const start_date = dayjs().startOf('week').format('YYYY-MM-DD')
    const end_date = dayjs().format('YYYY-MM-DD')
    const expected = `SELECT
        *
      FROM register
      WHERE open_date >= '${start_date}'
      AND open_date <= '${end_date}'`
    expect(
      eraseWhiteSpace(getReadQuery(getRegistersQuery(start_date, end_date)))
    ).toBe(eraseWhiteSpace(expected))
  })
})

describe('JOBS QUERIES', () => {
  test('get recent tasks', () => {
    const expected = `SELECT *
    FROM task
    WHERE NOT is_deleted
    AND NOT is_completed
    OR date_completed > date_sub(now(), interval 1 week)
    ORDER BY date_created DESC`
    expect(eraseWhiteSpace(getReadQuery(getJobsQuery()))).toBe(
      eraseWhiteSpace(expected)
    )
  })
})

describe('STOCKTAKE QUERIES', () => {
  test('get stock items by stocktake', () => {
    const stocktakeId = 1
    const expected = `SELECT * FROM stocktake_item
    WHERE NOT is_deleted
    AND stocktake_id = ${stocktakeId}
    ORDER BY date_counted DESC`
    expect(
      eraseWhiteSpace(
        getReadQuery(getStocktakeItemsByStocktakeQuery(stocktakeId))
      )
    ).toBe(eraseWhiteSpace(expected))
  })

  test('get all stocktake templates', () => {
    const expected = `SELECT *
    FROM stocktake_template
    WHERE NOT is_deleted`
    expect(eraseWhiteSpace(getReadQuery(getStocktakeTemplatesQuery()))).toBe(
      eraseWhiteSpace(expected)
    )
  })

  test('get stocktakes by template', () => {
    const templateId = 1
    const expected = `SELECT * FROM stocktake
    WHERE NOT is_deleted
    AND stocktake_template_id = ${templateId}
    ORDER BY date_started DESC`
    expect(
      eraseWhiteSpace(getReadQuery(getStocktakesByTemplateQuery(templateId)))
    ).toBe(eraseWhiteSpace(expected))
  })

  test('get all stocktakes', () => {
    const expected = `SELECT *
    FROM stocktake
    WHERE NOT is_deleted`
    expect(eraseWhiteSpace(getReadQuery(getStocktakesQuery()))).toBe(
      eraseWhiteSpace(expected)
    )
  })
})

describe('APP QUERIES', () => {
  test('get all selects', () => {
    const expected = `SELECT select_option.label, select_option.setting_select
    FROM select_option`
    expect(eraseWhiteSpace(getReadQuery(getAllSelectsQuery()))).toBe(
      eraseWhiteSpace(expected)
    )
  })

  test('get all helps', () => {
    const expected = `SELECT *
    FROM help
    WHERE NOT is_deleted`
    expect(eraseWhiteSpace(getReadQuery(getHelpsQuery()))).toBe(
      eraseWhiteSpace(expected)
    )
  })

  test('get all logs', () => {
    const limit = 200
    const expected = `SELECT *
    FROM log
    WHERE NOT is_deleted AND NOT table_id <=> 'system'
    ORDER BY date_created DESC LIMIT ${limit}`
    const expectedNoLimit = `SELECT *
    FROM log
    WHERE NOT is_deleted AND NOT table_id <=> 'system'
    ORDER BY date_created DESC`
    expect(eraseWhiteSpace(getReadQuery(getLogsQuery(limit)))).toBe(
      eraseWhiteSpace(expected)
    )
    expect(eraseWhiteSpace(getReadQuery(getLogsQuery()))).toBe(
      eraseWhiteSpace(expectedNoLimit)
    )
  })
})
