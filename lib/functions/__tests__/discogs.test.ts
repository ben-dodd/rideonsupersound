/**
 * @jest-environment node
 */

import {
  getDiscogsItem,
  getDiscogsItemArtistDetails,
  getDiscogsOptions,
  getDiscogsPriceSuggestions,
  getFormatFromDiscogs,
  getPriceSuggestionText,
} from '../discogs'
import { DiscogsConditionTypes } from '../../types/discogs'
import { StockItemObject } from 'lib/types/stock'

describe('getPriceSuggestion', () => {
  it('should get the price suggestion from stock object', () => {
    let priceSuggestions = {
      [DiscogsConditionTypes.M]: { value: 10 },
      [DiscogsConditionTypes.VG]: { value: 8 },
      [DiscogsConditionTypes.G]: { value: 5 },
      [DiscogsConditionTypes.P]: { value: 1 },
    }
    let item: StockItemObject = {
      discogsItem: { priceSuggestions },
      isNew: true,
    }
    expect(getPriceSuggestionText(item)).toBe('$10.00 NZD\n(Mint (M) condition)')
    item.isNew = false
    expect(getPriceSuggestionText(item)).toBe('$5.00 NZD\n(Good (G) condition)')
    item.cond = DiscogsConditionTypes.P
    expect(getPriceSuggestionText(item)).toBe('$1.00 NZD\n(Poor (P) condition)')
    item.discogsItem.priceSuggestions = {}
    expect(getPriceSuggestionText(item)).toBe('')
  })
})

describe('getDiscogsItem', () => {
  it('should get the master release from discogs', () => {
    return getDiscogsItem({ master_id: 10000 })
      .then((data) => {
        expect(data.title).toBe('Negativ')
      })
      .catch((e) => Error(e.message))
  })
})

describe('getDiscogsOptions', () => {
  it('should get releases with barcode', () => {
    return getDiscogsOptions({ barcode: '7 2064-24425-4 8' })
      .then((results) => {
        expect(results[0].title).toBe('Nirvana - Nevermind')
      })
      .catch((e) => Error(e.message))
  })
})

describe('getDiscogsPriceSuggestions', () => {
  it('should get discogs price suggestions by id', () => {
    return getDiscogsPriceSuggestions({ id: 26106 })
      .then((data) => {
        expect((data['Mint (M)'].currency = 'NZD'))
      })
      .catch((e) => Error(e.message))
  })
})

describe('getDiscogsItemArtistDetails', () => {
  it('should get detailed artist information from discogs', () => {
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
    })
      .then((data) => {
        expect(data?.map((artist) => artist.name)).toStrictEqual(['Cutmaster Swiff', 'Andre Benjamin', 'Bunny Sigler'])
      })
      .catch((e) => Error(e.message))
  })
})

describe('getFormatFromDiscogs', () => {
  it('should get format from discogs format list', () => {
    expect(getFormatFromDiscogs(['LP', 'Cassette', '16'])).toBe('LP')
    expect(getFormatFromDiscogs(['Poetry', 'LP', 'Cassette'])).toBe('LP')
    expect(getFormatFromDiscogs(['Poetry', 'Books', 'Cushions'])).toBe('Poetry')
  })
})
