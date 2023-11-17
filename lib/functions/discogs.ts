import axios from 'axios'
import { DiscogsItem } from 'lib/types/discogs'
import { genreLibrary } from 'lib/types/genreLibrary'
import { StockItemObject } from 'lib/types/stock'
import { priceDollarsString } from 'lib/utils'
import { camelCase } from 'lodash'

export async function getDiscogsOptions({ query, artist, title, barcode }: any) {
  return axios(`https://api.discogs.com/database/search`, {
    params: {
      query,
      release_title: title,
      artist,
      barcode,
      type: 'release',
      key: process.env.NEXT_PUBLIC_DISCOGS_CONSUMER_KEY,
      secret: process.env.NEXT_PUBLIC_DISCOGS_CONSUMER_SECRET,
    },
  })
    .then((res) => res?.data?.results)
    .catch((e) => Error(e.message))
}

export async function getDiscogsItem({ master_id, resource_url }: any) {
  if (!master_id && !resource_url) return null
  return axios(master_id ? `https://api.discogs.com/masters/${master_id}` : resource_url)
    .then((res) => res?.data)
    .catch((e) => Error(e.message))
}

export async function getDiscogsPriceSuggestions({ id }: any) {
  return axios(
    `https://api.discogs.com/marketplace/price_suggestions/${id || ''}?token=${
      process.env.NEXT_PUBLIC_DISCOGS_PERSONAL_ACCESS_TOKEN
    }`,
  )
    .then((res) => res.data)
    .catch((e) => Error(e.message))
}

export async function getDiscogsItemArtistDetails({ artists }: any) {
  if (!artists) return []
  return Promise.all(artists.filter((artist) => artist.resource_url).map((artist) => axios(artist.resource_url))).then(
    (data) => data.filter((artist) => typeof artist === 'object'),
  )
}

export async function setDiscogsItemToStockItem(discogsOption: DiscogsItem, overrideItemDetails: boolean) {
  const detailedDiscogsItem = await getDiscogsItem(discogsOption)
  const priceSuggestions = await getDiscogsPriceSuggestions(discogsOption)
  console.log(detailedDiscogsItem)

  const discogsItem = {
    ...discogsOption,
    ...detailedDiscogsItem,
    priceSuggestions,
  }
  let update = {
    thumbUrl: discogsOption?.thumb || null,
    imageUrl: discogsOption?.cover_image || null,
    discogsItem,
    // discogsItem: JSON.stringify(discogsItem),
  }

  if (overrideItemDetails) update = { ...update, ...mergeStockAndDiscogsItems(discogsItem) }

  return update
}

export function mergeStockAndDiscogsItems(discogsItem) {
  const discogsStyles = (
    discogsItem?.genre ? (Array.isArray(discogsItem?.genre) ? discogsItem?.genre : [discogsItem?.genre]) : []
  ).concat(discogsItem?.style ? (Array.isArray(discogsItem?.style) ? discogsItem?.style : [discogsItem?.style]) : [])
  return {
    artist: discogsItem?.artists?.map((artist) => artist?.name)?.join(', '),
    barcode: discogsItem?.barcode?.join('\n'),
    country: discogsItem?.country,
    format: getFormatFromDiscogs(discogsItem?.format),
    media: 'Audio',
    section: getSectionFromDiscogsStyles(discogsStyles, genreLibrary),
    genre: discogsStyles,
    title: discogsItem?.title,
    release_year: discogsItem?.year?.toString(),
  }
}

export function getFormatFromDiscogs(formats: string[]) {
  if (!formats) return ''
  let format = [
    'LP',
    'CD',
    'Cassette',
    '16"',
    '12"',
    '11"',
    '10"',
    '9"',
    '8"',
    '7"',
    '6½"',
    '6"',
    '5½"',
    '5"',
    '4"',
    '3½"',
    '3"',
    '2"',
    '1"',
  ]?.find((f) => formats?.includes(f))
  if (!format) format = formats[0]
  return format
}

export function getPriceSuggestionText(item: StockItemObject) {
  const suggestion = getPriceSuggestion(item)
  const condBackUp = item?.isNew ? 'Mint (M)' : 'Good (G)'
  return suggestion?.value
    ? `${priceDollarsString(suggestion?.value, true)} NZD\n(${item?.cond || condBackUp} condition)`
    : ''
}

export function getPriceSuggestion(item) {
  const { discogsItem, isNew, cond } = item
  const camelCaseKey = <string>camelCase(cond)
  const priceSuggestions = discogsItem?.priceSuggestions || {}
  const priceBackUp = isNew
    ? priceSuggestions['Mint (M)'] || priceSuggestions?.mintM || null
    : priceSuggestions['Good (G)'] || priceSuggestions?.goodG || null
  return priceSuggestions[cond] || priceSuggestions[camelCaseKey] || priceBackUp
}

export function getSectionFromDiscogsStyles(itemStyles, genreLibrary) {
  let bestMatch = { matchCount: 0, nonMatchingCount: Infinity, code: null }

  for (const section of genreLibrary) {
    const sectionGenres = section.discogsStyles.split(',').map((s) => s.trim())
    const intersection = itemStyles.filter((genre) => sectionGenres.includes(genre))
    const nonMatchingCount = sectionGenres?.length - intersection?.length

    if (
      intersection.length > bestMatch.matchCount ||
      (intersection.length === bestMatch.matchCount && nonMatchingCount < bestMatch.nonMatchingCount)
    ) {
      bestMatch = { matchCount: intersection.length, nonMatchingCount, code: section.code }
    }
  }

  return bestMatch.code
}
