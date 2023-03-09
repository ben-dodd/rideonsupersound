import { VendorObject } from 'lib/types/vendor'
import { useRouter } from 'next/router'
import React from 'react'

const VendorListItem = ({ vendor }: { vendor: VendorObject }) => {
  const router = useRouter()
  return (
    <div className={`list-item-compact`} onClick={() => router.push(`/vendors/${vendor?.id}`)}>
      <div>{`[${`000${vendor?.id}`.slice(-3)}] ${vendor?.name}`}</div>
    </div>
  )
}

export default VendorListItem
