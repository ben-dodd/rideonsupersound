// const testCon = require('../testConn')
import testCon from '../testConn'
import { dbGetClerk } from '../clerk'

// const { getClerk } = require('../clerk')

beforeAll(() => testCon.migrate.latest())

beforeEach(() => testCon.seed.run())

afterAll(() => testCon.destroy())

describe('getClerk', () => {
  it('get clerk that matches the sub', () => {
    return dbGetClerk('abc', testCon).then((clerk) => {
      expect(clerk?.name).toBe('Ben')
    })
  })
})
