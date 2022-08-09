import { get } from '@lib/api'
import { StockObject } from '@lib/types'
import { DiscogsItem } from './types'

export async function getDiscogsOptions({
  query,
  artist,
  title,
  barcode,
}: any) {
  return get(`https://api.discogs.com/database/search`, {
    params: {
      query,
      release_title: title,
      artist,
      barcode,
      key: process.env.NEXT_PUBLIC_DISCOGS_CONSUMER_KEY,
      secret: process.env.NEXT_PUBLIC_DISCOGS_CONSUMER_SECRET,
    },
  })
}

export async function getDiscogsItem({ master_id, resource_url }: any) {
  if (!master_id && !resource_url) return null
  return get(
    master_id ? `https://api.discogs.com/masters/${master_id}` : resource_url
  )
}

export async function getDiscogsPriceSuggestions({ id }: any) {
  return get(
    `https://api.discogs.com/marketplace/price_suggestions/${id || ''}?token=${
      process.env.NEXT_PUBLIC_DISCOGS_PERSONAL_ACCESS_TOKEN
    }`
  )
}

export async function getDiscogsItemArtistDetails({ artists }: any) {
  if (!artists) return []
  return Promise.all(
    artists
      .filter((artist) => artist.resource_url)
      .map((artist) => get(artist.resource_url))
  ).then((data) => data.filter((artist) => typeof artist === 'object'))
}

export async function setDiscogsItemToStockItem(
  discogsOption: DiscogsItem,
  stockItem: StockObject,
  overrideItemDetails: boolean
) {
  const detailedDiscogsItem = await getDiscogsItem(discogsOption)
  const priceSuggestions = await getDiscogsPriceSuggestions(discogsOption)

  const discogsItem = {
    ...discogsOption,
    ...detailedDiscogsItem,
    priceSuggestions,
  }

  if (overrideItemDetails)
    stockItem = mergeStockAndDiscogsItems(stockItem, discogsItem)

  return {
    ...stockItem,
    thumb_url: discogsOption?.thumb || null,
    image_url: discogsOption?.cover_image || null,
    discogsItem,
  }
}

export function mergeStockAndDiscogsItems(stockItem, discogsItem) {
  return {
    ...stockItem,
    artist: discogsItem?.artists?.map((artist) => artist?.name)?.join(', '),
    barcode: discogsItem?.barcode?.join('\n'),
    country: discogsItem?.country,
    format: getFormatFromDiscogs(discogsItem?.format),
    media: 'Audio',
    genre: [
      ...(discogsItem?.genre
        ? Array.isArray(discogsItem?.genre)
          ? discogsItem?.genre
          : [discogsItem?.genre]
        : []),
      ...(discogsItem?.style
        ? Array.isArray(discogsItem?.style)
          ? discogsItem?.style
          : [discogsItem?.style]
        : []),
    ],
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

export function getPriceSuggestion(item: StockObject) {
  if (item?.discogsItem?.priceSuggestions) {
    const priceSuggestions = item?.discogsItem?.priceSuggestions
    return priceSuggestions[
      item?.is_new ? 'Mint (M)' : item?.cond || 'Good (G)'
    ]?.value
      ? `$${parseFloat(
          priceSuggestions[item?.is_new ? 'Mint (M)' : item?.cond || 'Good (G)']
            ?.value
        )?.toFixed(2)} NZD (${
          item?.is_new ? 'Mint (M)' : item?.cond || 'Good (G)'
        } condition)`
      : null
  }
  return null
}
