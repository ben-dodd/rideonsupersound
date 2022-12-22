import axios from 'axios'
import { useAppStore } from 'lib/store'
import useSWR from 'swr'
import { useData } from './'

export function get(url, params = {}, callback = null) {
  return axios(url, params)
    .then((response) => (callback ? callback(response.data) : response.data))
    .catch((error) => {
      return error.message
    })
}

export async function getUSDExchangeRate() {
  return get(
    `https://api.apilayer.com/exchangerates_data/latest`,
    {
      params: { base: 'USD', symbols: 'NZD' },
      headers: {
        apikey: process.env.NEXT_PUBLIC_API_LAYER_API_KEY,
      },
    },
    (json) => json?.rates?.NZD ?? 1
  )
}

export function useSetWeatherToCart(setCart) {
  let loc = 'id=2192362'
  let latitude,
    longitude = ''
  if (navigator?.geolocation) {
    navigator?.geolocation?.getCurrentPosition((position) => {
      latitude = `${position.coords.latitude}`
      longitude = `${position.coords.longitude}`
      loc = `lat=${latitude}, lon=${longitude}`
    })
  }
  return axios(
    `https://api.openweathermap.org/data/2.5/weather?${loc}&appid=${process.env.NEXT_PUBLIC_OPEN_WEATHER_API}&units=metric`
  ).then((res) => {
    setCart({
      weather: res.data,
      geoLatitude: latitude,
      geoLongitude: longitude,
    })
  })
}

export function getGeolocation() {
  if (!navigator.geolocation) {
    console.log('Geolocation is not supported by your browser')
    return null
  } else
    return navigator.geolocation.getCurrentPosition(
      (position) => position?.coords,
      () => console.log('Unable to retrieve location.')
    )
}

export function uploadFiles(files) {
  // const body = new FormData();
  // body.append("file", files);
  try {
    fetch(`/api/upload-file?k=${process.env.NEXT_PUBLIC_SWR_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: files,
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
  } catch (e) {
    throw Error(e.message)
  }
}
