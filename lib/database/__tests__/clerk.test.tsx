// const testCon = require('../testConn')
import testCon from '../testConn'
import { getClerk } from '../clerk'

// const { getClerk } = require('../clerk')

beforeAll(() => testCon.migrate.latest())

beforeEach(() => testCon.seed.run())

afterAll(() => testCon.destroy())

describe('getClerk', () => {
  it('get clerk that matches the sub', () => {
    return getClerk('abc', testCon).then((clerk) => {
      expect(clerk?.name).toBe('Ben')
    })
  })
})
