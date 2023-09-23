import useSWR from 'swr'
import { camelCase, pascalCase } from '../utils'
import { mysql2js } from 'lib/database/utils/helpers'
import axios from 'axios'

export function useData(url: string, label: string) {
  const { data, error, mutate } = useSWR(url, async () =>
    axiosAuth
      .get(`/api/${url}`)
      .then((data) => mysql2js(data))
      .catch((error) => {
        throw error
      }),
  )

  return {
    [camelCase(label)]: data,
    [`is${pascalCase(label)}Loading`]: !error && data === undefined,
    [`is${pascalCase(label)}Error`]: error instanceof Error,
    [`mutate${pascalCase(label)}`]: mutate,
  }
}

export const getAuth = () =>
  axios(`/api/auth/jwt`)
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      throw error
    })

export const axiosAuth = {
  get: (url) =>
    getAuth()
      .then((accessToken) =>
        axios(url, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
          .then((res) => res.data)
          .catch((error) => {
            throw error
          }),
      )
      .catch((error) => {
        throw error
      }),
  post: (url, body = {}) =>
    getAuth()
      .then((accessToken) =>
        axios
          .post(url, body, {
            headers: { Authorization: `Bearer ${accessToken}` },
          })
          .then((res) => res.data)
          .catch((error) => {
            throw error
          }),
      )
      .catch((error) => {
        throw error
      }),
  patch: (url, body = {}) =>
    getAuth()
      .then((accessToken) =>
        axios
          .patch(url, body, {
            headers: { Authorization: `Bearer ${accessToken}` },
          })
          .then((res) => res.data)
          .catch((error) => {
            throw error
          }),
      )
      .catch((error) => {
        throw error
      }),
  delete: (url) =>
    getAuth()
      .then((accessToken) =>
        axios
          .delete(url, {
            headers: { Authorization: `Bearer ${accessToken}` },
          })
          .then((res) => res.data)
          .catch((error) => {
            throw error
          }),
      )
      .catch((error) => {
        throw error
      }),
}