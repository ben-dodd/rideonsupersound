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

export interface CartObject {
  uid: number;
  items?: any;
  notes?: string;
  contact_id?: number;
  date_sale_opened?: string;
}

export interface CartItem {
  id: number;
  cart_quantity: number;
}

export interface InventoryObject {
  id: number;
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
}
