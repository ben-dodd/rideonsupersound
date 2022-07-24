import { filterHelps } from './functions'

test('filter helps', () => {
  // expect(filterHelps(null)).toBe([])
  expect(filterHelps({ helps: null })).toStrictEqual([])
})
