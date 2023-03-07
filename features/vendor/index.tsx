import MidScreenContainer from 'components/container/mid-screen'
import SearchInput from 'components/inputs/search-input'
import { useVendors } from 'lib/api/vendor'
import React, { useState } from 'react'
import VendorListItem from './vendor-list-item'

const VendorsScreen = () => {
  const { vendors, isVendorsLoading } = useVendors()
  const [searchValue, setSearchValue] = useState('')
  const handleSearch = (e) => setSearchValue(e.target.value)
  console.log('vendors', vendors)
  return (
    <MidScreenContainer title="Vendors" isLoading={isVendorsLoading} titleClass="bg-col3" full={true}>
      <div className="h-content overflow-y-scroll">
        <div className="px-2">
          <SearchInput searchValue={searchValue} handleSearch={handleSearch} />
        </div>
        <div className="px-2">
          {vendors
            ?.filter?.((vendor) => vendor?.name?.toUpperCase?.()?.includes(searchValue?.toUpperCase()))
            ?.map((vendor) => (
              <VendorListItem key={vendor?.id} vendor={vendor} />
            ))}
        </div>
      </div>
    </MidScreenContainer>
  )
}

export default VendorsScreen
