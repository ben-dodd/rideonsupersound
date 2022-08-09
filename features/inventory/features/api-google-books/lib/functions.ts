import { get } from '@lib/api'

export async function getGoogleBooksOptionsByItem({ artist, title }: any) {
  return get(
    `https://www.googleapis.com/books/v1/volumes`,
    {
      params: { q: `inauthor:${artist || ''}+intitle:${title || ''}` },
      header: { key: process.env.NEXT_PUBLIC_GOOGLE_API_KEY },
    },
    (data) => data?.items || []
  )
}
