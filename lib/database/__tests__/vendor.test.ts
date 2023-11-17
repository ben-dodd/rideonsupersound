import testConn from '../testConn'
import {
  dbGetTotalVendorCut,
  dbGetTotalVendorCutFromVendorStockIds,
  dbGetTotalVendorPayments,
  dbGetVendorAccount,
  dbGetVendorAccounts,
  dbGetVendorFromVendorPayment,
  dbGetVendorStockIds,
} from '../vendor'

beforeAll(() => testConn.migrate.latest())

beforeEach(() => testConn.seed.run())

afterAll(() => testConn.destroy())

describe('dbGetVendorFromVendorPayment', () => {
  it('should return the name of the vendor who made the payment', () => {
    dbGetVendorFromVendorPayment(8, testConn).then((res) => {
      expect(res?.name).toBe('John Harris')
    })
  })
})

describe('dbGetVendorAccounts', () => {
  it('should return a list of all vendors with their id, name and amount owed by ROSS', () => {
    dbGetVendorAccounts(testConn).then((res) => {
      expect(res).toHaveLength(7)
    })
  })
})

describe('dbGetVendorAccount', () => {
  it('should return the vendor id, name and totalOwing', () => {
    dbGetVendorAccount({ id: 1, name: 'Nick White' }, testConn).then((res) => {
      expect(res).toMatchObject({ id: 1, name: 'Nick White', totalOwing: 1800 - 3000 })
    })
    dbGetVendorAccount({ id: 2, name: 'Ben Dodd' }, testConn).then((res) => {
      expect(res).toMatchObject({ id: 2, name: 'Ben Dodd', totalOwing: 700 - -500 })
    })
    dbGetVendorAccount({ id: 42, name: 'John Harris' }, testConn).then((res) => {
      expect(res).toMatchObject({ id: 42, name: 'John Harris', totalOwing: 2800 - 7700 })
    })
  })
  it.todo('should take into account transfers between vendors')
})

describe('dbGetTotalVendorPayments', () => {
  it('should return the total payments made to the vendor', () => {
    dbGetTotalVendorPayments(42, testConn).then((res) => {
      expect(res).toBe(7700)
    })
  })
  it('should not count deleted vendor payments', () => {
    dbGetTotalVendorPayments(1, testConn).then((res) => {
      expect(res).toBe(3000)
    })
  })
  it('should handle negative (transfer from) payments', () => {
    dbGetTotalVendorPayments(2, testConn).then((res) => {
      expect(res).toBe(-500)
    })
  })
})

describe('dbGetVendorStockIds', () => {
  it('should get a list of all the stock ids belonging to the vendor', () => {
    dbGetVendorStockIds(1, testConn).then((res) => {
      expect(res).toEqual([1, 2])
    })
  })
})

describe('dbGetTotalVendorCut', () => {
  it('should get the correct number for vendor that has sold only one item with no discounts', () => {
    dbGetTotalVendorCut(1, testConn).then((res) => {
      expect(res).toBe(1800)
    })
    dbGetTotalVendorCut(2, testConn).then((res) => {
      expect(res).toBe(700)
    })
    dbGetTotalVendorCut(42, testConn).then((res) => {
      expect(res).toBe(2800)
    })
  })
})

describe('dbGetTotalVendorCutFromVendorStockIds', () => {
  it('should return the vendor cut for a single item sold with no discount', () => {
    dbGetTotalVendorCutFromVendorStockIds([4], testConn).then((res) => {
      expect(res).toEqual(700)
    })
  })
  it('should return the vendor cut for multiple items sold with no discount', () => {
    dbGetTotalVendorCutFromVendorStockIds([8], testConn).then((res) => {
      expect(res).toEqual(5000) // 2 x 2500
    })
  })
  it('should return the vendor cut for a single item sold with a discount', () => {
    dbGetTotalVendorCutFromVendorStockIds([9], testConn).then((res) => {
      expect(res).toEqual(1600) // 3200 x 50%
    })
  })
  it('should return the vendor cut for multiple items sold with a discount', () => {
    dbGetTotalVendorCutFromVendorStockIds([10], testConn).then((res) => {
      expect(res).toEqual(1600) // 2 x 1000 * 20%
    })
  })
  it('should return zero for an item sold once and the sale deleted', () => {
    dbGetTotalVendorCutFromVendorStockIds([2], testConn).then((res) => {
      expect(res).toEqual(0)
    })
  })
  it('should return zero for an item that is on layby', () => {
    dbGetTotalVendorCutFromVendorStockIds([3], testConn).then((res) => {
      expect(res).toEqual(0)
    })
  })
  it('should return the correct vendor cut for an item that was repriced before the sale', () => {
    dbGetTotalVendorCutFromVendorStockIds([1], testConn).then((res) => {
      expect(res).toEqual(1800) // 1500 -> 1800
    })
  })
  it('should return the correct vendor cut for an item that was repriced after the sale was opened but before it was closed', () => {
    dbGetTotalVendorCutFromVendorStockIds([5], testConn).then((res) => {
      expect(res).toEqual(700) // 700 -> 500
      // 700 - 2018-11-01
      // sale opened 2018-11-15
      // 500 - 2019-01-01
      // sale closed 2019-01-05
    })
  })
  it('should return the correct vendor cut for an item that was sold multiple times with no modifiers', () => {
    dbGetTotalVendorCutFromVendorStockIds([6], testConn).then((res) => {
      expect(res).toEqual(700 * 3) // 700 sold three times
    })
  })
  it('should return the correct vendor cut for an item that was sold multiple times with quantity and discount modifiers', () => {
    dbGetTotalVendorCutFromVendorStockIds([7], testConn).then((res) => {
      expect(res).toEqual(7400) // 1000 sold five times
      // #1 1x = 1000
      // #2 5x = 5000
      // #3 20% = 800
      // #4 2x 70% = 600
      // #5 2x 100% = 0
    })
  })
  it('should return the correct vendor cut for an item that was sold multiple times with price changes between different sales', () => {
    dbGetTotalVendorCutFromVendorStockIds([11], testConn).then((res) => {
      expect(res).toEqual(2200)
      // 2018-06-01 $5
      // 2018-07-01 $6
      // 2018-08-01 Sold
      // 2018-09-01 $7
      // 2018-10-01 Sold
      // 2018-11-01 $8
      // 2018-12-01 $9
      // 2018-12-01 Sold
      // 2018-12-02 $10
    })
  })
})
