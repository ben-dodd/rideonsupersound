import useData from './'

export function useVendors() {
  return useData(`vendor`, 'vendors')
}

export function useVendorNames() {
  return useData(`vendor/names`, 'vendorNames')
}
