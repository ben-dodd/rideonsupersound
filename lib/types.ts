export enum SaleStateTypes {
  InProgress = "in progress", // sale in cart
  Layby = "layby", // sale held on layby
  Parked = "parked", // sale parked
  Completed = "completed", // sale completed
}

export enum StockMovementTypes {
  Received = "received", // received from vendor
  Returned = "returned", // returned to vendor
  Lost = "lost", // unknown/lost
  Found = "found", // unknown/found, back into stock
  Discarded = "discarded", // damaged/ruined/thrown out
  Layby = "layby", // held on layby
  Unlayby = "unlayby", // removed from layby back into stock
  Hold = "hold", // held for customer
  Unhold = "unhold", // removed from hold back into stock
  Sold = "sold", // sold to customer
  Unsold = "unsold", // customer returned, back into stock
  Adjustment = "adjustment", // stock level adjustment from stocktake
}

export enum PaymentMethodTypes {
  Cash = "cash", // paid with cash
  Card = "card", // paid with card, eftpos or credit
  Account = "acct", // paid with vendor store credit
  GiftCard = "gift", // paid with gift card
}

export enum VendorPaymentTypes {
  Sale = "sale", // vendor bought something with account
  SaleRefund = "sale refund", // vendor refunded something onto their account
  Cash = "cash", // vendor was given cash in store
  DC = "direct credit", // vendor paid with internet banking
  Batch = "batch", // vendor paid with batch kiwibank payment
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

export enum RoleTypes {
  CO = "Communication Officer",
  RC = "Record Chief",
  PMC = "Printed Matter Captain",
  VLG = "Vendor Liaison General",
  MC = "Mailorder Czar",
  CL = "Cash Lord",
  PM = "Pay Master",
  DW = "Data Wrangler",
  RS = "Retail Samurai",
}

export interface ClerkObject {
  id: number;
  name?: string;
  colour?: number;
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
  date_sale_opened?: any;
  sale_opened_by?: number;
  date_sale_closed?: any;
  sale_closed_by?: number;
  date_layby_started?: any;
  layby_started_by?: number;
  store_cut?: number;
  total_price?: number;
  number_of_items?: number;
  item_list?: string;
  is_mail_order?: boolean;
  postage?: number;
  postal_address?: string;
  cash_note?: string;
  note?: string;
  weather?: any;
  geo_latitude?: number;
  geo_longitude?: number;
  is_deleted?: boolean;
  items?: SaleItemObject[];
  transactions?: SaleTransactionObject[];
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
  refund_note?: string;
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
  vendor?: VendorObject;
  gift_card_update?: GiftCardObject;
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
  clerk_id?: number;
  bank_account_number?: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  postal_address?: string;
  note?: string;
  last_customered?: string;
  store_credit_only?: boolean;
  email_vendor?: boolean;
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

export interface StockObject {
  id?: number;
  sku?: string;
  vendor_id?: number;
  vendor_name?: string;
  artist?: string;
  title?: string;
  display_as?: string;
  media?: string;
  format?: string;
  section?: string;
  genre?: string[] | string;
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
  date_last_stocktake?: string;
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
  quantity_adjustment?: number;
  tags?: string[];
  is_gift_card?: boolean;
  gift_card_code?: string;
  gift_card_amount?: number;
  gift_card_remaining?: number;
  gift_card_is_valid?: boolean;
  is_misc_item?: boolean;
  misc_item_description?: string;
  misc_item_amount?: number;
  googleBooksItem?: any;
  discogsItem?: any;
  needs_restock?: boolean;
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
  gift_card_amount?: number;
  gift_card_remaining?: number;
  note?: string;
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

export interface StockMovementObject {
  id?: number;
  stock_id?: number;
  clerk_id?: number;
  quantity?: number;
  register_id?: number;
  act?: string;
  note?: string;
  date_moved?: string;
}

export interface TaskObject {
  id?: number;
  description?: string;
  date_created?: string;
  created_by_clerk_id?: number;
  assigned_to?: string;
  assigned_to_clerk_id?: number;
  is_completed?: boolean;
  is_priority?: boolean;
  date_completed?: string;
  completed_by_clerk_id?: number;
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
  identifiers?: DiscogsIdentifiers[];
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
  aliases?: DiscogsArtist[];
  anv?: string;
  data_quality?: string;
  id?: number;
  images?: DiscogsImage[];
  join?: string;
  name?: string;
  profile?: string;
  realname?: string;
  releases_url?: string;
  resource_url?: string;
  role?: string;
  tracks?: string;
  uri?: string;
  urls?: string[];
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

export interface DiscogsIdentifiers {
  value?: string;
  type?: string;
  description?: string;
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
    listPrice?: {
      amount: number;
      currencyCode: string;
    };
    retailPrice?: {
      amount: number;
      currencyCode: string;
    };
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
  vendor_id?: string;
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

export const bgDark = [
  "bg-col1-dark",
  "bg-col2-dark",
  "bg-col3-dark",
  "bg-col4-dark",
  "bg-col5-dark",
  "bg-col6-dark",
  "bg-col7-dark",
  "bg-col8-dark",
  "bg-col9-dark",
  "bg-col10-dark",
];

export const bg = [
  "bg-col1",
  "bg-col2",
  "bg-col3",
  "bg-col4",
  "bg-col5",
  "bg-col6",
  "bg-col7",
  "bg-col8",
  "bg-col9",
  "bg-col10",
];

export const bgLight = [
  "bg-col1-light",
  "bg-col2-light",
  "bg-col3-light",
  "bg-col4-light",
  "bg-col5-light",
  "bg-col6-light",
  "bg-col7-light",
  "bg-col8-light",
  "bg-col9-light",
  "bg-col10-light",
];
