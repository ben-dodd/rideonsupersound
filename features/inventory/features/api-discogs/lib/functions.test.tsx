import { StockObject } from 'lib/types'
import {
  getDiscogsItem,
  getDiscogsItemArtistDetails,
  getDiscogsOptions,
  getDiscogsPriceSuggestions,
  getFormatFromDiscogs,
  getPriceSuggestion,
} from './functions'
import { DiscogsConditionTypes } from './types'

test('get price suggestion from stock object', () => {
  let priceSuggestions = {
    [DiscogsConditionTypes.M]: { value: 10 },
    [DiscogsConditionTypes.VG]: { value: 8 },
    [DiscogsConditionTypes.G]: { value: 5 },
    [DiscogsConditionTypes.P]: { value: 1 },
  }
  let item: StockObject = {
    discogsItem: { priceSuggestions },
    is_new: 1,
  }
  expect(getPriceSuggestion(item)).toBe('$10.00 NZD (Mint (M) condition)')
  item.is_new = 0
  expect(getPriceSuggestion(item)).toBe('$5.00 NZD (Good (G) condition)')
  item.cond = DiscogsConditionTypes.P
  expect(getPriceSuggestion(item)).toBe('$1.00 NZD (Poor (P) condition)')
  item.discogsItem.priceSuggestions = {}
  expect(getPriceSuggestion(item)).toBe(null)
})

test('get master release from discogs', () => {
  return getDiscogsItem({ master_id: 10000 }).then((data) => {
    expect(data.title).toBe('Negativ')
  })
})

test('get releases with barcode', () => {
  return getDiscogsOptions({ barcode: '7 2064-24425-4 8' }).then((data) => {
    expect(data.results[0].title).toBe('Nirvana - Nevermind')
  })
})

test('get discogs price suggestions', () => {
  return getDiscogsPriceSuggestions({ id: 26106 }).then((data) => {
    expect((data['Mint (M)'].currency = 'NZD'))
  })
})

test('get detailed artist information from discogs', () => {
  return getDiscogsItemArtistDetails({
    artists: [
      { resource_url: 'https://api.discogs.com/artists/189495' },
      {
        name: 'Andre Benjamin',
        resource_url: 'https://api.discogs.com/artists/187668',
      },
      { name: 'Antwan Patton' },
      { resource_url: 'https://api.discogs.com/artists/invalid_id' },
      { resource_url: 'https://api.discogs.com/artists/17959' },
    ],
  }).then((data) => {
    expect(data?.map((artist) => artist.name)).toStrictEqual([
      'Cutmaster Swiff',
      'Andre Benjamin',
      'Bunny Sigler',
    ])
  })
})

test('get format from discogs format list', () => {
  expect(getFormatFromDiscogs(['LP', 'Cassette', '16'])).toBe('LP')
  expect(getFormatFromDiscogs(['Poetry', 'LP', 'Cassette'])).toBe('LP')
  expect(getFormatFromDiscogs(['Poetry', 'Books', 'Cushions'])).toBe('Poetry')
})
