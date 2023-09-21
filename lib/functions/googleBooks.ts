import dayjs from 'dayjs'
import { get } from 'lib/api/external'
import { GoogleBooksItem } from 'lib/types/googleBooks'
import { StockItemObject } from 'lib/types/stock'
import { andList } from 'lib/utils'

export async function getGoogleBooksOptionsByItem({ artist, title }: any) {
  console.log('Getting google books', artist, title)
  return get(
    `https://www.googleapis.com/books/v1/volumes`,
    {
      params: { q: `inauthor:${artist || ''}+intitle:${title || ''}` },
      header: { key: process.env.NEXT_PUBLIC_GOOGLE_API_KEY },
    },
    (data) => {
      return data?.items || []
    },
  )
}

export async function getGoogleBooksOptionsByKeyword(keyword: string) {
  return get(
    `https://www.googleapis.com/books/v1/volumes`,
    {
      params: { q: keyword },
      header: { key: process.env.NEXT_PUBLIC_GOOGLE_API_KEY },
    },
    (data) => {
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

export function mergeStockAndGoogleBooksItems(googleBooksItem: GoogleBooksItem) {
  const item = <StockItemObject>{
    artist: andList(googleBooksItem?.volumeInfo?.authors),
    title: googleBooksItem?.volumeInfo?.title,
    format: googleBooksItem?.volumeInfo?.printType,
    media: 'Literature',
    releaseYear: googleBooksItem?.volumeInfo?.publishedDate
      ? dayjs(googleBooksItem?.volumeInfo?.publishedDate).format('YYYY')
      : '',
    imageUrl: googleBooksItem?.volumeInfo?.imageLinks?.thumbnail,
  }
  return item
}
