// const testCon = require('../testConn')
import testCon from '../testConn'
import { dbGetCashUp } from '../register'

// const { getClerk } = require('../clerk')

beforeAll(() => testCon.migrate.latest())

beforeEach(() => testCon.seed.run())

afterAll(() => testCon.destroy())

describe('dbGetCashUp', () => {
  it('cashup till at the close of the register', () => {
    return dbGetCashUp(testCon).then((cashUp) => {
      console.log(cashUp)
      expect(cashUp?.cashGiven).toHaveLength(1)
    })
  })
})
