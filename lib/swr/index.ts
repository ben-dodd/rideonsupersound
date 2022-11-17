import useSWR from 'swr'
import { camelCase, pascalCase } from '../utils'
export default function useData(
  url: string,
  label: string,
  scopes: string[],
  getSingleValue: boolean = false
) {
  const { data, error, mutate } = useSWR(url, async () => {
    const response = await fetch(`/api/auth/jwt`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ scopes }),
    })
    console.log('Response', response)
    const accessToken = await response.json()
    console.log('Access', accessToken)
    fetch(`/api/${url}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json())
  })
  return {
    [camelCase(label)]: getSingleValue ? data?.[0] : data,
    [`is${pascalCase(label)}Loading`]: !error && data === undefined,
    [`is${pascalCase(label)}Error`]: error,
    [`mutate${pascalCase(label)}`]: mutate,
  }
}
