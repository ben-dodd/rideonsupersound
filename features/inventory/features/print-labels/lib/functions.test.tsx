import { getLabelPrinterCSV } from './functions'

test('create label printer csv', () => {
  expect(
    getLabelPrinterCSV([
      {
        artist: 'Nirvana',
        title: 'Nevermind',
        is_new: 1,
        total_sell: 1000,
        id: 24,
        vendor_id: 34,
        section: 'PUNK',
        country: 'USA',
      },
      {
        artist: 'Nirvana',
        title: 'Nevermind',
        is_new: 1,
        total_sell: 100,
        id: 1,
        vendor_id: 666,
        country: 'New Zealand',
      },
      {
        artist: 'Nirvana',
        title: 'Nevermind',
        is_new: 0,
        total_sell: 50,
        id: 10,
        vendor_id: 2,
        section: 'PUNK',
        country: 'New Zealand',
      },
    ])
  ).toStrictEqual([
    ['034/00024', 'Nirvana', 'Nevermind', 'NEW', '$10', 'PUNK', '00024'],
    ['666/00001', 'Nirvana', 'Nevermind', 'NEW', '$1', 'NZ', '00001'],
    ['002/00010', 'Nirvana', 'Nevermind', 'USED', '$1', 'PUNK/NZ', '00010'],
  ])
})
