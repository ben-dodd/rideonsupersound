import { StockObject } from '@/lib/types'
import { DiscogsItem } from './types'

export async function getDiscogsOptionsByBarcode(barcode: string) {
  try {
    const res = await fetch(
      `https://api.discogs.com/database/search?type=release&barcode=${barcode}&key=${process.env.NEXT_PUBLIC_DISCOGS_CONSUMER_KEY}&secret=${process.env.NEXT_PUBLIC_DISCOGS_CONSUMER_SECRET}`
    )
    const json = await res.json()
    if (!res.ok) throw Error(json.message)
    return json.results
  } catch (e) {
    throw Error(e.message)
  }
}

export async function getDiscogsOptionsByItem(item: StockObject) {
  try {
    let url = ''
    if (item?.barcode) url = `&barcode=${encodeURIComponent(item?.barcode)}`
    // if (false) url = "";
    else
      url = `&query=${item?.artist ? `${item?.artist} ` : ''}${
        item?.title ? `${item?.title} ` : ''
      }${item?.format ? `${item?.format} ` : ''}`
    // &artist=${
    //   item?.artist || ""
    // }&title=${item?.title || ""}
    const res = await fetch(
      `https://api.discogs.com/database/search?type=release${url}&key=${process.env.NEXT_PUBLIC_DISCOGS_CONSUMER_KEY}&secret=${process.env.NEXT_PUBLIC_DISCOGS_CONSUMER_SECRET}`
    )
    const json = await res.json()
    if (!res.ok) throw Error(json.message)
    return json.results
  } catch (e) {
    throw Error(e.message)
  }
}

export async function getDiscogsOptionsByKeyword(keyword: string) {
  try {
    const res = await fetch(
      `https://api.discogs.com/database/search?type=release&query=${keyword}&key=${process.env.NEXT_PUBLIC_DISCOGS_CONSUMER_KEY}&secret=${process.env.NEXT_PUBLIC_DISCOGS_CONSUMER_SECRET}`
    )
    const json = await res.json()
    if (!res.ok) throw Error(json.message)
    return json.results
  } catch (e) {
    throw Error(e.message)
  }
}

export async function getDiscogsItem(discogsItem: DiscogsItem) {
  try {
    let url = `https://api.discogs.com/masters/${discogsItem?.master_id || ''}`
    if (discogsItem?.master_id === 0 || !discogsItem?.master_id)
      url = discogsItem?.resource_url
    const res = await fetch(url)
    const json = await res.json()
    if (!res.ok) throw Error(json.message)
    return json
  } catch (e) {
    throw Error(e.message)
  }
}

export async function getDiscogsPriceSuggestions(discogsItem: DiscogsItem) {
  try {
    const res = await fetch(
      `https://api.discogs.com/marketplace/price_suggestions/${
        discogsItem?.id || ''
      }?token=${process.env.NEXT_PUBLIC_DISCOGS_PERSONAL_ACCESS_TOKEN}`
    )
    const json = await res.json()
    if (!res.ok) throw Error(json.message)
    return json
  } catch (e) {
    throw Error(e.message)
  }
}

export async function getDiscogsItemArtistDetails(discogsItem: DiscogsItem) {
  const artists = []
  console.log(discogsItem?.artists)
  if (discogsItem?.artists) {
    for (const discogsArtist of discogsItem?.artists) {
      console.log(discogsArtist)
      if (discogsArtist?.resource_url) {
        try {
          const res = await fetch(discogsArtist?.resource_url)
          const json = await res.json()
          if (!res.ok) throw Error(json.message)
          artists?.push({ ...json, name: discogsArtist?.name })
          return artists
        } catch (e) {
          throw Error(e.message)
        }
      }
    }
  } else {
    return {}
  }
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
    stockItem = {
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
  return {
    ...stockItem,
    thumb_url: discogsOption?.thumb || null,
    image_url: discogsOption?.cover_image || null,
    discogsItem,
  }
}

export function getFormatFromDiscogs(formats: string[]) {
  if (!formats) return ''
  let format = null
  console.log(formats)
  ;[
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
  ]?.forEach((f) => {
    if (formats?.includes(f)) format = f
  })
  if (!format) format = formats[0]
  console.log(format)
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
