import useSWR from 'swr'
import { camelCase, pascalCase } from '../utils'
import { request } from 'superagent'
import { mysql2js } from 'lib/database/utils/helpers'

export default function useData(url: string, label: string) {
  const { data, error, mutate } = useSWR(url, async () =>
    request(`/api/auth/jwt`)
      .then((response) => response.json())
      .then((accessToken) =>
        request(`/api/${url}`).set('Authorization', `Bearer ${accessToken}`)
      )
      .then((res) => mysql2js(res.json()))
  )
  return {
    [camelCase(label)]: data,
    [`is${pascalCase(label)}Loading`]: !error && data === undefined,
    [`is${pascalCase(label)}Error`]: error,
    [`mutate${pascalCase(label)}`]: mutate,
  }
}
