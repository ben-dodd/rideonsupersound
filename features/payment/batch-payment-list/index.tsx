import Loading from 'components/placeholders/loading'
import { useVendorBatchPayments } from 'lib/api/vendor'
import React, { useState } from 'react'
import BatchPaymentListItem from './batch-payment-list-item'
import LoadMoreButton from 'components/button/load-more-button'

const BatchPaymentList = () => {
  const { batchPayments, isBatchPaymentsLoading } = useVendorBatchPayments()
  const [limit, setLimit] = useState(50)
  return isBatchPaymentsLoading ? (
    <Loading />
  ) : (
    <div className="h-content overflow-y-scroll">
      <div className="px-2">
        {batchPayments
          ?.filter((batch) => !batch.dateCompleted)
          ?.map((batch) => (
            <BatchPaymentListItem key={batch?.id} batch={batch} />
          ))}
        {batchPayments
          ?.filter((batch) => batch?.dateCompleted)
          ?.slice(0, limit)
          ?.map((batch) => (
            <BatchPaymentListItem key={batch?.id} batch={batch} />
          ))}
        {limit < batchPayments?.filter((batch) => batch?.dateCompleted)?.length && (
          <LoadMoreButton onClick={() => setLimit((limit) => limit + 50)} />
        )}
      </div>
    </div>
  )
}

export default BatchPaymentList
