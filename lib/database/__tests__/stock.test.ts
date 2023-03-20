// const testCon = require('../testConn')
import testCon from '../testConn'
import { dbCheckIfRestockNeeded, dbCreateStockMovement, dbGetStockItem, dbGetStockItems, dbGetWebStock } from '../stock'
import { StockMovementTypes } from 'lib/types/stock'

beforeAll(() => testCon.migrate.latest())

beforeEach(() => testCon.seed.run())

afterAll(() => testCon.destroy())

describe('getStockItem', () => {
  it('get stock item that matches the id', () => {
    return dbGetStockItem(1, testCon).then((stockItem) => {
      expect(stockItem?.item?.id).toBe(1)
    })
  })
})

describe('getStockItems', () => {
  it('gets all stock items from a list', () => {
    return dbGetStockItems([1, 2], testCon).then((stockItems) => {
      expect(stockItems).toHaveLength(2)
      expect(stockItems[0]?.item?.artist).toBe('The Beatles')
      expect(stockItems[0]?.quantities?.inStock).toEqual(3)
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
  it('gets the correct 7" items for the website', () => {
    return dbGetWebStock(`stock.format = '7"'`, testCon).then((webStock) => {
      expect(webStock).toHaveLength(2)
    })
  })
  it.todo('gets the correct 10" items for the website')
  it.todo('gets the correct 12" items for the website')
  it.todo('gets all the items for the website')
  it.todo('gets the correct cassette items for the website')
  it.todo('gets the correct cd items for the website')
  it.todo('gets the correct clothing items for the website')
  it.todo('gets the correct comic items for the website')
  it.todo('gets the correct literature items for the website')
  it.todo('gets the correct LP items for the website')
  it.todo('gets the correct merch items for the website')
  it.todo('gets the correct NZ items for the website')
  it.todo('gets the correct zine items for the website')
})

describe('checkIfRestockNeeded', () => {
  it('checks if there is any more of the item in stock and changes the stock item restock flag to true', () =>
    dbCheckIfRestockNeeded(1, testCon).then((needsRestock) => {
      expect(needsRestock).toBeTruthy()
      return dbGetStockItem(1, true, testCon)
        .then((stockItem) => {
          expect(stockItem?.item?.needs_restock).toBeTruthy()
        })
        .catch((e) => Error(e.message))
    }))
  it('wont flag restock if there is no more in stock', () => {
    return dbCreateStockMovement({ stockId: 1, quantity: -3, act: StockMovementTypes.Sold }, testCon)
      .then(() => dbCheckIfRestockNeeded(1, testCon))
      .then((needsRestock) => {
        expect(needsRestock).toBeFalsy()
        return dbGetStockItem(1, true, testCon).then((stockItem) => {
          expect(stockItem?.item?.needs_restock).toBeFalsy()
        })
      })
  })
})
