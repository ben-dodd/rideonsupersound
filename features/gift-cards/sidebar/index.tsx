import SidebarContainer from 'components/container/side-bar'
import { useGiftCard } from 'lib/api/stock'
import { useAppStore } from 'lib/store'
import React from 'react'

const GiftCardSidebar = () => {
  const { loadedGiftCardId } = useAppStore()
  const { giftCard, isGiftCardLoading } = useGiftCard(loadedGiftCardId)
  console.log(giftCard)
  return <SidebarContainer show={Boolean(loadedGiftCardId)}>{loadedGiftCardId}</SidebarContainer>
}

export default GiftCardSidebar
