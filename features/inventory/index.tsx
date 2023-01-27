import MidScreenContainer from 'components/container/mid-screen'
import React from 'react'

const InventoryScreen = () => {
  const isLoading = false
  return (
    <MidScreenContainer title="INVENTORY" isLoading={isLoading} titleClass="bg-col2" full={true}>
      <div />
    </MidScreenContainer>
  )
}

export default InventoryScreen
