import useSWR from 'swr'
import { camelCase, pascalCase } from '../utils'
import { mysql2js } from 'lib/database/utils/helpers'
import axios from 'axios'

export default function useData(url: string, label: string) {
  const { data, error, mutate } = useSWR(url, async () =>
    axios(`/api/auth/jwt`)
      .then((response) => response.data)
      .then((accessToken) =>
        axios(`/api/${url}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      )
      .then((res) => mysql2js(res.data))
  )
  return {
    [camelCase(label)]: data,
    [`is${pascalCase(label)}Loading`]: !error && data === undefined,
    [`is${pascalCase(label)}Error`]: error,
    [`mutate${pascalCase(label)}`]: mutate,
  }
}
