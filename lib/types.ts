export enum SaleStateTypes {
  InProgress = "in progress",
  Layby = "layby",
  Parked = "parked",
  Completed = "completed",
}

export enum PaymentMethodTypes {
  Cash = "cash",
  Card = "card",
  Account = "acct",
  GiftCard = "gift",
}

export enum ButtonTypes {
  Ok = "ok",
  Cancel = "cancel",
}

export enum DiscogsConditionTypes {
  M = "Mint (M)",
  NM = "Near Mint (NM or M-)",
  VGP = "Very Good Plus (VG+)",
  VG = "Very Good (VG)",
  GP = "Good Plus (G+)",
  G = "Good (G)",
  F = "Fair (F)",
  P = "Poor (P)",
}

export interface ClerkObject {
  id: number;
  name?: string;
  password?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  image_id?: number;
  note?: string;
  is_admin?: number;
  is_current?: number;
  date_created?: string;
  date_modified?: string;
  is_deleted?: number;
}

export interface CustomerObject {
  id?: number;
  name?: string;
  email?: string;
  phone?: string;
  postal_address?: string;
  note?: string;
  is_deleted?: boolean;
}

export interface ConfirmModal {
  open: boolean;
  onClose?: Function;
  title?: string;
  message?: string;
  styledMessage?: any;
  action?: Function;
  altAction?: Function;
  yesText?: string;
  altText?: string;
  noText?: string;
}

export interface SaleObject {
  id?: number;
  customer_id?: number;
  state?: SaleStateTypes;
  date_sale_opened?: string;
  sale_opened_by?: number;
  date_sale_closed?: string;
  sale_closed_by?: number;
  date_layby_started?: string;
  layby_started_by?: number;
  cash_note?: string;
  note?: string;
  weather?: any;
  geo_latitude?: number;
  geo_longitude?: number;
  is_deleted?: boolean;
  items?: SaleItemObject[];
}

export interface SaleItemObject {
  id?: number;
  sale_id?: number;
  item_id?: number;
  quantity?: string;
  vendor_discount?: string;
  store_discount?: string;
  is_gift_card?: boolean;
  is_misc_item?: boolean;
  note?: string;
  is_refunded?: boolean;
  date_refunded?: string;
  is_deleted?: boolean;
}

export interface SaleTransactionObject {
  id?: number;
  sale_id: number;
  clerk_id: number;
  date?: string;
  payment_method: PaymentMethodTypes;
  amount: number;
  cash_received?: number;
  change_given?: number;
  vendor_payment_id?: number;
  gift_card_id?: number;
  gift_card_remaining?: number;
  gift_card_taken?: boolean;
  gift_card_change?: number;
  register_id?: number;
  is_refund?: boolean;
  is_deleted?: boolean;
}

export interface HoldObject {
  id?: number;
  customer_id?: number;
  item_id?: number;
  quantity?: number;
  vendor_discount?: number;
  store_discount?: number;
  hold_period?: number;
  date_from?: string;
  started_by?: number;
  date_removed_from_hold?: string;
  removed_from_hold_by?: number;
  is_sold?: boolean;
  note?: string;
  date_created?: string;
  date_modified?: string;
  is_deleted?: boolean;
  overdue?: boolean;
}

export interface VendorSaleItemObject {
  sale_id?: number;
  item_id?: number;
  quantity?: number;
  vendor_discount?: number;
  vendor_cut?: number;
  total_sell?: number;
  date_price_valid_from?: string;
  date_sale_opened?: string;
  date_sale_closed?: string;
}

export interface VendorPaymentObject {
  id?: number;
  amount?: number;
  bank_account_number?: string;
  batch_number?: string;
  date?: string;
  sequence_number?: string;
  clerk_id?: number;
  vendor_id?: number;
  register_id?: number;
  type?: string;
  is_deleted?: boolean;
}

export interface VendorObject {
  id?: number;
  name?: string;
  category?: string;
  customer_id?: number;
  clerk_id?: number;
  bank_account_number?: string;
  email?: string;
  phone?: string;
  postal_address?: string;
  note?: string;
  last_customered?: string;
  store_credit_only?: boolean;
  date_created?: string;
  date_modified?: string;
  is_deleted?: boolean;
  totalSell?: number;
  totalPaid?: number;
  totalOwing?: number;
  totalItemsInStock?: number;
  lastPaid?: string;
  lastSold?: string;
}

export interface InventoryObject {
  id: number;
  sku?: string;
  vendor_id: number;
  vendor_name?: string;
  artist?: string;
  title?: string;
  display_as?: string;
  media?: string;
  format?: string;
  genre?: string;
  is_new?: number;
  cond?: string;
  country?: string;
  release_year?: string;
  barcode?: string;
  publisher?: string;
  colour?: string;
  size?: string;
  description?: string;
  note?: string;
  image_id?: string;
  image_url?: string;
  thumb_url?: string;
  google_books_item_id?: number;
  discogs_item_id?: number;
  do_list_on_website?: number;
  has_no_quantity?: number;
  date_created?: string;
  date_modified?: string;
  is_deleted?: number;
  vendor_cut?: number;
  total_sell?: number;
  quantity?: number;
  quantity_received?: number;
  quantity_returned?: number;
  quantity_lost?: number;
  quantity_found?: number;
  quantity_discarded?: number;
  quantity_layby?: number;
  quantity_unlayby?: number;
  quantity_hold?: number;
  quantity_unhold?: number;
  quantity_sold?: number;
  quantity_unsold?: number;
  section?: string;
  tags?: string[];
  is_gift_card?: boolean;
  gift_card_code?: string;
  gift_card_amount?: number;
  gift_card_remaining?: number;
  gift_card_note?: string;
  gift_card_is_valid?: boolean;
  is_misc_item?: boolean;
  misc_item_description?: string;
  misc_item_amount?: number;
  googleBooksItem?: any;
  discogsItem?: any;
}

export interface StockPriceObject {
  id?: number;
  stock_id?: number;
  clerk_id?: number;
  vendor_cut?: number;
  total_sell?: number;
  date_valid_from?: string;
  note?: string;
}

export interface GiftCardObject {
  id?: number;
  is_gift_card?: boolean;
  gift_card_code?: string;
  gift_card_taken?: boolean;
  gift_card_change_given?: number;
  gift_card_amount?: number;
  gift_card_remaining?: number;
  gift_card_note?: string;
  gift_card_is_valid?: boolean;
  date_created?: string;
  date_modified?: string;
  is_deleted?: boolean;
}

export interface LogObject {
  id?: number;
  log: string;
  clerk_id?: number;
  table_id?: string;
  row_id?: number;
  date_created?: string;
  is_deleted?: boolean;
}

export interface DiscogsItem {
  artists?: DiscogsArtist[];
  barcode?: string[];
  catno?: string;
  community?: {
    have?: number;
    want?: number;
  };
  country?: string;
  cover_image?: string;
  data_quality?: string;
  format?: string[];
  format_quantity?: number;
  formats?: DiscogsFormat[];
  genre?: string[];
  genres?: string[]; // Dupliate of style
  id?: number;
  images?: DiscogsImage[];
  label?: string[];
  lowest_price?: number;
  main_release?: number;
  main_release_url?: string;
  master_id?: number;
  master_url?: string;
  most_recent_release?: number;
  most_recent_release_url?: string;
  num_for_sale?: number;
  priceSuggestions?: {
    [DiscogsConditionTypes.M]: DiscogsPriceSuggestion;
    [DiscogsConditionTypes.NM]: DiscogsPriceSuggestion;
    [DiscogsConditionTypes.VGP]: DiscogsPriceSuggestion;
    [DiscogsConditionTypes.VG]: DiscogsPriceSuggestion;
    [DiscogsConditionTypes.GP]: DiscogsPriceSuggestion;
    [DiscogsConditionTypes.G]: DiscogsPriceSuggestion;
    [DiscogsConditionTypes.F]: DiscogsPriceSuggestion;
    [DiscogsConditionTypes.P]: DiscogsPriceSuggestion;
  };
  resource_url?: string;
  style?: string[];
  styles?: string[]; // Duplicate of style
  thumb?: string; // Thumbnail image
  title?: string;
  tracklist?: DiscogsTrack[];
  type?: string; // e.g. release
  uri?: string;
  versions_url?: string;
  videos?: DiscogsVideo[];
  year?: number;
}

export interface DiscogsArtist {
  anv?: string;
  id?: number;
  join?: string;
  name?: string;
  resource_url?: string;
  role?: string;
  tracks?: string;
}

export interface DiscogsFormat {
  descriptions?: string[];
  name?: string;
  qty?: string;
  text?: string;
}

export interface DiscogsImage {
  height?: number;
  resource_url?: string;
  type?: string;
  uri?: string;
  uri150?: string;
  width?: number;
}

export interface DiscogsPriceSuggestion {
  currency?: string;
  value?: number;
}

export interface DiscogsTrack {
  duration?: string; // Duration in "mm:ss" format
  extraartists?: DiscogsArtist[];
  position?: string; // Track number / side
  title?: string;
  type_?: string;
}

export interface DiscogsVideo {
  description?: string; // Video description
  duration?: number; // Duration in seconds
  embed?: boolean;
  title?: string; // Video title
  uri?: string; // Video url
}

export interface GoogleBooksItem {
  accessInfo: {
    accessViewStatus: string;
    country: string;
    embeddable: boolean;
    epub: {
      isAvailable: boolean;
    };
    pdf: {
      isAvailable: boolean;
    };
    publicDomain: boolean;
    quoteSharingAllowed: boolean;
    textToSpeechPermission: string;
    viewability: string;
    webReaderLink: string;
  };
  etag: string;
  id: string;
  kind: string;
  saleInfo: {
    country: string;
    isEbook: boolean;
    saleability: string;
  };
  searchInfo: {
    textSnippet: string;
  };
  selfLink: string;
  volumeInfo: {
    allowAnonLogging: boolean;
    authors: string[];
    averageRating: number;
    canonicalVolumeLink: string;
    categories: string[];
    comicsContent: boolean;
    contentVersion: string;
    description: string;
    imageLinks: {
      smallThumbnail: string;
      thumbnail: string;
    };
    industryIdentifiers: GoogleBooksIndustryIdentifiers[];
    infoLink: string;
    language: string;
    maturityRating: string;
    pageCount: number;
    panelizationSummary: {
      containsEpubBubbles: boolean;
      containsImageBubbles: boolean;
    };
    previewLink: string;
    printType: string;
    publishedDate: string;
    publisher: string;
    ratingsCount: number;
    readingModes: {
      text: boolean;
      image: boolean;
    };
    subtitle: string;
    title: string;
  };
}

export interface GoogleBooksIndustryIdentifiers {
  identifier: string;
  type: string;
}

export interface RegisterObject {
  id?: number;
  opened_by_id?: number;
  open_date?: string;
  open_amount?: number;
  open_note?: string;
  open_till_id?: number;
  closed_by_id?: number;
  close_date?: string;
  close_till_id?: number;
  close_amount?: number;
  close_petty_balance?: number;
  close_cash_given?: number;
  close_manual_payments?: number;
  close_expected_amount?: number;
  close_discrepancy?: number;
  close_note?: string;
}

export interface TillObject {
  id?: number;
  one_hundred_dollar?: number;
  fifty_dollar?: number;
  twenty_dollar?: number;
  ten_dollar?: number;
  five_dollar?: number;
  two_dollar?: number;
  one_dollar?: number;
  fifty_cent?: number;
  twenty_cent?: number;
  ten_cent?: number;
}

export interface KiwiBankTransactionObject {
  name?: string;
  amount?: number;
  accountNumber?: string;
}

export interface ModalButton {
  type?: string;
  onClick?: Function;
  text?: string;
  disabled?: boolean;
  loading?: boolean;
  hidden?: boolean;
  data?: any[];
  headers?: string[];
  fileName?: string;
}

export interface HelpObject {
  id?: number;
  title?: string;
  tags?: string;
  pages?: string;
  views?: string;
  body?: string;
}

export interface OpenWeatherObject {
  base?: string;
  clouds?: {
    all?: number;
  };
  cod?: number;
  coord?: {
    lon?: number;
    lat?: number;
  };
  dt?: number;
  id?: number;
  main?: {
    feels_like?: number;
    humidity?: number;
    pressure?: number;
    temp?: number;
    temp_max?: number;
    temp_min?: number;
  };
  name?: string;
  sys?: {
    country?: string;
    id?: number;
    sunrise?: number;
    sunset?: number;
    type?: number;
  };
  timezone?: number;
  visibility?: number;
  weather?: WeatherObject[];
  wind?: {
    deg?: number;
    gust?: number;
    speed?: number;
  };
}

interface WeatherObject {
  id?: number;
  main?: string;
  description?: string;
  icon?: string;
}
