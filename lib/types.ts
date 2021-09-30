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

export interface ContactObject {
  id: number;
  name?: string;
  email?: string;
  phone?: string;
  postal_address?: string;
  note?: string;
}

export interface Modal {
  open: boolean;
  onClose?: Function;
  title?: string;
  message?: string;
  action?: Function;
  yesText?: string;
  noText?: string;
}

export interface SaleObject {
  id?: number;
  contact_id?: number;
  state?: string;
  items?: SaleItemObject[];
  transactions?: SaleTransactionObject[];
  date_sale_opened?: string;
  sale_opened_by?: number;
  date_sale_closed?: string;
  sale_closed_by?: number;
  cash_note?: string;
  note?: string;
  weather?: any;
  geo_latitude?: number;
  geo_longitude?: number;
  is_deleted?: boolean;
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
  is_deleted?: boolean;
}

export interface SaleTransactionObject {
  id?: number;
  sale_id: number;
  clerk_id: number;
  payment_method: string;
  amount: number;
  cash_received?: number;
  change_given?: number;
  payment_id?: number;
  gift_card_id?: number;
  card_taken?: boolean;
  date?: string;
  is_deleted?: boolean;
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

export interface VendorPayment {
  amount?: number;
  date?: string;
}

export interface VendorObject {
  id?: number;
  name?: string;
  category?: string;
  contact_id?: number;
  clerk_id?: number;
  bank_account_number?: string;
  email?: string;
  phone?: string;
  postal_address?: string;
  note?: string;
  last_contacted?: string;
  store_credit_only?: boolean;
  date_created?: string;
  date_modified?: string;
  is_deleted?: boolean;
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
  gift_card_note?: string;
  is_misc_item?: boolean;
  misc_item_description?: string;
  misc_item_amount?: number;
  googleBooksItem?: any;
  discogsItem?: any;
}

export interface TransactionObject {
  id?: number;
  sale_id: number;
  clerk_id?: number;
  date?: string;
  payment_method?: string;
  total_amount?: number;
  cash_received?: number;
  change_given?: number;
  vendor_payment_id?: number;
  gift_card_id?: number;
  card_taken?: boolean;
  is_deleted?: boolean;
}

export interface GiftCardObject {
  id?: number;
  code?: string;
  card_taken?: boolean;
  change_given?: number;
  initial_amount?: number;
  amount_remaining?: number;
  is_valid?: boolean;
  date_created?: string;
  date_modified?: string;
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
    "Mint (M)": DiscogsPriceSuggestion;
    "Near Mint (NM or M-)": DiscogsPriceSuggestion;
    "Very Good Plus (VG+)": DiscogsPriceSuggestion;
    "Very Good (VG)": DiscogsPriceSuggestion;
    "Good Plus (G+)": DiscogsPriceSuggestion;
    "Good (G)": DiscogsPriceSuggestion;
    "Fair (F)": DiscogsPriceSuggestion;
    "Poor (P)": DiscogsPriceSuggestion;
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
