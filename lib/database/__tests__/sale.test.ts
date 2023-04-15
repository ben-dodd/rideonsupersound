// const testCon = require('../testConn')
import testCon from '../testConn'
import { dbGetStockItem } from '../stock'
import { dbSaveCart } from '../sale'
import { SaleStateTypes } from 'lib/types/sale'

beforeAll(() => testCon.migrate.latest())

beforeEach(() => testCon.seed.run())

afterAll(() => testCon.destroy())

const baseCart = {
  sale: { state: SaleStateTypes.InProgress },
  items: [{ itemId: 12, quantity: 1 }],
}

describe('saveCart', () => {
  it('saves a cart and doesnt change the stock movement if in progress', () => {
    const cart = { ...baseCart }
    return dbSaveCart(cart, testCon).then(() =>
      dbGetStockItem(12, false, testCon).then((stockItem) => {
        expect(stockItem?.quantities?.inStock).toBe(10)
      }),
    )
  })
})
describe('saveCart', () => {
  it('saves a cart and doesnt change the stock movement if parked', () => {
    const cart = { ...baseCart }
    cart.sale.state = SaleStateTypes.Parked
    return dbSaveCart(cart, testCon).then(() =>
      dbGetStockItem(12, false, testCon).then((stockItem) => {
        expect(stockItem?.quantities?.inStock).toBe(10)
      }),
    )
  })
})
describe('saveCart', () => {
  it('saves a cart and reduces quantity by one if sale is completed', () => {
    const cart = { ...baseCart }
    cart.sale.state = SaleStateTypes.Completed
    cart.sale.saleClosedBy = 1
    return dbSaveCart(cart, testCon).then(() =>
      dbGetStockItem(12, false, testCon).then((stockItem) => {
        expect(stockItem?.quantities?.inStock).toBe(9)
      }),
    )
  })
})
