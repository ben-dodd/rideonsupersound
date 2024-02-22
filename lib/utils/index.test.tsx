import {
  andList,
  camelCase,
  convertDegToCardinal,
  convertMPStoKPH,
  getArrayOfNumbersBetweenTwoNumbers,
  getLastValidElementByDate,
  obj2query,
  pascalCase,
  query2obj,
} from '.'

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

describe('convert js to url query', () => {
  const testObjBasic = {
    name: 'Ben',
    age: 10,
    food: 'Bread',
  }
  const testObjWithNestedObjs = {
    name: 'Ben',
    age: 10,
    food: {
      name: 'Bread',
      weight: 5,
    },
  }
  const testObjWithNestedArrays = {
    name: 'Ben',
    age: 10,
    food: {
      name: 'Bread',
      weight: 5,
      cookingTypes: [
        { name: 'toasting', popularity: 10 },
        { name: 'sandwich', popularity: 4, datesEaten: ['2018-01-01', '2019-01-01', '2019.1.2'] },
      ],
    },
  }
  const testObjWithDecimals = {
    name: 'Ben',
    address: {
      city: 'Nelson',
      country: 'USA',
    },
    friends: [
      { name: 'Joe', age: 10 },
      { name: 'Ben', age: 50 },
      { name: 'Brian', age: 16, score: 6.5, average: 13.542 },
    ],
  }
  const testObjDeeplyNestedArrays = {
    name: 'Ben',
    arr1: [[[[[5, 6, [1, 2, { name: 'Joe', age: 10 }, [5, 6]]]]]]],
  }
  const flattenedTestObjWithDecimals =
    'name=Ben&address.city=Nelson&address.country=USA&friends.0.name=Joe&friends.0.age=10&friends.1.name=Ben&friends.1.age=50&friends.2.name=Brian&friends.2.age=16&friends.2.score=6.5&friends.2.average=13.542'
  it('should convert an obj to a flattened query string', () => {
    const str = obj2query(testObjWithDecimals)
    expect(str).toBe(flattenedTestObjWithDecimals)
  })
  it('should convert a flattened obj back to an obj', () => {
    const obj = query2obj(flattenedTestObjWithDecimals)
    expect(obj).toEqual(testObjWithDecimals)
  })
  it('should convert basic obj back and forth', () => {
    const str = obj2query(testObjBasic)
    const obj = query2obj(str)
    expect(obj).toEqual(testObjBasic)
  })
  it('should convert obj with nested objects back and forth', () => {
    const str = obj2query(testObjWithNestedObjs)
    const obj = query2obj(str)
    expect(obj).toEqual(testObjWithNestedObjs)
  })
  it('should convert obj with nested arrays and objects back and forth', () => {
    const str = obj2query(testObjWithNestedArrays)
    const obj = query2obj(str)
    expect(obj).toEqual(testObjWithNestedArrays)
  })
  it('should convert an obj with decimals back and forth', () => {
    const str = obj2query(testObjWithDecimals)
    const obj = query2obj(str)
    expect(obj).toEqual(testObjWithDecimals)
  })
  it('should convert an obj with deeply nested arrays back and forth', () => {
    const str = obj2query(testObjDeeplyNestedArrays)
    const obj = query2obj(str)
    expect(obj).toEqual(testObjDeeplyNestedArrays)
  })
})
