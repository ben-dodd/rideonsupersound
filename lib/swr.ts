import { useAuth0 } from '@auth0/auth0-react'
import useSWR from 'swr'
import { camelCase, pascalCase } from './utils'

export default function useApi(
  url: string,
  label: string,
  scope: string,
  getSingleValue: boolean = false
) {
  const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0()

  const { data, error, mutate } = useSWR(
    isLoading || !isAuthenticated ? null : url,
    async (url) => {
      const accessToken = await getAccessTokenSilently({
        audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
        scope,
      })
      const res = await fetch(url, {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      })
      return res.json()
    }
  )
  return {
    [camelCase(label)]: getSingleValue ? data?.[0] : data,
    [`is${pascalCase(label)}Loading`]: !error && !data,
    [`is${pascalCase(label)}Error`]: error,
    [`mutate${pascalCase(label)}`]: mutate,
  }
}
