import {
  andList,
  camelCase,
  convertDegToCardinal,
  convertMPStoKPH,
  getArrayOfNumbersBetweenTwoNumbers,
  getLastValidElementByDate,
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

test('convert degrees to cardinal directions', () => {
  expect(convertDegToCardinal(0)).toBe('N')
  expect(convertDegToCardinal(350)).toBe('N')
})

test('convert mph to kph', () => {
  expect(convertMPStoKPH(5)).toBe(8.045)
})

test('get the last valid element in a list', () => {
  const testList = [
    { id: 1, dateCompleted: '2016-03-19T11:17:49.000Z', dateStarted: '2013-03-19T11:17:49.000Z' },
    { id: 2, dateCompleted: '2017-12-31T11:00:00.000Z', dateStarted: '2015-12-31T11:00:00.000Z' },
  ]
  expect(getLastValidElementByDate(testList, 'dateCompleted', '2016-04-20')?.id).toBe(1)
  expect(getLastValidElementByDate(testList, 'dateStarted', '2016-04-20')?.id).toBe(2)
})

describe('getArrayOfNumbersBetweenTwoNumbers', () => {
  it('should return an array of numbers between two numbers', () => {
    const arr = getArrayOfNumbersBetweenTwoNumbers(6, 10)
    const expected = [6, 7, 8, 9, 10]
    expect(arr).toEqual(expected)
  })
  it('should handle numbers that are in the wrong order', () => {
    const arr = getArrayOfNumbersBetweenTwoNumbers(9, 4)
    const expected = [4, 5, 6, 7, 8, 9]
    expect(arr).toEqual(expected)
  })
  it('should handle zero key numbers', () => {
    const arr = getArrayOfNumbersBetweenTwoNumbers(3, 0)
    const expected = [0, 1, 2, 3]
    expect(arr).toEqual(expected)
  })
})
