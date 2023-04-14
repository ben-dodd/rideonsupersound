import { get } from 'lib/api/external'
import { GoogleBooksItem } from 'lib/types/googleBooks'

export async function getGoogleBooksOptionsByItem({ artist, title }: any) {
  console.log('Getting google books', artist, title)
  return get(
    `https://www.googleapis.com/books/v1/volumes`,
    {
      params: { q: `inauthor:${artist || ''}+intitle:${title || ''}` },
      header: { key: process.env.NEXT_PUBLIC_GOOGLE_API_KEY },
    },
    (data) => {
      console.log(data)
      return data?.items || []
    },
  )
}

export async function setGoogleBooksItemToStockItem(googleBooksOption: GoogleBooksItem, overrideItemDetails: boolean) {
  // const detailedDiscogsItem = await getDiscogsItem(googleBooksOption)
  // const priceSuggestions = await getDiscogsPriceSuggestions(googleBooksOption)

  const googleBooksItem = {
    ...googleBooksOption,
    // ...detailedDiscogsItem,
    // priceSuggestions,
  }
  console.log(googleBooksItem)
  let update = {
    // thumbUrl: discogsOption?.thumb || null,
    // imageUrl: discogsOption?.cover_image || null,
    googleBooksItem,
    // discogsItem: JSON.stringify(discogsItem),
  }

  if (overrideItemDetails) update = { ...update, ...mergeStockAndGoogleBooksItems(googleBooksItem) }

  return update
}

export function mergeStockAndGoogleBooksItems(googleBooksItem) {
  return {
    // artist: discogsItem?.artists?.map((artist) => artist?.name)?.join(', '),
    // barcode: discogsItem?.barcode?.join('\n'),
    // country: discogsItem?.country,
    // format: getFormatFromDiscogs(discogsItem?.format),
    // media: 'Audio',
    // genre: [
    //   ...(discogsItem?.genre ? (Array.isArray(discogsItem?.genre) ? discogsItem?.genre : [discogsItem?.genre]) : []),
    //   ...(discogsItem?.style ? (Array.isArray(discogsItem?.style) ? discogsItem?.style : [discogsItem?.style]) : []),
    // ],
    // title: discogsItem?.title,
    // release_year: discogsItem?.year?.toString(),
  }
}
