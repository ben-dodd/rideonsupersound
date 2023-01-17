import { useVendors } from 'lib/api/vendor'
import React from 'react'

const VendorsScreen = () => {
  const { vendors, isVendorsLoading } = useVendors()
  console.log('vendors', vendors)
  return (
    <div>
      <div className="font-bold">VENDORS</div>
    </div>
  )
}

export default VendorsScreen
