import { modulusCheck, splitAccountNumber } from './functions'

test('split account number into main parts', () => {
  expect(splitAccountNumber('11-7426-0024124-00')).toStrictEqual({
    bank: '11',
    branch: '7426',
    account: '0024124',
    suffix: '00',
  })
  expect(splitAccountNumber('1174260024124000')).toStrictEqual({
    bank: '11',
    branch: '7426',
    account: '0024124',
    suffix: '000',
  })
})

test('run modulus check on account number', () => {
  expect(modulusCheck('11-7426-0024124-00')).toBe(true)
  expect(modulusCheck('01-0902-0068389-00')).toBe(true)
})
