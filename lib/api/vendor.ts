import useData from '.'

export function useVendorNames() {
  return useData(`vendor/names`, 'vendorNames')
}
