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
}

export interface CartObject {
  uid: number | null;
  items: any;
  note?: string;
  contact_id?: number;
  date_sale_opened?: string;
  sale_opened_by?: string;
}

export interface CartItem {
  quantity?: number;
  vendor_discount?: number;
  store_discount?: number;
  note?: string;
  is_gift_card?: boolean;
  gift_card_code?: string;
  gift_card_amount?: number;
  gift_card_notes?: string;
  is_misc_item?: boolean;
  misc_item_description?: string;
  misc_item_amount?: number;
}

export interface InventoryObject {
  id: number;
  sku?: string;
  vendor_id: number;
  vendor_name?: string;
  artist?: string;
  title?: string;
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
  section?: string;
  tags?: string[];
  googleBooksItem?: any;
  discogsItem?: any;
}
