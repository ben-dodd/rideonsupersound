import { getItemSku } from '../lib/data-functions'

// test('should return an array as a string with "and" before the last item', function () {
//   expect(andList(['Lions', 'Tigers', 'Bears'])).toBe('Lions, Tigers and Bears')
//   expect(andList([1, 2, 3])).toBe('1, 2 and 3')
// })

// test('write integer as a word', () => {
//   expect(writeIntegerAsWord(1536)).toBe(
//     'one thousand, five hundred, and thirty-six'
//   )
// })

test('get item sku from item object', () => {
  expect(getItemSku({ vendor_id: 59, id: 1035 })).toBe('059/01035')
  // expect(getItemSku({ vendor_id: undefined, id: undefined })).toBe('000/00000')
  // expect(getItemSku({ vendor_id: null, id: 52 })).toBe('000/00052')
})
