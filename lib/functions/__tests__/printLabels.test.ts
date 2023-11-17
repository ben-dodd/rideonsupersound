import { getLabelPrinterCSV } from '../printLabels'

describe('getLabelPrinterCSV', () => {
  it('should return an array of values for the label printer', () => {
    expect(
      getLabelPrinterCSV([
        {
          artist: 'Nirvana',
          title: 'Nevermind',
          isNew: 1,
          totalSell: 1000,
          id: 24,
          vendorId: 34,
          section: 'PUNK',
          country: 'USA',
        },
        {
          artist: 'Nirvana',
          title: 'Nevermind',
          isNew: 1,
          totalSell: 100,
          id: 1,
          vendorId: 666,
          country: 'New Zealand',
        },
        {
          artist: 'Nirvana',
          title: 'Nevermind',
          isNew: 0,
          totalSell: 50,
          id: 10,
          vendorId: 2,
          section: 'PUNK',
          country: 'New Zealand',
        },
      ]),
    ).toStrictEqual([
      ['034/00024', 'Nirvana', 'Nevermind', 'NEW', '$10', 'PUNK', '00024'],
      ['666/00001', 'Nirvana', 'Nevermind', 'NEW', '$1', 'NZ', '00001'],
      ['002/00010', 'Nirvana', 'Nevermind', 'USED', '$1', 'PUNK/NZ', '00010'],
    ])
  })
  it.todo('should handle undefined values and not print "ned", etc.')
})
