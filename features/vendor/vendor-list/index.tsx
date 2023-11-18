import SearchInput from 'components/inputs/search-input'
import Loading from 'components/placeholders/loading'
import { useVendors } from 'lib/api/vendor'
import React, { useState } from 'react'
import VendorListItem from './vendor-list-item'
import FilterPanel from 'components/table/filter'

const VendorList = () => {
  const { vendors, isVendorsLoading } = useVendors()
  const [searchValue, setSearchValue] = useState('')
  const handleSearch = (e) => setSearchValue(e.target.value)
  return isVendorsLoading ? (
    <Loading />
  ) : (
    <div className="h-content overflow-y-scroll">
      <FilterPanel
        visible={
          <div className="flex justify-between w-full">
            <SearchInput searchValue={searchValue} handleSearch={handleSearch} />
          </div>
        }
      >
        <div className="grid grid-cols-4">Filter</div>
      </FilterPanel>

      <div className="px-2">
        {vendors
          ?.filter?.((vendor) => vendor?.name?.toUpperCase?.()?.includes(searchValue?.toUpperCase()))
          ?.map((vendor) => (
            <VendorListItem key={vendor?.id} vendor={vendor} />
          ))}
      </div>
    </div>
  )
}

export default VendorList
