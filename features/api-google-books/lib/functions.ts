import { StockObject } from '@/lib/types'

export async function getGoogleBooksOptionsByItem(item: StockObject) {
  try {
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${item?.artist || ''}${
        item?.title || ''
      }&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`
    )
    const data = await res.text()
    if (!res.ok) throw Error()
    let json = JSON.parse(data)
    return json?.items || []
  } catch (e) {
    throw Error(e.message)
  }
}
