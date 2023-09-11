import SearchInput from 'components/inputs/search-input'
import Loading from 'components/placeholders/loading'
import { useVendorPayments } from 'lib/api/vendor'
import React, { useState } from 'react'
import PaymentListItem from './payment-list-item'
import LoadMoreButton from 'components/button/load-more-button'

const PaymentList = () => {
  const { vendorPayments, isVendorPaymentsLoading } = useVendorPayments()
  const [searchValue, setSearchValue] = useState('')
  const handleSearch = (e) => setSearchValue(e.target.value)
  const [limit, setLimit] = useState(50)
  const filterPayment = (payment) =>
    searchValue === '' ||
    `${payment?.id}`?.includes(searchValue) ||
    payment?.vendorName?.toLowerCase()?.includes(searchValue?.toLowerCase())
  return isVendorPaymentsLoading ? (
    <Loading />
  ) : (
    <div className="h-content overflow-y-scroll">
      <div className="px-2">
        <SearchInput searchValue={searchValue} handleSearch={handleSearch} />
      </div>
      <div className="px-2">
        {vendorPayments
          ?.filter((payment) => filterPayment(payment))
          ?.slice(0, limit)
          ?.map((payment) => (
            <PaymentListItem key={payment?.id} payment={payment} />
          ))}
        {limit < vendorPayments?.length && <LoadMoreButton onClick={() => setLimit((limit) => limit + 50)} />}
      </div>
    </div>
  )
}

export default PaymentList
