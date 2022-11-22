import useSWR from 'swr'
import { camelCase, pascalCase } from '../utils'
export default function useData(
  url: string,
  label: string,
  getSingleValue: boolean = false
) {
  const { data, error, mutate } = useSWR(url, async () =>
    fetch(`/api/auth/jwt`)
      .then((response) => response.json())
      .then((accessToken) => {
        console.log('Access api', accessToken)
        return fetch(`/api/${url}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }).then((res) => res.json())
      })
  )
  return {
    [camelCase(label)]: getSingleValue ? data?.[0] : data,
    [`is${pascalCase(label)}Loading`]: !error && data === undefined,
    [`is${pascalCase(label)}Error`]: error,
    [`mutate${pascalCase(label)}`]: mutate,
  }
}
