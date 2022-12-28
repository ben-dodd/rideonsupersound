import { filterHelps } from '../help'

test('filter helps', () => {
  // expect(filterHelps(null)).toBe([])
  expect(filterHelps({ helps: null })).toStrictEqual([])
})
