import { VendorObject } from 'lib/types/vendor'
import { useRouter } from 'next/router'
import React from 'react'

const VendorListItem = ({ vendor }: { vendor: VendorObject }) => {
  const router = useRouter()
  return (
    <div
      className={`list-item hover:bg-gray-200 cursor-pointer items-center justify-between`}
      onClick={() => router.push(`/vendor/${vendor?.id}`)}
    >
      <div className="flex items-center text-xl w-full p-2">
        <div className="w-1/4">{vendor?.name}</div>
      </div>
    </div>
  )
}

export default VendorListItem
