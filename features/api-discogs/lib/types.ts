export enum DiscogsConditionTypes {
  M = 'Mint (M)',
  NM = 'Near Mint (NM or M-)',
  VGP = 'Very Good Plus (VG+)',
  VG = 'Very Good (VG)',
  GP = 'Good Plus (G+)',
  G = 'Good (G)',
  F = 'Fair (F)',
  P = 'Poor (P)',
}

export interface DiscogsItem {
  artists?: DiscogsArtist[]
  barcode?: string[]
  catno?: string
  community?: {
    have?: number
    want?: number
  }
  country?: string
  cover_image?: string
  data_quality?: string
  format?: string[]
  format_quantity?: number
  formats?: DiscogsFormat[]
  genre?: string[]
  genres?: string[] // Dupliate of style
  id?: number
  images?: DiscogsImage[]
  identifiers?: DiscogsIdentifiers[]
  label?: string[]
  lowest_price?: number
  main_release?: number
  main_release_url?: string
  master_id?: number
  master_url?: string
  most_recent_release?: number
  most_recent_release_url?: string
  num_for_sale?: number
  priceSuggestions?: {
    [DiscogsConditionTypes.M]: DiscogsPriceSuggestion
    [DiscogsConditionTypes.NM]: DiscogsPriceSuggestion
    [DiscogsConditionTypes.VGP]: DiscogsPriceSuggestion
    [DiscogsConditionTypes.VG]: DiscogsPriceSuggestion
    [DiscogsConditionTypes.GP]: DiscogsPriceSuggestion
    [DiscogsConditionTypes.G]: DiscogsPriceSuggestion
    [DiscogsConditionTypes.F]: DiscogsPriceSuggestion
    [DiscogsConditionTypes.P]: DiscogsPriceSuggestion
  }
  resource_url?: string
  style?: string[]
  styles?: string[] // Duplicate of style
  thumb?: string // Thumbnail image
  title?: string
  tracklist?: DiscogsTrack[]
  type?: string // e.g. release
  uri?: string
  versions_url?: string
  videos?: DiscogsVideo[]
  year?: number
}

export interface DiscogsArtist {
  aliases?: DiscogsArtist[]
  anv?: string
  data_quality?: string
  id?: number
  images?: DiscogsImage[]
  join?: string
  name?: string
  profile?: string
  realname?: string
  releases_url?: string
  resource_url?: string
  role?: string
  tracks?: string
  uri?: string
  urls?: string[]
}

export interface DiscogsFormat {
  descriptions?: string[]
  name?: string
  qty?: string
  text?: string
}

export interface DiscogsImage {
  height?: number
  resource_url?: string
  type?: string
  uri?: string
  uri150?: string
  width?: number
}

export interface DiscogsPriceSuggestion {
  currency?: string
  value?: number
}

export interface DiscogsTrack {
  duration?: string // Duration in "mm:ss" format
  extraartists?: DiscogsArtist[]
  position?: string // Track number / side
  title?: string
  type_?: string
}

export interface DiscogsVideo {
  description?: string // Video description
  duration?: number // Duration in seconds
  embed?: boolean
  title?: string // Video title
  uri?: string // Video url
}

export interface DiscogsIdentifiers {
  value?: string
  type?: string
  description?: string
}
