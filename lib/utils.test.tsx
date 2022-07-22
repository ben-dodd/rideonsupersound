import {
  andList,
  camelCase,
  convertDegToCardinal,
  convertMPStoKPH,
  isValidBankAccountNumber,
  pascalCase,
} from './utils'

test('convert string to pascal case', () => {
  expect(pascalCase('Hello world')).toBe('HelloWorld')
  expect(pascalCase('HELLO WORLD')).toBe('HELLOWORLD')
  expect(pascalCase('43World')).toBe('43World')
  expect(pascalCase(null)).toBe(null)
  expect(pascalCase('')).toBe('')
})

test('convert string to camel case', () => {
  expect(camelCase('Hello world')).toBe('helloWorld')
  expect(camelCase('HELLO WORLD')).toBe('hELLOWORLD')
  expect(camelCase('43World')).toBe('43World')
  expect(camelCase(null)).toBe(null)
  expect(camelCase('')).toBe('')
})

test('convert array of strings to list with and', () => {
  expect(andList(['Lions', 'tigers', 'BEARS'])).toBe('Lions, tigers and BEARS')
})

test('test if string is valid bank account format', () => {
  expect(isValidBankAccountNumber('11-7426-0024124-00')).toBe(true)
  expect(isValidBankAccountNumber('11-7426-0024124-000')).toBe(true)
  expect(isValidBankAccountNumber('11-74v6-0024124-000')).toBe(false)
  expect(isValidBankAccountNumber('113-7426-0024124-000')).toBe(false)
  expect(isValidBankAccountNumber('24.1')).toBe(false)
})

test('convert degrees to cardinal directions', () => {
  expect(convertDegToCardinal(0)).toBe('N')
  expect(convertDegToCardinal(350)).toBe('N')
})

test('convert mph to kph', () => {
  expect(convertMPStoKPH(5)).toBe(8.045)
})
