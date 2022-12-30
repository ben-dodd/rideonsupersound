import { useVendorNames } from 'lib/api/vendor'
import React from 'react'

const ItemDetails = ({ item }) => {
  const { vendorNames = [] } = useVendorNames()
  const vendorName = vendorNames?.find((vendor) => vendor?.id === item?.vendorId)?.name || '...'
  return (
    <div>
      <div className="text-sm text-green-800">{`${item?.section ? `${item.section} / ` : ''}${item?.format} [${
        item?.isNew ? 'NEW' : item?.cond?.toUpperCase() || 'USED'
      }]`}</div>
      <div className="text-sm">{`Selling for ${vendorName}`}</div>
    </div>
  )
}

export default ItemDetails
