import { checkCustomerNameConflict } from '../customer'

test('Check name conflicts', () => {
  const customers = [{ name: 'Sam' }, { name: 'Tom' }, { name: 'John' }]
  expect(checkCustomerNameConflict({ name: 'sam' }, null)).toBe(false)
  expect(checkCustomerNameConflict({ name: 'sam' }, customers)).toBe(true)
  expect(checkCustomerNameConflict({ name: 'Terry' }, customers)).toBe(false)
  expect(checkCustomerNameConflict({ name: 'Sammy' }, customers)).toBe(false)
  expect(checkCustomerNameConflict({ name: 'John', id: 2 }, customers)).toBe(
    false
  )
})
