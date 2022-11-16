import useSWR from 'swr'
import { camelCase, pascalCase } from '../utils'
export default function useData(
  url: string,
  label: string,
  scope: string,
  getSingleValue: boolean = false
) {
  const { data, error, mutate } = useSWR(url, async () => {
    fetch(`/api/${url}`).then((res) => res.json())
  })
  return {
    [camelCase(label)]: getSingleValue ? data?.[0] : data,
    [`is${pascalCase(label)}Loading`]: !error && data === undefined,
    [`is${pascalCase(label)}Error`]: error,
    [`mutate${pascalCase(label)}`]: mutate,
  }
}
