// const testCon = require('../testConn')
import testCon from '../testConn'
import { dbGetClerk } from '../clerk'
import { dbGetStockItem, dbGetStockItems, dbGetWebStock } from '../stock'

// const { getClerk } = require('../clerk')

beforeAll(() => testCon.migrate.latest())

beforeEach(() => testCon.seed.run())

afterAll(() => testCon.destroy())

describe('getStockItem', () => {
  it('get stock item that matches the id', () => {
    return dbGetStockItem(1, testCon).then((stockItem) => {
      expect(stockItem?.id).toBe(1)
    })
  })
})

describe('getStockItems', () => {
  it('gets all stock items from a list', () => {
    return dbGetStockItems([1, 2], testCon).then((stockItems) => {
      expect(stockItems).toHaveLength(2)
      expect(stockItems[0]?.artist).toBe('The Beatles')
      expect(stockItems[0]?.quantity).toEqual(3)
      // expect(stockItems[0]?.totalSell).toEqual(2000)
    })
  })
  it('gets a stock item when there is only one item', () => {
    return dbGetStockItems([1], testCon).then((stockItems) => {
      expect(stockItems).toHaveLength(1)
    })
  })
})

describe('getWebStock', () => {
  it('gets the correct stock items for the website', () => {
    return dbGetWebStock(`stock.format = '7"'`, testCon).then((webStock) => {
      expect(webStock).toHaveLength(2)
    })
  })
})
