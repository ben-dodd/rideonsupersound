import dayjs from 'dayjs'
import {
  modulusCheck,
  splitAccountNumber,
  writeKiwiBankBatchFile,
} from './functions'
import { KiwiBankTransactionObject } from './types'

const dummyTransactions: KiwiBankTransactionObject[] = [
  {
    accountNumber: '38 90160725779 000',
    amount: 5150,
    name: 'Shay Horay',
    vendor_id: '25',
  },
  {
    accountNumber: '25-2500-2608586-001',
    amount: 2250,
    name: 'A really long vendor name called Mr someone',
  },
  {
    accountNumber: '38 90160704505 000',
    amount: 2000,
    name: 'Another really long vendor name this guy is called Sam',
    vendor_id: '666',
  },
  { accountNumber: '10-8530-6186593-00', amount: 500, name: 'No one' },
]

test('test kbb file', () => {
  const date = dayjs.utc().format('YYMMDD')
  expect(
    writeKiwiBankBatchFile({
      transactions: dummyTransactions,
      batchNumber: '22',
      sequenceNumber: '42375',
    })
  ).toBe(
    `data:text/csv;charset=utf-8,1,,22,4237,389020005748600,7,${date},${date},%0D%0A2,3890160725779000,50,5150,Shay%20Horay,RideOn%20Pay,25%20Shay%20Hora,,Reg%2022,Ride%20On%20Super%20Sound,Reg%2022,25%20Shay%20Hora,Seq%20${date}%0D%0A2,3890160704505000,50,2000,Another%20really%20long%20,RideOn%20Pay,666%20Another%20,,Reg%2022,Ride%20On%20Super%20Sound,Reg%2022,666%20Another%20,Seq%20${date}%0D%0A3,7150,2,80321430284`
  )
})

// test('test transaction amount', () => {
//   expect(
//     getTotalTransactionAmount(getValidTransactions(dummyTransactions))
//   ).toBe(7150)
// })

// test('test transaction count', () => {
//   expect(
//     getTotalTransactionCount(getValidTransactions(dummyTransactions))
//   ).toBe(2)
// })

// test('test hash total', () => {
//   expect(getHashTotal(getValidTransactions(dummyTransactions))).toBe(
//     '80321430284'
//   )
// })

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
  expect(modulusCheck('08-6523-1954512-001')).toBe(true)
  expect(modulusCheck('01-0902-0998907-00')).toBe(true)
  expect(modulusCheck('09-0000-00007471-2')).toBe(true)
  expect(modulusCheck('25-2500-2608486-001')).toBe(true)
  expect(modulusCheck('25-2500-2608586-001')).toBe(false)
  expect(modulusCheck('12-3149-0347110-00')).toBe(true)
  // Sarah Rossiter
  expect(modulusCheck('10-8530-6186593-00')).toBe(false)
  expect(modulusCheck('010853061865930')).toBe(false)
})
