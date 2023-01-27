import MidScreenContainer from 'components/container/mid-screen'
import { useVendors } from 'lib/api/vendor'
import React from 'react'

const VendorsScreen = () => {
  const { vendors, isVendorsLoading } = useVendors()
  console.log('vendors', vendors)
  return (
    <MidScreenContainer title="VENDORS" isLoading={isVendorsLoading} titleClass="bg-col3" full={true}>
      <div />
    </MidScreenContainer>
  )
}

export default VendorsScreen
