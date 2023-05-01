import SearchInput from 'components/inputs/search-input'
import Loading from 'components/placeholders/loading'
import { useVendorPayments } from 'lib/api/vendor'
import React, { useState } from 'react'
import PaymentListItem from './payment-list-item'

const PaymentList = () => {
  const { vendorPayments, isVendorPaymentsLoading } = useVendorPayments()
  const [searchValue, setSearchValue] = useState('')
  const handleSearch = (e) => setSearchValue(e.target.value)
  console.log(vendorPayments)
  return isVendorPaymentsLoading ? (
    <Loading />
  ) : (
    <div className="h-content overflow-y-scroll">
      <div className="px-2">
        <SearchInput searchValue={searchValue} handleSearch={handleSearch} />
      </div>
      <div className="px-2">
        {vendorPayments?.map((payment) => (
          <PaymentListItem key={payment?.id} payment={payment} />
        ))}
      </div>
    </div>
  )
}

export default PaymentList
