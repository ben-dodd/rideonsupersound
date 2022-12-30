/* eslint-disable unused-imports/no-unused-vars */
export interface OpenWeatherObject {
  base?: string
  clouds?: {
    all?: number
  }
  cod?: number
  coord?: {
    lon?: number
    lat?: number
  }
  dt?: number
  id?: number
  main?: {
    feels_like?: number
    humidity?: number
    pressure?: number
    temp?: number
    temp_max?: number
    temp_min?: number
  }
  name?: string
  sys?: {
    country?: string
    id?: number
    sunrise?: number
    sunset?: number
    type?: number
  }
  timezone?: number
  visibility?: number
  weather?: WeatherObject[]
  wind?: {
    deg?: number
    gust?: number
    speed?: number
  }
}

interface WeatherObject {
  id?: number
  main?: string
  description?: string
  icon?: string
}
