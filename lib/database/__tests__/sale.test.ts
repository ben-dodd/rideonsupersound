// const testCon = require('../testConn')
import testCon from '../testConn'
import { dbSaveCart } from '../sale'
import { CartObject, SaleStateTypes } from 'lib/types/sale'
import { dbGetJobsLike } from '../jobs'
import { dbGetStockItem } from '../stock'
import { checkValue, mysql2js } from '../utils/helpers'

beforeAll(() => testCon.migrate.latest())

beforeEach(() => testCon.seed.run())

afterAll(() => testCon.destroy())

const baseCart: CartObject = {
  sale: { state: SaleStateTypes.InProgress },
  items: [{ itemId: 12, quantity: '1' }],
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
        expect(checkValue(stockItem?.quantities?.sold)).toBe(0)
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

describe('saveCart', () => {
  it('saves a cart and reduces quantity by one if sale is completed even if saved twice', () => {
    const cart = { ...baseCart }
    cart.sale.state = SaleStateTypes.Completed
    cart.sale.saleClosedBy = 1
    return dbSaveCart(cart, testCon)
      .then((savedCart) => dbSaveCart(mysql2js(savedCart), testCon))
      .then(() =>
        dbGetStockItem(12, false, testCon).then((stockItem) => {
          expect(stockItem?.quantities?.inStock).toBe(9)
          expect(stockItem?.quantities?.sold).toBe(1)
          expect(checkValue(stockItem?.quantities?.layby)).toBe(0)
        }),
      )
  })
})

describe('saveCart', () => {
  it('saves a cart and reduces quantity by one if sale is put on layby', () => {
    const cart = { ...baseCart }
    cart.sale.state = SaleStateTypes.Layby
    cart.sale.laybyStartedBy = 1
    return dbSaveCart(cart, testCon).then(() =>
      dbGetStockItem(12, false, testCon).then((stockItem) => {
        expect(stockItem?.quantities?.inStock).toBe(9)
        expect(checkValue(stockItem?.quantities?.sold)).toBe(0)
        expect(stockItem?.quantities?.layby).toBe(1)
      }),
    )
  })
})

describe('saveCart', () => {
  it('saves a cart and reduces quantity by one if sale is put on layby, even if saved twice', () => {
    const cart = { ...baseCart }
    cart.sale.state = SaleStateTypes.Layby
    cart.sale.laybyStartedBy = 1
    return dbSaveCart(cart, testCon)
      .then((savedCart) => dbSaveCart(mysql2js(savedCart), testCon))
      .then(() =>
        dbGetStockItem(12, false, testCon).then((stockItem) => {
          expect(stockItem?.quantities?.inStock).toBe(9)
          expect(checkValue(stockItem?.quantities?.sold)).toBe(0)
          expect(stockItem?.quantities?.layby).toBe(1)
        }),
      )
  })
})

describe('saveCart', () => {
  it('saves a cart and converts a layby to completed correctly', () => {
    const cart = { ...baseCart }
    cart.sale.state = SaleStateTypes.Layby
    cart.sale.laybyStartedBy = 1
    return dbSaveCart(cart, testCon)
      .then((savedCart) => {
        const newCart = { ...mysql2js(savedCart) }
        newCart.sale.state = SaleStateTypes.Completed
        newCart.sale.saleClosedBy = 2
        return dbSaveCart(newCart, testCon)
      })
      .then(() =>
        dbGetStockItem(12, false, testCon).then((stockItem) => {
          expect(stockItem?.quantities?.inStock).toBe(9)
          expect(checkValue(stockItem?.quantities?.sold)).toBe(1)
          expect(checkValue(stockItem?.quantities?.layby)).toBe(0)
        }),
      )
  })
})

describe('saveCart', () => {
  it('saves a cart and handles edited quantity increase', () => {
    const cart = { ...baseCart }
    cart.sale.state = SaleStateTypes.Completed
    cart.sale.saleClosedBy = 1
    return dbSaveCart(cart, testCon)
      .then((savedCart) => {
        const newCart = { ...mysql2js(savedCart) }
        newCart.items[0].quantity = '2'
        return dbSaveCart(newCart, testCon)
      })
      .then(() =>
        dbGetStockItem(12, false, testCon).then((stockItem) => {
          expect(stockItem?.quantities?.inStock).toBe(8)
          expect(checkValue(stockItem?.quantities?.sold)).toBe(2)
          expect(checkValue(stockItem?.quantities?.layby)).toBe(0)
        }),
      )
  })
})

describe('saveCart', () => {
  it('saves a cart and handles edited quantity decrease', () => {
    const cart = { ...baseCart }
    cart.sale.state = SaleStateTypes.Completed
    cart.sale.saleClosedBy = 1
    cart.items[0].quantity = '3'
    return dbSaveCart(cart, testCon)
      .then((savedCart) => {
        const newCart = { ...mysql2js(savedCart) }
        newCart.items[0].quantity = '1'
        return dbSaveCart(newCart, testCon)
      })
      .then(() =>
        dbGetStockItem(12, false, testCon).then((stockItem) => {
          expect(stockItem?.quantities?.inStock).toBe(9)
          expect(checkValue(stockItem?.quantities?.sold)).toBe(1)
          expect(checkValue(stockItem?.quantities?.layby)).toBe(0)
        }),
      )
  })
})

describe('saveCart', () => {
  it('saves a cart and handles edited quantity decrease for layby', () => {
    const cart = { ...baseCart }
    cart.sale.state = SaleStateTypes.Layby
    cart.sale.saleClosedBy = 1
    cart.items[0].quantity = '3'
    return dbSaveCart(cart, testCon)
      .then((savedCart) => {
        const newCart = { ...mysql2js(savedCart) }
        newCart.items[0].quantity = '1'
        return dbSaveCart(newCart, testCon)
      })
      .then(() =>
        dbGetStockItem(12, false, testCon).then((stockItem) => {
          expect(stockItem?.quantities?.inStock).toBe(9)
          expect(checkValue(stockItem?.quantities?.sold)).toBe(0)
          expect(checkValue(stockItem?.quantities?.layby)).toBe(1)
        }),
      )
  })
})

describe('saveCart', () => {
  it('saves a cart and handles item delete', () => {
    const cart = { ...baseCart }
    cart.sale.state = SaleStateTypes.Completed
    cart.sale.saleClosedBy = 1
    return dbSaveCart(cart, testCon)
      .then((savedCart) => {
        const newCart = { ...mysql2js(savedCart) }
        newCart.items[0].isDeleted = true
        return dbSaveCart(newCart, testCon)
      })
      .then(() =>
        dbGetStockItem(12, false, testCon).then((stockItem) => {
          expect(stockItem?.quantities?.inStock).toBe(10)
          expect(checkValue(stockItem?.quantities?.sold)).toBe(0)
          expect(checkValue(stockItem?.quantities?.layby)).toBe(0)
        }),
      )
  })
})

describe('saveCart', () => {
  it('saves a cart and handles item refund', () => {
    const cart = { ...baseCart }
    cart.sale.state = SaleStateTypes.Completed
    cart.sale.saleClosedBy = 1
    cart.items[0].quantity = '1'
    return dbSaveCart(cart, testCon)
      .then((savedCart) => {
        const newCart = { ...mysql2js(savedCart) }
        newCart.items[0].isRefunded = true
        return dbSaveCart(newCart, testCon)
      })
      .then(() =>
        dbGetStockItem(12, false, testCon).then((stockItem) => {
          expect(stockItem?.quantities?.inStock).toBe(10)
          expect(stockItem?.quantities?.sold).toBe(1)
          expect(stockItem?.quantities?.refunded).toBe(1)
          expect(checkValue(stockItem?.quantities?.layby)).toBe(0)
        }),
      )
  })
})

describe('saveCart', () => {
  it('saves a completed cart and ignores deleted items', () => {
    const cart = { ...baseCart }
    cart.sale.state = SaleStateTypes.Completed
    cart.sale.saleClosedBy = 1
    cart.items[0].isDeleted = true
    return dbSaveCart(cart, testCon).then(() =>
      dbGetStockItem(12, false, testCon).then((stockItem) => {
        expect(stockItem?.quantities?.inStock).toBe(10)
        expect(checkValue(stockItem?.quantities?.sold)).toBe(0)
        expect(checkValue(stockItem?.quantities?.layby)).toBe(0)
      }),
    )
  })
})

describe('saveCart', () => {
  it('saves a completed cart and ignores refunded items', () => {
    const cart = { ...baseCart }
    cart.sale.state = SaleStateTypes.Completed
    cart.sale.saleClosedBy = 1
    cart.items[0].isRefunded = true
    return dbSaveCart(cart, testCon).then(() =>
      dbGetStockItem(12, false, testCon).then((stockItem) => {
        expect(stockItem?.quantities?.inStock).toBe(10)
        expect(checkValue(stockItem?.quantities?.sold)).toBe(0)
        expect(checkValue(stockItem?.quantities?.layby)).toBe(0)
      }),
    )
  })
})

describe('saveCart', () => {
  it('saves a completed cart with mail order and posts job', () => {
    const cart = { ...baseCart }
    cart.sale.state = SaleStateTypes.Completed
    cart.sale.saleClosedBy = 1
    cart.items[0].quantity = '1'
    cart.sale.isMailOrder = true
    cart.sale.customerId = 1
    cart.sale.itemList = 'Test Items'
    cart.sale.postalAddress = '30 Hornbrook St'
    return dbSaveCart(cart, testCon).then((savedCart) => {
      console.log(savedCart)
      return dbGetJobsLike(`Post Sale ${savedCart?.sale?.id}`, testCon).then((tasks) => {
        expect(tasks).toHaveLength(1)
        expect(tasks?.[0]?.description).toContain(`Post Sale ${savedCart?.sale?.id}`)
      })
    })
  })
})

describe('saveCart', () => {
  it('saves a completed cart with mail order and doesnt repeat job if it exists', () => {
    const cart = { ...baseCart }
    cart.sale.state = SaleStateTypes.Completed
    cart.sale.saleClosedBy = 1
    cart.items[0].quantity = '1'
    cart.sale.isMailOrder = true
    cart.sale.customerId = 1
    cart.sale.itemList = 'Test Items'
    cart.sale.postalAddress = '30 Hornbrook St'
    return dbSaveCart(cart, testCon)
      .then((savedCart) => dbSaveCart(savedCart, testCon))
      .then((savedCart) => {
        return dbGetJobsLike(`Post Sale ${savedCart?.sale?.id}`, testCon).then((tasks) => {
          expect(tasks).toHaveLength(1)
          expect(tasks?.[0]?.description).toContain(`Post Sale ${savedCart?.sale?.id}`)
        })
      })
  })
})

describe('saveCart', () => {
  it('should handle combination of laybys, quantity changes and refunds', () => {
    const cart = { ...baseCart }
    cart.sale.state = SaleStateTypes.Completed
    cart.sale.saleClosedBy = 1
    cart.items[0].quantity = '1'
    cart.items[0].isDeleted = false
    cart.items[0].isRefunded = false
    return dbSaveCart(cart, testCon)
      .then((savedCart) => {
        const newCart = { ...mysql2js(savedCart) }
        newCart?.items?.push({ itemId: 13, quantity: '2' })
        return dbSaveCart(newCart, testCon)
      })
      .then((savedCart) => {
        const newCart = { ...mysql2js(savedCart) }
        expect(newCart.items).toHaveLength(2)
        newCart.items[0].quantity = '3'
        newCart.sale.state = SaleStateTypes.InProgress
        return dbSaveCart(newCart, testCon)
      })
      .then((savedCart) => {
        const newCart = { ...mysql2js(savedCart) }
        newCart.items[1].isRefunded = true
        newCart.sale.state = SaleStateTypes.Completed
        newCart.sale.isMailOrder = true
        newCart.sale.customerId = 1
        newCart.sale.itemList = 'Test Items'
        newCart.sale.postalAddress = '30 Hornbrook St'
        return dbSaveCart(newCart, testCon)
      })
      .then((savedCart) => {
        return dbGetJobsLike(`Post Sale ${savedCart?.sale?.id}`, testCon).then((tasks) => {
          expect(tasks).toHaveLength(1)
          expect(tasks?.[0]?.description).toContain(`Post Sale ${savedCart?.sale?.id}`)
        })
      })
      .then(() => dbGetStockItem(12, false, testCon))
      .then((stockItem) => {
        expect(stockItem.quantities.sold).toBe(3)
        expect(stockItem.quantities.refunded).toBe(0)
        expect(stockItem.quantities.inStock).toBe(7)
        expect(checkValue(stockItem.quantities.layby)).toBe(0)
      })
      .then(() => dbGetStockItem(13, false, testCon))
      .then((stockItem) => {
        expect(stockItem.quantities.received).toBe(5)
        expect(stockItem.quantities.sold).toBe(2)
        expect(stockItem.quantities.refunded).toBe(2)
        expect(stockItem.quantities.inStock).toBe(5)
      })
  })
})

describe('saveCart', () => {
  it('saves a cart and handles refunded items being readded', () => {
    const cart = { ...baseCart }
    cart.sale.state = SaleStateTypes.Completed
    cart.sale.saleClosedBy = 1
    cart.items[0].quantity = '2'
    return dbSaveCart(cart, testCon)
      .then((savedCart) => {
        const newCart = { ...mysql2js(savedCart) }
        newCart.items[0].isRefunded = true
        return dbSaveCart(newCart, testCon)
      })
      .then((savedCart) => {
        const newCart = { ...mysql2js(savedCart) }
        newCart.items[0].isRefunded = false
        newCart.items[0].quantity = '1'
        return dbSaveCart(newCart, testCon)
      })
      .then(() =>
        dbGetStockItem(12, false, testCon).then((stockItem) => {
          expect(stockItem?.quantities?.inStock).toBe(9)
          expect(stockItem?.quantities?.sold).toBe(3)
          expect(stockItem?.quantities?.refunded).toBe(2)
          expect(checkValue(stockItem?.quantities?.layby)).toBe(0)
          expect(stockItem?.stockMovements).toHaveLength(4)
        }),
      )
  })
})

describe('saveCart', () => {
  it('saves a cart and handles deleted items being readded', () => {
    const cart = { ...baseCart }
    cart.sale.state = SaleStateTypes.Completed
    cart.sale.saleClosedBy = 1
    cart.items[0].quantity = '2'
    return dbSaveCart(cart, testCon)
      .then((savedCart) => {
        const newCart = { ...mysql2js(savedCart) }
        console.log(newCart)
        newCart.items[0].isDeleted = true
        return dbSaveCart(newCart, testCon)
      })
      .then((savedCart) => {
        const newCart = { ...mysql2js(savedCart) }
        newCart.items[0].isDeleted = false
        newCart.items[0].quantity = '1'
        return dbSaveCart(newCart, testCon)
      })
      .then(() =>
        dbGetStockItem(12, false, testCon).then((stockItem) => {
          expect(stockItem?.quantities?.inStock).toBe(9)
          expect(stockItem?.quantities?.sold).toBe(1)
          expect(checkValue(stockItem?.quantities?.refunded)).toBe(0)
          expect(checkValue(stockItem?.quantities?.layby)).toBe(0)
          expect(stockItem?.stockMovements).toHaveLength(2)
        }),
      )
  })
})
